import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Accelerometer } from "expo-sensors";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppButton } from "@/components/AppButton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { MealCard } from "@/components/MealCard";
import { Screen } from "@/components/Screen";
import { colors, radius } from "@/constants/theme";
import { useFavorites } from "@/context/FavoritesContext";
import { getRandomMeal } from "@/services/api";
import { Meal } from "@/types/meal";

export default function RandomScreen() {
    const { toggleFavorite, isFavorite } = useFavorites();

    const [meal, setMeal] = useState<Meal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sensorAvailable, setSensorAvailable] = useState(false);

    const loadingRef = useRef(false);
    const lastShakeRef = useRef(0);

    const loadRandom = useCallback(async () => {
        try {
            loadingRef.current = true;
            setLoading(true);
            setError("");

            const randomMeal = await getRandomMeal();
            setMeal(randomMeal);
        } catch (apiError) {
            setError(
                apiError instanceof Error ? apiError.message : "Inspiratie laden mislukt."
            );
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRandom();
    }, [loadRandom]);

    useEffect(() => {
        let subscription: { remove: () => void } | null = null;

        async function startShakeSensor() {
            const available = await Accelerometer.isAvailableAsync();
            setSensorAvailable(available);

            if (!available) {
                return;
            }

            Accelerometer.setUpdateInterval(350);

            subscription = Accelerometer.addListener(({ x, y, z }) => {
                if (loadingRef.current) {
                    return;
                }

                const strength = Math.sqrt(x * x + y * y + z * z);
                const now = Date.now();

                if (strength > 1.8 && now - lastShakeRef.current > 1800) {
                    lastShakeRef.current = now;
                    loadRandom();
                }
            });
        }

        startShakeSensor();

        return () => {
            subscription?.remove();
        };
    }, [loadRandom]);

    return (
        <Screen scroll>
            <Animated.View entering={FadeInDown.duration(450)} style={styles.headerCard}>
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons
                        name="lightbulb-on-outline"
                        size={30}
                        color={colors.primary}
                    />
                </View>

                <Text style={styles.title}>Geen idee wat te koken?</Text>

                <Text style={styles.subtitle}>
                    Laat de app één recept kiezen uit de API. Handig wanneer je snel inspiratie wil.
                </Text>

                <AppButton title="Nieuw voorstel" onPress={loadRandom} loading={loading} />
            </Animated.View>

            <View style={styles.sensorBox}>
                <View style={styles.sensorIcon}>
                    <MaterialCommunityIcons
                        name="cellphone-arrow-down"
                        size={25}
                        color={colors.primary}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.sensorTitle}>Schud voor inspiratie</Text>
                    <Text style={styles.sensorText}>
                        {sensorAvailable
                            ? "Schud je telefoon om automatisch een nieuw recept te laden."
                            : "Deze functie werkt op een toestel met bewegingssensoren."}
                    </Text>
                </View>
            </View>

            {error ? <ErrorMessage message={error} onRetry={loadRandom} /> : null}
            {loading ? <LoadingState message="Recept ophalen..." /> : null}

            {meal && !loading ? (
                <MealCard
                    meal={meal}
                    favorite={isFavorite(meal.idMeal)}
                    onFavoritePress={() => toggleFavorite(meal)}
                />
            ) : null}
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
        gap: 12,
        marginBottom: 14,
    },
    iconCircle: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    subtitle: {
        color: colors.muted,
        lineHeight: 22,
        fontWeight: "600",
    },
    sensorBox: {
        backgroundColor: "#FFF7F0",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: 14,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        marginBottom: 14,
    },
    sensorIcon: {
        width: 44,
        height: 44,
        borderRadius: 16,
        backgroundColor: "#F4E5DB",
        alignItems: "center",
        justifyContent: "center",
    },
    sensorTitle: {
        color: colors.text,
        fontWeight: "900",
    },
    sensorText: {
        color: colors.muted,
        fontWeight: "600",
        lineHeight: 19,
        marginTop: 3,
    },
});