/*
 * @Author: Kinnon.Z
 * @Date: 2021-11-29 15:05:20
 * @Last Modified by: Kinnon.Z
 * @Last Modified time: 2021-11-29 17:13:45
 */
const ModMethods = [
    "push",
    "pop",
    "shift",
    "unshift",
    "sort",
    "reverse",
    "splice",
];
let GlobalProxies: Map<{}, {}[]> = new Map();
let DispatchingMedium: { oldV: any; newV: any } = null;

function VMNotify(newV: any, oldV: any, path: string[]) {
    //TODO
    console.log(
        `VMNotify:\n PATH = ${path.join(".")}\n [old] => ${JSON.stringify(
            oldV
        )}\n [new] => ${JSON.stringify(newV)}`
    );
}

function SafeSaveProxy(target, proxy) {
    if (GlobalProxies.has(target)) {
        GlobalProxies.get(target).push(proxy);
    } else {
        GlobalProxies.set(target, [proxy]);
    }
}

export function RootObserve<T extends { [k: string]: any }>(
    obj: T,
    path: string[] = []
) {
    let proxy = Observe(obj, path);
    SafeSaveProxy(obj, proxy);
    return proxy;
}

function Observe<T extends { [k: string]: any }>(obj: T, path: string[] = []) {
    Reflect.ownKeys(obj).forEach((key) => {
        key = String(key);
        let target = Reflect.get(obj, key);
        if (typeof target == "object" && target != null) {
            let p = Observe(target, [...path, key]);
            SafeSaveProxy(target, p);
        }
    });

    const proxyHandler = {
        set: function (target, field, newValue, receiver) {
            let route = [...path, field];
            let oldValue;
            if (DispatchingMedium) {
                oldValue = DispatchingMedium.oldV;
                newValue = DispatchingMedium.newV;
            } else {
                oldValue = Reflect.get(target, field);
            }
            if (oldValue != newValue) {
                if (
                    typeof oldValue == "object" &&
                    oldValue != null &&
                    typeof newValue == "object" &&
                    newValue != null
                ) {
                    if (!DispatchingMedium) {
                        GlobalProxies.delete(oldValue);
                    }
                    let np = Observe(newValue, route);
                    SafeSaveProxy(newValue, np);
                } else if (
                    typeof oldValue == "object" &&
                    oldValue != null &&
                    newValue == null
                ) {
                    GlobalProxies.delete(oldValue);
                } else if (
                    oldValue == null &&
                    typeof newValue == "object" &&
                    newValue != null
                ) {
                    let np = Observe(newValue, route);
                    SafeSaveProxy(newValue, np);
                }
                VMNotify(newValue, oldValue, route);
                if (!DispatchingMedium) {
                    Reflect.set(target, field, newValue);
                    DispatchingMedium = {
                        newV: newValue,
                        oldV: oldValue,
                    };
                    let allProxies = GlobalProxies.get(target);
                    allProxies
                        .filter((each) => each != receiver)
                        .forEach((each) => (each[field] = newValue));
                    DispatchingMedium = null;
                }
            }
            return true;
        },
        get: function (target, field, receiver) {
            if (Array.isArray(target) && ModMethods.indexOf(field) >= 0) {
                return function (...args: any[]) {
                    let route = [...path];
                    let callee = this;
                    let oldValue, newValue;
                    if (DispatchingMedium) {
                        oldValue = DispatchingMedium.oldV;
                        newValue = DispatchingMedium.newV;
                    } else {
                        oldValue = target.slice();
                        Reflect.get(target, field).apply(callee, args);
                        newValue = target.slice();
                    }
                    let changed =
                        oldValue.length != newValue.length ||
                        newValue.some((each, idx) => each != oldValue[idx]);
                    if (changed) {
                        VMNotify(newValue, oldValue, route);
                        if (!DispatchingMedium) {
                            DispatchingMedium = {
                                newV: newValue,
                                oldV: oldValue,
                            };
                            let allProxies = GlobalProxies.get(target) || [];
                            allProxies
                                .filter((each) => each != receiver)
                                .forEach((each) => {
                                    each[field](args);
                                });
                            DispatchingMedium = null;
                        }
                    }
                };
            }
            let result = Reflect.get(target, field);
            if (typeof result == "object" && result != null) {
                if (GlobalProxies.get(result)?.length > 0) {
                    return GlobalProxies.get(result)[0];
                }
            }
            return Reflect.get(target, field);
        },
        deleteProperty: function (target, field) {
            let allProxies = GlobalProxies.get(target) || [];
            allProxies.forEach((each) => (each[field] = undefined));
            return true;
        },
    };

    let proxy = new Proxy(obj, proxyHandler);
    return proxy;
}
