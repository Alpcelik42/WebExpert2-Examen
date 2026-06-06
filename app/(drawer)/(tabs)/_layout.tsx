import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    height: 62 + insets.bottom,
                    paddingTop: 8,
                    paddingBottom: Math.max(insets.bottom, 10),
                },
                tabBarLabelStyle: {
                    fontWeight: "900",
                    fontSize: 12,
                },
                tabBarItemStyle: {
                    paddingVertical: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Zoeken",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="random"
                options={{
                    title: "Inspiratie",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="lightbulb-on-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}