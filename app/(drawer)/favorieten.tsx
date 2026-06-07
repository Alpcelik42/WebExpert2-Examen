import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LegeStaat } from "@/components/LegeStaat";
import { ReceptKaart } from "@/components/ReceptKaart";
import { Scherm } from "@/components/Scherm";
import { colors, radius } from "@/constants/theme";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesScreen() {
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    return (
        <Scherm style={{ paddingHorizontal: 0 }}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.idMeal}
                initialNumToRender={6}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <Animated.View entering={FadeInDown.duration(450)} style={styles.headerCard}>
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons
                                name="heart-outline"
                                size={28}
                                color={colors.primary}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>Favorieten</Text>
                            <Text style={styles.subtitle}>
                                Recepten die je bewaart, blijven lokaal beschikbaar op dit toestel.
                            </Text>
                        </View>
                    </Animated.View>
                }
                ListEmptyComponent={
                    <LegeStaat
                        title="Nog geen favorieten"
                        message="Tik op het hartje bij een recept om het hier te bewaren."
                        iconName="heart-plus-outline"
                    />
                }
                renderItem={({ item }) => (
                    <ReceptKaart
                        meal={item}
                        favorite={isFavorite(item.idMeal)}
                        onFavoritePress={() => toggleFavorite(item)}
                    />
                )}
            />
        </Scherm>
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 16,
        paddingBottom: 34,
    },
    headerCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        gap: 14,
        alignItems: "center",
    },
    iconCircle: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: colors.text,
        fontSize: 27,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    subtitle: {
        color: colors.muted,
        lineHeight: 21,
        fontWeight: "600",
        marginTop: 4,
    },
});