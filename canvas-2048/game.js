class Cell {
    constructor(row, col, width) {
        this.value = 0;
        this.x = col * width + 5 * (col + 1);
        this.y = row * width + 5 * (row + 1);
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sizeInput = document.getElementById('size');
        this.startBtn = document.querySelector('.start');
        this.startBtn2 = document.querySelector('.start2');
        this.scoreLabel = document.getElementById('score');
        this.resetBtn = document.querySelector('.reset');
        this.lessHtml = document.querySelector('.lose');
        this.scoreValue = 0;
        this.bestScore = document.getElementById('bestScore');
        this.bestScoreValue = localStorage.getItem('score2048');
        this.size = 4;
        this.width = this.canvas.width / this.size - 6;
        this.cells = [];
        this.fontSize = 0;
        this.loss = false;

        this.init();
        this.initState();
    }

    init() {
        this.startBtn.addEventListener('click', () => {
            this.publicEvent();
        });

        this.resetBtn.addEventListener('click', () => {
            this.scoreValue = 0;
            this.canvas.style.opacity = '1';
            this.loss = false;
            this.lessHtml.style.display = 'none';
            this.bestScoreValue = localStorage.getItem('score2048');
            this.scoreLabel.innerHTML = `Score: ${+this.scoreValue}`;
            this.startGame();
            this.initScore();
        });
    }

    initState() {
        this.initStart();

        this.initScore();

        this.initEvent();
    }

    initStart() {
        this.canvas.style.display = 'none';
        this.startBtn2.addEventListener('click', () => {
            this.publicEvent();
        });
    }

    publicEvent() {
        if (this.sizeInput.value >= 3 && this.sizeInput.value <= 10) {
            this.size = this.sizeInput.value;
            this.width = this.canvas.width / this.size - 6;
            this.canvasClear();
            this.startGame();
            this.canvas.style.display = 'block';
            this.startBtn2.style.display = 'none';
        } else {
            alert('不在生成的区间内，无法开始游戏');
            return;
        }
    }

    initScore() {
        if (this.bestScoreValue !== null || this.bestScoreValue !== undefined) {
            this.bestScore.innerHTML = `Best Score: ${+this.bestScoreValue}`
        } else {
            this.bestScore.innerHTML = `Best Score: 0`
        }
    }

    initEvent() {
        document.addEventListener('keydown', (event) => {
            if (!this.loss && this.canvas.style.display === 'block') {
                switch (event.key) {
                    case 'ArrowUp':
                        this.moveUp();
                        break;
                    case 'ArrowDown':
                        this.moveDown();
                        break;
                    case 'ArrowLeft':
                        this.moveLeft();
                        break;
                    case 'ArrowRight':
                        this.moveRight();
                        break;
                }
                this.scoreLabel.innerHTML = `Score: ${+this.scoreValue}`;
            }
        });
    }

    canvasClear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async startGame() {
        await this.createCells();
        await this.drawAllCells();
        await this.pasteNewCell();
        await this.pasteNewCell();
    }

    async createCells() {
        for (let i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.cells[i][j] = new Cell(i, j, this.width);
            }
        }
    }

    async drawAllCells() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.drawCell(this.cells[i][j]);
            }
        }
    }

    moveArrow(arrow) {
        console.log('arraw', arrow);
        const arrowList = new Map([
            ['ArrowUp', this.moveUp()]
            ['ArrowDown', this.moveDown()],
            ['ArrowLeft', this.moveLeft()],
            ['ArrowRight', this.moveRight()],
        ]);

        return arrowList.get(arrow);
    }



    async pasteNewCell() {
        let countFree = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.cells[i][j].value) {
                    countFree++;
                }
            }
        }

        if (!countFree) {
            this.finishGame();
            return;
        }

        while (true) {
            let row = Math.floor(Math.random() * this.size);
            let col = Math.floor(Math.random() * this.size);

            if (!this.cells[row][col].value) {
                this.cells[row][col].value = 2 * Math.ceil(Math.random() * 2);
                this.drawAllCells();
                return;
            }
        }
    }

    finishGame() {
        const currentScore = localStorage.getItem('score2048');
        console.log('currentScore', currentScore, this.scoreValue);
        if (currentScore < this.scoreValue) {
            localStorage.setItem('score2048', this.scoreValue);
        }
        this.canvas.style.opacity = '0.3';
        this.loss = true;
        this.lessHtml.style.display = 'block';
    }

    drawCell(cell) {
        this.ctx.beginPath();
        this.ctx.rect(cell.x, cell.y, this.width, this.width);
        this.ctx.fillStyle = "#384081";
        this.ctx.fill();

        if (cell.value) {
            this.ctx.fillStyle = `${this.cellColor(cell.value)}`;
            this.ctx.fill();
            this.fontSize = this.width / 2;
            this.ctx.font = this.fontSize + 'px Viga';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = "center";
            this.ctx.fillText(cell.value, cell.x + this.width / 2, cell.y + this.width / 1.5);
        }
    }

    cellColor(value) {
        const colorList = new Map([
            [0, 'rgb(135,200,116)'],
            [2, 'rgb(135,200,116)'],
            [4, 'rgb(95,149,212)'],
            [8, 'rgb(139,89,177)'],
            [16, 'rgb(229,195,81)'],
            [32, 'rgb(202,77,64)'],
            [64, 'rgb(108,129,112)'],
            [128, 'rgb(207,126,63)'],
            [256, 'rgb(82,125,124)'],
            [512, 'rgb(191,76,134)'],
            [1024, 'rgb(119,41,92)'],
            [2048, 'rgb(118,179,194)'],
            [4096, 'rgb(52,63,79)'],
        ]);

        return colorList.get(value) || 'rgba(70,80,161,0.8)';
    }

    moveUp() {
        let row;
        for (let j = 0; j < this.size; j++) {
            for (let i = 1; i < this.size; i++) {
                if (this.cells[i][j].value) {
                    row = i;
                    while (row > 1) {
                        if (!this.cells[row - 1][j].value) {
                            this.cells[row - 1][j].value = this.cells[row][j].value;
                            this.cells[row][j].value = 0;
                            row--;
                        } else if (this.cells[row][j].value === this.cells[row - 1][j].value) {
                            this.cells[row - 1][j].value *= 2;
                            this.scoreValue += this.cells[row - 1][j].value;
                            this.cells[row][j].value = 0;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        this.pasteNewCell();
    }

    moveDown() {
        let row;
        for (let j = 0; j < this.size; j++) {
            for (let i = this.size - 2; i >= 0; i--) {
                if (this.cells[i][j].value) {
                    row = i;
                    while (row + 1 < this.size) {
                        if (!this.cells[row + 1][j].value) {
                            this.cells[row + 1][j].value = this.cells[row][j].value;
                            this.cells[row][j].value = 0;
                            row++;
                        } else if (this.cells[row][j].value === this.cells[row + 1][j].value) {
                            this.cells[row + 1][j].value *= 2;
                            this.scoreValue += this.cells[row + 1][j].value;
                            this.cells[row][j].value = 0;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        this.pasteNewCell();
    }

    moveLeft() {
        let col;
        for (let i = 0; i < this.size; i++) {
            for (let j = 1; j < this.size; j++) {
                if (this.cells[i][j].value) {
                    col = j;
                    while (col - 1 >= 0) {
                        if (!this.cells[i][col - 1].value) {
                            this.cells[i][col - 1].value = this.cells[i][col].value;
                            this.cells[i][col].value = 0;
                            col--;
                        } else if (this.cells[i][col].value === this.cells[i][col - 1].value) {
                            this.cells[i][col - 1].value *= 2;
                            this.scoreValue += this.cells[i][col - 1].value;
                            this.cells[i][col].value = 0;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        this.pasteNewCell();
    }

    moveRight() {
        let col;
        for (let i = 0; i < this.size; i++) {
            for (let j = this.size - 2; j >= 0; j--) {
                if (this.cells[i][j].value) {
                    col = j;
                    while (col + 1 < this.size) {
                        if (!this.cells[i][col + 1].value) {
                            this.cells[i][col + 1].value = this.cells[i][col].value;
                            this.cells[i][col].value = 0;
                            col++;
                        } else if (this.cells[i][col].value === this.cells[i][col + 1].value) {
                            this.cells[i][col + 1].value *= 2;
                            this.scoreValue += this.cells[i][col + 1].value;
                            this.cells[i][col].value = 0;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        this.pasteNewCell();
    }
}

new Game();