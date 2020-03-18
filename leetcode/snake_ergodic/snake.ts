class Snake {
    private readonly input = [
        [1, 2, 4, 7],
        [3, 5, 8, 11],
        [6, 9, 12, 14],
        [10, 13, 15, 16]
    ];
    private readonly linel = 4;
    private readonly rowl = 4;

    public output() {
        for (let time = 1; time <= this.rowl; ++time) {
            let line = 0;
            for (let row = time - 1; row >= 0; --row) {
                console.log(this.input[line][row]);
                ++line;
            }
        }
    }
}

new Snake().output();
