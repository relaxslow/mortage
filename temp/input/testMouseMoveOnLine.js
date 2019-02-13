path.addEventListener("mousemove", mousemovePath)
function mousemovePath(evt) {

    let x = evt.clientX;
    let y = evt.clientY;
    let nearestPointIndex = nearWhichPoint(x, y);
    console.log(nearestPointIndex);

}
function nearWhichPoint(x, y,points) {
    let divRect = div.getBoundingClientRect();
    let divx = divRect.left + padding.left;
    let divy = divRect.top + padding.top;

    let mindist = -1;
    let index = -1;
    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let pointx = divx + oX + point[0];
        let pointy = divy + oY - point[1];
        let a = pointx - x;
        let b = pointy - y;
        console.log(x, y, pointx, pointy);
        let dist = Math.sqrt(a * a + b * b);
        if (mindist == -1 || dist < mindist) {
            mindist = dist;
            index = i;
        }
    }
    return index;
}