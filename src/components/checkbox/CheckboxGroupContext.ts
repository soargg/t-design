import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type CheckboxValueType = string | number | boolean;

export type CheckboxOptionType = {
    label: React.ReactNode;
    value: CheckboxValueType;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    onChange?(next: boolean): void;
}

export interface GroupContext {
    values?: Array<CheckboxValueType>;
    disabled?: boolean;
    toggleOption?: (option: CheckboxOptionType) => void;
    registerValue?: (value: CheckboxValueType) => void;
    cancelValue?: (value: CheckboxValueType) => void;
}

export const CheckboxGroupContext = React.createContext<GroupContext>(null);