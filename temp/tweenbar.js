//use tween.js
let param = { h: 0 }
bar.beginAnimate = function () {
   bar.tween = new TWEEN.Tween(param)
      .to({ h: hei }, 1000)
      .onUpdate(function () {
         // requestAnimationFrame(function(){
         setRectHeight(bar, param.h);
         // })

      })
      .start();
}
bar.beginAnimate();