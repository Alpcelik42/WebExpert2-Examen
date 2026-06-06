import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useCallback, useEffect, useState } from "react";
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

    const loadRandom = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const randomMeal = await getRandomMeal();
            setMeal(randomMeal);
        } catch (apiError) {
            setError(
                apiError instanceof Error ? apiError.message : "Inspiratie laden mislukt."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRandom();
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
        marginBottom: 18,
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
});