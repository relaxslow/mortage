function LineChart(name, data) {
    let div;
    let padding;
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
    let color = '#f06';
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

    function drawLineAligned(XCord) {
        let points = [];
        let initPoints = []
        let num = XValues.length;
        let maxValue = axis.getYMax();

        for (let i = 0; i < num; i++) {
            let y = graphHei * XValues[i] / maxValue;
            let x = XCord[i];
            points.push([x, y]);
            let random = Math.random() *graphHei;

            initPoints.push([x, random]);
        }
        let path = chart.drawPath([initPoints, 2, color]);
        drawPointCircles(points, initPoints);
        tweenMulti(initPoints, points, 1000, changePathPointPos, ElasticEasings.easeInElastic);
        function changePathPointPos(values) {
            chart.setPathPoint(path, values);
            for (let i = 0; i < circles.length; i++) {
                let circle = circles[i];
                chart.setCirclePos(circle, values[i][0], values[i][1]);
            }
        }


    }
    let circles = [];
    function drawPointCircles(points) {
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let circle = chart.drawCircle(point[0], 0, 10, color, 2, '#ffffff');
            circles.push(circle);
            // circle.style.transition = transition;
            // requestAnimationFrame(function () {
            //     chart.setCirclePos(circle, point[0], point[1]);
            // });
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


    init();
    axis.drawTitle(data[2]);
    // axis.drawOutline();
    axis.drawUpDownBorder();
    // axis.drawVerticalLines();
    axis.drawVerticalLinesAligned(XNames, 20);
    // axis.drawXTextAligned();
    axis.drawXTextRotatedAligned(XNames, 10, 60);
    axis.drawHorizonLines(5);
    axis.drawYAxisTexts(ceiling, 5);
    drawLineAligned(axis.getXCords());
    new ToolTip(div, circles, XValues);




}