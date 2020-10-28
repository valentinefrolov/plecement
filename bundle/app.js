import {Scene} from './scene/scene';
import {Layer} from "./scene/layer";
import {Line} from "./scene/element/line";
import {Rect} from "./scene/element/rect";
import {Text} from "./scene/element/text";
import {Wall} from "./app/wall";
import {Img} from "./app/img";
import {Panel} from "./app/panel";
import {Item} from "./app/item";
import {fillMenu, fillWorkplace} from "./init";
import {Curtain} from "./app/curtain";
import {Door} from "./app/door";

export function points(element, layer, fill='red') {
    const box = element.box;

    const dot0 = new Rect({width:4, height: 4, left: box.left - 2, top: box.top - 2, fill: fill});
    const dot1 = new Rect({width:4, height: 4, left: box.left + box.width - 2, top: box.top - 2, fill: fill});
    const dot2 = new Rect({width:4, height: 4, left: box.left + box.width - 2, top: box.top + box.height - 2, fill: fill});
    const dot3 = new Rect({width:4, height: 4, left: box.left - 2, top: box.top + box.height - 2, fill: fill});

    layer.add(dot0);
    layer.add(dot1);
    layer.add(dot2);
    layer.add(dot3);

}

export const CELL_SIZE = 42;
export const COLUMN_COUNT = 14;
export const ROW_COUNT = 7;
export const WORKPLACE_PADDING = 40;
export const WIDTH = CELL_SIZE*COLUMN_COUNT+2*WORKPLACE_PADDING;
export const MENU_HEIGHT = 280;
export const WORKPLACE_HEIGHT = CELL_SIZE*ROW_COUNT+2*WORKPLACE_PADDING;

const scene = new Scene({node: document.getElementById('Scene')});
const menu = new Layer({width: WIDTH, height: MENU_HEIGHT, top: 0, name: 'menu'});
const workplace = new Layer({width: WIDTH, height: WORKPLACE_HEIGHT, top: MENU_HEIGHT});
const layer = new Layer({width: WIDTH, height: MENU_HEIGHT+WORKPLACE_HEIGHT, top: 0, name: 'layer'});

scene.add(menu);
scene.add(workplace);
scene.add(layer);


const classMap = {
    'Img': Img,
    'Panel': Panel,
    'Wall': Wall,
    'Curtain': Curtain,
    'Door': Door
};

fillMenu(menu);
export const sceneNet = fillWorkplace(workplace);

export const STATE_NONE  = -1;
export const STATE_TRANSLATE = 1;
export const STATE_TRANSFORM = 3;
export const STATE_ROTATE = 4;
export const STATE_SELECT = 5;
export const STATE_RESIZE = 6;


let state = STATE_NONE;
let selectBox = null;
let concat = false;
let callback = null;

export let data = null;
export const selected = [];
const copies = [];
let copyStart = false;

function checkInBox(box, element) {
    const elBox = element.box;
    if(
        box.left > elBox.left ||
        box.top > elBox.top ||
        box.left + box.width < elBox.left + elBox.width ||
        box.top + box.height < elBox.top + elBox.height
    ) return false;

    for(let i=0; i < element.children.length; i++) {
        if(!checkInBox(box, element.children[i])) return false;
    }
    return true;
}

function root(el) {
    while(el.parent && !(el.parent instanceof Layer)) {
        el = el.parent;
    }
    return el;
}

scene.node.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('mouseup', () => {
    state = STATE_NONE;
    if(selectBox) {
        selectBox.remove();
        selectBox = null;
    }
});

document.addEventListener('keydown', (e) => {
    if(e.keyCode === 16) {
        concat = true;
    } else if(e.keyCode === 17) {
        concat = true;
        copyStart = true;
    }
});

document.addEventListener('keyup', (e) => {
    if(e.keyCode === 17) {
        copyStart = false;
    } else if(e.keyCode === 67 && copyStart) {
        if(selected.length) {
            copies.splice(0, copies.length);
            for(let i = 0; i < selected.length; i++) copies.push(selected[i]);
        }
    } else if(e.keyCode === 86 && copyStart) {
        for(let i = selected.length-1; i >= 0; i--) selected[i].blur();
        for(let i =0; i < copies.length; i++) {
            const copy = new classMap[copies[i].constructor.name](copies[i].state);
            layer.add(copy);
            copy.focus();
        }
        copyStart = false;
    } else if(e.keyCode === 46) {
        for(let i = selected.length-1; i >= 0; i--) {
            selected[i].remove();
            selected[i].blur();
        }
    }

});

menu.addEventListener('mousedown', (e) => {
    for(let i = selected.length-1; i >=0 ; i--) selected[i].blur();
    const el = root(e.element);
    if(el instanceof Item) {
        const element = new classMap[el.constructor.name](el.state);
        layer.add(element);
        //const res = element.getState(e);
        element.focus();
        state = STATE_TRANSLATE;
        data = {x: e.nodeX, y: e.nodeY};
    }
}, scene.node);

layer.addEventListener('mousedown', (e) => {

    const el = root(e.element);
    if(el instanceof Item) {
        if(!concat) for(let i = selected.length-1; i >= 0; i--) selected[i].blur();
        const res = el.getState(e);
        state = res.state;
        data = res.data;
        callback = res.callback;
        el.toFirst();
    } else if(e.element instanceof Layer){
        for(let i= selected.length-1; i >= 0; i--) selected[i].blur();
        data = {x:  e.nodeX, y: e.nodeY};
        state = STATE_SELECT;
        selectBox = new Rect({width: 1, height: 1, left: e.nodeX, top: e.nodeY, strokeStyle: 'gray', strokeWidth: 1});
        concat = true;
        layer.add(selectBox);
    }
});

layer.addEventListener('mousemove', (e) => {
    switch(state) {
        case STATE_RESIZE:
            for (let i = 0; i < selected.length; i++) {
                selected[i][callback](e);
            }
            break;
        case STATE_ROTATE :
            for (let i = 0; i < selected.length; i++) {
                selected[i].revolve(e);
            }
            break;
        case STATE_TRANSFORM:
            for (let i = 0; i < selected.length; i++) {
                selected[i].transform(e);
            }
            break;
        case STATE_SELECT:
            const startX = data.x;
            const startY = data.y;
            const endX = e.nodeX;
            const endY = e.nodeY;

            const left = Math.min(startX, endX);
            const width = Math.max(startX, endX) - left;
            const top = Math.min(startY, endY);
            const height = Math.max(startY, endY) - top;

            selectBox.update({left: left, top: top, width: width, height: height});
            break;
        case STATE_TRANSLATE:

            for(let i=0; i< selected.length; i++) selected[i].drag(e);
    }
});

layer.addEventListener('mouseup', (e) => {
    e.original.stopPropagation();
    switch(state) {
        case STATE_SELECT:
            for(let i = 0; i <= layer.children.length; i++) {
                if(layer.children[i] instanceof Item && checkInBox(selectBox, layer.children[i])) {
                    layer.children[i].focus();
                }
            }
            selectBox.remove();
            selectBox = null;
            break;
        case STATE_TRANSLATE:
            for(let i = selected.length-1; i>= 0; i--) {
                const box = selected[i].box;
                if(box.top + box.height < MENU_HEIGHT) {
                    selected[i].remove();
                    selected[i].blur();
                } else {
                    selected[i].focus();
                }
            }
            if(selected.length <= 1) concat = false;
            break;
        default:
            if(selected.length <= 1) concat = false;
    }
    state = STATE_NONE;
    for(let i = 0; i < layer.children.length; i++) {
        if(layer.children[i] instanceof Item) {
            layer.children[i].zIndex(layer.children[i]._initialZIndex);
        }
    }
});



































