import {Element} from "../scene/element";
import {Rect} from "../scene/element/rect";
import {Line} from "../scene/element/line";
import {Ellipse} from "../scene/element/ellipse";
import {selected, data, STATE_ROTATE, STATE_TRANSFORM, STATE_TRANSLATE} from "../app";

export class Item extends Element
{
    constructor(props) {
        super(props);
        this._initialZIndex = props.zIndex;
        this.selectBox = null;
        this.initialDrag = {};
    }

    draw(ctx) {

    }

    toFirst() {
        let maxZIndex = 0;
        for(let i=0; i < this.parent.children.length; i++) {
            if(maxZIndex < this.parent.children[i]._zIndex) {
                maxZIndex = this.parent.children[i]._zIndex;
            }
        }
        this.zIndex(maxZIndex+1);
    }

    focus() {
        this.blur();
        let minX = 99999999999,
            minY = 99999999999,
            maxX = -9999999999,
            maxY = -9999999999;
        const chain = this.reverseChain;
        for(let i = 0; i < chain.length; i++) {
            if(chain[i].left < minX) {
                minX = chain[i].left;
            }
            if(chain[i].top < minY) {
                minY = chain[i].top
            }
            if(chain[i].width + chain[i].left > maxX) {
                maxX = chain[i].width + chain[i].left;
            }
            if(chain[i].height + chain[i].top > maxY) {
                maxY = chain[i].height + chain[i].top
            }
        }
        const left = minX - this.left - 5;
        const top = minY - this.top - 5;
        const width = maxX + 10 - this.left;
        const height = maxY + 10 - this.top;

        this.selectBox = new Rect({
            left: left,
            top: top,
            width: width,
            height: height,
            strokeStyle: 'blue',
            strokeWidth: 1,
            zIndex: -1
        });

        const line = new Line({
           coords: [
               {
                   left: width/2,
                   top: -10
               },
               {
                   left: width/2,
                   top: 0
               },
           ],
           strokeStyle: 'blue'
        });

        const circle = new Ellipse({
            left: width/2 - 5,
            top: top - 10 - 5,
            width: 10,
            height: 10,
            fill: '#00ff00',
            strokeWidth: 1,
            strokeStyle: 'blue',
            name: 'rotate'
        });

        this.selectBox.add(line);
        this.selectBox.add(circle);
        this.add(this.selectBox);
        selected.push(this);
    }

    blur() {
        for(let i=0; i < selected.length; i++){
            if(selected[i] === this) {
                selected.splice(i, 1);
                if(this.selectBox) {
                    this.selectBox.remove();
                    this.selectBox = null;
                }
            }
        }
    }

    revolve(e) {
        const x = e.nodeX - data.x;
        const y = e.nodeY - data.y;
        const angle = -1 * Math.atan(x / y) * 180 / Math.PI - (y >= 0 ? 180 : 0);
        this.update({rotate: angle});
    }

    drag(e) {

        this.update({
            left: this.initialDrag.x + (e.nodeX - data.x),
            top: this.initialDrag.y + (e.nodeY - data.y)
        });
    }

    getState(e) {
        if(e.element.name === 'rotate') {
            this.focus();
            return {
                state: STATE_ROTATE,
                data: {x: this.left + this.state.axisLeft, y: this.top + this.state.axisTop}
            };
        } else if(e.element.name === 'wall-left' || e.element.name === 'wall-right') {
            for (let i = selected.length - 1; i >= 0; i--) if(selected[i] !== this) selected[i].blur();
            this.focus();
            return {
                state: STATE_TRANSFORM,
                data: e.element.name
            }
        } else {
            this.focus();
            for(let i = 0; i < selected.length; i++) {
                selected[i].initialDrag = {x: selected[i].left, y: selected[i].top};
            }
            const data = {
                x: e.nodeX,
                y: e.nodeY
            };
            return {
                state: STATE_TRANSLATE,
                data: data
            };
        }
    }

    props() {
        return {
            left: 'l',
            top: 't',
            rotate: 'r',
            width: 'w',
            height: 'h'
        }
    }

    serialize() {
        let line = '&__n:'+this.constructor.name;
        const props = this.props();
        for(let i in this.state) {
            if(this.state.hasOwnProperty(i) && props.hasOwnProperty(i)) {

            }
        }
    }
}