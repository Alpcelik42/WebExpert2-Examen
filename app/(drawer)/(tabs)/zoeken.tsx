import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppKnop } from "@/components/AppKnop";
import { LegeStaat } from "@/components/LegeStaat";
import { FoutMelding } from "@/components/FoutMelding";
import { InvoerVeld } from "@/components/InvoerVeld";
import { LaadStatus } from "@/components/LaadStatus";
import { ReceptKaart } from "@/components/ReceptKaart";
import { Scherm } from "@/components/Scherm";
import { colors, radius } from "@/constants/theme";
import { useFavorites } from "@/context/FavoritesContext";
import { searchMeals } from "@/services/api";
import { Meal } from "@/types/meal";
import { validateSearchQuery } from "@/utils/validation";

export default function SearchScreen() {
    const { toggleFavorite, isFavorite } = useFavorites();

    const [query, setQuery] = useState("");
    const [meals, setMeals] = useState<Meal[]>([]);
    const [inputError, setInputError] = useState("");
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function handleSearch() {
        const validation = validateSearchQuery(query);
        setInputError(validation ?? "");
        setApiError("");

        if (validation) {
            return;
        }

        try {
            setLoading(true);
            setSearched(true);
            const results = await searchMeals(query);
            setMeals(results);
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "Zoeken mislukt.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Scherm style={{ paddingHorizontal: 0 }}>
            <FlatList
                data={meals}
                keyExtractor={(item) => item.idMeal}
                initialNumToRender={5}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
                        <View style={styles.headerCard}>
                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons
                                    name="magnify"
                                    size={28}
                                    color={colors.primary}
                                />
                            </View>

                            <Text style={styles.title}>Recept zoeken</Text>
                            <Text style={styles.subtitle}>
                                Zoek op ingrediënten of gerechten. Probeer bijvoorbeeld pasta, chicken,
                                beef, soup of rice.
                            </Text>
                        </View>

                        <InvoerVeld
                            label="Zoekterm"
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Bijvoorbeeld: pasta"
                            returnKeyType="search"
                            onSubmitEditing={handleSearch}
                            error={inputError}
                        />

                        <AppKnop title="Zoeken" onPress={handleSearch} loading={loading} />

                        {apiError ? <FoutMelding message={apiError} onRetry={handleSearch} /> : null}
                        {loading ? <LaadStatus message="Zoeken..." /> : null}
                    </Animated.View>
                }
                ListEmptyComponent={
                    !loading ? (
                        searched ? (
                            <LegeStaat
                                title="Geen resultaten"
                                message="Er zijn geen recepten gevonden voor deze zoekterm."
                                iconName="database-search-outline"
                            />
                        ) : (
                            <LegeStaat
                                title="Start met zoeken"
                                message="Gebruik de zoekbalk om recepten via de REST API op te halen."
                                iconName="text-search"
                            />
                        )
                    ) : null
                }
                renderItem={({ item }) => (
                    <ReceptKaart
                        meal={item}
                        favorite={isFavorite(item.idMeal)}
                        onFavoritePress={() => toggleFavorite(item)}
                    />
                )}
            />
        </Scherm>
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 16,
        paddingBottom: 34,
    },
    header: {
        gap: 14,
        marginBottom: 12,
    },
    headerCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
        gap: 9,
    },
    iconCircle: {
        width: 52,
        height: 52,
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