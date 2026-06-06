import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, Redirect, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AppButton } from "@/components/AppButton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { InputField } from "@/components/InputField";
import { LoadingState } from "@/components/LoadingState";
import { Screen } from "@/components/Screen";
import { colors, radius } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { validateAuthForm } from "@/utils/validation";

export default function LoginScreen() {
    const { user, loading, login, register } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [generalError, setGeneralError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (loading) {
        return <LoadingState message="Account controleren..." />;
    }

    if (user) {
        return <Redirect href="/" />;
    }

    async function handleLogin() {
        const validation = validateAuthForm({ email, password }, false);
        setErrors(validation);
        setGeneralError("");

        if (Object.keys(validation).length > 0) {
            return;
        }

        try {
            setSubmitting(true);
            await login(email, password);
            router.replace("/");
        } catch (error) {
            setGeneralError(error instanceof Error ? error.message : "Inloggen mislukt.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDemoAccount() {
        try {
            setSubmitting(true);
            await register("Demo Chef", "demo@kookkompas.app", "demo1234");
            router.replace("/");
        } catch {
            try {
                await login("demo@kookkompas.app", "demo1234");
                router.replace("/");
            } catch {
                setGeneralError("Demo-account kon niet worden gestart.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Screen scroll>
            <Animated.View entering={FadeInUp.duration(450)} style={styles.hero}>
                <View style={styles.logoMark}>
                    <MaterialCommunityIcons
                        name="silverware-fork-knife"
                        size={34}
                        color={colors.primary}
                    />
                </View>

                <Text style={styles.brand}>KookKompas</Text>
                <Text style={styles.subtitle}>
                    Ontdek recepten, bewaar favorieten en vind snel inspiratie voor je volgende maaltijd.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(120).duration(450)} style={styles.card}>
                <Text style={styles.cardTitle}>Inloggen</Text>
                <Text style={styles.cardText}>
                    Gebruik je account om je favorieten en laatst bekeken recepten lokaal te bewaren.
                </Text>

                {generalError ? <ErrorMessage message={generalError} /> : null}

                <InputField
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="naam@email.com"
                    error={errors.email}
                />

                <InputField
                    label="Wachtwoord"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Minstens 6 tekens"
                    error={errors.password}
                />

                <AppButton title="Inloggen" onPress={handleLogin} loading={submitting} />

                <AppButton
                    title="Demo-account gebruiken"
                    onPress={handleDemoAccount}
                    variant="secondary"
                    loading={submitting}
                />

                <View style={styles.linkRow}>
                    <Text style={styles.muted}>Nog geen account?</Text>
                    <Link href="/register" style={styles.link}>
                        Account maken
                    </Link>
                </View>
            </Animated.View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: "center",
        paddingTop: 34,
        paddingBottom: 24,
        gap: 10,
    },
    logoMark: {
        width: 76,
        height: 76,
        borderRadius: 24,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    brand: {
        fontSize: 36,
        color: colors.text,
        fontWeight: "900",
        letterSpacing: -1,
    },
    subtitle: {
        color: colors.muted,
        textAlign: "center",
        lineHeight: 22,
        fontWeight: "600",
        maxWidth: 360,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
        gap: 12,
    },
    cardTitle: {
        color: colors.text,
        fontSize: 24,
        fontWeight: "900",
    },
    cardText: {
        color: colors.muted,
        lineHeight: 21,
        fontWeight: "600",
    },
    linkRow: {
        flexDirection: "row",
        gap: 6,
        justifyContent: "center",
        marginTop: 8,
    },
    muted: {
        color: colors.muted,
        fontWeight: "600",
    },
    link: {
        color: colors.primary,
        fontWeight: "900",
    },
});