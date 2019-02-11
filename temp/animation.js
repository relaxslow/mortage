//1.
bar.style.transition = 'all 0.8s  cubic-bezier(.28,1.94,.56,.72)'
requestAnimationFrame(function () {//beginAnimate
    chart.setRectHeight(bar, hei);
})
//2.
window.parent.scheduleAnimation(bar.beginAnimate);
//3.
tween(0, hei, 800, changeBarHeight, ElasticEasings.easeInElastic);
function changeBarHeight(v) {
    chart.setRectHeight(bar, v);
}