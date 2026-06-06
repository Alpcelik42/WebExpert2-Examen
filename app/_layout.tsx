import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <FavoritesProvider>
                        <StatusBar style="dark" />

                        <Stack
                            screenOptions={{
                                headerStyle: { backgroundColor: colors.background },
                                headerTintColor: colors.text,
                                headerTitleStyle: { fontWeight: "900" },
                            }}
                        >
                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                            <Stack.Screen
                                name="meal/[id]"
                                options={{
                                    title: "Recept details",
                                    presentation: "card",
                                }}
                            />
                        </Stack>
                    </FavoritesProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}