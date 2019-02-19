if (grabIcon == null)
    grabIcon = document.querySelector('.grabhand');
else {
    grabIcon.style.top = e.pageY + "px";
    grabIcon.style.left = e.pageX + "px"
}