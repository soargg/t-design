import * as React from 'react';

export interface TabsContextType {
    activeKey?: string | number
}

export const TabsContext = React.createContext<TabsContextType>(null);