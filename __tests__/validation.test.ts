import { isValidEmail, validateAuthForm, validateSearchQuery } from "@/utils/validation";

describe("validation utilities", () => {
    test("validates correct and incorrect e-mail addresses", () => {
        expect(isValidEmail("test@example.com")).toBe(true);
        expect(isValidEmail("alperen.ozcelik@gmail.com")).toBe(true);
        expect(isValidEmail("wrong-email")).toBe(false);
        expect(isValidEmail("wrong@email")).toBe(false);
    });

    test("requires name on register", () => {
        const errors = validateAuthForm(
            {
                name: "",
                email: "test@example.com",
                password: "secret123",
            },
            true
        );

        expect(errors.name).toBe("Naam is verplicht.");
    });

    test("requires e-mail", () => {
        const errors = validateAuthForm(
            {
                email: "",
                password: "secret123",
            },
            false
        );

        expect(errors.email).toBe("E-mail is verplicht.");
    });

    test("rejects invalid e-mail", () => {
        const errors = validateAuthForm(
            {
                email: "fout-email",
                password: "secret123",
            },
            false
        );

        expect(errors.email).toBe("Gebruik een geldig e-mailadres.");
    });

    test("requires password", () => {
        const errors = validateAuthForm(
            {
                email: "test@example.com",
                password: "",
            },
            false
        );

        expect(errors.password).toBe("Wachtwoord is verplicht.");
    });

    test("rejects short passwords", () => {
        const errors = validateAuthForm(
            {
                email: "test@example.com",
                password: "123",
            },
            false
        );

        expect(errors.password).toBe("Wachtwoord moet minstens 6 tekens bevatten.");
    });

    test("accepts valid login form", () => {
        const errors = validateAuthForm(
            {
                email: "test@example.com",
                password: "secret123",
            },
            false
        );

        expect(errors).toEqual({});
    });

    test("validates search query", () => {
        expect(validateSearchQuery("")).toBe("Vul eerst een zoekterm in.");
        expect(validateSearchQuery("a")).toBe("Gebruik minstens 2 tekens.");
        expect(validateSearchQuery("pasta")).toBeNull();
    });
});