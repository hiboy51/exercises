class QuickSort {
    private sort(input: number[]) {
        if (input.length == 1) {
            return input;
        }
        if (input.length == 0) {
            return [];
        }
        let randIdx = Math.round(Math.random() * (input.length - 1));
        let guard = input[randIdx];
        let left = input.filter(each => each < guard);
        let right = input.filter((each, idx) => each >= guard && idx != randIdx);

        return [...this.sort(left), guard, ...this.sort(right)];
    }

    public output() {
        let input = [12, 45, 235, 78, 22, 688, 20, 222, 11, 22, 82345, 19988, 2, 1, 0];
        let sorted = this.sort(input);
        console.log(JSON.stringify(sorted));
    }
}

new QuickSort().output();
