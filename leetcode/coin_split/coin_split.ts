class Test {
    private readonly metas = [64, 16, 4, 1];
    private readonly input = 1024 - 200;

    private _biggestMeat(remains: number) {
        return this.metas.find(each => each <= remains);
    }

    private _splitCoin(remains: number, cacheArr: number[] = []): number[] {
        let biggest = this._biggestMeat(remains);
        if (biggest == null) {
            return cacheArr;
        }
        cacheArr = [biggest].concat(cacheArr.slice());
        return this._splitCoin(remains - biggest, cacheArr);
    }

    public output() {
        let result = this._splitCoin(this.input);
        console.log(result);
        console.log(`coin count = ${result.length}`);
    }
}

new Test().output();
