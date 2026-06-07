import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import {
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { colors, radius } from "@/constants/theme";
import { Meal } from "@/types/meal";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
    meal: Meal;
    favorite?: boolean;
    onFavoritePress?: () => void;
};

export function ReceptKaart({ meal, favorite = false, onFavoritePress }: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    function openDetail() {
        router.push({
            pathname: "/recept/[id]",
            params: { id: meal.idMeal },
        });
    }

    return (
        <AnimatedPressable
            onPress={openDetail}
            onPressIn={() => {
                scale.value = withSpring(0.98);
            }}
            onPressOut={() => {
                scale.value = withSpring(1);
            }}
            style={[styles.card, animatedStyle]}
        >
            {meal.strMealThumb ? (
                <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.placeholder]}>
                    <MaterialCommunityIcons
                        name="image-off-outline"
                        size={34}
                        color={colors.muted}
                    />
                    <Text style={styles.placeholderText}>Geen afbeelding beschikbaar</Text>
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.topRow}>
                    <View style={styles.textBlock}>
                        <Text numberOfLines={2} style={styles.title}>
                            {meal.strMeal}
                        </Text>

                        <View style={styles.metaRow}>
                            <MaterialCommunityIcons
                                name="tag-outline"
                                size={15}
                                color={colors.muted}
                            />
                            <Text numberOfLines={1} style={styles.meta}>
                                {meal.strCategory ?? "Categorie onbekend"} ·{" "}
                                {meal.strArea ?? "Regio onbekend"}
                            </Text>
                        </View>
                    </View>

                    {onFavoritePress ? (
                        <Pressable
                            onPress={onFavoritePress}
                            hitSlop={12}
                            style={styles.favoriteButton}
                        >
                            <MaterialCommunityIcons
                                name={favorite ? "heart" : "heart-outline"}
                                size={24}
                                color={favorite ? colors.primary : colors.muted}
                            />
                        </Pressable>
                    ) : null}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Bekijk recept</Text>
                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color={colors.primary}
                    />
                </View>
            </View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.07,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 6 },
            },
            android: {
                elevation: 3,
            },
        }),
    },
    image: {
        width: "100%",
        height: 185,
        backgroundColor: colors.surfaceAlt,
    },
    placeholder: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    placeholderText: {
        color: colors.muted,
        fontWeight: "700",
    },
    content: {
        padding: 14,
        gap: 12,
    },
    topRow: {
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
    },
    textBlock: {
        flex: 1,
        gap: 8,
    },
    title: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "900",
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    meta: {
        color: colors.muted,
        fontWeight: "700",
        flex: 1,
    },
    favoriteButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    footerText: {
        color: colors.primary,
        fontWeight: "900",
    },
});