function BarChart(name, data) {
    let div;
    let chart;
    let axis;


    let lineWid = 1;
    let leftSpace = 50;
    let rightSpace = 20;
    let bottomSpace = 50;
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
        [width, height, graphWid, graphHei, oX, oY] = Chart.initParam([
            div, leftSpace, rightSpace, bottomSpace, topSpace, lineWid
        ])

        chart = new Chart(oX, oY);

        div.appendChild(chart.getNode());

        // XNames = [
        //     "2017Q1",
        //     "2017Q2",
        //     "2017Q3",
        // ];
        // XValues = [
        //     1234,
        //     2345,
        //     3456,
        // ];
        XNames = data[0];
        XValues = data[1];
        let maxValue = Chart.findMax(XValues);
        ceiling = Chart.findCeiling(maxValue);


        axis = new Axis({
            wid: graphWid,
            hei: graphHei,

            chart: chart,
            lineWid: lineWid,

        });

    }


    let bars = [];
    function drawBars() {
        let num = XValues.length;
        let step = graphWid / num;
        let current = 0;
        let widPercent = 0.8;
        let wid = step * widPercent;
        let offset = (1 - widPercent) * step / 2;
        let maxValue = axis.getYMax();

        for (let i = 0; i < num; i++) {
            let hei = graphHei * XValues[i] / maxValue;
            let x = current + offset;
            let bar = chart.drawRect(x, 0, wid, 0);

            bars.push(bar);
            current += step;

            new Tween(0, hei, 1000, changeBarHeight, ElasticEasings.easeInElastic);
            function changeBarHeight(v) {
                chart.setRectHeight(bar, v);
            }

        }

        for (let i = 0; i < bars.length; i++) {
            let bar = bars[i];
            bar.bkcolor = bar.getAttribute('fill');
            bar.bkHighLight = brighter(bar.bkcolor);
            bar.addEventListener('mouseover', mouseoverBar);
            bar.addEventListener('mouseout', mouseoutBar);


        }
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
        function mouseoutBar(e) {
            let bar = e.currentTarget;
            bar.setAttribute('fill', bar.bkcolor);
        }
        function mouseoverBar(e) {
            let bar = e.currentTarget;
            bar.setAttribute('fill', bar.bkHighLight);
        }
    }

    init();
    axis.drawTitle(data[2]);
    axis.drawOutline();
    axis.drawXTextRotated(XNames, 10, 60);//name,size,angle
    axis.drawHorizonLines(4);
    axis.drawYAxisTexts(ceiling, 4);
    drawBars();

    new ToolTip(div, bars, XValues, "popupOnGraph");

}
