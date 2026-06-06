export type AuthValues = {
    name?: string;
    email: string;
    password: string;
};

export type AuthErrors = {
    name?: string;
    email?: string;
    password?: string;
};

export function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateAuthForm(values: AuthValues, isRegister = false) {
    const errors: AuthErrors = {};

    if (isRegister && !values.name?.trim()) {
        errors.name = "Naam is verplicht.";
    }

    if (!values.email.trim()) {
        errors.email = "E-mail is verplicht.";
    } else if (!isValidEmail(values.email)) {
        errors.email = "Gebruik een geldig e-mailadres.";
    }

    if (!values.password.trim()) {
        errors.password = "Wachtwoord is verplicht.";
    } else if (values.password.length < 6) {
        errors.password = "Wachtwoord moet minstens 6 tekens bevatten.";
    }

    return errors;
}

export function validateSearchQuery(query: string) {
    if (!query.trim()) {
        return "Vul eerst een zoekterm in.";
    }

    if (query.trim().length < 2) {
        return "Gebruik minstens 2 tekens.";
    }

    return null;
}