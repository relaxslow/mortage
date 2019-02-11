
function getMenu(name, fun) {
    let current = 0;

    let group = document.querySelector(name);
    let items = document.querySelectorAll(`${name} button`);
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item.index = i;
        item.addEventListener("click", clickItem);
    }
    function clickItem(evt) {
        let item = evt.currentTarget;
        if (current == item.index) return;
        setCurrent(item.index);
        if (fun) fun(item.index)
    }
    function setCurrent(num) {
       
        items[current].classList.remove("select");
        items[num].classList.add("select");
        current = num;
    }

    let menu = {};
    menu.getItems = function(){
        return items;
    }
    menu.getHei = function () {
        let rect = group.getBoundingClientRect();
        return rect.height;
    }
    return menu;



}

