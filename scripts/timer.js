function Timer(callback, delay) {
    this.start;
    this.remaining = delay;
    this.time = delay;

    this.pause = function () {
        clearTimeout(this.timerId);
        this.remaining -= performance.now() - this.start;
    };

    this.resume = function () {
        this.start = performance.now();
        clearTimeout(this.timerId);
        this.timerId = window.setTimeout(callback, this.remaining);
    };

    this.restart = function() {
        this.start = performance.now();
        clearTimeout(this.timerId);
        this.timerId = window.setTimeout(callback, this.time);        
    }
}
