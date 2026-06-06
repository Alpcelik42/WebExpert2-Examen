import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";
import { colors, radius } from "@/constants/theme";

type Props = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger";
    style?: ViewStyle;
    testID?: string;
};

export function AppButton({
                              title,
                              onPress,
                              loading = false,
                              disabled = false,
                              variant = "primary",
                              style,
                              testID,
                          }: Props) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            testID={testID}
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                isDisabled && styles.disabled,
                pressed && !isDisabled && styles.pressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 52,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border,
    },
    danger: {
        backgroundColor: colors.danger,
    },
    disabled: {
        opacity: 0.55,
    },
    pressed: {
        transform: [{ scale: 0.98 }],
    },
    text: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 16,
    },
    secondaryText: {
        color: colors.text,
    },
});