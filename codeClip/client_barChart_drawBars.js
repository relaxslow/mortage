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