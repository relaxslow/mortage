

EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t * t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}
ElasticEasings = {
    // elastic bounce effect at the beginning
    easeInElastic: function (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 },
    // elastic bounce effect at the end
    easeOutElastic: function (t) { return .04 * t / (--t) * Math.sin(25 * t) },
    // elastic bounce effect at the beginning and end
    easeInOutElastic: function (t) { return (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 }
}

function Tween(from, to, duration, updatefun, easefun, completefun) {
    let percent;
    let dist = to - from;
    if (!easefun) easefun = EasingFunctions.linear;
    let start = null;
    let id;
    function animate(t) {
        if (!start) {
            start = t;
            if (updatefun) updatefun(from);
            id = requestAnimationFrame(animate);
        } else {
            let elapse = t - start;
            percent = elapse / duration;
            let ease = easefun(percent);
            //             console.log(elapse, from + dist * ease)
            if (updatefun) updatefun(from + dist * ease);
            if (elapse <= duration) {
                id = requestAnimationFrame(animate);
            }
            else {
                if (updatefun) updatefun(to);
                if (completefun) completefun();
            }
        }
    }
    id = requestAnimationFrame(animate);
    let m = {};
    m.stop = function () {
        cancelAnimationFrame(id)
    }
    m.stopAtEnd = function () {
        cancelAnimationFrame(id)
        updatefun(to)
    }
    return m;
}

function tweenMulti(from, to, duration, updatefun, easefun, completefun) {
    let dist, value;
    dist = JSON.parse(JSON.stringify(to));
    value = JSON.parse(JSON.stringify(to));
    //iterateWithCheck for debug
    iterate([from, to], dist, function ([f, t]) {
        return t - f;
    })

    let percent;
    if (!easefun) easefun = EasingFunctions.linear;
    let start = null;
    function animate(t) {
        if (!start) {
            start = t
            if (updatefun) updatefun(from);
            requestAnimationFrame(animate);
        } else {
            let elapse = t - start;
            percent = elapse / duration;
            let ease = easefun(percent);
            value = iterate([from, dist], value, function ([f, d]) {
                return f + d * ease;
            })
            if (updatefun) updatefun(value);
            if (elapse <= duration) {
                id = requestAnimationFrame(animate);
            }
            else {
                if (updatefun) updatefun(to);
                if (completefun) completefun();
            }
        }

    }
    requestAnimationFrame(animate);
}



function iterateWithCheck(input, output, fun) {
    let type = checkType(input[0])
    let length = 0;
    if (type === "array") length = input[0].length;
    if (type === "string") throw new Error('input can not be string');
    for (let i = 1; i < input.length; i++) {
        let one = input[i]
        let t = checkType(one);
        if (t !== type) differentStructure(one, type);
        if (type === "array" && one.length !== length) differentLength(input[0], one)
        if (type === "object") {
            for (let key in input[0]) {
                if (input[i][key] == null) noFound(key, input[i])
            }
        }
    }
    if (type === 'number') {
        output = fun(input);
    }
    else if (type === 'array') {
        let aaa = input[0];
        for (let i = 0; i < input[0].length; i++) {
            let newInput = [];
            for (let j = 0; j < input.length; j++) {
                newInput.push(input[j][i])
            }
            output[i] = iterateWithCheck(newInput, output[i], fun);
        }
    }
    else if (type === 'object') {
        for (let key in input[0]) {
            let newInput = [];
            for (let i = 0; i < input.length; i++) {
                let one = input[i][key];
                if (one == null) noFound(key, input[i])
                newInput.push(one);
            }
            output[key] = iterateWithCheck(newInput, output[key], fun);
        }
    }
    return output;
}

function iterate(input, output, fun) {
    let type = checkType(input[0]);
    if (type === 'number') {
        output = fun(input);
    }
    else if (type === 'array') {
        let aaa = input[0];
        for (let i = 0; i < input[0].length; i++) {
            let newInput = [];
            for (let j = 0; j < input.length; j++) {
                newInput.push(input[j][i])
            }
            output[i] = iterate(newInput, output[i], fun);
        }
    }
    else if (type === 'object') {
        for (let key in input[0]) {
            let newInput = [];
            for (let i = 0; i < input.length; i++) {
                newInput.push(input[i][key])
            }
            output[key] = iterate(newInput, output[key], fun);
        }
    }
    return output;
}
function checkType(v) {
    let type = typeof (v)
    if (type === "object") {
        if (Array.isArray(v)) type = "array"
    }
    return type;
}
function noFound(key, a) {
    console.log(a)
    throw new Error(`not found ${key}`);
}
function differentLength(from, to) {
    console.log(from, to)
    throw new Error('diffrent length');
}
function differentStructure(from, to) {
    console.log(from, to);
    throw new Error('different structure');
}


//use-------------------
// let box = document.querySelector(".box");
// Tween(0, 300, 1000, moveBox, ElasticEasings.easeInElastic);
// function moveBox(v) {
//     box.style.left = v + "px";
// }