import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMealById, getRandomMeal, searchMeals } from "@/services/api";

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const rawMeal = {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken",
    strCategory: "Chicken",
    strArea: "Japanese",
    strMealThumb: "https://example.com/chicken.jpg",
    strInstructions: "Cook everything together.",
    strYoutube: "https://youtube.com/example",
    strIngredient1: "Chicken",
    strMeasure1: "500g",
    strIngredient2: "Soy sauce",
    strMeasure2: "2 tbsp",
    strIngredient3: "",
    strMeasure3: "",
};

function mockFetchResponse(data: unknown, ok = true) {
    global.fetch = jest.fn().mockResolvedValue({
        ok,
        json: jest.fn().mockResolvedValue(data),
    }) as unknown as typeof fetch;
}

function mockFetchReject() {
    global.fetch = jest.fn().mockRejectedValue(new Error("Offline")) as unknown as typeof fetch;
}

describe("recept API service", () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
        jest.clearAllMocks();
    });

    test("searchMeals fetches meals from REST API and normalizes ingredients", async () => {
        mockFetchResponse({
            meals: [rawMeal],
        });

        const results = await searchMeals("chicken");

        expect(results).toHaveLength(1);
        expect(results[0].idMeal).toBe("52772");
        expect(results[0].strMeal).toBe("Teriyaki Chicken");
        expect(results[0].ingredients).toEqual([
            {
                name: "Chicken",
                measure: "500g",
            },
            {
                name: "Soy sauce",
                measure: "2 tbsp",
            },
        ]);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("search.php?s=chicken")
        );

        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    test("searchMeals returns empty list when API has no meals", async () => {
        mockFetchResponse({
            meals: null,
        });

        const results = await searchMeals("unknown-food");

        expect(results).toEqual([]);
    });

    test("searchMeals uses cache when API fails", async () => {
        const cachedMeals = [
            {
                idMeal: "99",
                strMeal: "Cached Pasta",
            },
        ];

        mockFetchReject();

        jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(
            JSON.stringify({
                cachedAt: "2026-01-01T00:00:00.000Z",
                data: cachedMeals,
            })
        );

        const results = await searchMeals("pasta");

        expect(results).toEqual(cachedMeals);
    });

    test("searchMeals throws helpful error when API fails and no cache exists", async () => {
        mockFetchReject();

        jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(null);

        await expect(searchMeals("pasta")).rejects.toThrow(
            "Geen internetverbinding"
        );
    });

    test("getMealById fetches one recept detail", async () => {
        mockFetchResponse({
            meals: [rawMeal],
        });

        const meal = await getMealById("52772");

        expect(meal.idMeal).toBe("52772");
        expect(meal.strMeal).toBe("Teriyaki Chicken");
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("lookup.php?i=52772")
        );
    });

    test("getMealById uses cache when detail API fails", async () => {
        const cachedMeal = {
            idMeal: "55",
            strMeal: "Cached Soup",
        };

        mockFetchReject();

        jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(
            JSON.stringify({
                cachedAt: "2026-01-01T00:00:00.000Z",
                data: cachedMeal,
            })
        );

        const meal = await getMealById("55");

        expect(meal).toEqual(cachedMeal);
    });

    test("getMealById throws helpful error when not found and no cache exists", async () => {
        mockFetchResponse({
            meals: null,
        });

        jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(null);

        await expect(getMealById("000")).rejects.toThrow(
            "Dit recept kon niet worden geladen"
        );
    });

    test("getRandomMeal fetches a random recept", async () => {
        mockFetchResponse({
            meals: [rawMeal],
        });

        const meal = await getRandomMeal();

        expect(meal.strMeal).toBe("Teriyaki Chicken");
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("random.php")
        );
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    test("getRandomMeal uses cache when random API fails", async () => {
        const cachedMeal = {
            idMeal: "77",
            strMeal: "Cached Random Meal",
        };

        mockFetchReject();

        jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(
            JSON.stringify({
                cachedAt: "2026-01-01T00:00:00.000Z",
                data: cachedMeal,
            })
        );

        const meal = await getRandomMeal();

        expect(meal).toEqual(cachedMeal);
    });

    test("getRandomMeal throws helpful error when API fails and no cache exists", async () => {
        mockFetchReject();

        jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(null);

        await expect(getRandomMeal()).rejects.toThrow(
            "Geen internetverbinding"
        );
    });
});