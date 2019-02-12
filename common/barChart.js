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
    }

    init();
    axis.drawTitle(data[2]);
    axis.drawOutline();
    axis.drawXTextRotated(XNames,10,60);//name,size,angle
    axis.drawHorizonLines(4);
    axis.drawYAxisTexts(ceiling,4);
    drawBars();
    new ToolTip(div, bars, XValues, "popupOnGraph");

}
