export class ArrayUtils {
    public static flat(arr: Array<any>) {
        if (arr.length == 0) {
            return [];
        }

        let [head, ...tail] = arr;
        if (!Array.isArray(head)) {
            return [head, ...ArrayUtils.flat(tail)];
        } else {
            return [...ArrayUtils.flat(head), ...ArrayUtils.flat(tail)];
        }
    }

    public static unique<T>(
        arr: Array<T>,
        predicate: (a: T, b: T) => boolean,
        result: Array<T> = []
    ) {
        if (arr.length == 0) {
            return result;
        }
        let [head, ...tail] = arr;
        if (
            result.every(each => {
                return predicate(head, each);
            })
        ) {
            result.push(head);
        }
        return ArrayUtils.unique(tail, predicate, result);
    }
}
