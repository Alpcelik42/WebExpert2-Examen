import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { colors } from "@/constants/theme";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/context/AuthContext";

export default function DrawerLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingState message="App voorbereiden..." />;
    }

    if (!user) {
        return <Redirect href="/login" />;
    }

    return (
        <Drawer
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: { fontWeight: "900" },

                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: colors.text,
                drawerActiveBackgroundColor: "#F4E0D6",

                drawerStyle: {
                    backgroundColor: colors.background,
                    width: 300,
                },
                drawerContentStyle: {
                    paddingTop: 12,
                },
                drawerItemStyle: {
                    borderRadius: 22,
                    marginHorizontal: 14,
                    marginVertical: 2,
                    minHeight: 54,
                },
                drawerLabelStyle: {
                    fontWeight: "900",
                    fontSize: 15,
                    marginLeft: -8,
                },
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    title: "Ontdekken",
                    drawerLabel: "Ontdekken",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="view-dashboard-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="favorites"
                options={{
                    title: "Favorieten",
                    drawerLabel: "Favorieten",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="heart-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="about"
                options={{
                    title: "Weekplanning",
                    drawerLabel: "Weekplanning",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="calendar-month-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name="profiel"
                options={{
                    title: "Profiel",
                    drawerLabel: "Profiel",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="account-circle-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Drawer>
    );
}