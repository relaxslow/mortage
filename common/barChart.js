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

    //animation param
    let normal = {
        color: {
            r: 0xff,
            g: 0x00,
            b: 0x66,
        },
        text: {//#765373
            r: 0x76,
            g: 0x53,
            b: 0x73
        },
    }
    //ffcd71
    let highlight = {
        color: {
            r: 0xff,
            g: 0xcd,
            b: 0x71,
        },
        text: {
            r: 0xff,
            g: 0xcd,
            b: 0x71
        }
    }
    let texttween = {


    }

    function drawBars() {
        let num = XValues.length;
        let step = graphWid / num;
        let current = 0;
        let widPercent = 0.9;
        let wid = step * widPercent;
        let offset = (1 - widPercent) * step / 2;
        let maxValue = axis.getYMax();

        for (let i = 0; i < num; i++) {
            let hei = graphHei * XValues[i] / maxValue;
            let x = current + offset;
            let bar = chart.drawRect(x, 0, wid, 0);

            bars.push(bar);
            current += step;

            TweenX(0, hei, 1000, changeBarHeight, ElasticEasings.easeInElastic);
            function changeBarHeight(v) {
                chart.setRectHeight(bar, v);
            }

        }
        //focus animation
        for (let i = 0; i < bars.length; i++) {
            let bar = bars[i];
            bar.index = i;
            bar.addEventListener('mouseover', mouseoverBar);
            bar.addEventListener('mouseout', mouseoutBar);
        }


        function mouseoutBar(e) {
            let bar = e.currentTarget;
            let currentValue;
            if (bar.tween) {
                bar.tween.stop();
                currentValue = bar.tween.getCurrentValue();
            }
            else
                currentValue = highlight;
            bar.tween = TweenX(currentValue, normal, 1000, unfocusBar)
            function unfocusBar(v) {
                changeFocus(bar, v);
            }
        }
        function mouseoverBar(e) {
            let bar = e.currentTarget;
            if (bar.tween) {
                bar.tween.stop();
                currentValue = bar.tween.getCurrentValue();
            }
            else
                currentValue = normal;
            bar.tween = TweenX(currentValue, highlight, 0, focusBar)
            function focusBar(v) {
                changeFocus(bar, v);
            }
        }
        function changeFocus(bar, v) {
            let color = rgbToCss(v.color.r, v.color.g, v.color.b);
            let textColor = rgbToCss(v.text.r, v.text.g, v.text.b);
            bar.setAttribute('fill', color);
            texts[bar.index].setAttribute('fill', textColor)
        }
    }

    init();
    axis.drawTitle(data[2]);
    axis.drawOutline();
    let texts = axis.drawXTextRotated(XNames, 10, 60,'shadow');//name,size,angle
    axis.drawHorizonLines(4);
    axis.drawYAxisTexts(ceiling, 4);
    drawBars();

    new ToolTip(div, bars, XValues, "popupOnGraph");

}
