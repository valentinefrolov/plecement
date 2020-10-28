import {Curtain} from "./curtain";
import {Rect} from "../scene/element/rect";
import {Path} from "../scene/element/path";
import {Ellipse} from "../scene/element/ellipse";

export class Door extends Curtain
{
    getChildren() {

        this.add(new Rect({
            width: this.width + 20,
            height: this.height + 20,
            left: -10,
            top: -10,
            name: 'wall-bg'
        }));
        this.add(new Path({path:[
                [0, 0],
                [this.width, 0]
            ],
            strokeWidth: 2,
            name: 'wall'
        }));
        this.add(new Path({path:[
                [this.width, 0],
                [11, 13]
            ],
            strokeWidth: 2,
        }));
        this.add(new Ellipse({
            float: true,
            width: 6,
            height: 6,
            left: -3,
            top: -3,
            fill: 'white',
            name: 'wall-left',
            strokeWidth: 1,
            strokeStyle: 'black'

        }));
        this.add(new Ellipse({
            float: true,
            width: 6,
            height: 6,
            left: this.width - 3,
            top: -3,
            fill: 'white',
            name: 'wall-right',
            strokeWidth: 1,
            strokeStyle: 'black'
        }));
    }
}