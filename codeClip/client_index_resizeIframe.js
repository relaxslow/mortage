function resizeIframe(iframe) {
    // let iframeContentHei = iframe.contentWindow.document.body.scrollHeight;
    let iframeContentHei = iframe.contentWindow.document.querySelector('.main').getBoundingClientRect().height;
    if (iframeContentHei < window.innerHeight - headHeight) {
        iframe.style.height = window.innerHeight - headHeight + "px";
    } else {
        iframe.style.height = (iframe.contentWindow.document.body.scrollHeight) + "px";

    }
}
window.resizeContent = function () {
    resizeIframe(contentFrame);
}