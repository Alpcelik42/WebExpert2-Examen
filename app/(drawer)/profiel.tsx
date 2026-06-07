import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppKnop } from "@/components/AppKnop";
import { Scherm } from "@/components/Scherm";
import { colors, radius } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { STORAGE_KEYS } from "@/services/storage";

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { favorites, clearFavorites } = useFavorites();
    const [locationLabel, setLocationLabel] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEYS.location).then(setLocationLabel);
    }, []);

    async function handleLogout() {
        await logout();
        router.replace("/inloggen");
    }

    return (
        <Scherm scroll>
            <Animated.View entering={FadeInDown.duration(450)} style={styles.profileCard}>
                <View style={styles.avatar}>
                    <MaterialCommunityIcons
                        name="account-circle-outline"
                        size={48}
                        color={colors.primary}
                    />
                </View>

                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                <View style={styles.badge}>
                    <MaterialCommunityIcons name="silverware-fork-knife" size={17} color={colors.primary} />
                    <Text style={styles.badgeText}>KookKompas profiel</Text>
                </View>
            </Animated.View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Mijn gegevens</Text>

                <View style={styles.row}>
                    <View style={styles.rowLabel}>
                        <MaterialCommunityIcons name="heart-outline" size={21} color={colors.primary} />
                        <Text style={styles.label}>Bewaarde recepten</Text>
                    </View>
                    <Text style={styles.value}>{favorites.length}</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.rowLabel}>
                        <MaterialCommunityIcons name="map-marker-outline" size={21} color={colors.primary} />
                        <Text style={styles.label}>Ingestelde regio</Text>
                    </View>
                    <Text style={styles.value}>{locationLabel ?? "Nog niet ingesteld"}</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.rowLabel}>
                        <MaterialCommunityIcons name="calendar-month-outline" size={21} color={colors.primary} />
                        <Text style={styles.label}>Weekplanning</Text>
                    </View>
                    <Text style={styles.value}>Lokaal bewaard</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Wat bewaart de app?</Text>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="check-circle-outline" size={22} color={colors.success} />
                    <Text style={styles.text}>
                        Je favorieten blijven op dit toestel staan, zodat je ze later snel terugvindt.
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="check-circle-outline" size={22} color={colors.success} />
                    <Text style={styles.text}>
                        Je regio wordt alleen gebruikt om de app persoonlijker te maken.
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="check-circle-outline" size={22} color={colors.success} />
                    <Text style={styles.text}>
                        Recepten die je eerder bekeken hebt, kunnen opnieuw sneller geladen worden.
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                <AppKnop title="Favorieten wissen" onPress={clearFavorites} variant="secondary" />
                <AppKnop title="Uitloggen" onPress={handleLogout} variant="danger" />
            </View>
        </Scherm>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 22,
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 30,
        backgroundColor: colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
    },
    name: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    email: {
        color: colors.muted,
        fontWeight: "700",
    },
    badge: {
        marginTop: 8,
        backgroundColor: "#F4E5DB",
        borderRadius: 999,
        paddingHorizontal: 13,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },
    badgeText: {
        color: colors.primary,
        fontWeight: "900",
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 14,
        gap: 14,
    },
    cardTitle: {
        color: colors.text,
        fontSize: 19,
        fontWeight: "900",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
        alignItems: "center",
    },
    rowLabel: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        flex: 1,
    },
    label: {
        color: colors.muted,
        fontWeight: "800",
        flexShrink: 1,
    },
    value: {
        color: colors.text,
        fontWeight: "900",
        flexShrink: 1,
        textAlign: "right",
    },
    infoRow: {
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-start",
    },
    text: {
        color: colors.muted,
        lineHeight: 22,
        fontWeight: "600",
        flex: 1,
    },
    actions: {
        gap: 12,
    },
});