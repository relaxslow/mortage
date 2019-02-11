
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

    let status = "close";
    let group = document.querySelector(`.${elemtClass}`)
    let button = document.querySelector(`.${elemtClass} button`);
    let buttonText = button.querySelector("span");

    let options = document.querySelector(`.${elemtClass} .options`);
    options.style.top = getComputedStyle(button).height;
    options.style.width = getComputedStyle(button).width;
    group.removeChild(options);
    button.addEventListener("click", clickBut, false);

    let currentValue="all";
    function getCurrentValue() {
        return currentValue;
    }

    function setValue(num) {
        if (currentOption == num) return;
        currentOption = num;
        currentValue = items[num].textContent;
        buttonText.textContent = items[num].textContent;
        select.classList.remove("select");
        select = items[num];
        select.classList.add("select");
    }
    function closeMenu() {
        group.removeChild(options);
        status = "close";
        currentOpen = null;

    }
    function openMenu() {
        group.appendChild(options);
        status = "open";
        currentOpen = p;
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
    let currentOption;
    let items;
    let select;

    initOptions();
    function initOptions() {
        let req = new XMLHttpRequest();
        req.open('GET', `/getPullDownMenu/${elemtClass}`);
        req.onload = function () {
            let data = JSON.parse(req.response);
            // while (options.firstChild) {
            //     options.removeChild(options.firstChild);
            // }
            for (let i = 0; i < data.length; i++) {
                let item = document.createElement('BUTTON');
                item.classList.add('optionItem');
                if (data[i] === "")
                    item.textContent = "none"
                else
                    item.textContent = data[i];

                options.appendChild(item);
            }

            initItems();
        }
        req.send();
    }

    // function initOptions(){
    //     for (let i = 0; i < items.length; i++) {
    //         const item = items[i];
    //         item.addEventListener("click", clickItem, false);
    //         item.index = i;
    //     }
    // }
    function initItems() {
        currentOption = 0;
        items = options.querySelectorAll(`.optionItem`);
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            item.addEventListener("click", clickItem, false);
            item.index = i;
        }
        select = items[currentOption];
        buttonText.textContent = select.textContent;
        select.classList.add("select");
    }
    function clickItem(evt) {
        let item = evt.currentTarget;
        setValue(item.index);
        closeMenu();
    }

    let p = new PullDownMenu();
    p.close = closeMenu;
    p.getCurrentValue = getCurrentValue;

    return p;
}

function PullDownMenu() {
    this.getCurrentValue = null;
    this.getMenu = null;
}
