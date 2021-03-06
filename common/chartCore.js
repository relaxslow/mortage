
/**
 * This class allow user draw svg base on an origin point Ox,Oy
 * @param {number} ox 
 * @param {number} oy
 * 
 */
function Chart(ox, oy) {
    let oX = ox;
    let oY = oy;
    let ns = 'http://www.w3.org/2000/svg';
    let svg = createSVG();
    function getNode() {
        return svg;
    }
    // return this;

    function createSVG() {
        let svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('xmlns', ns);
        svg.setAttribute('width', "100%");
        svg.setAttribute('height', "100%");
        return svg
    }
    function setWH(w, h) {
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);
    }
    function setViewBox(x, y, w, h) {
        svg.setAttribute('viewBox', `${x},${y},${w},${h}`)
    }
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
    function drawCircle(x, y, r, stroke, wid, fill) {
        let circle = document.createElementNS(ns, 'circle');
        setCirclePos(circle, x, y);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', fill);
        circle.setAttribute('stroke', stroke);
        circle.setAttribute('stroke-width', `${wid}`);
        svg.append(circle);
        return circle;

    }
    function setCirclePos(circle, x, y) {
        circle.setAttribute('cx', oX + x);
        circle.setAttribute('cy', oY - y);
    }
    function setRectHeight(rect, hei) {
        rect.setAttribute('y', oY - rect.beginY - hei);
        rect.setAttribute('height', hei);
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
    function drawText(x, y, str) {
        let text = document.createElementNS(ns, 'text')
        text.setAttribute('x', oX + x);
        text.setAttribute('y', oY - y);
        text.setAttribute('fill', '#765373');
        text.setAttribute('font-family', 'cursive');
        text.textContent = str;
        svg.append(text);
        return text
    }
    function createText(str) {
        let text = document.createElementNS(ns, 'text');
        text.setAttribute('fill', '#765373');
        text.setAttribute('font-family', 'cursive');
        text.textContent = str;
        // text.style["pointer-events"] = "none";
        svg.append(text);
        return text;
    }
    function moveText(text, x, y) {
        text.setAttribute('x', oX + x);
        text.setAttribute('y', oY - y);
    }
    function rotateText(text, deg, x, y) {
        text.setAttribute("transform", `rotate(${deg} ${oX + x},${oY - y})`);
    }
    function setTextSize(text, size) {
        text.setAttribute("font-size", `${size}`);
    }
    function drawPath(data) {
        let [points, wid, color] = data
        let path = document.createElementNS(ns, 'path');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', wid);
        path.setAttribute('fill', "none")
        setPathPoint(path, points);
        svg.append(path);
        return path;
    }
    function drawClosePath(data) {
        let [points, color] = data
        let path = document.createElementNS(ns, 'path');
        path.setAttribute('stroke', "none");
        path.setAttribute('fill', color);
        setPathPoint(path, points, close);
        svg.append(path);
        return path;
    }
    function setPathPoint(path, points, close) {
        let d = '';
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            if (i == 0)
                d += 'M';
            else
                d += 'L';
            d += `${oX + point[0]},${oY - point[1]}`;
        }
        if (close == true) d += 'z';
        path.setAttribute('d', d);
    }


    this.drawCircle = drawCircle;
    this.setCirclePos = setCirclePos;

    this.drawRect = drawRect;
    this.setRectHeight = setRectHeight;

    this.drawLine = drawLine;

    this.createText = createText;
    this.moveText = moveText;
    this.rotateText = rotateText;
    this.setTextSize = setTextSize;

    this.drawPath = drawPath;
    this.drawClosePath = drawClosePath;
    this.setPathPoint = setPathPoint;

    this.getNode = getNode;
    this.setWH = setWH;
    this.setViewBox = setViewBox;


}
//-------
Chart.initParam = initChartDimension;
Chart.findMax = findMax;
Chart.findCeiling = findCeiling;
Chart.findCeilingWithBase = findCeilingWithBase;
function initChartDimension(data) {
    let [div, left, right, bottom, top, lineWid] = data;
    let style = window.getComputedStyle(div);

    let padding = {
        left: parseInt(style["padding-left"]),
        right: parseInt(style["padding-right"]),
        top: parseInt(style["padding-top"]),
        bottom: parseInt(style["padding-bottom"])
    };

    let rect = div.getBoundingClientRect();
    let width = rect.width - padding.left - padding.right;
    let height = rect.height - padding.top - padding.bottom;
    div.param = {
        wid: width,
        hei: height,
        pad: padding,
        rect: rect
    };
    let oX = left;
    let oY = height - bottom;
    let graphWid = width - left - right - lineWid / 2;
    let graphHei = height - bottom - top - lineWid / 2;
    return [width, height, graphWid, graphHei, oX, oY, padding];

}
function findCeilingWithBase(v, base) {
    let x = Math.round(v / base);
    return findCeiling(x);
}
function findCeiling(v) {
    let maxValueStr = v.toString();
    let digit = maxValueStr.length - 1;
    let ceiling = (parseInt(maxValueStr[0]) + 1) * Math.pow(10, digit);
    return ceiling
}
function findMax(data) {
    let max;
    for (let i = 0; i < data.length; i++) {
        let v = data[i];
        if (max == null)
            max = v;
        else if (v > max) {
            max = v;
        }
    }
    return max;
}
//------
function ToolTip(div, elems, data, type) {
    let tooltip = document.createElement('DIV');
    tooltip.classList.add("tooltip");
    tooltip.style.opacity = 0;
    div.appendChild(tooltip);
    let text = document.createElement('P');
    text.classList.add("tooltipText");
    tooltip.appendChild(text);
    let divRect = div.getBoundingClientRect();
    let popDialog;
    let downArrow;
    let arrowWid = 10;
    let arrowHei = 10;
    createToolTipShape();
    function createToolTipShape() {
        let rect = tooltip.getBoundingClientRect();
        popDialog = new Chart(0, 0);
        popDialog.setWH(arrowWid, arrowHei);
        popDialog.setViewBox(0, 0, 100, 100)
        downArrow = popDialog.getNode();
        downArrow.style["position"] = "absolute";
        downArrow.style["top"] = "0px";
        downArrow.style["left"] = "0px";

        tooltip.appendChild(downArrow);

        let arrowpoints = [
            [0, 0],
            [100, 0],
            [50, -100]
        ]
        let arrowcolor = '#ffcd71'
        popDialog.drawClosePath([arrowpoints, arrowcolor]);





    }

    let tooltipType = {
        "undefined": normal,
        "popupOnGraph": popup,
        "popupOnView": popupOnView
    }
    tooltipType[type]();
    function popupOnView() {

    }
    function popup() {
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            elem.index = i;
            elem.addEventListener("mouseout", mouseout);
            elem.addEventListener("mouseenter", mouseenter);
        }

        function mouseenter(evt) {
            let elem = evt.currentTarget
            text.textContent = data[elem.index];
            let textRect = text.getBoundingClientRect();
            if (tooltip._hei == null) {//animation param must save for interrupt
                tooltip._hei = textRect.height;
                tooltip._wid = textRect.width;
            }

            let elemrect = elem.getBoundingClientRect();
            let parentRect = elem.parentNode.getBoundingClientRect();
            let top = div.param.pad.top + elemrect.top - parentRect.top;
            let left = div.param.pad.left + elemrect.left - parentRect.left;
            //   let top = 0;
            // let left=0;

            if (elemrect.width > tooltip._wid)
                tooltip._wid = elemrect.width;

            tooltip._top = top;
            tooltip._left = left + elemrect.width / 2 - tooltip._wid / 2;

            if (tween) {
                tween.stopAtEnd();
                tween = null;
            }
            let offset=10;
            tooltip.style.opacity = 1;
            tooltip.style.top = tooltip._top + "px";
            tooltip.style.left = tooltip._left + "px";
            tooltip.style.top = (tooltip._top - tooltip._hei-offset) + "px";
            tooltip.style.width = tooltip._wid + "px";
            downArrow.style.left = (tooltip._wid / 2 - arrowWid / 2) + "px";

            if (!canPop) return;
            tooltip.style.height = 0 + "px";

            tween = TweenX(0, tooltip._hei, 500, changeTooltipHei, ElasticEasings.easeInElastic);
           
            function changeTooltipHei(v) {
                tooltip.style.height = v + "px";
                tooltip.style.top = (tooltip._top -v-offset) + "px";
                downArrow.style.top = v + "px";

            }
           
        }
        let canPop = true;
        let tween;
        function mouseout(evt) {
            tooltip.style.opacity = 0;

            canPop = false
            if (tween) {
                tween.stopAtEnd();
                tween = null;
            }
            tween = TweenX(1, 0, 500, fadeOut, EasingFunctions.linear, permitPop);
            function fadeOut(v) {
                tooltip.style.opacity = v;
            }
            function permitPop() {
                canPop = true;
            }

        }
    }
    function normal() {
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            elem.index = i;
            elem.addEventListener("mousemove", mouseover);
            elem.addEventListener("mouseout", mouseout);
            elem.addEventListener("mouseenter", mouseenter);
        }

        function mouseenter(e) {
            let elem = e.currentTarget;
            text.textContent = data[elem.index];
            let textRect = text.getBoundingClientRect()
            tooltip.style.opacity = 1;

            tooltip.style.height = textRect.height + "px";
            tooltip.style.width = textRect.width + "px";
            tooltip._wid = textRect.width;
            tooltip._hei = textRect.height;

        }
        function mouseout(evt) {
            tooltip.style.opacity = 0;
        }
        function mouseover(evt) {
            let mousex = evt.pageX - divRect.left;
            let mousey = evt.pageY - divRect.top;
            tooltip.style.transform = `translate(${mousex}px,${mousey - tooltip._hei - arrowHei}px)`;
            downArrow.style.top = tooltip._hei + "px";

        }
    }


}

//util

function rgbToCss(r, g, b) {
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    let rStr = Math.round(r).toString(16);
    let gStr = Math.round(g).toString(16);
    let bStr = Math.round(b).toString(16);
    if (rStr.length == 1) rStr = '0' + rStr;
    if (gStr.length == 1) gStr = '0' + gStr;
    if (bStr.length == 1) bStr = '0' + bStr;
    return '#' + rStr + gStr + bStr;
}