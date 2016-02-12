function Timer(callback, delay) {
    this.start;
    this.remaining = delay;
    var start, remaining = delay;

    this.pause = function () {
        clearTimeout(this.timerId);
        remaining -= performance.now() - start;
    };

    this.resume = function () {
        start = performance.now();
        clearTimeout(this.timerId);
        this.timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
}
