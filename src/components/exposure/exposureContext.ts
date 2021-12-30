import React from 'react';
import { ExposureConsumer } from './exposureConsumer';

export type ExposureMethods = {
    register(exp: ExposureConsumer): void;
    logoff(exp: ExposureConsumer): void;
}

export default React.createContext<ExposureMethods>(null as any);