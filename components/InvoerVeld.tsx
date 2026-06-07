import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { colors, radius } from "@/constants/theme";

type Props = TextInputProps & {
    label: string;
    error?: string;
};

export function InvoerVeld({ label, error, style, ...props }: Props) {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                placeholderTextColor={colors.muted}
                style={[styles.input, error && styles.inputError, style]}
                {...props}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 8,
        marginBottom: 14,
    },
    label: {
        color: colors.text,
        fontWeight: "800",
        fontSize: 14,
    },
    input: {
        minHeight: 52,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        paddingHorizontal: 14,
        color: colors.text,
        fontSize: 16,
    },
    inputError: {
        borderColor: colors.danger,
    },
    error: {
        color: colors.danger,
        fontWeight: "600",
    },
});