import { RootObserve, RootUnObserve } from "./Observer";

let obj = {
    a: 1,
    b: "hello world",
    c: null,
    d: {
        aa: 2,
        bb: "bad day",
        cc: null,
        dd: {
            aaa: 3,
            bbb: "nice day",
            ccc: null,
        },
    },
};

let p1 = RootObserve(obj, "ROOT_1");
let p2 = RootObserve(obj, "ROOT_2");
let p3 = RootObserve(obj.d, "ROOT_3");

delete p1.a;
// p1.a = null;
// RootUnObserve("ROOT_2");
// p2 = RootObserve(obj, "ROOT_2");
// RootUnObserve("ROOT_2");
// p2 = RootObserve(obj, "ROOT_2");

// RootUnObserve("ROOT_3");
// p2.d = {
//     i: 1,
//     f: 2,
// };
// p1.c = { name: "kinnon" };
// p1.c.kinnon = "123";
p1.d.dd = {};

// p1.a = 2;
// p2.a = 22;

// p1.b = "hello hell";
// p2.d = null;

// let arrayObj = [1, 2, 3];

// let p1 = RootObserve(arrayObj, "ROOT_ARRAY_1");
// let p2 = RootObserve(arrayObj, "ROOT_ARRAY_2");

// p1[0] = "d";
// p1.splice(0, 1);
// p1.push("d");
// p1.pop();
// p1.sort((a, b) => b - a);
// p1.reverse();
