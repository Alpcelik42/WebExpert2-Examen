import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/AppButton";
import { colors, radius } from "@/constants/theme";

type Props = {
    message: string;
    onRetry?: () => void;
};

export function ErrorMessage({ message, onRetry }: Props) {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Er ging iets mis</Text>
            <Text style={styles.message}>{message}</Text>

            {onRetry ? (
                <AppButton title="Opnieuw proberen" onPress={onRetry} variant="secondary" />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#FFF1EE",
        borderColor: "#F4B7A8",
        borderWidth: 1,
        borderRadius: radius.lg,
        padding: 16,
        gap: 10,
    },
    title: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: "900",
    },
    message: {
        color: colors.text,
        lineHeight: 20,
    },
});