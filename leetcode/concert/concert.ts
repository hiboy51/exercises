/*
 * @Author: Kinnon.Z
 * @Date: 2020-03-12 14:34:11
 * @Last Modified by: Kinnon.Z
 * @Last Modified time: 2020-03-12 22:29:03
 */
import { ArrayUtils } from "../../array_utils";
import { Tree, EmptyTree } from "../../tree";

class Concert {
    private readonly singerSize: number = 5;
    private readonly startTL = [1, 2, 4, 6, 8];
    private readonly endTL = [3, 5, 7, 9, 10];

    public output() {
        let crossex = this._generateData();
        console.log(
            JSON.stringify(
                crossex.map(each => {
                    let [concert, conflict] = each;
                    return `${concert} 号演唱会与 [${(conflict as Number[]).join(
                        ","
                    )}] 号演唱会冲突`;
                }),
                null,
                "\t"
            )
        );
        console.log("============================");
        let result = this._genCombinationTree(crossex);
        let allEnds = result
            .allLeafs()
            .map(each => each.pathToRoot())
            .map(each =>
                each
                    .map(e => e.value)
                    .reverse()
                    .slice(1)
            );

        let uniqueResult = ArrayUtils.unique(allEnds, (a, b) => {
            if (a.length != b.length) {
                return false;
            }
            if (a.every(ea => b.indexOf(ea) >= 0) && b.every(eb => a.indexOf(eb) >= 0)) {
                return false;
            }
            return true;
        });
        console.log(JSON.stringify(uniqueResult));
    }
    //* 组装数据
    private _generateData() {
        let pairTL = this.startTL.map((each, idx) => [each, this.endTL[idx]]);
        let indexes = [...Array(this.singerSize).keys()];
        let crossex = indexes.map(each => {
            let [start, end] = pairTL[each];
            let cross = indexes.slice().filter(e => {
                if (e == each) {
                    return false;
                }
                let [cs, ce] = pairTL[e];
                let notCross = end < cs || start > ce;
                return !notCross;
            });
            return [each, cross] || [each, []];
        });
        return crossex;
    }

    private _genCombinationTree(crosses: any[], root: Tree = Tree.of(999)) {
        if (crosses.length == 0) {
            root.appendBranch(Tree.empty());
            return root;
        }
        //* 先挑选一个和其他交集最少的集合
        let sortedCrosses = crosses
            .map(each => {
                let [idx, cross] = each;
                return [idx, cross.length];
            })
            .sort((a, b) => {
                let [, countA] = a;
                let [, countB] = b;
                return countA - countB;
            });
        let [, leastCrossesCount] = sortedCrosses[0];
        let compatible = sortedCrosses.filter(each => {
            let [, eachCount] = each;
            return eachCount == leastCrossesCount;
        });
        let result = compatible.map(each => {
            let [idx] = each;
            let remains = crosses.filter(each => {
                let [realIdx, cross] = each;
                if (realIdx == idx) {
                    return false;
                }
                if (cross.indexOf(idx) >= 0) {
                    return false;
                }
                return true;
            });
            let newTree = Tree.of(idx);
            this._genCombinationTree(remains, newTree);
            return newTree;
        });
        result.forEach(tr => root.appendBranch(tr));
        return root;
    }
}

let testObj = new Concert();
testObj.output();
