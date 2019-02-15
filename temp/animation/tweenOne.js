function Tween(from, to, duration, updatefun, easefun, completefun) {
    let value;
    let dist = to - from;
    if (!easefun) easefun = EasingFunctions.linear;
    let start = null;
    let id;
    function animate(t) {
        if (!start) {
            start = t;
            value = from;
            if (updatefun) updatefun(value);
            id = requestAnimationFrame(animate);
        } else {
            let elapse = t - start;
            let percent = elapse / duration;
            if (percent > 1) percent = 1;
            let ease = easefun(percent);
            //             console.log(elapse, from + dist * ease)
            value = from + dist * ease;
            if (updatefun) updatefun(value);
            if (percent < 1) {
                id = requestAnimationFrame(animate);
            }
            else {
                value = to;
                if (completefun) completefun();
            }
        }
    }
    id = requestAnimationFrame(animate);
    let m = {};
    m.stop = function () {
        m.
            cancelAnimationFrame(id)
    }
    m.stopAtEnd = function () {
        cancelAnimationFrame(id)
        value = to;
        updatefun(value);
    }
    return m;
}
