let regex_newLine = /\r?\n/;
let regex_empty = /^$|^\s*$/gm;
let regex_spaceAtBegin = /^\s+/;
let regex_keywords = /\bconst\b|\blet\b|\bconsole\b|\bfunction\b|\bclass\b/g;
let regex_operator = /[\+\-\*\/=\!]|\|\||&&/g
let regex_strs = /'[^']*'|`[^`]*`|"[^"]*"/g
let regex_nonStr = /\btrue\b|\bfalse\b|\bnull\b|\bundefined\b|\b\d+\b/g
let regex_varInStr3 = /(?<=`.*)\${[^{}]*}(?=.*`)/g;
let regex_varL = /\${/g;
let regex_varR = /}/g;
let regex_funcall = /(?<!function.*)(?!function|for|if)\b\w+(?=\s*\()/g
let regex_funDef = /(?<=function\s+)\w+(?=\s*\()/g
let regex_funDefParam = /(?<=function(\s+)?(\w+(\s+)?)?\(.*,?)(?<!{.*|\/.*)\w+(?=,?.*\))|\bthis\b/g
let regex_condition = /\bif\b|\belse\b|\bfor\b|\breturn\b|\bcontinue\b|\bbreak\b/g

let regex_yellow = /\/.*\/gm?/g
let regex_blue = /(?!\\b)\\.|\[\^\(\)\]|\[\^\\\[\\\]\]|\[[^\[\]]*\]|\[\^.*\](?=.*\/g?m?)/g
let regex_red = /(?<!\\)\^|\||\*|\\b|\+|\?(?!<|=|!)|(?<=\/)g/g
let regex_property = /(?<!\?.*)\w+(?=\s*:)/g
exports.parse = function (codeStr) {
    let instructions = codeStr.split(regex_newLine);
    let indents = organize(instructions);
    let newCode = '';

    for (let i = 0; i < instructions.length; i++) {
        let instruction = instructions[i];
        let newInstruction = parse(instruction);
        let indent = createIndent(indents[i]);
        newCode += '<code>' + indent + newInstruction + '</code>';

    }

    return newCode;

}
function organize(instructions) {
    if (regex_empty.test(instructions[0]) == true) {
        instructions.shift();
    }
    if (regex_empty.test(instructions[instructions.length - 1]) == true) {
        instructions.pop();
    }
    let firstLine = instructions[0]; if (firstLine === '') return null;
    let indents = [];
    let minLength;
    for (let i = 0; i < instructions.length; i++) {
        let instruction = instructions[i];

        let spaceLength = -1;
        let isEmpty = instruction.match(regex_empty);
        if (!isEmpty) {
            let space = instruction.match(regex_spaceAtBegin);
            if (space != null) {
                spaceLength = space[0].length;
                if (minLength == null || minLength > spaceLength) minLength = spaceLength;
                instructions[i] = instruction.replace(regex_spaceAtBegin, '');
            }
        }

        indents.push(spaceLength);

    }
    for (let i = 0; i < indents.length; i++) {
        if (indents[i] != -1)//''
            indents[i] = indents[i] - minLength;
        else indents[i] = 0;
    }

    return indents;
}
function isEmpty(line) {
    let result = line.match(regex_empty);
    if (result && result[0].length == line.length)
        return true;
    return false;
}
function parse(line) {
    if (isEmpty(line)) return '<br>'
    let commentBegin = line.indexOf('//')
    let normal, comment;
    if (commentBegin != -1) {
        normal = line.slice(0, commentBegin);
        comment = line.slice(commentBegin);
    }
    else {
        normal = line;
        comment = '';
    }
    if (comment !== '')
        comment = markComment(comment);

    let allProperty, allStr, allRegex, allfuncall, allfundef, allfundefParam, allkey, allOperator, allNonStr, allcondition;
    [allRegex, normal] = markRegex(normal);
    [allStr, normal] = markString(normal);
    [allfundefParam, normal] = markfunDefParam(normal);
    [allfuncall, normal] = markfuncall(normal);
    [allfundef, normal] = markfundef(normal);
    [allkey, normal] = markkey(normal);//key mark after fun...
    [allOperator, normal] = markOperator(normal);
    [allNonStr, normal] = markNonString(normal);
    [allcondition, normal] = markCondition(normal);
    [allProperty, normal] = markProperty(normal);




    normal = restore(allStr, normal, /#ssssss#/g, "string");
    normal = restore(allfuncall, normal, /#fffccc#/g, "funcall");
    normal = restore(allfundef, normal, /#fffddd#/g, "fundef");
    normal = restore(allfundefParam, normal, /#fffdpp#/g, "funDefParam")
    normal = restore(allkey, normal, /#kkkkkk#/g, "keyword")
    normal = restore(allOperator, normal, /#oooooo#/g, "operator")
    normal = restore(allNonStr, normal, /#uunstr#/g, "unStr")
    normal = restore(allcondition, normal, /#cccccc#/g, "condition")
    normal = restore(allRegex, normal, /#rrrrrr#/g, "regexYellow")
    normal = restore(allProperty, normal, /#pppppp#/g, "property")
    let final = markHtmlEscape(normal + comment + '<br>');
    return final;
}


function createIndent(indent) {
    if (indent == 0) return ''
    let space = "&nbsp;".repeat(indent)
    return `<span>${space}</span>`;
}
function markHtmlEscape(str) {
    str = str.replace(/<!/g, '&lt;!')
    return str;
}
function markProperty(str) {
    let all = str.match(regex_property);
    if (all == null) return [null, str];
    str = str.replace(regex_property, '#pppppp#');
    return [all, str]
}
function markRegex(str) {
    let all = str.match(regex_yellow);
    if (all == null) return [null, str];
    str = str.replace(regex_yellow, '#rrrrrr#');
    for (let i = 0; i < all.length; i++) {
        let allblue = all[i].match(regex_blue);
        all[i] = all[i].replace(regex_blue, '#rrrblu#')

        all[i] = restore(allblue, all[i], /#rrrblu#/g, "regexBlue");

        let allred = all[i].match(regex_red);
        all[i] = all[i].replace(regex_red, '#rrrred#');
        all[i] = restore(allred, all[i], /#rrrred#/g, "regexRed");

    }
    return [all, str];
}
function markCondition(str) {
    let all = str.match(regex_condition);
    if (all == null) return [null, str];
    str = str.replace(regex_condition, '#cccccc#');
    return [all, str]
}
function markNonString(str) {
    let all = str.match(regex_nonStr);
    if (all == null) return [null, str];
    str = str.replace(regex_nonStr, '#uunstr#');
    return [all, str]
}
function markOperator(str) {
    let all = str.match(regex_operator);
    if (all == null) return [null, str];
    str = str.replace(regex_operator, '#oooooo#');
    return [all, str]
}
function markfunDefParam(str) {
    let all = str.match(regex_funDefParam);
    if (all == null) return [null, str];
    let allParam = [];
    for (let i = 0; i < all.length; i++) {
        let onei = all[i];
        let splitcomma = onei.split(',');
        for (let j = 0; j < splitcomma.length; j++) {
            let onej = splitcomma[j];
            allParam.push(onej);
            onei = onei.replace(onej, '#fffdpp#');
        }
        all[i] = onei;

    }
    let i = 0;
    str = str.replace(regex_funDefParam, function () {
        let result = all[i];
        i++;
        return result;
    })

    return [allParam, str]
}
function markfundef(str) {
    let all = str.match(regex_funDef);
    if (all == null) return [null, str];
    str = str.replace(regex_funDef, '#fffddd#');
    return [all, str]
}


function markfuncall(str) {
    let all = str.match(regex_funcall);
    if (all == null) return [null, str];
    str = str.replace(regex_funcall, '#fffccc#');
    return [all, str]
}

function markkey(str) {
    let allkey = str.match(regex_keywords);
    if (allkey == null) return [null, str];
    str = str.replace(regex_keywords, '#kkkkkk#');
    return [allkey, str]
}

function markComment(str) {
    if (str == undefined)
        return "";
    else {
        return `<span class='comment'>${str}</span>`;
    }
}
function markString(str) {
    if (str == null || str === '') return [null, ''];
    let all = str.match(regex_strs);
    if (all == null) return [null, str];
    str = str.replace(regex_strs, '#ssssss#');


    for (let i = 0; i < all.length; i++) {
        let onei = all[i];
        let vars = onei.match(regex_varInStr3)
        if (vars == null) continue;
        for (let j = 0; j < vars.length; j++) {
            let onej = vars[j];
            onej = onej.replace(regex_varL, "<span class='operator'>${</span>");
            onej = onej.replace(regex_varR, "<span class='operator'>}</span>");
            vars[j] = onej;

        }
        let j = 0;
        onei = onei.replace(regex_varInStr3, function () {
            let result = `<span class='normal'>${vars[j]}</span>`;
            j++;
            return result;
        });

        all[i] = onei;
    }

    return [all, str];
}

function restore(all, normal, alter, className) {
    if (all == null) return normal;
    let i = 0;
    normal = normal.replace(alter, function () {
        let result = `<span class='${className}'>${all[i]}</span>`;
        i++;
        return result;
    });

    return normal;
}