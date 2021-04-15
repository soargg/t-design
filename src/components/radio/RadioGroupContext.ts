import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type RadioValueType = string | number | boolean;

export interface RadioOptionType {
    label: React.ReactNode;
    value: RadioValueType;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    onChange?(next: boolean): void;
}

export interface GroupContext {
    current?: RadioValueType;
    disabled?: boolean;
    onRadioChange?: (value: RadioValueType) => void;
}

export const RadioGroupContext = React.createContext<GroupContext>(null);