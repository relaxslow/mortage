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