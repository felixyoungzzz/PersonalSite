
export function createItem(items, itemMsg) {
    let itemsHtml = document.querySelector('.items');
    for (let i = 0; i < items.length; i++) {
        let item = document.createElement('div');
        item.setAttribute('class', 'item animated fadeInUp');
        item.setAttribute('id', 'item' + i);
        item.innerHTML = itemMsg.replace(/clip-x/, 'clip-' + i).replace(/clip-x/, 'clip-' + i);
        let link=document.createElement('a');
        link.setAttribute('href',items[i].href);
        link.setAttribute('target','_blank');
        itemsHtml.appendChild(link);
        link.appendChild(item);
        document.querySelectorAll('#item' + i + ' text').forEach(function (item) {
            item.textContent = items[i].text;
        });
        document.querySelector('#item' + i + ' image').setAttribute('xlink:href', items[i].path);
        document.querySelector('#item'+i).style.background='url('+items[i].bgpath+') no-repeat';
    }
}

export function addSVGmousemoveListener() {
    let items = [],
        point = document.querySelector('svg').createSVGPoint();

    function getCoordinates(e, svg) {
        point.x = e.clientX;
        point.y = e.clientY;
        return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    function Item(config) {
        Object.keys(config).forEach(function (item) {
            this[item] = config[item];
        }, this);
        this.el.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    }

    Item.prototype = {
        update: function update(c) {
            this.clip.setAttribute('cx', c.x);
            this.clip.setAttribute('cy', c.y);
        },
        mouseMoveHandler: function mouseMoveHandler(e) {
            this.update(getCoordinates(e, this.svg));
        },

    };

    [].slice.call(document.querySelectorAll('.item'), 0).forEach(function (item, index) {
        items.push(new Item({
            el: item,
            svg: item.querySelector('svg'),
            clip: document.querySelector('#clip-' + index + ' circle'),
        }));
    });
}