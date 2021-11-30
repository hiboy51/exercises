/*
 * @Author: Kinnon.Z
 * @Date: 2021-11-29 15:05:20
 * @Last Modified by: Kinnon.Z
 * @Last Modified time: 2021-11-29 18:24:43
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
type RootPath = string;
type TargetSource = {};
type TargetProxy = {};
let GlobalProxies: Map<TargetSource, [RootPath, TargetProxy][]> = new Map();
let DispatchingMedium: { oldV: any; newV: any } = null;

function VMNotify(newV: any, oldV: any, path: string[]) {
    //TODO
    console.log(
        `VMNotify:\n PATH = ${path.join(".")}\n [old] => ${JSON.stringify(
            oldV
        )}\n [new] => ${JSON.stringify(newV)}`
    );
}

function SafeSaveProxy(target, rootPath, proxy) {
    if (GlobalProxies.has(target)) {
        GlobalProxies.get(target).push([rootPath, proxy]);
    } else {
        GlobalProxies.set(target, [[rootPath, proxy]]);
    }
}

function Observe<T extends { [k: string]: any }>(obj: T, path: string[] = []) {
    Reflect.ownKeys(obj).forEach((key) => {
        key = String(key);
        let target = Reflect.get(obj, key);
        if (typeof target == "object" && target != null) {
            let curPath = [...path, key];
            let p = Observe(target, curPath);
            SafeSaveProxy(target, curPath.join("."), p);
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
                    SafeSaveProxy(newValue, route.join("."), np);
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
                    SafeSaveProxy(newValue, route.join("."), np);
                }
                VMNotify(newValue, oldValue, route);
                if (!DispatchingMedium) {
                    Reflect.set(target, field, newValue);
                    DispatchingMedium = {
                        newV: newValue,
                        oldV: oldValue,
                    };
                    GlobalProxies.get(target)
                        .filter((each) => {
                            let [, p] = each;
                            return p != receiver;
                        })
                        .forEach((v, k) => {
                            let [, p] = v;
                            p[field] = newValue;
                        });
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
                                .filter((each) => {
                                    let [, p] = each;
                                    return p != receiver;
                                })
                                .forEach((v, k) => {
                                    let [, p] = v;
                                    p[field](args);
                                });
                            DispatchingMedium = null;
                        }
                    }
                };
            }
            let result = Reflect.get(target, field);
            if (typeof result == "object" && result != null) {
                if (GlobalProxies.get(result)?.length > 0) {
                    return GlobalProxies.get(result)[0][1];
                }
            }
            return Reflect.get(target, field);
        },
        deleteProperty: function (target, field) {
            let allProxies = GlobalProxies.get(target) || [];
            allProxies.forEach((each) => (each[1][field] = undefined));
            return true;
        },
    };

    let proxy = new Proxy(obj, proxyHandler);
    return proxy;
}

export function RootObserve<T extends { [k: string]: any }>(
    obj: T,
    root: string
) {
    let proxy = Observe(obj, [root]);
    SafeSaveProxy(obj, root, proxy);
    return proxy;
}

export function RootUnObserve(rootPath: string) {
    let i = 0,
        path = "";
    GlobalProxies.forEach((v, k) => {
        for (i = v.length - 1; i >= 0; --i) {
            [path] = v[i];
            if (path.startsWith(rootPath)) {
                v.splice(i, 1);
            }
        }
    });
}
