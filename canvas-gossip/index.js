
class Gossip {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentAngle = 0;

        this.PI = Math.PI;
        this.PI2 = 2 * this.PI;
        // this.gossipRotate();
        // this.ctx.translate(250, 150);
        this.ctx.translate(400, 300);

        // this.init();
        // this.gossipRotate();
        this.draw();
    }

    init() {
        const drawData = this.gossipData2()
        for (let i = 0; i < drawData.length; i++) {
            const { x, y, radius, startAngle, endAngle, anticlockwise, color } = drawData[i];
            this.drawGossip(x, y, radius, startAngle, endAngle, anticlockwise, color);
        }
    }

    gossipRotate() {
        this.currentAngle -= Math.this.PI / 360
        this.ctx.globalCompositeOperation = 'source-over'
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        const drawData = this.gossipData(this.currentAngle);
        for (let i = 0; i < drawData.length; i++) {
            const { x, y, radius, startAngle, endAngle, anticlockwise, color } = drawData[i];
            this.drawGossip(x, y, radius, startAngle, endAngle, anticlockwise, color);
        }

        // setInterval(() => {
        //     this.gossipRotate()
        // }, 30);
    }

    gossipData(rotate = 0) {
        const circle = [
            // 绘制黑色半圆
            { x: 0, y: 100, radius: 100, startAngle: rotate + Math.this.PI / 2, endAngle: rotate + Math.PI * 3 / 2, anticlockwise: false, color: '#000' },
            // 绘制白色半圆
            { x: 0, y: 100, radius: 100, startAngle: rotate + Math.this.PI / 2, endAngle: rotate + Math.PI * 3 / 2, anticlockwise: true, color: '#fff' },
            //绘制黑色整圆
            { x: 0, y: 50, radius: 50, startAngle: rotate + 0, endAngle: rotate + Math.PI * 2, anticlockwise: false, color: '#000' },
            //绘制白色整圆
            { x: 0, y: 150, radius: 50, startAngle: rotate + 0, endAngle: rotate + Math.PI * 2, anticlockwise: false, color: '#fff' },
            //绘制中间白色小圆
            { x: 0, y: 50, radius: 10, startAngle: 0, endAngle: Math.PI * 2, anticlockwise: false, color: '#fff' },
            //绘制中间黑色小圆
            { x: 0, y: 150, radius: 10, startAngle: 0, endAngle: Math.PI * 2, anticlockwise: false, color: '#000' },
        ];

        return circle;
    }


    drawGossip(x, y, radius, startAngle, endAngle, anticlockwise, color) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.currentAngle -= Math.this.PI / 360
        // this.ctx.save();
        // this.ctx.strokeStyle = 'rgba( 0, 0, 0, 1 )';
        // this.ctx.fillStyle = 'rgba( 0, 0, 0, 1 )';

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        // this.ctx.arc(75, 75, 50, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    gossipData2() {
        const circle = [
            // 绘制最外层大圆
            { x: 0, y: 0, radius: 160, startAngle: 0, endAngle: this.PI2, anticlockwise: false, color: '#000'},
            // 绘制最外层小圆
            { x: 0, y: 0, radius: 150, startAngle: 0, endAngle: this.PI2, anticlockwise: false, color: '#fff'},
            // 绘制阴、阳圆
            { x: 0, y: 0, radius: 160, startAngle: this.PI / 2, endAngle: -this.PI2 / 2, anticlockwise: false, color: '#000'},
            { x: 0, y: -75, radius: 75, startAngle: -this.PI / 2, endAngle: this.PI2 / 2, anticlockwise: false, color: '#000'},
            { x: 0, y: 75, radius: 75, startAngle: -this.PI / 2, endAngle: this.PI2 / 2, anticlockwise: true, color: '#000'},
            // 绘制里面的阳
            { x: 0, y: -75, radius: 20, startAngle: 0, endAngle: this.PI2, anticlockwise: false, color: '#fff'},
            // 绘制里面的阴
            { x: 0, y: 75, radius: 20, startAngle: 0, endAngle: this.PI2, anticlockwise: false, color: '#000'},
        ];

        return circle;
    }

    drawTaiji() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba( 0, 0, 0, 1 )';
        this.ctx.fillStyle = 'rgba( 0, 0, 0, 1 )';

        // 大圆
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 160, 0, this.PI2);
        this.ctx.clip();
        this.ctx.closePath();
        this.ctx.stroke();
        // 小圆
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = '#FFF';
        this.ctx.arc(0, 0, 150, 0, this.PI2, false);
        this.ctx.closePath();
        this.ctx.stroke();

        // 阴面 阳面
        this.ctx.restore();
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 150, this.PI / 2, -this.PI / 2, false);
        this.ctx.arc(0, -75, 75, -this.PI / 2, this.PI / 2, false);
        this.ctx.arc(0, 75, 75, -this.PI / 2, this.PI / 2, true);
        this.ctx.closePath();
        this.ctx.fill();


        // 阴面内的阳
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = '#FFF';
        this.ctx.arc(0, -75, 20, 0, this.PI2, false);
        this.ctx.closePath();
        this.ctx.fill();

        // 阳面的阴
        this.ctx.restore();
        this.ctx.beginPath();
        this.ctx.arc(0, 75, 20, 0, this.PI2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    draw() {
        setInterval(() => {
            this.ctx.clearRect(-400, -300, 800, 600);
            this.ctx.rotate(this.PI2 / 20);
            this.drawTaiji();
        }, 80);
    }
}

new Gossip();