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

export default function RegisterScreen() {
    const { user, loading, register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});
    const [generalError, setGeneralError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (loading) {
        return <LoadingState message="Account controleren..." />;
    }

    if (user) {
        return <Redirect href="/" />;
    }

    async function handleRegister() {
        const validation = validateAuthForm({ name, email, password }, true);
        setErrors(validation);
        setGeneralError("");

        if (Object.keys(validation).length > 0) {
            return;
        }

        try {
            setSubmitting(true);
            await register(name, email, password);
            router.replace("/");
        } catch (error) {
            setGeneralError(
                error instanceof Error ? error.message : "Registreren mislukt."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Screen scroll>
            <Animated.View entering={FadeInUp.duration(450)} style={styles.hero}>
                <View style={styles.logoMark}>
                    <MaterialCommunityIcons
                        name="account-plus-outline"
                        size={34}
                        color={colors.primary}
                    />
                </View>

                <Text style={styles.title}>Account maken</Text>
                <Text style={styles.subtitle}>
                    Maak een profiel aan om je favorieten en weekplanning lokaal te bewaren.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(120).duration(450)} style={styles.card}>
                <Text style={styles.cardTitle}>Registreren</Text>
                <Text style={styles.cardText}>
                    Vul je gegevens in. Je account wordt alleen op dit toestel bewaard.
                </Text>

                {generalError ? <ErrorMessage message={generalError} /> : null}

                <InputField
                    label="Naam"
                    value={name}
                    onChangeText={setName}
                    placeholder="Bijvoorbeeld: Alperen"
                    error={errors.name}
                />

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

                <AppButton
                    title="Account maken"
                    onPress={handleRegister}
                    loading={submitting}
                />

                <View style={styles.linkRow}>
                    <Text style={styles.muted}>Heb je al een account?</Text>
                    <Link href="/login" style={styles.link}>
                        Inloggen
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
    title: {
        fontSize: 32,
        color: colors.text,
        fontWeight: "900",
        letterSpacing: -1,
        textAlign: "center",
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