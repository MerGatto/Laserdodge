function Timer(callback, delay) {
    var start, remaining = delay;

    this.pause = function () {
        window.clearTimeout(this.timerId);
        remaining -= new Date() - start;
    };

    this.resume = function () {
        start = new Date();
        window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
}
