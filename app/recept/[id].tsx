import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Image,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppKnop } from "@/components/AppKnop";
import { FoutMelding } from "@/components/FoutMelding";
import { LaadStatus } from "@/components/LaadStatus";
import { Scherm } from "@/components/Scherm";
import { colors, radius } from "@/constants/theme";
import { useFavorites } from "@/context/FavoritesContext";
import { getMealById } from "@/services/api";
import { Meal } from "@/types/meal";

export default function MealDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [meal, setMeal] = useState<Meal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMeal = useCallback(async () => {
        if (!id) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            const detail = await getMealById(id);
            setMeal(detail);
        } catch (apiError) {
            setError(apiError instanceof Error ? apiError.message : "Recept laden mislukt.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadMeal();
    }, [loadMeal]);

    async function shareMeal() {
        if (!meal) {
            return;
        }

        await Share.share({
            title: meal.strMeal,
            message: `Bekijk dit recept in KookKompas: ${meal.strMeal}`,
        });
    }

    return (
        <Scherm scroll>
            <Stack.Screen
                options={{
                    title: meal?.strMeal ?? "Recept details",
                }}
            />

            {loading ? <LaadStatus message="Recept laden..." /> : null}
            {error ? <FoutMelding message={error} onRetry={loadMeal} /> : null}

            {meal && !loading ? (
                <Animated.View entering={FadeInDown.duration(500)} style={styles.wrapper}>
                    {meal.strMealThumb ? (
                        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
                    ) : null}

                    <View style={styles.card}>
                        <Text style={styles.title}>{meal.strMeal}</Text>
                        <Text style={styles.meta}>
                            {meal.strCategory ?? "Categorie onbekend"} · {meal.strArea ?? "Regio onbekend"}
                        </Text>

                        <View style={styles.actions}>
                            <AppKnop
                                title={isFavorite(meal.idMeal) ? "Verwijder favoriet" : "Bewaar favoriet"}
                                onPress={() => toggleFavorite(meal)}
                                variant={isFavorite(meal.idMeal) ? "secondary" : "primary"}
                                style={styles.actionButton}
                            />

                            <AppKnop
                                title="Delen"
                                onPress={shareMeal}
                                variant="secondary"
                                style={styles.actionButton}
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Ingrediënten</Text>

                        {meal.ingredients?.length ? (
                            meal.ingredients.map((ingredient) => (
                                <Text key={`${ingredient.name}-${ingredient.measure}`} style={styles.ingredient}>
                                    • {ingredient.measure} {ingredient.name}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.text}>Geen ingrediënten gevonden.</Text>
                        )}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Bereiding</Text>
                        <Text style={styles.text}>
                            {meal.strInstructions ?? "Geen bereidingswijze beschikbaar."}
                        </Text>
                    </View>
                </Animated.View>
            ) : null}
        </Scherm>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 14,
    },
    image: {
        width: "100%",
        height: 260,
        borderRadius: radius.lg,
        backgroundColor: colors.surfaceAlt,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        gap: 10,
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "900",
    },
    meta: {
        color: colors.muted,
        fontWeight: "800",
    },
    actions: {
        flexDirection: "row",
        gap: 10,
        flexWrap: "wrap",
    },
    actionButton: {
        flexGrow: 1,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "900",
    },
    ingredient: {
        color: colors.text,
        lineHeight: 23,
        fontWeight: "700",
    },
    text: {
        color: colors.text,
        lineHeight: 23,
        fontWeight: "600",
    },
});