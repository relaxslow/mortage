//gre/easing.js
/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
EasingFunctions = {
    // no easing, no acceleration
    linear: function(t) { return t },
    // accelerating from zero velocity
    easeInQuad: function(t) { return t * t },
    // decelerating to zero velocity
    easeOutQuad: function(t) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: function(t) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: function(t) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart: function(t) { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart: function(t) { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: function(t) { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: function(t) { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}
ElasticEasings = {
    // elastic bounce effect at the beginning
    easeInElastic: function(t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 },
    // elastic bounce effect at the end
    easeOutElastic: function(t) { return .04 * t / (--t) * Math.sin(25 * t) },
    // elastic bounce effect at the beginning and end
    easeInOutElastic: function(t) { return (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 }
}


//useage-------------------
// let box = document.querySelector(".box");
// Tween(0, 300, 1000, moveBox, ElasticEasings.easeInElastic);
// function moveBox(v) {
//     box.style.left = v + "px";
// }
/**
 * 
 * @param {*} from 
 * @param {*} to 
 * @param {number} duration unit ms, 1000ms=1s
 * @param {function} updatefun 
 * @param {function} easefun 
 * @param {function} completefun 
 * @returns {Tween}
 */
function TweenX(from, to, duration, updatefun, easefun, completefun) {
    let dist, value;
    dist = JSON.parse(JSON.stringify(to));
    value = JSON.parse(JSON.stringify(from));
    dist = iterate([from, to], dist, function([f, t]) {
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
            value = iterate([from, dist], value, function([f, d]) {
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
    m.stop = function() {
        cancelAnimationFrame(id)
    }
    m.stopAtEnd = function() {
        cancelAnimationFrame(id)
        value = to;
        updatefun(to);
    }
    m.getCurrentValue = function() {
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

function iterate(input, output, fun) {
    let type = checkType(input[0]);
    if (type === 'number') {
        output = fun(input);
    } else if (type === 'array') {
        let aaa = input[0];
        for (let i = 0; i < input[0].length; i++) {
            let newInput = [];
            for (let j = 0; j < input.length; j++) {
                newInput.push(input[j][i])
            }
            output[i] = iterate(newInput, output[i], fun);
        }
    } else if (type === 'object') {
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
    let type = typeof(v)
    if (type === "object") {
        if (Array.isArray(v)) type = "array"
    }
    return type;
}