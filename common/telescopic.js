//dependency:
// tweenX.js
function TelescopicBox(box, shrinkWid, shrinkHei, expandWid, expandHei) {
    //prepare
    let icon = box.querySelector('.shrink');
    let content = box.querySelector('.expend');


    //init
    box.style.width = shrinkWid + 'px';
    box.style.height = shrinkHei + 'px';

    content.style["visibility"] = 'hidden';
    content.style["opacity"] = 0;
    icon.style.visibility = 'visible';
    icon.style.opacity = 1;


    //animation
    let tween;//current tween
    let shrinkBoxParam = [shrinkWid, shrinkHei, 0];//wid,hei,content opacity
    let expandBoxParam = [expandWid, expandHei, 1];
    let animationStatus = 'iconShrink';
    let animations = {
        "iconExpand": {
            param: [1, 0],//opacity
            updatefun: iconUpdate,
            completefun: iconExpandComplete,
            duration: 200
        },
        "iconShrink": {
            param: [0, 1],
            updatefun: iconUpdate,
            completefun: iconShrinkComplete,
            duration: 200
        },
        "boxExpand": {
            param: [shrinkBoxParam, expandBoxParam],
            updatefun: boxUpdate,
            completefun: boxExpandComplete,
            duration: 200

        },
        "boxShrink": {
            param: [expandBoxParam, shrinkBoxParam],
            updatefun: boxUpdate,
            completefun: boxShrinkComplete,
            duration: 200

        }

    }

    function iconShrinkComplete() {

    }
    function iconUpdate(v) {
        icon.style.opacity = v;
    }
    function iconExpandComplete() {
        icon.style["visibility"] = 'hidden';
        content.style["visibility"] = 'visible';
        animationStatus = 'boxExpand';
        let animation = animations[animationStatus];
        let currentValue = animation.param[0];
        let to = animation.param[1];
        let updatefun = animation.updatefun;
        let completefun = animation.completefun;
        let duration = animation.duration;
        tween = TweenX(currentValue, to, duration, updatefun, null, completefun);
        tween.name = animationStatus;

    }




    function boxShrinkComplete() {
        content.style["visibility"] = 'hidden';
        icon.style['visibility'] = 'visible';
        animationStatus = 'iconShrink';
        let animation = animations[animationStatus];
        let currentValue = animation.param[0];
        let to = animation.param[1];
        let updatefun = animation.updatefun;
        let completefun = animation.completefun;
        let duration = animation.duration;
        tween = TweenX(currentValue, to, duration, updatefun, null, completefun);
        tween.name = animationStatus;
    }

    function boxUpdate([w, h, o]) {
        box.style.width = w + 'px';
        box.style.height = h + 'px';
        content.style.opacity = o;
    }
    function boxExpandComplete() {

    }



    document.body.addEventListener('mousemove', mousemoveBody)
    let mouseX;
    let mouseY;
    function mousemoveBody(evt) {
        let mouseX = evt.clientX;
        let mouseY = evt.clientY;
        //         console.log(mouseX,mouseY);
    }
    box.addEventListener('mouseover', mouseoverBox, true)
    box.addEventListener('mouseout', mouseoutBox, true)

 
    const outBox = 'outBox';
    const inBox = 'inBox';
    let status = outBox;//mouse status
    function mouseoverBox(evt) {
        if (status == outBox) {
            // console.log('begin expand')
            expand();
            status = inBox;
        }
    }
    function mouseoutBox(evt) {

      
        let related=evt.relatedTarget;
        if(box.contains(related))return;
        // console.log('begin Shrink')
        shrink();
        status = outBox;
    }

    function shrink() {
        // icon.style.visibility = 'visible';
        let to;
        let updatefun;
        let completefun;
        let duration;
        let currentValue;
        let animation;
        if (tween) {
            tween.stop();
            currentValue = tween.getCurrentValue();
            let elapse = tween.getCurrentElapse();
            if (animationStatus === 'iconExpand') {
                animationStatus = 'iconShrink';
            }
            else if (animationStatus === 'boxExpand') {
                animationStatus = 'boxShrink';
            }

            animation = animations[animationStatus];
            duration = elapse * animation.duration;
        } else {
            animationStatus = 'boxShrink';
            animation = animations[animationStatus];
            currentValue = animation.param[0];
            duration = animation.duration;
        }

        to = animation.param[1];
        updatefun = animation.updatefun;
        completefun = animation.completefun;
        tween = TweenX(currentValue, to, duration, updatefun, null, completefun)
        tween.name = animationStatus;


    }


    function expand() {
        let to;
        let updatefun;
        let completefun;
        let duration;
        let currentValue;
        let animation;

        if (tween) {
            tween.stop();
            currentValue = tween.getCurrentValue();
            let elapse = tween.getCurrentElapse();

            if (animationStatus === 'iconShrink') {
                animationStatus = 'iconExpand';
            }
            else if (animationStatus === 'boxShrink') {
                animationStatus = 'boxExpand';
            }
            animation = animations[animationStatus];
            duration = elapse * animation.duration;

        } else {
            animationStatus = 'iconExpand';
            animation = animations[animationStatus];
            currentValue = animation.param[0];
            duration = animation.duration;

        }

        to = animation.param[1];
        updatefun = animation.updatefun;
        completefun = animation.completefun;
        tween = TweenX(currentValue, to, duration, updatefun, null, completefun);
        tween.name = animationStatus;

    }

    return box;
}