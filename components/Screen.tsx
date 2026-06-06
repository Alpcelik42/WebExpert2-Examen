import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll = false, style, contentContainerStyle }: Props) {
    const content = scroll ? (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
            {children}
        </ScrollView>
    ) : (
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
    );

    return (
        <SafeAreaView style={[styles.safe, style]} edges={["left", "right", "bottom"]}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {content}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboard: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
});