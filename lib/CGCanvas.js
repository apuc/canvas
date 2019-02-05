class CGCanvas {

    init(id, callback) {
        callback = callback || function () {
        };
        this.pool = [];
        document.addEventListener('DOMContentLoaded', () => {
            this.c = document.getElementById(id);
            this.width = this.c.width;
            this.height = this.c.height;
            this.ctx = this.c.getContext('2d');
            this.c.onclick = this.createFigureClick().bind(this);
            callback();
        });
    };

    animate(options, callback) {
        callback = callback || function () {
        };
        let start = performance.now();

        options.timing = options.timing || function (timeFraction) {
            return timeFraction;
        };

        requestAnimationFrame(async function animate(time) {
            if (options.obj.stopAnimate) return;
            // timeFraction от 0 до 1
            let timeFraction = (time - start) / options.duration;
            if (timeFraction > 1) timeFraction = 1;

            //console.log(options.obj);

            // текущее состояние анимации
            let progress = options.timing(timeFraction);

            options.draw(progress);

            if (timeFraction < 1 && !options.obj.stopAnimate) {
                requestAnimationFrame(animate);
            }
            else {
                if (options.obj.runCallback) {
                    callback();
                }
            }

        });
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawAll() {
        for (let i = 0; i < this.pool.length; i++) {
            this.pool[i].draw();
        }
    }

    stopAll() {
        for (let i = 0; i < this.pool.length; i++) {
            this.pool[i].runCallback = false;
            this.pool[i].stopAnimate = true;
        }
    }

    getMousePos(evt) {
        let rect = this.c.getBoundingClientRect(),
            scaleX = this.c.width / rect.width,
            scaleY = this.c.height / rect.height;

        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        }
    }

    createFigureClick() {
        for (let i = 0; i < this.pool.length; i++) {

        }
    }

}

class CGFigure {
    constructor(CGC) {
        this.cgc = CGC;
        this.cgc.pool.push(this);
        this.runCallback = true;
        this.onclick = function (e, obj) {
        };
    }
}

class CGRect extends CGFigure {

    draw(x, y, w, h, color) {
        this.setOptions(x, y, w, h, color);
        this.cgc.ctx.fillStyle = this.color;
        this.cgc.ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    setOptions(x, y, w, h, color) {
        x = x || this.x || 0;
        y = y || this.y || 0;
        w = w || this.w || 100;
        h = h || this.h || 100;
        color = color || this.color || 'black';
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    move(x, y, duration, callback = function () {
    }) {
        this.stopAnimate = false;
        duration = duration || 1000;
        const difX = x - this.x;
        const difY = y - this.y;
        const curX = this.x;
        const curY = this.y;
        this.cgc.animate({
            draw: (progress) => {
                this.setOptions(curX + difX * progress, curY + difY * progress);
                this.cgc.clearAll();
                this.cgc.drawAll();
            },
            duration: duration,
            obj: this
        }, callback);
    }

    changeSize(w, h, duration, callback) {
        this.stopAnimate = false;
        callback = callback || function () {
        };
        duration = duration || 1000;
        const difW = w - this.w;
        const difH = h - this.h;
        const curW = this.w;
        const curH = this.h;
        this.cgc.animate({
            draw: (progress) => {
                this.setOptions(this.x, this.y, curW + difW * progress, curH + difH * progress);
                this.cgc.clearAll();
                this.cgc.drawAll();
            },
            duration: duration,
            obj: this
        }, callback);
    }

    clear() {
        this.cgc.ctx.clearRect(this.x, this.y, this.w, this.h);
    }

    onFigure(coordinates) {
        //if((this.x < coordinates.x && this.y < coordinates.y) && (this.x + ))
    }

}

class CGCircle extends CGFigure {

    draw(x, y, r, data) {
        this.setOptions(x, y, r, data);
        this.cgc.ctx.beginPath();
        this.cgc.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        if (this.color) {
            this.cgc.ctx.fillStyle = this.color;
            this.cgc.ctx.fill();
        }
        if (this.lineWidth) {
            this.cgc.ctx.lineWidth = this.lineWidth;
            this.cgc.ctx.strokeStyle = this.strokeStyle;
            this.cgc.ctx.stroke();
        }
        this.cgc.ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    setOptions(x, y, r, data) {
        data = data || {};
        x = x || this.x || 0;
        y = y || this.y || 0;
        r = r || this.r || 100;
        if ('lineWidth' in data) {
            this.lineWidth = data.lineWidth || this.lineWidth || 0;
        }
        if (data.color) {
            this.color = data.color || this.color || 'black';
        }
        else {
            this.color = this.color || 'black';
        }
        if (data.strokeStyle) {
            this.strokeStyle = data.strokeStyle || this.strokeStyle || 'black';
        }
        this.x = x;
        this.y = y;
        this.r = r;
    }

    move(x, y, duration, callback) {
        this.stopAnimate = false;
        callback = callback || function () {
        };
        duration = duration || 1000;
        const difX = x - this.x;
        const difY = y - this.y;
        const curX = this.x;
        const curY = this.y;
        this.cgc.animate({
            draw: (progress) => {
                this.setOptions(curX + difX * progress, curY + difY * progress);
                this.cgc.clearAll();
                this.cgc.drawAll();
            },
            duration: duration,
            obj: this
        }, callback);
    }

    changeSize(r, duration, callback) {
        this.stopAnimate = false;
        callback = callback || function () {
        };
        duration = duration || 1000;
        const difR = r - this.r;
        const curR = this.r;
        this.cgc.animate({
            draw: (progress) => {
                this.setOptions(this.x, this.y, curR + difR * progress);
                this.cgc.clearAll();
                this.cgc.drawAll();
            },
            duration: duration,
            obj: this
        }, callback);
    }

    onFigure(coordinates) {
        return false;
    }
}

let CGC = new CGCanvas();