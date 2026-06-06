import { STORAGE_KEYS } from "@/services/storage";

describe("storage keys", () => {
    test("contains stable keys for local app data", () => {
        expect(STORAGE_KEYS.favorites).toBe("tastetrail:favorites");
        expect(STORAGE_KEYS.location).toBe("tastetrail:last-location");
        expect(STORAGE_KEYS.searchPrefix).toBe("tastetrail:search:");
        expect(STORAGE_KEYS.detailPrefix).toBe("tastetrail:detail:");
        expect(STORAGE_KEYS.randomMeal).toBe("tastetrail:random-meal");
    });
});