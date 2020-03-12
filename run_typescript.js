var metas = [64, 16, 4, 1];
function biggestMeta(remains) {
    return metas.find(function (each) { return each >= remains; });
}
function splitCoin(remains) {
    var biggest = biggestMeta(remains);
    if (biggest == null) {
        return [];
    }
    return [biggest].concat(splitCoin(remains - biggest));
}
var result = splitCoin(1024);
console.log(result);
console.log("coin count = " + result.length);
