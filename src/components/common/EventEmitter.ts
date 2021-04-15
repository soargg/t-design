import {isFunction} from './utils'

const Applay = Function.prototype.apply;
const privateMap = new WeakMap();

interface EventItem {
    callback: Function,
    context: Object,
    weight: number
}

interface PrivateMap {
    _events: Set<string>;
    _callbacks: {
        [propName: string]: Array<EventItem>
    };
    _console: Console;
    _maxListeners: number
}

// 为了使用私有属性
function internal(obj: Object): PrivateMap {
    if (!privateMap.has(obj)) {
        privateMap.set(obj, {});
    }
    return privateMap.get(obj);
}

export default class EventEmitter {
    /**
     * Constructor.
     *
     * @constructor
     * @param {number|null} maxListeners.
     * @param {object} localConsole.
     * @return {this}
     */
    constructor(maxListeners: number = null, localConsole: Console = console) {
        const self = internal(this);
        self._events = new Set();
        self._callbacks = {};
        self._console = localConsole;
        self._maxListeners = maxListeners === null ? null : parseInt(`${maxListeners}`, 10);

        return this;
    }

    /**
     * Get all callback for the event.
     * @param {string} eventName
     * @return {object|undefined}
     */
    private _getCallbacks(eventName: string): Array<EventItem> {
        return internal(this)._callbacks[eventName];
    }

    /**
     * Add callback to the event.
     *
     * @param {string} eventName.
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     * @param {number} weight - Using for sorting callbacks calls.
     *
     * @return {this}
     */
    private _addCallback(eventName: string, callback: Function, context: Object, weight: number): EventEmitter {
        this._getCallbacks(eventName)
            .push({
                callback,
                context,
                weight
            });

        // 对该事件注册的回调函数排序
        this._getCallbacks(eventName)
            .sort((a, b) => a.weight - b.weight);

        return this;
    }

    /**
     * Get callback's index for the event.
     *
     * @param {string} eventName
     * @param {callback} callback
     *
     * @return {number|null}
     */
    private _getCallBackIndex(eventName: string, callback: Function): number {
        return this._has(eventName) ? this._getCallbacks(eventName).findIndex(item => item.callback === callback) : -1;
    }

     /**
     * Check if we achieve maximum of listeners for the event.
     *
     * @param {string} eventName
     *
     * @return {bool}
     */
    private _achieveMaxListener(eventName: string): boolean {
        const self = internal(this);
        return (self._maxListeners !== null  && self._maxListeners < this.listenersNumber(eventName));
    }

    /**
     * Check is the event was already added.
     *
     * @param {string} eventName
     *
     * @return {bool}
     */
    private _has(eventName: string): boolean {
        return internal(this)._events.has(eventName);
    }

    /**
     * Check if callback is already exists for the event.
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     *
     * @return {bool}
     */
    private _callbackIsExists(eventName: string, callback: Function, context: Object): boolean {
        const callbackIdx = this._getCallBackIndex(eventName, callback);
        const activeCallback = callbackIdx !== -1 ? this._getCallbacks(eventName)[callbackIdx] : void 0;

        return (callbackIdx !== -1 && !!activeCallback && activeCallback.context === context);
    }

    /**
     * Returns number of listeners for the event.
     *
     * @param {string} eventName
     *
     * @return {number|null} - Number of listeners for event
     *                         or null if event isn't exists.
     */
    listenersNumber(eventName: string): number {
        return this._has(eventName) ? this._getCallbacks(eventName).length : null;
    }

    /**
     * Add the listener.
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     * @param {number} weight - Using for sorting callbacks calls.
     *
     * @return {this}
     */
    on(eventName: string, callback: Function, context: Object = null, weight = 1) {
        const self = internal(this);

        if (!isFunction(callback)) {
            throw new TypeError(`${callback} is not a function`);
        }

        // 如果事件已经被添加，直接注册回调
        // 初始化EventItem
        if (!this._has(eventName)) {
            self._events.add(eventName);
            self._callbacks[eventName] = [];
        } else {
            // Check if we reached maximum number of listeners.
            if (this._achieveMaxListener(eventName)) {
                self._console.warn(`Max listeners (${self._maxListeners}) for event "${eventName}" is reached!`);
            }
            // Check if the same callback has already added.
            if (this._callbackIsExists(eventName, callback, context)) {
                self._console.warn(`Event "${eventName}" already has the callback ${callback}.`);
            }
        }

        this._addCallback(eventName, callback, context, weight);
    }

    /**
     * Add the listener which will be executed only once.
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     * @param {number} weight - Using for sorting callbacks calls.
     *
     * @return {this}
     */
    once(eventName: string, callback: Function, context: Object = null, weight = 1) {
        const onceCallback = (...args: any[]) => {
            this.off(eventName, callback);
            return Applay.call(callback, context, args);
        }

        return this.on(eventName, onceCallback, context, weight);
    }

    /**
     * Remove an event at all or just remove selected callback from the event.
     *
     * @param {string} eventName
     * @param {function} callback
     *
     * @return {this}
     */
    off(eventName: string, callback: Function = null) {
        const self = internal(this);

        if (this._has(eventName)) {
            if (callback === null) {
                // Remove the event.
                self._events.delete(eventName);
                self._callbacks[eventName] = null;
            } else {
                const callBackIdx: number = this._getCallBackIndex(eventName, callback);

                if (callBackIdx !== -1) {
                    self._callbacks[eventName].splice(callBackIdx, 1);
                    // Remove all equal callbacks.
                    this.off(eventName, callback);
                }
            }
        }

        return this;
    }

    /**
     * Trigger the event.
     *
     * @param {string} eventName
     * @param {...args} args - All arguments which should be passed into callbacks.
     *
     * @return {this}
     */
    emit(eventName: string, ...args: any[]) {
        if (this._has(eventName)) {
            this._getCallbacks(eventName).forEach(eventFun => {
                Applay.call(eventFun.callback, eventFun.context, args);
            })
        }

        return this;
    }

    /**
     * Clear all events and callback links.
     *
     * @return {this}
     */
    clear() {
        const self = internal(this);

        self._events.clear();
        self._callbacks = {};

        return this;
    }
}