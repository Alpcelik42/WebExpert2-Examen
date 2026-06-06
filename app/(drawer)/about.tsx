import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppButton } from "@/components/AppButton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { InputField } from "@/components/InputField";
import { LoadingState } from "@/components/LoadingState";
import { Screen } from "@/components/Screen";
import { colors, radius } from "@/constants/theme";
import { useFavorites } from "@/context/FavoritesContext";

type DayKey =
    | "maandag"
    | "dinsdag"
    | "woensdag"
    | "donderdag"
    | "vrijdag"
    | "zaterdag"
    | "zondag";

type WeekPlan = Record<DayKey, string>;

const STORAGE_KEY = "kookkompas.weekplanning";

const days: { key: DayKey; label: string }[] = [
    { key: "maandag", label: "Maandag" },
    { key: "dinsdag", label: "Dinsdag" },
    { key: "woensdag", label: "Woensdag" },
    { key: "donderdag", label: "Donderdag" },
    { key: "vrijdag", label: "Vrijdag" },
    { key: "zaterdag", label: "Zaterdag" },
    { key: "zondag", label: "Zondag" },
];

const emptyPlan: WeekPlan = {
    maandag: "",
    dinsdag: "",
    woensdag: "",
    donderdag: "",
    vrijdag: "",
    zaterdag: "",
    zondag: "",
};

export default function WeekPlanningScreen() {
    const { favorites } = useFavorites();

    const [plan, setPlan] = useState<WeekPlan>(emptyPlan);
    const [selectedDay, setSelectedDay] = useState<DayKey>("maandag");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const filledDays = useMemo(() => {
        return Object.values(plan).filter((value) => value.trim().length > 0).length;
    }, [plan]);

    useEffect(() => {
        async function loadPlanning() {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);

                if (saved) {
                    setPlan({
                        ...emptyPlan,
                        ...JSON.parse(saved),
                    });
                }
            } catch {
                setErrorMessage("De weekplanning kon niet worden geladen.");
            } finally {
                setLoading(false);
            }
        }

        loadPlanning();
    }, []);

    function updateDay(day: DayKey, value: string) {
        setPlan((current) => ({
            ...current,
            [day]: value,
        }));

        setSuccessMessage("");
        setErrorMessage("");
    }

    function useFavoriteAsSuggestion(mealName: string) {
        updateDay(selectedDay, mealName);
    }

    async function savePlanning() {
        try {
            setSaving(true);
            setErrorMessage("");
            setSuccessMessage("");

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));

            setSuccessMessage("Je weekplanning werd lokaal opgeslagen.");
        } catch {
            setErrorMessage("De weekplanning kon niet worden opgeslagen.");
        } finally {
            setSaving(false);
        }
    }

    async function clearPlanning() {
        try {
            setSaving(true);
            setErrorMessage("");
            setSuccessMessage("");

            await AsyncStorage.removeItem(STORAGE_KEY);
            setPlan(emptyPlan);

            setSuccessMessage("Je weekplanning werd leeggemaakt.");
        } catch {
            setErrorMessage("De planning kon niet worden gewist.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <LoadingState message="Weekplanning laden..." />;
    }

    return (
        <Screen scroll>
            <Animated.View entering={FadeInDown.duration(450)} style={styles.headerCard}>
                <View style={styles.logoMark}>
                    <MaterialCommunityIcons
                        name="calendar-month-outline"
                        size={34}
                        color={colors.primary}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.kicker}>Extra functie</Text>
                    <Text style={styles.title}>Weekplanning</Text>
                    <Text style={styles.subtitle}>
                        Plan per dag wat je wil koken. De planning wordt lokaal opgeslagen op dit
                        toestel.
                    </Text>
                </View>
            </Animated.View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <MaterialCommunityIcons name="calendar-check-outline" size={24} color={colors.primary} />
                    <Text style={styles.statValue}>{filledDays}/7</Text>
                    <Text style={styles.statLabel}>dagen ingevuld</Text>
                </View>

                <View style={styles.statCard}>
                    <MaterialCommunityIcons name="heart-outline" size={24} color={colors.primary} />
                    <Text style={styles.statValue}>{favorites.length}</Text>
                    <Text style={styles.statLabel}>favorieten</Text>
                </View>
            </View>

            {errorMessage ? <ErrorMessage message={errorMessage} /> : null}

            {successMessage ? (
                <View style={styles.successBox}>
                    <MaterialCommunityIcons
                        name="check-circle-outline"
                        size={22}
                        color={colors.success}
                    />
                    <Text style={styles.successText}>{successMessage}</Text>
                </View>
            ) : null}

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Kies een dag</Text>

                <View style={styles.dayGrid}>
                    {days.map((day) => {
                        const active = selectedDay === day.key;
                        const hasMeal = plan[day.key].trim().length > 0;

                        return (
                            <Pressable
                                key={day.key}
                                onPress={() => setSelectedDay(day.key)}
                                style={[styles.dayButton, active && styles.activeDayButton]}
                            >
                                <Text style={[styles.dayText, active && styles.activeDayText]}>
                                    {day.label}
                                </Text>

                                {hasMeal ? (
                                    <MaterialCommunityIcons
                                        name="check-circle"
                                        size={16}
                                        color={active ? "#FFFFFF" : colors.success}
                                    />
                                ) : null}
                            </Pressable>
                        );
                    })}
                </View>

                <InputField
                    label={`Maaltijd voor ${days.find((day) => day.key === selectedDay)?.label}`}
                    value={plan[selectedDay]}
                    onChangeText={(value) => updateDay(selectedDay, value)}
                    placeholder="Bijvoorbeeld: pasta met kip"
                />

                <AppButton title="Planning bewaren" onPress={savePlanning} loading={saving} />
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Overzicht van de week</Text>

                {days.map((day) => (
                    <View key={day.key} style={styles.planRow}>
                        <View style={styles.dayIcon}>
                            <MaterialCommunityIcons
                                name={plan[day.key].trim() ? "silverware-fork-knife" : "minus"}
                                size={18}
                                color={plan[day.key].trim() ? colors.primary : colors.muted}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.planDay}>{day.label}</Text>
                            <Text style={styles.planMeal}>
                                {plan[day.key].trim() || "Nog niets gepland"}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {favorites.length > 0 ? (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Gebruik een favoriet als suggestie</Text>
                    <Text style={styles.cardText}>
                        Kies eerst bovenaan een dag en tik daarna op een favoriet.
                    </Text>

                    {favorites.slice(0, 5).map((meal) => (
                        <Pressable
                            key={meal.idMeal}
                            onPress={() => useFavoriteAsSuggestion(meal.strMeal)}
                            style={styles.favoriteSuggestion}
                        >
                            <MaterialCommunityIcons
                                name="heart-outline"
                                size={20}
                                color={colors.primary}
                            />
                            <Text numberOfLines={1} style={styles.favoriteText}>
                                {meal.strMeal}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Tip</Text>
                    <Text style={styles.cardText}>
                        Bewaar eerst enkele recepten als favoriet. Daarna kan je ze hier sneller in je
                        weekplanning zetten.
                    </Text>
                </View>
            )}

            <AppButton
                title="Planning wissen"
                onPress={clearPlanning}
                variant="secondary"
                loading={saving}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
        flexDirection: "row",
        gap: 14,
        alignItems: "flex-start",
        marginBottom: 14,
    },
    logoMark: {
        width: 62,
        height: 62,
        borderRadius: 22,
        backgroundColor: colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
    },
    kicker: {
        color: colors.primary,
        fontWeight: "900",
        marginBottom: 2,
    },
    title: {
        color: colors.text,
        fontSize: 29,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    subtitle: {
        color: colors.muted,
        lineHeight: 21,
        fontWeight: "600",
        marginTop: 4,
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 14,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        gap: 6,
    },
    statValue: {
        color: colors.text,
        fontSize: 24,
        fontWeight: "900",
    },
    statLabel: {
        color: colors.muted,
        fontWeight: "700",
    },
    successBox: {
        backgroundColor: "#E7F3EC",
        borderWidth: 1,
        borderColor: "#BBDDC9",
        borderRadius: radius.lg,
        padding: 14,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginBottom: 14,
    },
    successText: {
        color: colors.success,
        fontWeight: "800",
        flex: 1,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 14,
        gap: 12,
    },
    cardTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "900",
    },
    cardText: {
        color: colors.muted,
        lineHeight: 21,
        fontWeight: "600",
    },
    dayGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    dayButton: {
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius: 999,
        paddingHorizontal: 13,
        paddingVertical: 9,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    activeDayButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    dayText: {
        color: colors.text,
        fontWeight: "800",
    },
    activeDayText: {
        color: "#FFFFFF",
    },
    planRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    dayIcon: {
        width: 36,
        height: 36,
        borderRadius: 13,
        backgroundColor: colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
    },
    planDay: {
        color: colors.text,
        fontWeight: "900",
    },
    planMeal: {
        color: colors.muted,
        fontWeight: "600",
        marginTop: 2,
    },
    favoriteSuggestion: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    favoriteText: {
        color: colors.text,
        fontWeight: "800",
        flex: 1,
    },
});