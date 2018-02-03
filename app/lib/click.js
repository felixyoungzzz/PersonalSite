let biggestZindex = 4;
export function addClickListener(els) {
    clickTochange(els[0], els[1], els[2], els[3]);
    clickTochange(els[1], els[0], els[2], els[3]);
    clickTochange(els[2], els[0], els[1], els[3]);
    clickTochange(els[3], els[0], els[1], els[2]);

    let buttons = []
    els.forEach(function (el, index) {
        let button = $(el).find('.circle').first();
        button.click(() => {
            el.style.display = 'none';
        });
        buttons.push(button);
    });
}

function clickTochange(el1, el2, el3, el4) {

    el1.addEventListener('mousedown', () => {
        el1.style.zIndex = biggestZindex + 1;
        biggestZindex++;

        changeToClickedStyle(el1);
        changeToUnclickedStyle(el2);
        changeToUnclickedStyle(el3);
        changeToUnclickedStyle(el4);
    });
}

function changeToClickedStyle(el) {
    let header = $(el).children('.header').first();
    let title = $(el).find('.title').first();
    let buttons = $(el).find('.circle');
    let buttonStyle = ['red', 'yellow', 'green'];
    toggleclass(header, 'header-unclicked', 'header-clicked');
    toggleclass(title, 'title-unclicked', 'title-clicked');
    for (let i = 0; i < 3; i++) {
        toggleclass(buttons[i], 'gray', buttonStyle[i]);
    }
}

function changeToUnclickedStyle(el) {
    let header = $(el).children('.header').first();
    let title = $(el).find('.title').first();
    let buttons = $(el).find('.circle');
    let buttonStyle = ['red', 'yellow', 'green'];
    toggleclass(header, 'header-clicked', 'header-unclicked');
    toggleclass(title, 'title-clicked', 'title-unclicked');
    for (let i = 0; i < 3; i++) {
        toggleclass(buttons[i], buttonStyle[i], 'gray');
    }
}

function toggleclass(el, class1, class2) {
    $(el).removeClass(class1).addClass(class2);
}

export function changeEditor(el1, el2) {
    el1.style.zIndex = 4;
    el2.style.zIndex = 3;
    changeToClickedStyle(el1);
    changeToUnclickedStyle(el2);
}