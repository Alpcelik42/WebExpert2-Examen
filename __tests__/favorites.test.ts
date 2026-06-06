import { isFavoriteMeal, toggleMealFavorite } from "@/utils/favorites";
import { Meal } from "@/types/meal";

const meal: Meal = {
    idMeal: "1",
    strMeal: "Test Pasta",
};

const secondMeal: Meal = {
    idMeal: "2",
    strMeal: "Test Soup",
};

describe("favorites utilities", () => {
    test("adds a meal when it is not favorite yet", () => {
        const result = toggleMealFavorite([], meal);

        expect(result).toHaveLength(1);
        expect(result[0].idMeal).toBe("1");
    });

    test("adds new meal at the beginning of the list", () => {
        const result = toggleMealFavorite([meal], secondMeal);

        expect(result).toHaveLength(2);
        expect(result[0].idMeal).toBe("2");
    });

    test("removes a meal when it already exists", () => {
        const result = toggleMealFavorite([meal, secondMeal], meal);

        expect(result).toHaveLength(1);
        expect(result[0].idMeal).toBe("2");
    });

    test("checks if meal is favorite", () => {
        expect(isFavoriteMeal([meal], "1")).toBe(true);
        expect(isFavoriteMeal([meal], "2")).toBe(false);
    });
});