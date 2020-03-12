class Secret {
    private NUM_LEN = 9;
    private SKIP = 7;
    private CRYPTED = 0b111000110011101;

    public output() {
        console.log(`decrypt result is ${this._decrypt().toString(2)}`);
    }

    public encrypt(numStr: string, skip: number) {
        let source = parseInt(numStr, 2);
        let result = source;
        for (let i = 1; i < skip; ++i) {
            result ^= source << i;
        }
        if (result > 0) {
            this.CRYPTED = result;
            this.NUM_LEN = numStr.split("").length;
            this.SKIP = skip;
            console.log(`encrypt result: ${result.toString(2)} from ${numStr} skip ${skip}`);
        }
        return;
    }

    private _decrypt() {
        let next = (result: number, curColumnL: number) => {
            let curColumnR = this.NUM_LEN - curColumnL + 1;
            if (curColumnR == this.NUM_LEN) {
                return this._numberAtColumn(result, curColumnR);
            }
            let offset = curColumnL <= this.SKIP ? 0 : curColumnL - this.SKIP;
            let determinedColumnsCount = curColumnL <= this.SKIP ? curColumnL : this.SKIP;
            let determinedColumns = [...Array(determinedColumnsCount - 1).keys()].map(each => {
                each += offset + 1;
                let cr = this.NUM_LEN - each + 1;
                return cr;
            });
            // console.log(`columns: ${determinedColumns} to calcutate column ${curColumnR}`);
            let determinedColumnValues = determinedColumns.map(each =>
                this._numberAtColumn(result, each)
            );
            // console.log(`values: ${determinedColumnValues} to calcutate column ${curColumnR}`);
            let cryptedColumR = this.NUM_LEN + this.SKIP - curColumnL;
            let totalXOR = this._numberAtColumn(this.CRYPTED, cryptedColumR);
            // console.log(`totalXOR = ${totalXOR} at column ${cryptedColumR}`);
            let calculateResult = this._calculateCertainColumn(totalXOR, ...determinedColumnValues);
            // console.log(
            //     `xor result : ${calculateResult}, totalXOR: ${totalXOR}, others: ${determinedColumnValues}`
            // );
            return calculateResult << (curColumnR - 1);
        };
        let result = 1 << (this.NUM_LEN - 1);
        // console.log(`calculate number at columnL 1 = ${result.toString(2)}`);
        for (let i = 2; i <= this.NUM_LEN; ++i) {
            let calculateColumn = next(result, i);
            // console.log(`calculate number at columnL ${i} = ${calculateColumn.toString(2)}`);
            result |= calculateColumn;
            // console.log(`result = ${result.toString(2)}`);
        }
        return result;
    }

    private _numberAtColumn(number: number, columnR: number): 0 | 1 {
        let add = 1 << (columnR - 1);
        add &= number;
        // console.log(
        //     `column ${columnR} to add number: ${number.toString(2)}, add number: ${add.toString(2)}`
        // );
        let r = add >> (columnR - 1);
        // console.log(`add result: ${r.toString(2)}`);
        return r as 0 | 1;
    }

    private _calculateCertainColumn(totalXOR: 0 | 1, ...others: (0 | 1)[]) {
        let r = this._xor(null, ...others);
        // console.log(`xor: ${r}`);
        if (totalXOR == 0) {
            return r;
        }
        return ~r & 1;
    }

    private _xor(result: 0 | 1, ...numbers: (0 | 1)[]) {
        if (numbers.length == 1) {
            let [theLast] = numbers;
            if (result !== null) {
                return theLast ^ result;
            }
            return theLast;
        }
        if (numbers.length == 2) {
            let [head, tail] = numbers;
            if (result !== null) {
                return head ^ tail ^ result;
            }
            return head ^ tail;
        }
        let [head, second, ...last] = numbers;
        if (result !== null) {
            result ^= head ^ second;
        } else {
            result = (head ^ second) as 0 | 1;
        }
        return this._xor(result, ...last);
    }
}

let testClz = new Secret();

testClz.encrypt("100100111", 7);
testClz.output();
