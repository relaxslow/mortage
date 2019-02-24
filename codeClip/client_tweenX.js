function TweenX(from, to, duration, updatefun, easefun, completefun) {
    let dist, value;
    dist = JSON.parse(JSON.stringify(to));
    value = JSON.parse(JSON.stringify(from));
    dist = iterate([from, to], dist, function ([f, t]) {
        return t - f;
    })

    if (!easefun) easefun = EasingFunctions.linear;
    let start = null;
    let id;

    function animate(t) {
        if (!start) {
            start = t
            if (updatefun) updatefun(from);
            id = requestAnimationFrame(animate);
        } else {
            let elapse = t - start;
            let percent = elapse / duration;
            if (percent > 1) percent = 1;
            let ease = easefun(percent);
            value = iterate([from, dist], value, function ([f, d]) {
                return f + d * ease;
            })
            if (updatefun) updatefun(value);
            if (percent < 1) {
                id = requestAnimationFrame(animate);
            } else {
                value = to;
                if (completefun) completefun();
            }
        }

    }
    id = requestAnimationFrame(animate);
    let m = new Tween();
    m.stop = function () {
        cancelAnimationFrame(id)
    }
    m.stopAtEnd = function () {
        cancelAnimationFrame(id)
        value = to;
        updatefun(to);
    }
    m.getCurrentValue = function () {
        return value;
    }
    return m;
}
class Tween {
    construction() {
        this.stop = null;
        this.stopAtEnd = null;
        this.getCurrentValue = null;
    }


}