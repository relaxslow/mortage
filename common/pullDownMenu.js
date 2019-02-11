
let currentOpen = null;
document.addEventListener("click", clickOutsideMenu, false)
function clickOutsideMenu(evt) {
    if (currentOpen) currentOpen.close();
}

/**
 * 
 * @param {string} elemtClass 
 * @returns {PullDownMenu} 
 */
function getPullDown(elemtClass) {
    let component = document.querySelector(`.${elemtClass}`);
    let group = component.querySelector(".pullDown");
    let button = document.querySelector(`.${elemtClass} .pullDown button`);
    let buttonText = button.querySelector("span");
    let list = document.querySelector(`.${elemtClass} .list`);
    list.style.top = getComputedStyle(button).height;
    list.style.width = getComputedStyle(button).width;

    let options = list.querySelector(`.${elemtClass} .options`);
    options.adjustHei = function () {
        if (options.scrollHeight > 300) {
            options.style["height"] = 300 + "px";
            options.style["overflow-y"] = "scroll";
        }
        else
            options.style["height"] = options.scrollHeight;

    }
    group.removeChild(list);
    let result = component.querySelector(".result");
    button.addEventListener("click", clickBut, false);

    function closeMenu() {
        selector.hide();
        group.removeChild(list);
        currentOpen = null;

    }
    function openMenu() {
        selector.show();
        group.appendChild(list);
        let rect = options.getBoundingClientRect();
        options.adjustHei();
        currentOpen = p;
        parent.window.resizeContent();
    }
    function clickBut(evt) {
        evt.stopPropagation();
        if (currentOpen == null) {
            openMenu();
        }
        else {
            if (currentOpen == p) {
                closeMenu();
            } else if (currentOpen != p) {
                currentOpen.close();
                openMenu();
            }
        }

    }

    let items;
    initOptions();
    function initOptions() {
        let req = new XMLHttpRequest();
        req.open('GET', `/getPullDownMenu/${elemtClass}`);
        req.onload = function () {
            let data = JSON.parse(req.response);
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d === "") continue;
                let item = document.createElement('BUTTON');
                item.classList.add('optionItem');
                item.textContent = d;
                options.appendChild(item);

            }


            initItems();
            initResetBut();
            requestAnimationFrame(function () {
                initSelector();
            })
        }
        req.send();
    }
    let selector;
    function initSelector() {
        selector = document.createElement("DIV");
        selector.style["position"] = "absolute";
        selector.style["visibility"] = "hidden";
        // selector.style["background-color"] = "#a81212";
        selector.style["zIndex"] = "500";
        selector.style["pointer-events"] = "none";
        selector.style["border"] = "solid red 1px";
        selector.style["boxSizing"] = "border-box";

        options.appendChild(selector);
        selector.show = function () {
            selector.style.visibility = "visible";
        }
        selector.hide = function () {
            selector.style.visibility = "visible";
        }
        selector.place = function (item) {
            selector.show();
            let itemrect = item.getBoundingClientRect();
            let optionsRect = options.getBoundingClientRect();
            selector.style.top = (itemrect.top - optionsRect.top + options.scrollTop) + "px";
            selector.style["height"] = itemrect.height + "px";
            selector.style["width"] = itemrect.width + "px";
        }
    }


    function initItems() {
        items = options.querySelectorAll(`.optionItem`);
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            item.addEventListener("mousemove", mouseoverItem);
            item.addEventListener("mousedown", onmouseDown);
            item.addEventListener("click", clickItem);
            item.select = false;
            item.index = i;
        }
        document.addEventListener("mouseup", onmouseUp);


    }
    let reset;
    function initResetBut() {
        reset = list.querySelector(".reset")
        reset.style["zIndex"] = "600";
        reset.addEventListener("click", clickReset);
        reset.addEventListener('mouseover', mouseOverResetButton)

        result.textContent = "any";
    }
    function clickReset(evt) {
        evt.stopPropagation();
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.select = false;
            item.classList.remove("select");
        }
        result.textContent = "any"
        selected.length = 0;
        buttonText.textContent="select..."
    }
    function mouseOverResetButton() {
        selector.style["visibility"] = "hidden";
    }

    let mousey;
    let mouseDownY;
    let mouseDownItem = false;
    function onmouseDown(evt) {
        mouseDownItem = true;
        mouseDownY = evt.pageY;
        let item = evt.currentTarget
        switchSelect(item);
        collection.length = 0;

    }
    function onmouseUp(evt) {
        mouseDownItem = false;



    }
    function removeItemFromArr(item) {
        let index = this.indexOf(item);
        if (index != -1)
            this.splice(index, 1);
    }
    let collection = [];
    function removeItemNotInCollectRect() {
        for (let i = 0; i < collection.length; i++) {
            let item = collection[i];
            if (!isInSelectRect(item)) {
                removeItemFromArr.call(collection, item);
                switchback(item);
            }
        }

    }
    function addItemInCollectRect() {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (isInSelectRect(item)) {
                let index = collection.indexOf(item)
                if (index == -1) {
                    collection.push(item);
                    switchSelect(item);

                }
            }
        }
    }
    function isInSelectRect(item) {
        let rect = item.getBoundingClientRect();
        if (mousey > mouseDownY)//down
        {
            if (rect.top >= mouseDownY && rect.top <= mousey) {
                return true;
            }
        }
        else if (mousey < mouseDownY)//up
        {
            if (rect.bottom >= mousey && rect.bottom <= mouseDownY) {
                return true;
            }
        }
        return false;
    }

 
    function mouseoverItem(evt) {
        evt.stopPropagation();
        selector.place(evt.currentTarget);

        if (mouseDownItem) {
            mousey = evt.pageY;
            addItemInCollectRect();
            removeItemNotInCollectRect();

        }

    }
    function clickItem(evt) {
        evt.stopPropagation();
        
    }
    function switchback(item) {
        if (item.select == true) {
            item.classList.add("select");
        }
        else {
            item.classList.remove("select");
        }
    }
    let selected = [];
    function switchSelect(item) {
        if (item.select == true) {
            item.classList.remove("select");
        }
        else {
            item.classList.add("select");
        }

        selected.length = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.classList.contains("select")) {
                selected.push(item.textContent)
            }
        }
        let text = "";
        for (let i = 0; i < selected.length; i++) {
            let itemtext = selected[i];
            text += itemtext;
            if (i != selected.length - 1) {
                text += ", "
            }
        }
        result.textContent = text;
        buttonText.textContent=`select ${selected.length} items`;
    }
 

    function getCurrentSelect() {
        return selected;
    }
    let p = new PullDownMenu();
    p.close = closeMenu;
    p.getCurrentSelect = getCurrentSelect;

    return p;
}

class PullDownMenu {
    constructor() {
        this.getCurrentSelect = null;
        this.close = null;

    }
}
