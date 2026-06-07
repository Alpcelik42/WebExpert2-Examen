import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/theme";

export function LaadStatus({ message = "Laden..." }: { message?: string }) {
    return (
        <View style={styles.wrapper}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 28,
        alignItems: "center",
        gap: 12,
    },
    text: {
        color: colors.muted,
        fontWeight: "700",
    },
});