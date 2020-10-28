import {Item as Abstract} from "./item";
import {Rect} from "../scene/element/rect";
import {Ellipse} from "../scene/element/ellipse";
import {CELL_SIZE, data, sceneNet, selected} from "../app";
import {Line} from "../scene/element/line";


export class Wall extends Abstract
{
    constructor(props) {
        props.zIndex = 1;
        super(props);

        this.state.width = props.width || CELL_SIZE;
        this.state.height = props.height || 0;
        this.state.axisLeft = props.axisLeft || 0;
        this.state.axisTop = props.axisTop || 0;
        this.state.float = true;

        this.transformDelay = false;
        this.placed = false;

        this.getChildren();
    }

    getChildren() {
        this.add(new Rect({
            width: this.width + 20,
            height: this.height + 20,
            left: -10,
            top: -10,
            name: 'wall-bg'
        }));
        this.add(new Rect({
            float: true,
            width: this.width,
            height: 3,
            fill: 'black',
            name: 'wall',
            top: -1.5,
        }));
        this.add(new Ellipse({
            float: true,
            width: 8,
            height: 8,
            left: -4,
            top: -4,
            fill: 'black',
            name: 'wall-left'
        }));
        this.add(new Ellipse({
            float: true,
            width: 8,
            height: 8,
            left: this.width - 4,
            top: -4,
            fill: 'black',
            name: 'wall-right'
        }));
    }

    focus() {
        this.blur();
        const bg = this.find('wall-bg');
        bg.update({strokeStyle: 'blue', strokeWidth: 1});
        this.selectBox = true;
        selected.push(this);
    }

    blur() {
        for(let i=0; i < selected.length; i++){
            if(selected[i] === this) {
                selected.splice(i, 1);
                this.find('wall-bg').update({strokeStyle: 'transparent', strokeWidth: 0});
                if(this.selectBox) {
                    this.selectBox = null;
                }
            }
        }
    }

    revolve() {

    }

    drag(e) {

        let closestX = -1;
        let closestY = -1;
        const box = this.box;

        for(let i = 0 ; i < sceneNet.x.length; i++) {
            if(
                Math.abs((this.initialDrag.x + (e.nodeX - data.x)) - sceneNet.x[i]) <= CELL_SIZE/2
                &&
                box.left >= sceneNet.x[0]
                &&
                box.left + box.width <= sceneNet.x[sceneNet.x.length-1]
            ) {
                closestX = i;
                break;
            }
        }
        for(let i = 0 ; i < sceneNet.y.length; i++) {
            if(
                Math.abs((this.initialDrag.y + (e.nodeY - data.y)) - sceneNet.y[i]) <= CELL_SIZE/2
                &&
                box.top >= sceneNet.y[0]
                &&
                box.top + box.height <= sceneNet.y[sceneNet.y.length-1]
            ) {
                closestY = i;
                break;
            }
        }
        if(closestX !== -1 && closestY !== -1) {
            if(this.state.left !== sceneNet.x[closestX] || this.state.top !== sceneNet.y[closestY])
                this.update({left: sceneNet.x[closestX], top: sceneNet.y[closestY]});
            this.placed = true;
        } else {
            super.drag(e);
            this.placed = false;
        }
    }

    transformLeft(e) {
        const width = this.width;
        let offset = 0;
        let transformed = false;
        switch(this.state.rotate) {
            case 270:
                offset = e.nodeX - this.left;
                if(offset > width) {
                    this.update({rotate: 180, left: this.state.left + width, top: this.state.top - width});
                    transformed = true;
                } else if(offset < -1*width) {
                    this.update({rotate: 0, left: this.state.left - width, top: this.state.top - width});
                    transformed = true;
                }
                break;
            case 90:
                offset = e.nodeX - this.left;
                if(offset > width) {
                    this.update({rotate: 180, left: this.state.left + width, top: this.state.top + width});
                    transformed = true;
                } else if(offset < -1*width) {
                    this.update({rotate: 0, left: this.state.left - width, top: this.state.top + width});
                    transformed = true;
                }
                break;
            case 180:
                offset = e.nodeY - this.top;
                if(offset > width) {
                    this.update({rotate: 270, left: this.state.left - width, top: this.state.top + width});
                    transformed = true;
                } else if(offset < -1*width) {
                    this.update({rotate: 90, left: this.state.left - width, top: this.state.top - width});
                    transformed = true;
                }
                break;
            default:
                offset = e.nodeY - this.top;
                if(offset > width) {
                    this.update({rotate: 270, left: this.state.left + width, top: this.state.top + width});
                    transformed = true;
                } else if(offset < -1*width) {
                    this.update({rotate: 90, left: this.state.left + width, top: this.state.top - width});
                    transformed = true;
                }
        }
        return transformed;
    }

    transformRight(e) {
        const width = this.width;
        let offset = 0;
        let transformed = false;
        switch(this.state.rotate) {
            case 270:
            case 90:
                offset = e.nodeX - this.left;
                if(offset > width) {
                    this.update({rotate: 0});
                    transformed = true;
                } else if(offset < -1*width) {
                    this.update({rotate: 180});
                    transformed = true;
                }
                break;
            case 180:
            default:
                offset = e.nodeY - this.top;
                if(offset > width) {
                    this.update({rotate: 90});
                    transformed = true;
                } else if(offset < -1*width) {
                    this.update({rotate: 270});
                    transformed = true;
                }
        }
        return transformed;
    }

    pushLeft(e) {
        const right = this.find('wall-right');
        const bg = this.find('wall-bg');
        const wall = this.find('wall');
        let width = -1;
        switch(this.state.rotate) {
            case 270:
                if(e.nodeY > this.top + CELL_SIZE/2) {
                    width = this.width + CELL_SIZE;
                    this.update({top: this.top + CELL_SIZE, width: width});
                } else if(this.width > CELL_SIZE && e.nodeY < this.top - CELL_SIZE/2) {
                    width = this.width - CELL_SIZE;
                    this.update({top: this.top - CELL_SIZE, width: width});
                }
                break;
            case 90:
                if(e.nodeY < this.top - CELL_SIZE/2) {
                    width = this.width + CELL_SIZE;
                    this.update({top: this.top - CELL_SIZE, width: width});
                } else if(this.width > CELL_SIZE && e.nodeY > this.top + CELL_SIZE/2) {
                    width = this.width - CELL_SIZE;
                    this.update({top: this.top + CELL_SIZE, width: width});
                }
                break;
            case 180:
                if(e.nodeX > this.left + CELL_SIZE/2) {
                    width = this.width + CELL_SIZE;
                    this.update({left: this.left + CELL_SIZE, width: width});
                } else if(this.width > CELL_SIZE && e.nodeX < this.left - CELL_SIZE/2) {
                    width = this.width - CELL_SIZE;
                    this.update({left: this.left - CELL_SIZE, width: width});
                }
                break;
            default:
                if(e.nodeX < this.left - CELL_SIZE/2) {
                    width = this.width + CELL_SIZE;
                    this.update({left: this.left - CELL_SIZE, width: width});
                } else if(this.width > CELL_SIZE && e.nodeX > this.left + CELL_SIZE/2) {
                    width = this.width - CELL_SIZE;
                    this.update({left: this.left + CELL_SIZE, width: width});
                }
        }
        if(width !== -1) {
            bg.update({width: width + 20});
            wall.update({width: width });
            right.update({left: width - 4});
        }
    }

    pushRight(e) {
        const right = this.find('wall-right');
        const bg = this.find('wall-bg');
        const wall = this.find('wall');
        let width = -1;
        switch(this.state.rotate) {
            case 270:
                if(this.top - e.nodeY> this.width + CELL_SIZE/2) {
                    width = this.width + CELL_SIZE;
                    this.update({width: width});
                } else if(this.width > CELL_SIZE && this.top - e.nodeY < this.width - CELL_SIZE/2) {
                    width = this.width - CELL_SIZE;
                    this.update({width: width});
                }
                break;
            case 90:
                if(e.nodeY > this.top + this.width + CELL_SIZE/2) {
                    width = this.width + CELL_SIZE;
                    this.update({width: width});
                } else if(this.width > CELL_SIZE && e.nodeY < this.top + this.width - CELL_SIZE/2) {
                    width = this.width - CELL_SIZE;
                    this.update({width: width});
                }
                break;
            case 180:
                if(e.nodeX < this.left - this.width - CELL_SIZE/2) {
                    width = this.width + CELL_SIZE;
                    this.update({width: width});
                } else if(this.width > CELL_SIZE && e.nodeX > this.left - this.width + CELL_SIZE/2) {
                    width = this.width - CELL_SIZE;
                    this.update({width: width});
                }
                break;
            default:
                if(e.nodeX > this.left + this.width + CELL_SIZE/2) {
                    width = this.width+CELL_SIZE;
                    this.update({width: width});
                } else if(this.width > CELL_SIZE && e.nodeX < this.left + this.width - CELL_SIZE/2) {
                    width = this.width-CELL_SIZE;
                    this.update({width: width});
                }
        }
        if(width !== -1) {
            bg.update({width: width + 20});
            wall.update({width: width});
            right.update({left: width - 4});
        }
    }

    transform(e) {
        if(this.placed) {
            const transformed = this.transformDelay ? false : (data === 'wall-left' ? this.transformLeft(e) : this.transformRight(e));
            if (!transformed) {
                data === 'wall-left' ? this.pushLeft(e) : this.pushRight(e);
            } else {
                this.transformDelay = setTimeout(() => {
                    this.transformDelay = false;
                }, 200);
            }
        }
    }


}