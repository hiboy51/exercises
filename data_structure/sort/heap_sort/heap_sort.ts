class HeapInt {
    public value: number;
    public left: HeapInt = null;
    public right: HeapInt = null;
    public root: HeapInt = null;
    static of(input: number[], idx: number = 0) {
        if (idx >= input.length) {
            return null;
        }
        let value = input[idx];
        let lIdx = 2 * idx + 1;
        let rIdx = 2 * idx + 2;

        let constructed = new HeapInt(value);
        let left = HeapInt.of(input, lIdx);
        let right = HeapInt.of(input, rIdx);
        constructed.left = left;
        constructed.right = right;
        if (left) {
            left.root = constructed;
        }
        if (right) {
            right.root = constructed;
        }
        return constructed;
    }

    constructor(value: number) {
        this.value = value;
    }

    public justify() {
        let left = this.left;
        let right = this.right;
        if (!left) {
            //* 叶子节点
            return this.value;
        }
        if (!right) {
            //* 只有左节点
            if (this.value < left.justify()) {
                let tmp = this.value;
                this.value = left.value;
                left.value = tmp;
            }
            return this.value;
        }
        if (this.value < right.justify()) {
            let tmp = this.value;
            this.value = right.value;
            right.value = tmp;
        }
        if (this.value < left.justify()) {
            let tmp = this.value;
            this.value = left.value;
            left.value = tmp;
        }
        return this.value;
    }
}
class HeapSort {
    public sort(input: number[], result: number[] = []) {
        if (input.length == 0) {
            return result;
        }
        let heap = HeapInt.of(input);
        let biggest = heap.justify();
        console.log(`loop biggest = ${biggest}`);
        result.unshift(biggest);
        input.splice(input.indexOf(biggest), 1);
        return this.sort(input, result);
    }

    public output() {
        const input = [123, 2, 25882, 23, 2, 234, 2356, 1221];
        let sorted = this.sort(input);
        console.log(JSON.stringify(sorted));
    }
}

new HeapSort().output();
