import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "@/services/storage";
import { Meal } from "@/types/meal";
import { isFavoriteMeal, toggleMealFavorite } from "@/utils/favorites";

type FavoritesContextValue = {
    favorites: Meal[];
    loading: boolean;
    toggleFavorite: (meal: Meal) => void;
    isFavorite: (mealId: string) => boolean;
    clearFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
    undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFavorites() {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEYS.favorites);

                if (saved) {
                    setFavorites(JSON.parse(saved));
                }
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, []);

    function toggleFavorite(meal: Meal) {
        setFavorites((current) => {
            const next = toggleMealFavorite(current, meal);
            AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next));
            return next;
        });
    }

    function isFavorite(mealId: string) {
        return isFavoriteMeal(favorites, mealId);
    }

    async function clearFavorites() {
        await AsyncStorage.removeItem(STORAGE_KEYS.favorites);
        setFavorites([]);
    }

    const value = useMemo(
        () => ({
            favorites,
            loading,
            toggleFavorite,
            isFavorite,
            clearFavorites,
        }),
        [favorites, loading]
    );

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const value = useContext(FavoritesContext);

    if (!value) {
        throw new Error("useFavorites moet binnen FavoritesProvider gebruikt worden.");
    }

    return value;
}