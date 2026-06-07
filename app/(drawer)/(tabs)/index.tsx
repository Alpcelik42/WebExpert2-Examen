import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppKnop } from "@/components/AppKnop";
import { LegeStaat } from "@/components/LegeStaat";
import { FoutMelding } from "@/components/FoutMelding";
import { LaadStatus } from "@/components/LaadStatus";
import { ReceptKaart } from "@/components/ReceptKaart";
import { Scherm } from "@/components/Scherm";
import {
    getReadableLocationLabel,
    getRegionalSuggestion,
    quickFilters,
} from "@/constants/home";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { searchMeals } from "@/services/api";
import { STORAGE_KEYS } from "@/services/storage";
import { Meal } from "@/types/meal";
import { homeStyles as styles } from "@/styles/homeStyles";

export default function HomeScreen() {
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [meals, setMeals] = useState<Meal[]>([]);
    const [selectedFilter, setSelectedFilter] = useState("chicken");
    const [customResultTitle, setCustomResultTitle] = useState<string | null>(null);
    const [locationLabel, setLocationLabel] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [error, setError] = useState("");

    const regionalSuggestion = useMemo(
        () => getRegionalSuggestion(locationLabel),
        [locationLabel]
    );

    const loadMeals = useCallback(async (query: string, title?: string) => {
        try {
            setLoading(true);
            setError("");
            setSelectedFilter(query);
            setCustomResultTitle(title ?? null);

            const results = await searchMeals(query);
            setMeals(results);
        } catch (apiError) {
            setError(
                apiError instanceof Error ? apiError.message : "Recepten laden mislukt."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMeals("chicken");

        AsyncStorage.getItem(STORAGE_KEYS.location).then((stored) => {
            if (stored) {
                setLocationLabel(stored);
            }
        });
    }, [loadMeals]);

    async function requestLocation() {
        try {
            setLocationLoading(true);
            setError("");

            const permission = await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {
                setError("Locatietoegang werd geweigerd. Je kan de app verder gebruiken.");
                return;
            }

            const current = await Location.getCurrentPositionAsync({});
            const places = await Location.reverseGeocodeAsync(current.coords);
            const label = getReadableLocationLabel(current.coords, places[0]);
            const suggestion = getRegionalSuggestion(label);

            setLocationLabel(label);
            await AsyncStorage.setItem(STORAGE_KEYS.location, label);
            await loadMeals(suggestion.query, suggestion.resultTitle);
        } catch {
            setError("Locatie kon niet worden opgehaald.");
        } finally {
            setLocationLoading(false);
        }
    }

    async function handleRegionalSuggestion() {
        if (!locationLabel) {
            await requestLocation();
            return;
        }

        await loadMeals(regionalSuggestion.query, regionalSuggestion.resultTitle);
    }

    const selectedFilterLabel =
        customResultTitle ??
        quickFilters.find((item) => item.query === selectedFilter)?.label ??
        "Aanbevolen";

    return (
        <Scherm style={{ paddingHorizontal: 0 }}>
            <FlatList
                data={meals}
                keyExtractor={(item) => item.idMeal}
                initialNumToRender={4}
                maxToRenderPerBatch={6}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
                        <View style={styles.introCard}>
                            <View style={styles.introIcon}>
                                <MaterialCommunityIcons
                                    name="chef-hat"
                                    size={28}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.kicker}>Welkom terug</Text>
                                <Text style={styles.title}>{user?.name ?? "Gebruiker"}</Text>
                                <Text style={styles.subtitle}>
                                    Zoek recepten, bewaar favorieten en stel makkelijk een weekmenu samen.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.locationBox}>
                            <View style={styles.locationIcon}>
                                <MaterialCommunityIcons
                                    name="map-marker-outline"
                                    size={24}
                                    color={colors.accent}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.locationTitle}>Regio</Text>
                                <Text style={styles.locationText}>
                                    {locationLabel ?? "Nog geen locatie ingesteld"}
                                </Text>
                            </View>

                            <AppKnop
                                title={locationLabel ? "Update" : "Ophalen"}
                                onPress={requestLocation}
                                loading={locationLoading}
                                style={styles.locationButton}
                            />
                        </View>

                        <View style={styles.suggestionCard}>
                            <View style={styles.suggestionIcon}>
                                <MaterialCommunityIcons
                                    name="lightbulb-on-outline"
                                    size={25}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.suggestionTitle}>{regionalSuggestion.title}</Text>
                                <Text style={styles.suggestionText}>{regionalSuggestion.text}</Text>
                            </View>

                            <Pressable onPress={handleRegionalSuggestion} style={styles.suggestionButton}>
                                <Text style={styles.suggestionButtonText}>
                                    {regionalSuggestion.button}
                                </Text>
                            </Pressable>
                        </View>

                        <Text style={styles.sectionTitle}>Snelle keuzes</Text>

                        <View style={styles.filters}>
                            {quickFilters.map((filter) => {
                                const active = selectedFilter === filter.query && !customResultTitle;

                                return (
                                    <Pressable
                                        key={filter.query}
                                        onPress={() => loadMeals(filter.query)}
                                        style={[styles.filter, active && styles.activeFilter]}
                                    >
                                        <MaterialCommunityIcons
                                            name={filter.icon}
                                            size={18}
                                            color={active ? "#FFFFFF" : colors.primary}
                                        />

                                        <Text style={[styles.filterText, active && styles.activeFilterText]}>
                                            {filter.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Text style={styles.resultsTitle}>{selectedFilterLabel}</Text>

                        {error ? (
                            <FoutMelding message={error} onRetry={() => loadMeals(selectedFilter)} />
                        ) : null}

                        {loading ? <LaadStatus message="Recepten laden..." /> : null}
                    </Animated.View>
                }
                ListEmptyComponent={
                    !loading ? (
                        <LegeStaat
                            title="Geen recepten gevonden"
                            message="Probeer een andere categorie of zoekterm."
                            iconName="magnify-close"
                        />
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