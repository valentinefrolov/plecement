import {Wall} from "./wall";
import {Rect} from "../scene/element/rect";
import {Line} from "../scene/element/line";
import {Path} from "../scene/element/path";
import {Ellipse} from "../scene/element/ellipse";
import {data} from "../app";

export class Curtain extends Wall
{
    constructor(props) {
        props.zIndex = 1;
        super(props);

    }

    getChildren() {

        this.add(new Rect({
            width: this.width + 20,
            height: this.height + 20,
            left: -10,
            top: -10,
            name: 'wall-bg'
        }));
        this.add(new Path({path:[
                [0, -2],
                [5.5, 3],
                [11, -2],
                [16.5, 3],
                [22, -2],
                [27.5, 3],
                [33, -2],

            ],
            strokeWidth: 2,
            name: 'wall'
        }));
        this.add(new Path({path:[
                [this.width, 0],
                [this.width-10, 5],
                [this.width-10, -5],
            ],
            fill: 'black',
            strokeWidth: 1
        }));
        this.add(new Ellipse({
            float: true,
            width: 8,
            height: 8,
            left: -4,
            top: -4,
            fill: 'transparent',
            name: 'wall-left',
            strokeWidth: 0,
            strokeStyle: 'transparent'

        }));
        this.add(new Ellipse({
            float: true,
            width: 8,
            height: 8,
            left: this.width - 4,
            top: -4,
            fill: 'transparent',
            name: 'wall-right',
            strokeWidth: 0,
            strokeStyle: 'transparent'
        }));
    }

    transform(e) {
        if(this.placed) {
            const transformed = this.transformDelay ? false : (data === 'wall-left' ? this.transformLeft(e) : this.transformRight(e));
            if (transformed) {
                this.transformDelay = setTimeout(() => {
                    this.transformDelay = false;
                }, 200);
            }
        }
    }

}