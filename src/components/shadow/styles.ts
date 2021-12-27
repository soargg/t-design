import { ShadowLevel } from './interface';

const shadowStyles: ShadowLevel = {
    none: {
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0,
        shadowColor: '',
        shadowRadius: 0
    },
    shadow1: {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.02,
        shadowColor: '#000000',
        shadowRadius: 4
    },
    shadow2: {
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.04,
        shadowColor: '#333333', // 
        shadowRadius: 8
    },
    shadow3: {
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.06,
        shadowColor: '#333333',
        shadowRadius: 10
    }
};

export default shadowStyles;
