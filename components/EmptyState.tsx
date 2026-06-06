import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "@/constants/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = {
    title: string;
    message: string;
    iconName?: IconName;
};

export function EmptyState({
                               title,
                               message,
                               iconName = "silverware-fork-knife",
                           }: Props) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons name={iconName} size={30} color={colors.primary} />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 22,
        alignItems: "center",
        gap: 10,
    },
    iconCircle: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "900",
        color: colors.text,
        textAlign: "center",
    },
    message: {
        color: colors.muted,
        textAlign: "center",
        lineHeight: 22,
        fontWeight: "600",
    },
});