let prototype = Array.prototype;
let funcDumplicate = function(v) {
    let arr = this;
    let uniqe = arr.filter((each, idx, arry) => {
        return arry.indexOf(each) == idx;
    });
    let mapped = uniqe.map(each => {
        let count = arr.reduce((pre, cur) => {
            if (cur == each) {
                return pre + 1;
            }
            return pre;
        }, 0);
        return [each, count];
    });
    let found = mapped.find(each => each[0] == v);
    return (found && found[1]) || 0;
};
Object.defineProperty(prototype, "duplicate", {
    value: funcDumplicate,
    writable: false
});

// test
const b = [1, 1, 2, 2, 3, 4, 3];
let countb = b["duplicate"](3);
console.log(countb);
