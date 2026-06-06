import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meal } from "@/types/meal";
import { STORAGE_KEYS } from "@/services/storage";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function normalizeMeal(raw: any): Meal {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const name = raw[`strIngredient${i}`];
        const measure = raw[`strMeasure${i}`];

        if (name && String(name).trim()) {
            ingredients.push({
                name: String(name).trim(),
                measure: measure ? String(measure).trim() : "",
            });
        }
    }

    return {
        idMeal: String(raw.idMeal),
        strMeal: raw.strMeal ?? "Onbekend recept",
        strCategory: raw.strCategory ?? "Onbekend",
        strArea: raw.strArea ?? "Onbekend",
        strMealThumb: raw.strMealThumb,
        strInstructions: raw.strInstructions,
        strYoutube: raw.strYoutube,
        ingredients,
    };
}

async function saveCache<T>(key: string, data: T) {
    await AsyncStorage.setItem(
        key,
        JSON.stringify({
            cachedAt: new Date().toISOString(),
            data,
        })
    );
}

async function readCache<T>(key: string): Promise<T | null> {
    const cached = await AsyncStorage.getItem(key);

    if (!cached) {
        return null;
    }

    const parsed = JSON.parse(cached);
    return parsed.data as T;
}

async function fetchFromApi(url: string) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("De server gaf geen geldig antwoord terug.");
    }

    return response.json();
}

export async function searchMeals(query: string): Promise<Meal[]> {
    const cleanQuery = query.trim().toLowerCase();
    const cacheKey = `${STORAGE_KEYS.searchPrefix}${cleanQuery}`;

    try {
        const json = await fetchFromApi(
            `${BASE_URL}/search.php?s=${encodeURIComponent(cleanQuery)}`
        );

        const meals = Array.isArray(json.meals)
            ? json.meals.map(normalizeMeal)
            : [];

        await saveCache(cacheKey, meals);
        return meals;
    } catch {
        const cached = await readCache<Meal[]>(cacheKey);

        if (cached) {
            return cached;
        }

        throw new Error(
            "Geen internetverbinding en geen offline cache gevonden voor deze zoekopdracht."
        );
    }
}

export async function getMealById(id: string): Promise<Meal> {
    const cacheKey = `${STORAGE_KEYS.detailPrefix}${id}`;

    try {
        const json = await fetchFromApi(`${BASE_URL}/lookup.php?i=${id}`);

        if (!json.meals?.[0]) {
            throw new Error("Recept niet gevonden.");
        }

        const meal = normalizeMeal(json.meals[0]);

        await saveCache(cacheKey, meal);
        return meal;
    } catch {
        const cached = await readCache<Meal>(cacheKey);

        if (cached) {
            return cached;
        }

        throw new Error(
            "Dit recept kon niet worden geladen en staat nog niet offline opgeslagen."
        );
    }
}

export async function getRandomMeal(): Promise<Meal> {
    try {
        const json = await fetchFromApi(`${BASE_URL}/random.php`);

        if (!json.meals?.[0]) {
            throw new Error("Geen willekeurig recept gevonden.");
        }

        const meal = normalizeMeal(json.meals[0]);

        await saveCache(STORAGE_KEYS.randomMeal, meal);
        await saveCache(`${STORAGE_KEYS.detailPrefix}${meal.idMeal}`, meal);

        return meal;
    } catch {
        const cached = await readCache<Meal>(STORAGE_KEYS.randomMeal);

        if (cached) {
            return cached;
        }

        throw new Error(
            "Geen internetverbinding en nog geen willekeurig recept offline beschikbaar."
        );
    }
}