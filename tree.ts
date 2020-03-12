/*
 * @Author: Kinnon.Z
 * @Date: 2020-03-12 18:42:19
 * @Last Modified by: Kinnon.Z
 * @Last Modified time: 2020-03-12 22:20:18
 */

export class Tree {
    private _value: number;
    private _branches: Tree[] = [];
    public get branches() {
        return this._branches;
    }
    public root: Tree = null;

    public static of(v: number) {
        return new Tree(v);
    }

    public static empty() {
        return new EmptyTree();
    }

    public constructor(v: number) {
        this._value = v;
    }

    public get value() {
        return this._value;
    }

    public get isLeaf() {
        if (this.isEmpty) {
            return false;
        }
        return this._branches.length == 0 || this._branches.every(each => each.isEmpty);
    }

    public get isEmpty() {
        return this instanceof EmptyTree;
    }

    public get isBranch() {
        return !this.isEmpty && !this.isLeaf;
    }

    public appendBranch(tr: Tree) {
        this._branches.push(tr);
        tr.root = this;
        return this;
    }

    public allLeafs(): Tree[] {
        if (this.isEmpty) {
            return [];
        }
        if (this.isLeaf) {
            return [this];
        }
        //? 循环的方法
        // let leafs = [];
        // let stack = [...this._branches];
        // while (stack.length != 0) {
        //     let tail = stack.pop();
        //     if (tail.isEmpty) {
        //     } else if (tail.isLeaf) {
        //         leafs.push(tail);
        //     } else {
        //         stack = [...stack, ...tail.branches];
        //     }
        // }
        // return leafs;
        //? 递归的方法
        return this.branches
            .map(each => each.allLeafs())
            .reduce((pre, cur) => [...pre, ...cur], []);
    }

    public pathToRoot(): Tree[] {
        if (!this.root) {
            return [this];
        }
        return [this, ...this.root.pathToRoot()];
    }
}

export class EmptyTree extends Tree {
    constructor() {
        super(-1);
    }

    // ====================================================================================
    // override
    // ====================================================================================
    public appendBranch(tr: Tree) {
        return this;
    }
}
