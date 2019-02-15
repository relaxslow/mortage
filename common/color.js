function brighter(color) {
    let [r, g, b] = cssColorToInt(color);
    let offset = 80;
    r += offset;
    g += offset;
    b += offset;
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    return '#' + intToHex(r) + intToHex(g) + intToHex(b);
}
function cssColorToInt(color) {
    let hexStr = color.slice(color.indexOf('#') + 1)
    let r, g, b
    if (hexStr.length == 3) {
        r = '0x' + hexStr[0] + hexStr[0];
        g = '0x' + hexStr[1] + hexStr[1];
        b = '0x' + hexStr[2] + hexStr[2];
    }
    else {
        r = '0x' + hexStr.slice(0, 1);
        g = '0x' + hexStr.slice(2, 3);
        b = '0x' + hexStr.slice(4, 5);
    }
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}
function intToHex(color) {
    let str = color.toString(16);
    if (str.length == 1) str = '0' + str;
    return str;
}