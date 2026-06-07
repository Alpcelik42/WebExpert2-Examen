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

import { AppKnop } from "@/components/AppKnop";
import { LegeStaat } from "@/components/LegeStaat";
import { FoutMelding } from "@/components/FoutMelding";
import { InvoerVeld } from "@/components/InvoerVeld";
import { LaadStatus } from "@/components/LaadStatus";

function childrenOf(element: React.ReactElement) {
    return React.Children.toArray(element.props.children) as React.ReactElement[];
}

describe("basic UI components", () => {
    test("AppKnop exposes title and press handler", () => {
        const onPress = jest.fn();

        const element = AppKnop({
            title: "Klik mij",
            onPress,
        }) as React.ReactElement;

        expect(element.props.disabled).toBe(false);

        element.props.onPress();
        expect(onPress).toHaveBeenCalledTimes(1);

        const child = React.Children.only(element.props.children) as React.ReactElement;
        expect(child.props.children).toBe("Klik mij");
    });

    test("AppKnop supports disabled state", () => {
        const element = AppKnop({
            title: "Disabled",
            onPress: jest.fn(),
            disabled: true,
        }) as React.ReactElement;

        expect(element.props.disabled).toBe(true);
    });

    test("AppKnop supports loading state", () => {
        const element = AppKnop({
            title: "Laden",
            onPress: jest.fn(),
            loading: true,
        }) as React.ReactElement;

        expect(element.props.disabled).toBe(true);
        expect(element.props.children).toBeTruthy();
    });

    test("AppKnop supports secondary variant", () => {
        const element = AppKnop({
            title: "Secundair",
            onPress: jest.fn(),
            variant: "secondary",
        }) as React.ReactElement;

        const child = React.Children.only(element.props.children) as React.ReactElement;
        expect(child.props.children).toBe("Secundair");
    });

    test("LegeStaat renders title, message and default icon", () => {
        const element = LegeStaat({
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

    test("LegeStaat supports custom icon", () => {
        const element = LegeStaat({
            title: "Geen favorieten",
            message: "Bewaar eerst een recept.",
            iconName: "heart-plus-outline",
        }) as React.ReactElement;

        const children = childrenOf(element);
        const iconWrapper = children[0] as React.ReactElement;
        const icon = React.Children.only(iconWrapper.props.children) as React.ReactElement;

        expect(icon.props.name).toBe("heart-plus-outline");
    });

    test("FoutMelding renders message without retry button", () => {
        const element = FoutMelding({
            message: "Netwerkfout",
        }) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[0].props.children).toBe("Er ging iets mis");
        expect(children[1].props.children).toBe("Netwerkfout");
        expect(children[2]).toBeUndefined();
    });

    test("FoutMelding renders retry button when onRetry exists", () => {
        const onRetry = jest.fn();

        const element = FoutMelding({
            message: "API fout",
            onRetry,
        }) as React.ReactElement;

        const children = childrenOf(element);
        const retryButton = children[2];

        expect(retryButton.props.title).toBe("Opnieuw proberen");
        expect(retryButton.props.onPress).toBe(onRetry);
    });

    test("InvoerVeld renders label, input and error", () => {
        const element = InvoerVeld({
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

    test("InvoerVeld renders without error", () => {
        const element = InvoerVeld({
            label: "Naam",
            value: "Alperen",
            onChangeText: jest.fn(),
        }) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[0].props.children).toBe("Naam");
        expect(children[1].props.value).toBe("Alperen");
        expect(children[2]).toBeUndefined();
    });

    test("LaadStatus renders default message", () => {
        const element = LaadStatus({}) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[1].props.children).toBe("Laden...");
    });

    test("LaadStatus renders custom message", () => {
        const element = LaadStatus({
            message: "Recepten laden...",
        }) as React.ReactElement;

        const children = childrenOf(element);

        expect(children[1].props.children).toBe("Recepten laden...");
    });
});