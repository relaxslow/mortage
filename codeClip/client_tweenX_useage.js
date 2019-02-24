TweenX(0, hei, 1000, changeBarHeight, ElasticEasings.easeInElastic);
function changeBarHeight(v) {
    chart.setRectHeight(bar, v);
}