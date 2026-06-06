import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

type User = {
    name: string;
    email: string;
};

type StoredUser = User & {
    passwordHash: string;
};

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const USERS_KEY = "tastetrail.users";
const SESSION_KEY = "tastetrail.session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isRunningOnWeb() {
    return Platform.OS === "web";
}

async function getStoredItem(key: string) {
    if (isRunningOnWeb()) {
        return window.localStorage.getItem(key);
    }

    return SecureStore.getItemAsync(key);
}

async function setStoredItem(key: string, value: string) {
    if (isRunningOnWeb()) {
        window.localStorage.setItem(key, value);
        return;
    }

    await SecureStore.setItemAsync(key, value);
}

async function deleteStoredItem(key: string) {
    if (isRunningOnWeb()) {
        window.localStorage.removeItem(key);
        return;
    }

    await SecureStore.deleteItemAsync(key);
}

async function getStoredUsers(): Promise<StoredUser[]> {
    const stored = await getStoredItem(USERS_KEY);

    if (!stored) {
        return [];
    }

    try {
        return JSON.parse(stored);
    } catch {
        await setStoredItem(USERS_KEY, JSON.stringify([]));
        return [];
    }
}

async function hashPassword(password: string) {
    return Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function bootstrap() {
            try {
                const session = await getStoredItem(SESSION_KEY);

                if (session) {
                    setUser(JSON.parse(session));
                }
            } catch {
                await deleteStoredItem(SESSION_KEY);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        bootstrap();
    }, []);

    async function register(name: string, email: string, password: string) {
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const passwordHash = await hashPassword(password);

        const users = await getStoredUsers();
        const alreadyExists = users.some((storedUser) => storedUser.email === cleanEmail);

        if (alreadyExists) {
            throw new Error("Er bestaat al een account met dit e-mailadres.");
        }

        const storedUser: StoredUser = {
            name: cleanName,
            email: cleanEmail,
            passwordHash,
        };

        const nextUsers = [...users, storedUser];

        const sessionUser: User = {
            name: cleanName,
            email: cleanEmail,
        };

        await setStoredItem(USERS_KEY, JSON.stringify(nextUsers));
        await setStoredItem(SESSION_KEY, JSON.stringify(sessionUser));

        setUser(sessionUser);
    }

    async function login(email: string, password: string) {
        const cleanEmail = email.trim().toLowerCase();
        const users = await getStoredUsers();

        const storedUser = users.find((item) => item.email === cleanEmail);

        if (!storedUser) {
            throw new Error("Er bestaat geen account met dit e-mailadres.");
        }

        const passwordHash = await hashPassword(password);

        if (storedUser.passwordHash !== passwordHash) {
            throw new Error("E-mail of wachtwoord is niet correct.");
        }

        const sessionUser: User = {
            name: storedUser.name,
            email: storedUser.email,
        };

        await setStoredItem(SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
    }

    async function logout() {
        await deleteStoredItem(SESSION_KEY);
        setUser(null);
    }

    const value = useMemo(
        () => ({
            user,
            loading,
            login,
            register,
            logout,
        }),
        [user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error("useAuth moet binnen AuthProvider gebruikt worden.");
    }

    return value;
}