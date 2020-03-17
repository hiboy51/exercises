let handle = {
    get: function(obj, name) {
        if (name in obj) {
            return obj[name];
        }
        if (name == "duplicate") {
            return function(v: number) {
                let arr = this as Array<any>;
                let uniqe = arr.filter((each, idx, arry) => {
                    return arry.indexOf(each) == idx;
                });
                let mapped = uniqe.map((each, idx, arry) => {
                    let count = arr.reduce((pre, cur) => {
                        if (cur == each) {
                            return pre + 1;
                        }
                        return pre;
                    }, 0);
                    return [each, count];
                });
                let find = mapped.find(each => each[0] == v);
                return (find && find[1]) || 0;
            };
        }
    }
};

let prototype = Array.prototype;
let pp = Object.getPrototypeOf(prototype);
Object.setPrototypeOf(prototype, new Proxy(pp, handle));

// test
const a = [1, 1, 2, 2, 3, 4, 3];
let counta = a["duplicate"](0);
console.log(counta);
