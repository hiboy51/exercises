let metas = [64, 16, 4, 1];
const input = 1024 - 200;

function biggestMeta(remains: number) {
    return metas.find(each => each <= remains);
}

function splitCoin(remains: number): number[] {
    let biggest = biggestMeta(remains);
    if (biggest == null) {
        return [];
    }
    return [biggest].concat(splitCoin(remains - biggest));
}

let result = splitCoin(input);
console.log(result);
console.log(`coin count = ${result.length}`);
