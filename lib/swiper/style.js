import { StyleSheet } from 'react-native';
import { pTd } from '../common/utils';
export const styles = StyleSheet.create({
    // 容器自适应宽高
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
        flex: 1
    },
    wrapper: {
        backgroundColor: 'transparent'
    },
    slide: {
        backgroundColor: 'transparent'
    },
    slideLoadWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonWrapper: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 50,
        color: '#007aff'
    },
    indicatorWrapper: {
        backgroundColor: 'transparent',
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        top: 0,
        left: 0,
        flex: 1,
        zIndex: 9
    },
    indicator: {
        position: 'absolute',
        bottom: pTd(20)
    }
});
