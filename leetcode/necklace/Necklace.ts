/*
 * @Author: Kinnon.Z
 * @Date: 2020-04-13 10:01:43
 * @Last Modified by: Kinnon.Z
 * @Last Modified time: 2020-04-13 12:29:11
 */
export default class Necklace {
    private readonly ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // ? ===================================================================================
    // ? private interfaces
    // ? ===================================================================================
    private _genNecklace() {
        const alphabet_arr = this.ALPHABET.split("");
        const len = 100;
        let input = [];
        let tmp: string;
        for (let i = 0; i < len; ++i) {
            tmp = alphabet_arr[Math.floor(Math.random() * alphabet_arr.length)];
            input.push(tmp);
        }
        return input;
    }

    private _specifiyDimands() {
        let alphabet_arr = this.ALPHABET.split("");
        //* 洗牌算法
        let shuffle = (input: string[], result: string[] = []): string[] => {
            if (input.length == 1) {
                result = [input[0], ...result];
                return result;
            }
            let last = input.pop();
            let ran = Math.floor(Math.random() * (input.length - 1));
            let pick = input.splice(ran, 1, last)[0];
            result = [pick, ...result];
            return shuffle(input, result);
        };
        let shuffled = shuffle(alphabet_arr);
        const diamandCount = 5;
        return shuffled.slice(0, diamandCount);
    }
    // ? ===================================================================================
    // ? public interfaces
    // ? ===================================================================================
    //! 第一种解法： 暴力循环,每次切割一段检测是否满足条件
    public output() {
        const necklace = this._genNecklace();
        const diamands = this._specifiyDimands();

        console.log(`necklace: ${necklace}`);
        console.log(`dimands: ${diamands}`);

        //* 问题转变为： 从necklace中找到最短的一段，使其包含diamands中的所有元素
        let sliced: string[];
        let cutnum: number = diamands.length;
        let find: boolean;
        let result: { start: number; sequece: string[]; seqLen: number }[] = [];
        for (let i = 0; i < necklace.length - cutnum; ++i) {
            find = false;
            cutnum = diamands.length;
            while (cutnum < necklace.length - i) {
                sliced = necklace.slice(i, cutnum + i);
                if (diamands.every((each) => sliced.indexOf(each) >= 0)) {
                    find = true;
                    result.push({
                        start: i,
                        sequece: sliced,
                        seqLen: sliced.length,
                    });
                    break;
                }
                ++cutnum;
            }
            if (!find) {
                break;
            }
        }

        if (result.length == 0) {
            return console.log("no matched segment");
        }
        result.forEach((each) => {
            console.log(
                `matched segment ${each.sequece}, from ${each.start} with length ${each.seqLen}`
            );
        });

        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n");
        let sorted = result.sort((a, b) => a.seqLen - b.seqLen);
        let shortest = sorted.shift();
        console.log(`found the shortest segment ${shortest.sequece}, from ${shortest.start}`);
    }

    //! 第二种解法：可以预测，最终的满足条件的切割段必然以关键字开始，以另一个关键字结束
    //! 所以可以先找到所有关键字所在的位置作为锚点，以锚点之间来切割检测段
    public output2() {
        const necklace = this._genNecklace();
        const diamands = this._specifiyDimands();

        console.log(`necklace: ${necklace}`);
        console.log(`dimands: ${diamands}`);

        let anchors = diamands.map((each) => {
            let mapped = necklace
                .map((each, idx) => [each, idx])
                .filter((e) => e[0] == each)
                .map((e) => e[1]);
            return mapped;
        });
        if (anchors.some((each) => each.length == 0)) {
            //! 目标串中找不到某些关键字
            return console.log("no matched segment");
        }
        let anchorPos: number[] = anchors
            .reduce((pre: number[], cur: number[]) => {
                return [...pre, ...cur];
            }, [])
            .sort();
        let result: { start: number; sequece: string[]; seqLen: number }[] = [];

        let startLetter: string;
        let endLetter: string;
        let sliced: string[];
        for (let i = 0; i < anchorPos.length - 1; ++i) {
            startLetter = necklace[anchorPos[i]];
            for (let k = i + 1; k < anchorPos.length; ++k) {
                endLetter = necklace[anchorPos[k]];
                if (startLetter == endLetter) {
                    continue;
                }
                sliced = necklace.slice(anchorPos[i], anchorPos[k] + 1);
                if (diamands.every((each) => sliced.indexOf(each) >= 0)) {
                    //! 找到一段
                    result.push({
                        start: anchorPos[i],
                        seqLen: anchorPos[k] - anchorPos[i],
                        sequece: sliced,
                    });
                    //! 必然是本次循环的最短，所以后面不用测试了
                    break;
                }
            }
        }
        if (result.length == 0) {
            return console.log("no matched segment");
        }
        result.forEach((each) => {
            console.log(
                `matched segment ${each.sequece}  from ${each.start} with length ${each.seqLen}`
            );
        });

        console.log("\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n");
        let sorted = result.sort((a, b) => a.seqLen - b.seqLen);
        let shortest = sorted.shift();
        console.log(
            `found the shortest segment ${shortest.sequece}  from ${shortest.start} with length ${shortest.seqLen}`
        );
    }
}

// new Necklace().output();
new Necklace().output2();
