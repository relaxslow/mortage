function getSelectMenu(classname) {
    let menu = document.querySelector(`.${classname}`);
    menu.onchange = function (evt) {
        let item = menu.options[menu.selectedIndex]
        select.classList.remove('highlight');
        select = item;
        select.classList.add('highlight')
    }

    function initOptions() {

    }
    function initItems() {
        items = menu.querySelectorAll('option');
        currentOption = 1;
        select = items[currentOption];
        select.classList.add("highlight");
        menu.value=select.value;
    }
    let currentOption;
    let select;
    let items;
    initItems();
}
