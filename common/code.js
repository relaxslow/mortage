var htmlparser = new DOMParser()
function syntaxHighlight(code) {

    let regex_newLine = /\r?\n/;
    let regex_empty = /^$|^\s*$/gm;
    let regex_spaceAtBegin = /^\s+/;
    let regex_keywords = /const|let|console|function/g;
    let regex_operator = /[\+\-\*\/=\!]|\|\||&&/g
    let regex_strs = /'[^']*'|`[^`]*`|"[^"]*"/g
    let regex_nonStr = /(?<=\=\s+)\btrue\b|\bfalse\b|\bnull\b|\bundefined\b|\b\d+\b/g
    let regex_varInStr3 = /(?<=`.*)\${[^{|}]*}(?=.*`)/g;
    let regex_varL = /\${/g;
    let regex_varR = /}/g;
    let varX = /(?<=\${).*(?=})/
    let regex_funcall = /(?<!function.*)(?!function|for|if)\b\w+(?=\s*\()/g
    let regex_funDef = /(?<=function\s+)\w+(?=\s*\()/g
    let regex_funDefParam = /(?<=function.*\()[^(|)]*(?=\))/g
    let regex_condition = /\bif\b|\belse\b|\bfor\b|\breturn\b|\bcontinue\b|\bbreak\b/g

    let codeStr = code.querySelector('code').textContent;

    let instructions = codeStr.split(regex_newLine);

    if (regex_empty.test(instructions[0]) == true) {
        instructions.shift();
    }
    if (regex_empty.test(instructions[instructions.length - 1]) == true) {
        instructions.pop();
    }
    let newCode = '';
    let firstLine = instructions[0]; if (firstLine === '') return;
    let unindent = firstLine.match(regex_spaceAtBegin)[0].length;
    for (let i = 0; i < instructions.length; i++) {
        let instruction = instructions[i];
        let newInstruction = parse(instruction)
        newCode += '<code>'+newInstruction+'</code>';
        // console.log(newInstruction);

    }

    code.innerHTML = newCode;
    function isEmpty(line) {
        let result = line.match(regex_empty);
        if (result && result[0].length == line.length)
            return true;
        return false;
    }
    function parse(line) {
        if (isEmpty(line)) return '<br>'
        let s = line.split("//");
        let normal = s[0];
        let comment = s[1];
        comment = markComment(comment);
        let beginspace = normal.match(regex_spaceAtBegin);
        let indent = 0;
        if (beginspace) {
            indent = beginspace[0].length - unindent;
        }
        indent = createIndent(indent);

        normal = normal.replace(regex_spaceAtBegin, '');
        let allStr, allfuncall, allfundef, allfundefParam, allkey, allOperator, allNonStr, allcondition;
        [allStr, normal] = markString(normal);
        [allfundefParam, normal] = markfunDefParam(normal);
        [allfuncall, normal] = markfuncall(normal);
        [allfundef, normal] = markfundef(normal);
        [allkey, normal] = markkey(normal);//key mark after fun...
        [allOperator, normal] = markOperator(normal);
        [allNonStr, normal] = markNonString(normal);
        [allcondition, normal] = markCondition(normal);



        normal = restore(allStr, normal, /_ssssss_/g, "string");
        normal = restore(allfuncall, normal, /_fffccc_/g, "funcall");
        normal = restore(allfundef, normal, /_fffddd_/g, "fundef");
        normal = restore(allfundefParam, normal, /_fffdpp_/g, "funDefParam")
        normal = restore(allkey, normal, /_kkkkkk_/g, "keyword")
        normal = restore(allOperator, normal, /_oooooo_/g, "operator")
        normal = restore(allNonStr, normal, /_uunstr_/g, "unStr")
        normal = restore(allcondition, normal, /_cccccc_/g, "condition")
        return indent + normal + comment + '<br>';
    }


    function createIndent(indent) {
        if (indent == 0) return ''
        let space = "&nbsp;".repeat(indent)
        return `<span>${space}</span>`;
    }
    function markCondition(str) {
        let all = str.match(regex_condition);
        if (all == null) return [null, str];
        str = str.replace(regex_condition, '_cccccc_');
        return [all, str]
    }
    function markNonString(str) {
        let all = str.match(regex_nonStr);
        if (all == null) return [null, str];
        str = str.replace(regex_nonStr, '_uunstr_');
        return [all, str]
    }
    function markOperator(str) {
        let all = str.match(regex_operator);
        if (all == null) return [null, str];
        str = str.replace(regex_operator, '_oooooo_');
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
                onei = onei.replace(onej, '_fffdpp_');
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
        str = str.replace(regex_funDef, '_fffddd_');
        return [all, str]
    }


    function markfuncall(str) {
        let all = str.match(regex_funcall);
        if (all == null) return [null, str];
        str = str.replace(regex_funcall, '_fffccc_');
        return [all, str]
    }

    function markkey(str) {
        let allkey = str.match(regex_keywords);
        if (allkey == null) return [null, str];
        str = str.replace(regex_keywords, '_kkkkkk_');
        return [allkey, str]
    }

    function markComment(str) {
        if (str == undefined)
            return "";
        else {
            return `<span class='comment'> //${str}</span>`;
        }
    }
    function markString(str) {
        if (str == null || str === '') return [null, ''];
        let allstr = str.match(regex_strs);
        if (allstr == null) return [null, str];
        str = str.replace(regex_strs, '_ssssss_');


        for (let i = 0; i < allstr.length; i++) {
            let onei = allstr[i];
            let vars = onei.match(regex_varInStr3)
            if (vars == null) continue;
            for (let j = 0; j < vars.length; j++) {
                let onej = vars[j];
                onej = onej.replace(regex_varL, "<span class='regex_operator'>${</span>");
                onej = onej.replace(regex_varR, "<span class='regex_operator'>}</span>");
                vars[j] = onej;

            }
            let j = 0;
            onei = onei.replace(regex_varInStr3, function () {
                let result = `<span class='normal'>${vars[j]}</span>`;
                j++;
                return result;
            });

            allstr[i] = onei;
        }

        return [allstr, str];
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
    //drag


    code.addEventListener('pointerdown', mousedownCode);
    code.addEventListener('pointerour', mouseLeaveCode);
    code.addEventListener('pointerup', mouseUpCode);
    code.addEventListener('pointermove', mousemoveCode);
    let isDown = false;
    let startX;
    let scrollLeft;
    function mousedownCode(e) {
        isDown = true;
        code.classList.add('active');
        startX = e.pageX - code.offsetLeft;
        scrollLeft = code.scrollLeft;

    }
    function mouseLeaveCode(e) {
        isDown = false;
        code.classList.remove('active');

    }
    function mouseUpCode(e) {
        isDown = false;
        code.classList.remove('active');

    }
    let grabIcon;
    function mousemoveCode(e) {
        if (!isDown) return;
        // e.preventDefault();
        const x = e.pageX - code.offsetLeft;
        const offset = (x - startX) * 3; //scroll-fast
        code.scrollLeft = scrollLeft - offset;

    }
}
