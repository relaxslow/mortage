function LineChart(name, data) {
    let div;
    let padding;
    /** @type Chart */
    let chart;


    let lineWid = 1;
    let leftSpace = 70;
    let rightSpace = 10;
    let bottomSpace = 40;
    let topSpace = 20;


    let width;
    let height;
    let oX;
    let oY;
    let graphWid;
    let graphHei;

    let XNames, XValues;
    let ceiling;

    function init() {
        div = document.querySelector(`.${name}`);
        [width, height, graphWid, graphHei, oX, oY, padding] = Chart.initParam([
            div,
            leftSpace,
            rightSpace,
            bottomSpace,
            topSpace,
            lineWid
        ])
        chart = new Chart(oX, oY);
        div.appendChild(chart.getNode());
        // XNames = [
        //     "2017Q1",
        //     "2017Q2",
        //     "2017Q3",
        // ];
        // XValues = [
        //     340,
        //     220,
        //     510,
        // ];
        XNames = data[0];
        XValues = data[1];
        let maxValue = Chart.findMax(XValues);
        ceiling = Chart.findCeiling(maxValue);
        axis = new Axis({
            wid: graphWid,
            hei: graphHei,
            chart: chart,
            lineWid: lineWid

        });

    }
    let lineColor = '#f06';

    function drawLineAligned(XCord) {
        let points = [];
        let initPoints = []
        let num = XValues.length;
        let maxValue = axis.getYMax();

        for (let i = 0; i < num; i++) {
            let y = graphHei * XValues[i] / maxValue;
            let x = XCord[i];
            points.push([x, y]);
            let random = Math.random() * graphHei;
            initPoints.push([x, random]);
        }
        let path = chart.drawPath([initPoints, 2, lineColor]);
        drawPointCircles(points, initPoints);
        TweenX(initPoints, points, 1000, changePathPointPos, ElasticEasings.easeInElastic);
        function changePathPointPos(values) {
            chart.setPathPoint(path, values);
            for (let i = 0; i < circles.length; i++) {
                let circle = circles[i];
                chart.setCirclePos(circle, values[i][0], values[i][1]);
            }
        }
        return points;

    }
    let circles = [];
    function drawPointCircles(points) {

        let r = 3
        let color = '#ffcd71';
        let lineColor = '#f06';
        let lineW = 2;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let circle = chart.drawCircle(point[0], 0, r, lineColor, lineW, color);
            circle.index = i;
            circles.push(circle);
        }


        return circles;
    }

    function drawLine() {
        let points = [];
        let num = XValues.length;
        let step = graphWid / num;
        let offset = step / 2;
        let current = 0;
        let maxValue = axis.getYMax();
        for (let i = 0; i < num; i++) {
            let y = graphHei * XValues[i] / maxValue;
            let x = current + offset;
            current += step;
            points.push([x, y]);
        }
        chart.drawPath([points, 2, '#000000']);
    }
    //focus

    let normal = {
        r: 3,
        text: {//#765373//ffcd71
            r: 0x76,
            g: 0x53,
            b: 0x73
        },
    }
    let highlight = {
        r: 8,
        text: {
            r: 0xff,
            g: 0xcd,
            b: 0x71
        }
    }

    let focusedCircle = null;
    function focusCircle(circle) {
        let currentR;
        if (circle.tween) {
            circle.tween.stop();
            currentR = circle.tween.getCurrentValue();
        } else currentR = normal;
        circle.tween = TweenX(currentR, highlight, 500, changeRadius, ElasticEasings.easeInElastic);
        function changeRadius(v) {
            circle.setAttribute('r', v.r);
            texts[circle.index].setAttribute('fill', rgbToCss(v.text.r, v.text.g, v.text.b))
        }
        focusedCircle = circle;
    }
    function unfocusCircle(circle) {
        circle.tween.stop();
        let currentR = circle.tween.getCurrentValue();
        circle.tween = TweenX(currentR, normal, 700, changeRadius);
        function changeRadius(v) {
            circle.setAttribute('r', v.r);
            texts[circle.index].setAttribute('fill', rgbToCss(v.text.r, v.text.g, v.text.b))

        }
        focusedCircle = null;
    }
    function setFocusAction() {
        div.addEventListener('mousemove', mouseoverDiv)
    }
    let oldNearst = -1;

    function mouseoverDiv(e) {

        let divRect = div.getBoundingClientRect();
        let divx = divRect.left + padding.left;
        let divy = divRect.top + padding.top;
        let x = e.clientX - divx - oX;
        let y = oY - (e.clientY - divy);
        //         console.log(x,y)
        if (x < 0 || x > graphWid || y < 0 || y > graphHei) {
            oldNearst = -1;
            if (focusedCircle) {
                unfocusCircle(focusedCircle)
            }
            return;
        }

        let nearestIndex = nearWhichX(x, linepoints);
        if (nearestIndex == oldNearst) return;
        else {
            if (focusedCircle != null)
                unfocusCircle(focusedCircle);
            focusCircle(circles[nearestIndex]);
            oldNearst = nearestIndex
        }


        //         console.log(x, y, nearestIndex);
    }
    function nearWhichX(x, points) {
        let mindist = -1;
        let index = -1;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let pointx = point[0];
            let dist = Math.abs(x - pointx);
            if (mindist == -1 || dist < mindist) {
                mindist = dist;
                index = i;
            }
        }
        return index;
    }
    function nearWhichPoint(x, y, points) {
        let divRect = div.getBoundingClientRect();
        let divx = divRect.left + padding.left;
        let divy = divRect.top + padding.top;

        let mindist = -1;
        let index = -1;
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let pointx = divx + oX + point[0];
            let pointy = divy + oY - point[1];
            let a = pointx - x;
            let b = pointy - y;
            //             console.log(x, y, pointx, pointy);
            let dist = Math.sqrt(a * a + b * b);
            if (mindist == -1 || dist < mindist) {
                mindist = dist;
                index = i;
            }
        }
        return index;
    }
    init();
    axis.drawTitle(data[2]);
    // axis.drawOutline();
    axis.drawUpDownBorder();
    // axis.drawVerticalLines();
    axis.drawVerticalLinesAligned(XNames, 20);
    // axis.drawXTextAligned();
    let texts = axis.drawXTextRotatedAligned(XNames, 10, 60);
    axis.drawHorizonLines(5);
    axis.drawYAxisTexts(ceiling, 5);
    let linepoints = drawLineAligned(axis.getXCords());
    new ToolTip(div, circles, XValues);
    setFocusAction();



}