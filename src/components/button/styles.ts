import { StyleSheet } from 'react-native';
import { isAndroid } from '../common';

export const styles = StyleSheet.create({
    button: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 'auto',
        overflow: 'hidden'
    },
    large: {
        height: 44,
        paddingHorizontal: 28,
        borderRadius: 6
    },
    middle: {
        height: 40,
        paddingHorizontal: 28,
        borderRadius: 6
    },
    small: {
        height: 32,
        paddingHorizontal: 12,
        borderRadius: 6
    },
    mini: {
        height: 24,
        paddingHorizontal: 10,
        borderRadius: 4
    },
    spinView: {
        position: 'absolute',
        zIndex: 10,
        left: 0,
        top: 0,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    spinMini: {
        transform: [{ scale: 0.7 }]
    }
});

export const txtStyle = StyleSheet.create({
    base: {
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingBottom: isAndroid ? 1 : 0
    },
    large: {
        fontSize: 16
    },
    middle: {
        fontSize: 16
    },
    small: {
        fontSize: 14
    },
    mini: {
        fontSize: 12
    }
});

