function CGCanvas() {

    this.init = function (id) {
        document.addEventListener('DOMContentLoaded', ()=>{
            let c = document.getElementById(id);
            this.ctx = c.getContext('2d');
        });
    };

    this.animate = function (options) {

        let start = performance.now();

        options.timing = options.timing || function(timeFraction) {return timeFraction;};

        requestAnimationFrame(function animate(time) {
            // timeFraction от 0 до 1
            let timeFraction = (time - start) / options.duration;
            if (timeFraction > 1) timeFraction = 1;

            // текущее состояние анимации
            let progress = options.timing(timeFraction)

            options.draw(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }

        });
    }


}

let CGC = new CGCanvas();