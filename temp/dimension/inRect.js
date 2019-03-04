function inRect(rect, x, y, fillet) {
    if (x < rect.left + fillet || x > rect.left + rect.width - fillet || y < rect.top + fillet || y > rect.top + rect.height - fillet)
        return false;
    return true;
}
  // let x = evt.clientX;
        // let y = evt.clientY;
        // console.log('mouseout', evt.eventPhase, x, y)