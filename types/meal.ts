export type Ingredient = {
    name: string;
    measure: string;
};

export type Meal = {
    idMeal: string;
    strMeal: string;
    strCategory?: string;
    strArea?: string;
    strMealThumb?: string;
    strInstructions?: string;
    strYoutube?: string;
    ingredients?: Ingredient[];
};