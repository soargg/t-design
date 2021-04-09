// 是否是方法
export function isFunction(it: any): boolean {
    return Object.prototype.toString.call(it) === '[object Function]';
}

// 数字类型判断
export function isNumber(it: any): boolean {
    return typeof it === 'number';
}

// 字符串判断
export function isString(it: any): boolean {
    return typeof it === 'string';
}

// 布尔判断
export function isBoolean(it: any): boolean {
    return typeof it === 'boolean';
}

// 对象
export function isObject(it: any): boolean {
    return Object.prototype.toString.call(it) === '[object Object]';
}

export function getArrayByLength(length: number): null[] {
    const ret = [];
    for (let i = 0; i < length; i++) {
        ret[i] = null;
    }
    return ret;
}