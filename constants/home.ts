export const quickFilters = [
    { label: "Kip", query: "chicken", icon: "food-drumstick-outline" },
    { label: "Pasta", query: "pasta", icon: "pasta" },
    { label: "Rund", query: "beef", icon: "food-steak" },
    { label: "Rijst", query: "rice", icon: "rice" },
    { label: "Vegetarisch", query: "vegetarian", icon: "leaf" },
] as const;

type Coords = {
    latitude: number;
    longitude: number;
};

type Place = {
    city?: string | null;
    subregion?: string | null;
    district?: string | null;
    region?: string | null;
    country?: string | null;
};

function isInBelgium(latitude: number, longitude: number) {
    return latitude >= 49.4 && latitude <= 51.6 && longitude >= 2.4 && longitude <= 6.5;
}

function isInNetherlands(latitude: number, longitude: number) {
    return latitude >= 50.7 && latitude <= 53.7 && longitude >= 3.2 && longitude <= 7.3;
}

export function getReadableLocationLabel(coords: Coords, place?: Place) {
    const city = place?.city || place?.subregion || place?.district || place?.region;
    const country = place?.country;

    if (city && country) {
        return `${city}, ${country}`;
    }

    if (country) {
        return country;
    }

    if (isInBelgium(coords.latitude, coords.longitude)) {
        return "België";
    }

    if (isInNetherlands(coords.latitude, coords.longitude)) {
        return "Nederland";
    }

    return "Regio ingesteld";
}

export function getRegionalSuggestion(locationLabel: string | null) {
    if (!locationLabel) {
        return {
            title: "Voor jouw regio",
            text: "Stel je regio in. Daarna laden we automatisch een passend receptvoorstel.",
            query: "chicken",
            button: "Regio instellen",
            resultTitle: "Kip",
        };
    }

    const lower = locationLabel.toLowerCase();

    if (
        lower.includes("belgië") ||
        lower.includes("belgium") ||
        lower.includes("nederland") ||
        lower.includes("netherlands")
    ) {
        return {
            title: "Suggestie voor jouw regio",
            text: "Voor jouw regio tonen we eenvoudige gerechten die goed passen bij een weekmenu.",
            query: "pasta",
            button: "Toon voorstel",
            resultTitle: "Voor jouw regio",
        };
    }

    if (
        lower.includes("turkije") ||
        lower.includes("turkey") ||
        lower.includes("türkiye")
    ) {
        return {
            title: "Suggestie voor jouw regio",
            text: "Je regio is ingesteld. We tonen gerechten met een warme en kruidige stijl.",
            query: "lamb",
            button: "Toon voorstel",
            resultTitle: "Voor jouw regio",
        };
    }

    return {
        title: "Suggestie voor jouw regio",
        text: "Je regio is ingesteld. We laden een algemene receptsuggestie voor jou.",
        query: "chicken",
        button: "Toon voorstel",
        resultTitle: "Voor jouw regio",
    };
}