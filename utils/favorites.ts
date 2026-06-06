import { Meal } from "@/types/meal";

export function isFavoriteMeal(favorites: Meal[], mealId: string) {
    return favorites.some((meal) => meal.idMeal === mealId);
}

export function toggleMealFavorite(favorites: Meal[], meal: Meal) {
    const exists = isFavoriteMeal(favorites, meal.idMeal);

    if (exists) {
        return favorites.filter((item) => item.idMeal !== meal.idMeal);
    }

    return [meal, ...favorites];
}