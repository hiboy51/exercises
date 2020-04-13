/*
 * @Author: Kinnon.Z
 * @Date: 2020-04-13 10:01:43
 * @Last Modified by: Kinnon.Z
 * @Last Modified time: 2020-04-13 10:51:06
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
                sliced = necklace.slice(i, cutnum);
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
}

new Necklace().output();
