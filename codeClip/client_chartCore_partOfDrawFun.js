function drawRect(x, y, wid, hei) {
    let rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', oX + x);
    rect.setAttribute('y', oY - y - hei);
    rect.setAttribute('width', wid);
    rect.setAttribute('height', hei);
    rect.setAttribute('fill', "#f06");
    rect.beginY = y;
    svg.append(rect);
    return rect;
}
function drawLine(x1, y1, x2, y2, lineWid) {
    let line = document.createElementNS(ns, 'line')
    line.setAttribute('x1', oX + x1);
    line.setAttribute('y1', oY - y1);
    line.setAttribute('x2', oX + x2);
    line.setAttribute('y2', oY - y2);
    line.setAttribute('stroke', '#999999');
    line.setAttribute('stroke-width', `${lineWid}`);
    line.style["pointer-events"] = "none";
    svg.append(line);
    return line;
}