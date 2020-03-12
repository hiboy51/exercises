/*
 * @Author: Kinnon.Z
 * @Date: 2020-03-12 14:34:11
 * @Last Modified by:   Kinnon.Z
 * @Last Modified time: 2020-03-12 14:34:11
 */
import { ArrayUtils } from "../../ArrayUtils";

class Concert {
    private readonly singerSize: number = 5;
    private readonly startTL = [1, 2, 4, 6, 8];
    private readonly endTL = [3, 5, 7, 9, 10];

    public output() {
        let crossex = this._generateData();
        console.log(crossex);
        console.log("============================");
        let result = this._listCombination(crossex);
        let realResult: number[][] = result.map((each: any[]) =>
            ArrayUtils.flat(each).sort((a, b) => a - b)
        );
        console.log(JSON.stringify(realResult));
        let uniqueResult = ArrayUtils.unique(realResult, (a, b) => {
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

    private _listCombination(crosses: any[]) {
        if (crosses.length == 0) {
            return [];
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
            return [idx, ...this._listCombination(remains)];
        });
        return result;
    }
}

let testObj = new Concert();
testObj.output();
