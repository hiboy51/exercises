/*
 * @Author: Kinnon.Z
 * @Date: 2020-04-21 20:00:10
 * @Last Modified by: Kinnon.Z
 * @Last Modified time: 2020-04-21 22:36:10
 */

export default class FillInNumbers {
    // ? ===================================================================================
    // ? private interfaces
    // ? ===================================================================================
    //! 组合算法
    private _combine(count: number, total: number[]): number[][] {
        if (count == 0) {
            return [];
        }
        if (total.length < count) {
            return [];
        }
        if (total.length == count) {
            return [total.slice()];
        }
        if (count == 1) {
            return total.map((each) => [each]);
        }

        let [head] = total;
        let a = this._combine(count - 1, total.slice(1)).map((each) => [head, ...each]);
        let b = this._combine(count, total.slice(1));
        return [...a, ...b];
    }

    private _checkMatch(input: number[]) {
        const aim = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let matched = aim.every((each, idx) => {
            let count = input.reduce((pre, cur) => {
                if (cur == each) {
                    return ++pre;
                }
                return pre;
            }, 0);
            return count == input[idx];
        });
        return matched;
    }

    //! 暴力破解法
    private _m1() {
        let max = 9999999999;
        let gen = [];
        let startTime = new Date().getTime();
        for (let i = max; i >= 0; --i) {
            gen = i
                .toString()
                .split("")
                .map((each) => Number(each));
            if (gen.length != 10) {
                gen = [...new Array(10 - gen.length).entries()].concat(gen);
            }
            if (this._checkMatch(gen)) {
                let endTime = new Date().getTime();
                console.log(`cost time ${endTime - startTime}`);
                return;
            }
        }
    }

    //! 分析求解法
    /**
     * 1.确定0的个数
     * 2.非零个数为10 - 0的个数
     * 3.从[1...9]个数字中选非零个数个位置
     * 4.每个位置最大取值非零个数
     * 循环破解
     */
    private _m2() {
        let startTime = new Date().getTime();
        for (let zeroCount = 9; zeroCount >= 1; --zeroCount) {
            let notZeroCount = 9 - zeroCount;
            let combine = this._combine(notZeroCount, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            let combineLen = combine.length;
            for (let i = 0; i < combineLen; ++i) {
                let pos = combine[i];
                let tmplete: (number | number[])[] = [zeroCount, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (let posI = 0; posI < pos.length; ++posI) {
                    tmplete[pos[posI]] = [...Array(notZeroCount).keys()].map((each) => ++each);
                }
                let gen = this._arrayDivision(tmplete);
                for (let k = 0; k < gen.length; ++k) {
                    if (this._checkMatch(gen[k])) {
                        let endTime = new Date().getTime();
                        console.log("hit the right number");
                        console.log(`cost time ${endTime - startTime}`);
                        console.log(JSON.stringify(gen[k]));
                        return;
                    }
                }
            }
        }
    }

    private _arrayDivision(input: (number | number[])[]) {
        let findIndex = input.findIndex((each) => Array.isArray(each));
        if (findIndex < 0) {
            return [input as number[]];
        }
        let findArray = input[findIndex] as number[];
        let division = findArray
            .map((each) => {
                let di = input.slice();
                di.splice(findIndex, 1, each);
                return di;
            })
            .map((each) => this._arrayDivision(each))
            .reduce((pre, cur) => {
                return [...cur, ...pre];
            }, []);
        return division;
    }
    // ? ===================================================================================
    // ? public interfaces
    // ? ===================================================================================
    public output() {
        // this._m1();
        this._m2();
    }
}

new FillInNumbers().output();
