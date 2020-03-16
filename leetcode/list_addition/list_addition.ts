class ListInt {
    private _next: ListInt = null;
    private _value: number;
    public static Empty() {
        return new ListEmpty();
    }
    public get value() {
        return this._value;
    }
    constructor(value: number) {
        this._value = value;
    }
    // ====================================================================================
    // public interfaces
    // ====================================================================================
    public next(value: number) {
        let next = new ListInt(value);
        this._next = next;
        return next;
    }

    public add(lst: ListInt, midResult: ListInt = null, carry: 0 | 1 = 0) {
        let [lia, aa] = this._popLastInt();
        let [lib, bb] = lst._popLastInt();

        if (lia || lib) {
            let ia = (lia && lia.value) || 0;
            let ib = (lib && lib.value) || 0;
            let addAB = (ia + ib + carry) % 10;
            carry = ia + ib + carry >= 10 ? 1 : 0;
            let newResult = new ListInt(addAB);
            if (midResult) {
                newResult._next = midResult;
            }
            midResult = newResult;
            return aa.add(bb, midResult, carry);
        } else {
            if (carry > 0) {
                let newInt = new ListInt(carry);
                newInt._next = midResult;
                midResult = newInt;
            }
            return midResult;
        }
    }

    public push(value: number) {
        if (!this._next) {
            return this.next(value);
        }
        return this._next.push(value);
    }

    // ====================================================================================
    // protected interfaces
    // ====================================================================================
    protected _lastInt() {
        if (!this._next) {
            return this;
        }
        return this._next._lastInt();
    }

    // ====================================================================================
    // private interfaces
    // ====================================================================================
    private _popLastInt() {
        let lastInt = this._lastInt();
        let list: ListInt = this;
        if (!this._next) {
            list = ListInt.Empty();
        } else {
            let cur: ListInt = this;
            while (true) {
                let next = cur._next;
                if (next == lastInt) {
                    cur._next = null;
                    break;
                }
                cur = next;
            }
        }
        return [lastInt, list];
    }
}

class ListEmpty extends ListInt {
    constructor(value: number = -1) {
        super(value);
    }
    public get value() {
        return NaN;
    }

    protected _lastInt() {
        return null;
    }
}

class ListAddition {
    private _a: ListInt;
    private _b: ListInt;

    constructor() {
        this._a = new ListInt(9);
        this._a
            .next(9)
            .next(9)
            .next(9);

        this._b = new ListInt(3);
        this._b.next(5);
    }

    // ====================================================================================
    // public interfaces
    // ====================================================================================
    public output() {
        let added = this._a.add(this._b);
        let cur = added;
        while (cur) {
            if (!cur) {
                break;
            }
            console.log(cur.value);
            cur = cur._next;
        }
    }
}

new ListAddition().output();
