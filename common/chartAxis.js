function Axis(data) {
    let { wid, hei, chart, lineWid } = data;

    function drawVerticalLines(names) {
        let num = names.length;
        let step = wid / num;
        let current = step;
        for (let i = 1; i < num; i++) {
            chart.drawLine(current, 0, current, hei, lineWid);
            current += step;
        }
    }

    let XCords = [];
    function getXCords() {
        return XCords;
    }
    function drawVerticalLinesAligned(names, padding) {
        let num = names.length;
        let step = (wid - padding * 2) / (num - 1);
        let current = padding;
        for (let i = 0; i < num; i++) {
            chart.drawLine(current, 0, current, hei, lineWid);
            XCords.push(current);
            current += step;
        }
    }
    function drawUpDownBorder() {
        chart.drawLine(0, 0, wid, 0, lineWid);//bottom
        chart.drawLine(0, hei, wid, hei, lineWid);//up
    }
    function drawLeftRightBorder() {
        chart.drawLine(0, 0, 0, hei, lineWid);//left
        chart.drawLine(wid, 0, wid, hei, lineWid)//right
    }
    function drawOutline() {
        drawUpDownBorder();
        drawLeftRightBorder();
    }
    function drawXAxisTexts(names, size) {
        let num = names.length;
        let step = wid / num;
        let current = 0;
        for (let i = 0; i < 1; i++) {
            let text = chart.createText(names[i]);
            chart.setTextSize(text, size);
            let rect = text.getBoundingClientRect();
            let x = current + step / 2 - rect.width / 2;
            let y = -rect.height;
            chart.moveText(text, x, y);
            current += step;
        }
    }
    function drawXTextRotated(names, size, angle,className) {
        let all = [];
        let num = names.length;
        let step = wid / num;
        let current = 0;
        for (let i = 0; i < num; i++) {
            let text = chart.createText(names[i]);
            chart.setTextSize(text, size);
            let rect = text.getBoundingClientRect();
            let x = current;
            let y = -rect.height + 8;
            chart.rotateText(text, angle, x, y);
            chart.moveText(text, x, y);
            current += step;
            if (className)
            text.classList.add(className);
            all.push(text);
        }
        return all;
    }
    function drawXTextRotatedAligned(names, size, angle, className) {
        let num = names.length;
        let all = [];
        for (let i = 0; i < num; i++) {
            let text = chart.createText(names[i]);
            chart.setTextSize(text, size);
            let rect = text.getBoundingClientRect();
            let x = XCords[i];
            let y = -rect.height + 8
            chart.moveText(text, x, y);
            chart.rotateText(text, angle, x, y);
            if (className)
                text.classList.add(className);
            all.push(text);
        }
        return all;
    }
    function drawXTextAligned(names) {
        let num = names.length;
        for (let i = 0; i < num; i++) {
            let text = chart.createText(names[i]);
            let rect = text.getBoundingClientRect();
            chart.moveText(text, XCords[i] - rect.width / 2, -rect.height);
        }
    }
    function drawHorizonLines(yValueNum) {
        let num = yValueNum;
        let step = hei / num;
        let current = step;
        for (let i = 1; i < num; i++) {
            chart.drawLine(0, current, wid, current, lineWid);
            current += step;
        }

    }
    let yMax;
    function getYMax() {
        return yMax;
    }
    function drawYAxisTexts(yValueMax, yValueNum) {
        let num = yValueNum;
        let max = yValueMax;
        yMax = yValueMax;
        let valueStep = max / num;
        let valueCurrent = 0;

        let current = 0;
        let step = hei / num;
        let space = 5;
        let offset = 5;
        for (let i = 0; i < num + 1; i++) {
            let text = chart.createText(valueCurrent);
            text.style["font-size"] = "12px";
            let rect = text.getBBox();
            chart.moveText(text, -rect.width - space, current - rect.height / 2 + offset);
            current += step;
            valueCurrent += valueStep;
        }
    }
    function drawTitle(str) {
        let x = 0;
        let offset = 5;
        let y = hei + offset;
        let text = chart.createText(str);
        chart.moveText(text, x, y);
    }

    this.drawOutline = drawOutline;
    this.drawUpDownBorder = drawUpDownBorder;
    this.drawLeftRightBorder = drawLeftRightBorder;
    this.drawVerticalLines = drawVerticalLines;
    this.drawVerticalLinesAligned = drawVerticalLinesAligned;
    this.drawHorizonLines = drawHorizonLines;
    this.drawXAxisTexts = drawXAxisTexts;
    this.drawXTextAligned = drawXTextAligned;
    this.drawXTextRotated = drawXTextRotated;
    this.drawXTextRotatedAligned = drawXTextRotatedAligned;
    this.drawYAxisTexts = drawYAxisTexts;
    this.drawTitle = drawTitle;
    this.getYMax = getYMax;
    this.getXCords = getXCords;
}