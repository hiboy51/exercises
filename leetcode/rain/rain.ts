class Rain {
    private readonly _steps = [0, 1, 0, 2, 1, 0, 1, 3, 3, 1, 2, 1];

    // ====================================================================================
    // public interfaces
    // ====================================================================================
    public output() {
        let waterInSteps = this._calWater();
        console.log(`water between steps = ${waterInSteps}`);
    }
    // ====================================================================================
    // private interfaces
    // ====================================================================================
    //* 首尾都必须是台阶的有效数据
    private _trim(input: number[]) {
        // * 空数组无需trim
        if (input.length == 0) {
            return [];
        }
        // * 单元素数组无需头尾判断
        if (input.length == 1) {
            let [item] = input;
            if (item == 0) {
                return [];
            }
            return input.slice();
        }
        let inputLen = input.length;
        let head = input[0];
        let tail = input[inputLen - 1];
        //* trim结束条件
        if (head > 0 && tail > 0) {
            return input;
        }
        let trimmed = input.slice().filter((each, idx) => {
            let headOrTail = idx == 0 || idx == inputLen - 1;
            if (headOrTail) {
                return each > 0;
            }
            return true;
        });
        return this._trim(trimmed);
    }

    //* 计算积水
    private _calWater(input: number[] = this._steps, water: number = 0) {
        let trimmed = this._trim(input);
        if (trimmed.length == 0 || trimmed.length == 1) {
            return water;
        }
        let min = Math.min(...trimmed.filter(each => each > 0));
        let curLayerWater = trimmed.reduce((pre, cur) => {
            if (cur < min) {
                pre += Math.abs(cur - min);
            }
            return pre;
        }, 0);
        water += curLayerWater;
        input = trimmed.map(each => {
            return Math.max(each - min, 0);
        });
        return this._calWater(input, water);
    }
}

let testObj = new Rain();
testObj.output();
