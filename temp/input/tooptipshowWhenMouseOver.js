//in some loop
for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    circle.highlightParam = {
        r: 8
    }
    circle.animation = 0;
    circle.addEventListener('mouseenter', mouseenterCircle)
    circle.addEventListener('mouseout', mouseoutCircle)
}



function mouseoutCircle(e) {
    let circle = e.currentTarget;
    unfocusCircle(circle)


}
function mouseenterCircle(e) {
    let circle = e.currentTarget;
    focusCircle(circle)

}