
import {Text} from "./scene/element/text";
import {Panel} from "./app/panel";
import {Img} from "./app/img";
import {Wall} from "./app/wall";
import {Line} from "./scene/element/line";
import {Rect} from "./scene/element/rect";

import {MENU_HEIGHT, points, WORKPLACE_PADDING} from "./app";
import {WORKPLACE_HEIGHT} from "./app";
import {CELL_SIZE} from "./app";
import {COLUMN_COUNT} from "./app";
import {ROW_COUNT} from "./app";
import {WIDTH} from "./app";
import {Curtain} from "./app/curtain";
import {Door} from "./app/door";


export function fillWorkplace(workplace) {

    const x = [];
    const y = [];

    const background = new Rect({width: WIDTH, height: WORKPLACE_HEIGHT,fill: 'white'});
    workplace.add(background);

    for(let i = 0; i <= COLUMN_COUNT; i++) {
        x.push(i*CELL_SIZE+WORKPLACE_PADDING);
        const line = new Line({coords:[{left: i*CELL_SIZE+WORKPLACE_PADDING,top: WORKPLACE_PADDING},{left:i*CELL_SIZE+WORKPLACE_PADDING,top:ROW_COUNT*CELL_SIZE+WORKPLACE_PADDING}]});
        background.add(line);
    }

    for(let i = 0; i <= ROW_COUNT; i++) {
        y.push(i*CELL_SIZE+WORKPLACE_PADDING+MENU_HEIGHT);
        const line = new Line({coords:[{left: WORKPLACE_PADDING,top: i*CELL_SIZE+WORKPLACE_PADDING},{left:COLUMN_COUNT*CELL_SIZE+WORKPLACE_PADDING,top:i*CELL_SIZE+WORKPLACE_PADDING}]});
        background.add(line);
    }

    return {
        x: x,
        y: y
    }
}




export function fillMenu(menu) {
    menu.add(new Text({text: 'Элемент стен', font: '14px Arial, sans-serif', left: 26, top: 30, fill: 'black'}));
    menu.add(new Text({text: 'Электрическая розетка', font: '14px Arial, sans-serif', left: 235, top: 30, fill: 'black'}));
    menu.add(new Text({text: 'Корзина для мусора', font: '14px Arial, sans-serif', left: 496, top: 30, fill: 'black'}));
    menu.add(new Text({text: 'Фризовая панель с надписью', font: '14px Arial, sans-serif', left:26, top: 81, fill: 'black'}));
    menu.add(new Text({text: 'Дверь', font: '14px Arial, sans-serif', left: 541, top: 81, fill: 'black'}));
    menu.add(new Text({text: 'Архивный шкаф (инфо.)   321 -', font: '14px Arial, sans-serif', left: 26, top: 131, fill: 'black'}));
    menu.add(new Text({text: '320 -', font: '14px Arial, sans-serif', left: 302, top: 131, fill: 'black'}));
    menu.add(new Text({text: 'Вешалка', font: '14px Arial, sans-serif', left: 536, top: 131, fill: 'black'}));
    menu.add(new Text({text: 'Стол со стульями', font: '14px Arial, sans-serif', left: 26, top: 199, fill: 'black'}));
    menu.add(new Text({text: 'Спот-бра', font: '14px Arial, sans-serif', left: 536, top: 199, fill: 'black'}));
    menu.add(new Text({text: 'Витрина     398 (H-2.5m с подсветкой)  -', font: '14px Arial, sans-serif', left: 26, top: 266, fill: 'black'}));
    menu.add(new Text({text: '396 (H-1.8m) -', font: '14px Arial, sans-serif', left: 356, top: 266, fill: 'black'}));
    menu.add(new Text({text: '394 (H-1.1m) -', font: '14px Arial, sans-serif', left: 516, top: 266, fill: 'black'}));



    menu.add(new Wall({left: 138, top: 24}));
    menu.add(new Img({src: '/img/outlet.png', left: 409, top: 20}));
    menu.add(new Img({src: '/img/trash.png', left: 638, top: 10}));
    menu.add(new Panel({left: 242, top: 57, name: 'fromMenu'}));
    menu.add(new Curtain({left: 617, top: 60}));
    menu.add(new Door({left: 617, top: 79}));
    menu.add(new Img({src: '/img/archive.png', left: 241, top: 108}));
    menu.add(new Img({src: '/img/archive1.png', left: 342, top: 110}));
    menu.add(new Img({src: '/img/hanger.png', left: 627, top: 125}));
    menu.add(new Img({src: '/img/table.png', left: 168, top: 170}));
    menu.add(new Img({src: '/img/table1.png', left: 251, top: 166}));
    menu.add(new Img({src: '/img/table2.png', left: 343, top: 168}));
    menu.add(new Img({src: '/img/spot.png', left: 640, top: 178}));
    menu.add(new Img({src: '/img/showcase.png', left: 296, top: 245}));
    menu.add(new Img({src: '/img/showcase1.png', left: 455, top: 245}));
    menu.add(new Img({src: '/img/showcase2.png', left: 620, top: 245}));



}
