import { screenWidth, designWidth, p1x } from './index';
// 是否是方法
export function isFunction(it) {
    return Object.prototype.toString.call(it) === '[object Function]';
}
// 数字类型判断
export function isNumber(it) {
    return typeof it === 'number';
}
// 字符串判断
export function isString(it) {
    return typeof it === 'string';
}
// 布尔判断
export function isBoolean(it) {
    return typeof it === 'boolean';
}
// 对象
export function isObject(it) {
    return Object.prototype.toString.call(it) === '[object Object]';
}
export function getArrayByLength(length) {
    const ret = [];
    for (let i = 0; i < length; i++) {
        ret[i] = null;
    }
    return ret;
}
// 多种屏幕宽度适配方案
export function pTd(value) {
    const scaleValue = Math.floor(value * (screenWidth / designWidth) + 0.5);
    return value > 0 && scaleValue === 0 ? p1x : scaleValue;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function is(x, y) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    }
    else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}
function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
        return true;
    }
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    for (let i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
/**
 * shouldComponentUpdate 浅比较
 * @param instance
 * @param nextProps
 * @param nextState
 * @returns { Boolean }
 */
export function shallowCompare(instance, nextProps, nextState) {
    return (!shallowEqual(instance.props, nextProps) ||
        !shallowEqual(instance.state, nextState));
}
