import React from "react";

jest.mock("react-native", () => {
    const React = require("react");

    const createMockComponent = (name: string) => {
        return ({ children, ...props }: any) =>
            React.createElement(name, props, children);
    };

    return {
        View: createMockComponent("View"),
        Text: createMockComponent("Text"),
        TextInput: createMockComponent("TextInput"),
        ActivityIndicator: createMockComponent("ActivityIndicator"),
        Pressable: ({ children, ...props }: any) =>
            React.createElement(
                "Pressable",
                props,
                typeof children === "function" ? children({ pressed: false }) : children
            ),
        StyleSheet: {
            create: (styles: any) => styles,
        },
        Platform: {
            OS: "ios",
            select: (options: any) => options.ios ?? options.default,
        },
    };
});

jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => {
    const React = require("react");

    function MockMaterialCommunityIcons(props: any) {
        return React.createElement("MaterialCommunityIcons", props);
    }

    return {
        __esModule: true,
        default: MockMaterialCommunityIcons,
    };
});

import { AppButton } from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { InputField } from "@/components/InputField";
import { LoadingState } from "@/components/LoadingState";

function childrenOf(element: React.ReactElement) {
    return React.Children.toArray(element.props.children) as React.ReactElement[];
}

describe("basic UI components", () => {
    test("AppButton exposes title and press handler", () => {
        const onPress = jest.fn();

        const element = AppButton({
            title: "Klik mij",
            onPress,
        }) as React.ReactElement;

        expect(element.props.disabled).toBe(false);

        element.props.onPress();
        expect(onPress).toHaveBeenCalledTimes(1);

        const child = React.Children.only(element.props.children) as React.ReactElement;
        expect(child.props.children).toBe("Klik mij");
    });

    test("AppButton supports disabled state", () => {
        const element = AppButton({
            title: "Disabled",
            onPress: jest.fn(),
            disabled: true,
        }) as React.ReactElement;

        expect(element.props.disabled).toBe(true);
    });

    test("AppButton supports loading state", () => {
        const element = AppButton({
            title: "Laden",
            onPress: jest.fn(),
            loading: true,
        }) as React.ReactElement;

        expect(element.props.disabled).toBe(true);
        expect(element.props.children).toBeTruthy();
    });

    test("AppButton supports secondary variant", () => {
        const element = AppButton({
            title: "Secundair",
            onPress: jest.fn(),
            variant: "secondary",
        }) as React.ReactElement;

        const child = React.Children.only(element.props.children) as React.ReactElement;
        expect(child.props.children).toBe("Secundair");
    });

    test("EmptyState renders title, message and default icon", () => {
        const element = EmptyState({
            title: "Geen data",
            message: "Er is niets gevonden.",
        }) as React.ReactElement;

        const children = childrenOf(element);
        const iconWrapper = children[0] as React.ReactElement;
        const icon = React.Children.only(iconWrapper.props.children) as React.ReactElement;

        expect(icon.props.name).toBe("silverware-fork-knife");
        expect(children[1].props.children).toBe("Geen data");
        expect(children[2].props.children).toBe("Er is niets gevonden.");
    });

    test("EmptyState supports custom icon", () => {
        const element = EmptyState({
            title: "Geen favorieten",
            message: "Bewaar eerst een recept.",
            iconName: "heart-plus-outline",
        }) as React.ReactElement;

        const children = childrenOf(element);
        const iconWrapper = children[0] as React.ReactElement;
        const icon = React.Children.only(iconWrapper.props.children) as React.ReactElement;

        expect(icon.props.name).toBe("heart-plus-outline");
    });

    test("ErrorMessage renders message without retry button", () => {
        const element = ErrorMessage({
            message: "Netwerkfout",
        }) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[0].props.children).toBe("Er ging iets mis");
        expect(children[1].props.children).toBe("Netwerkfout");
        expect(children[2]).toBeUndefined();
    });

    test("ErrorMessage renders retry button when onRetry exists", () => {
        const onRetry = jest.fn();

        const element = ErrorMessage({
            message: "API fout",
            onRetry,
        }) as React.ReactElement;

        const children = childrenOf(element);
        const retryButton = children[2];

        expect(retryButton.props.title).toBe("Opnieuw proberen");
        expect(retryButton.props.onPress).toBe(onRetry);
    });

    test("InputField renders label, input and error", () => {
        const element = InputField({
            label: "E-mail",
            value: "",
            onChangeText: jest.fn(),
            error: "E-mail is verplicht.",
        }) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[0].props.children).toBe("E-mail");
        expect(children[1].props.value).toBe("");
        expect(children[2].props.children).toBe("E-mail is verplicht.");
    });

    test("InputField renders without error", () => {
        const element = InputField({
            label: "Naam",
            value: "Alperen",
            onChangeText: jest.fn(),
        }) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[0].props.children).toBe("Naam");
        expect(children[1].props.value).toBe("Alperen");
        expect(children[2]).toBeUndefined();
    });

    test("LoadingState renders default message", () => {
        const element = LoadingState({}) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[1].props.children).toBe("Laden...");
    });

    test("LoadingState renders custom message", () => {
        const element = LoadingState({
            message: "Recepten laden...",
        }) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[1].props.children).toBe("Recepten laden...");
    });
});