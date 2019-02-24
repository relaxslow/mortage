let regex_operator = /[\+\-\*\/=\!]|\|\||&&/g
let regex_keywords = /\bconst\b|\blet\b|\bconsole\b|\bfunction\b/g;
let regex_strs = /'[^']*'|`[^`]*`|"[^"]*"/g
let regex_nonStr = /(?<=\=\s+)\btrue\b|\bfalse\b|\bnull\b|\bundefined\b|\b\d+\b/g
let regex_yellow = /\/.*\/g?m?/g
let regex_funcall = /(?<!function.*)(?!function|for|if)\b\w+(?=\s*\()/g
let regex_funDef = /(?<=function\s+)\w+(?=\s*\()/g
let regex_funDefParam = /(?<=function(\s+)?(\w+(\s+)?)?\(.*,?)(?<!{.*|\/.*)\w+(?=,?.*\))/g
let regex_condition = /\bif\b|\belse\b|\bfor\b|\breturn\b|\bcontinue\b|\bbreak\b/g
let regex_yellow = /\/.*\/gm?/g
let regex_blue = /(?!\\b)\\.|\[\^\(\)\]|\[\^\\\[\\\]\]|\[[^\[\]]*\]|\[\^.*\](?=.*\/g?m?)/g
let regex_red = /(?<!\\)\^|\||\*|\\b|\+|\?(?!<|=|!)|(?<=\/)g/g