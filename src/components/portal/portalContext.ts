import React from 'react';

export type PortalMethods = {
    mount(children: React.ReactNode, zIndex?: number): number;
    update(key: number, children: React.ReactNode): void;
    unmount(key: number): void;
}

export default React.createContext<PortalMethods>(null as any);