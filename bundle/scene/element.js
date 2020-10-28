import {Box} from "./box";
import {Scene} from "./scene";
import {Layer} from "./layer";

function toRad(deg) {
    return deg * Math.PI / 180;
}

export class Element extends Box
{
    constructor(props) {
        super(props);

        this._renderLeft = false;
        this._renderTop = false;
        this._shouldReCalc = true;
        this._points = [];

        this.state.float = props.float || false;
        this.state.opacity = props.opacity !== undefined ? props.opacity : 1;
        this.state.rotate = props.rotate || 0;
        this.state.axisLeft = props.axisLeft === undefined ?  this.width / 2 : props.axisLeft;
        this.state.axisTop = props.axisTop === undefined ? this.height / 2 : props.axisTop;
    }

    get width() {
        return this.state.float ? this.state.width : Math.ceil(this.state.width);
    }

    get height() {
        return this.state.float ? this.state.height : Math.ceil(this.state.height);
    }

    get left() {
        if(this._renderLeft !== false) return this._renderLeft;
        return this.parent.left + (this.state.float ? this.state.left : Math.floor(this.state.left));
    }
    get top() {
        if(this._renderTop !== false) return this._renderTop;
        return this.parent.top + (this.state.float ? this.state.top : Math.floor(this.state.top));
    }

    get points() {

        if(this._shouldReCalc || !this._points.length) {
            if(this.rotate !== 0) {
                
                const center = this.center();

                const ltAngle = Math.atan(-this.state.axisTop / -this.state.axisLeft) || 0;
                const ltVector = -this.state.axisTop / Math.sin(ltAngle) ||
                    -this.state.axisLeft / Math.cos(ltAngle);

                const lt = {
                    left: center.x + ltVector * Math.cos(toRad(this.rotate) + ltAngle),
                    top: center.y + ltVector * Math.sin(toRad(this.rotate) + ltAngle),
                };

                const rtAngle = Math.atan((this.state.width - this.state.axisLeft) / -this.state.axisTop) || 0;
                const rtVector = (this.state.width - this.state.axisLeft) / Math.sin(rtAngle) ||
                    -this.state.axisTop / Math.cos(rtAngle);
                const rt = {
                    left: center.x + rtVector * Math.sin(rtAngle - toRad(this.rotate)),
                    top: center.y + rtVector * Math.cos(rtAngle - toRad(this.rotate)),
                };

                const rbAngle = Math.atan((this.state.height - this.state.axisTop) / (this.state.width - this.state.axisLeft)) || 0;
                const rbVector = (this.state.height - this.state.axisTop) / Math.sin(rbAngle) ||
                    (this.state.width - this.state.axisLeft) / Math.cos(rbAngle);
                const rb = {
                    left: center.x + rbVector * Math.cos(toRad(this.rotate) + rbAngle),
                    top: center.y + rbVector * Math.sin(toRad(this.rotate) + rbAngle),
                };

                const lbAngle = Math.atan(-this.state.axisLeft / (this.state.height - this.state.axisTop)) || 0;
                const lbVector = -this.state.axisLeft / Math.sin(lbAngle) ||
                    (this.state.height - this.state.axisTop) / Math.cos(lbAngle);
                const lb = {
                    left: center.x + lbVector * Math.sin(lbAngle - toRad(this.rotate)),
                    top: center.y + lbVector * Math.cos(lbAngle - toRad(this.rotate)),
                };
                this._points = [lt, rt, rb, lb];
            } else {
                this._points = super.points;
            }
            this._shouldReCalc = false;
        }
        return this._points;
    }

    get rotate() {
        return this.state.rotate + (this.parent instanceof Element ? this.parent.rotate : 0);
    }

    render(ctx) {
        const translateLeft = this.state.left + this.state.axisLeft - (this.parent instanceof Element ? this.parent.state.axisLeft : 0 ) ;
        const translateTop = this.state.top + this.state.axisTop - (this.parent instanceof Element ? this.parent.state.axisTop : 0) ;

        ctx.save();
        ctx.translate(translateLeft, translateTop);
        ctx.rotate(toRad(this.state.rotate));

        this._renderLeft = -this.state.axisLeft;
        this._renderTop = -this.state.axisTop;

        if(this.state.opacity !== 1) {
            ctx.globalAlpha = this.state.opacity;
        }

        this.draw(ctx);

        this._renderLeft = false;
        this._renderTop = false;

        for(let i = 0; i < this.children.length; i++) {
            this.children[i].render(ctx);
        }

        ctx.restore();
        super.render();
        /*if(this.state.rotate !== 0) {

        } else {
            if(this.state.opacity !== 1) {
                ctx.globalAlpha = this.state.opacity;
            }
            this.draw(ctx);
            for(let i = 0; i < this.children.length; i++) {
                this.children[i].render(ctx);
            }
        }*/
    }

    add(element)  {
        if(!(element instanceof Element)) throw new Error('element added to Element must be instance of Element');
        let item = this;
        while(true) {
            if(item === element) throw new Error('element can not be nested');
            if(item.parent instanceof Element) {
                item = item.parent;
            } else {
                break;
            }
        }
        if(this.float && !element.float) element.float = true;
        super.add(element);
    }

    draw(ctx) {
        throw new Error('Draw method must be defined in class ' + this.constructor.name);
    }

    center() {
        if(this.parent instanceof Element) {
            const leftRay = this.state.left + this.state.axisLeft - this.parent.state.axisLeft;
            const topRay = this.state.top + this.state.axisTop - this.parent.state.axisTop;
            const angle = (Math.atan(topRay/leftRay) || 0);
            const vector = topRay/Math.sin(angle) || leftRay/Math.cos(angle);
            const parentCenter = this.parent.center();
            return {
                x: parentCenter.x + vector*Math.cos(angle + toRad(this.rotate - this.state.rotate)),
                y: parentCenter.y + vector*Math.sin(angle + toRad(this.rotate - this.state.rotate))
            };
        }
        return {x: this.left + this.state.axisLeft, y: this.top + this.state.axisTop};
    }

    update(props, flow) {
        if(!flow) {
            for(let i = 0; i < this.children.length; i++) {
                this.children[i].update({}, flow);
            }
            this._shouldReCalc = true;
        }
        super.update(props, flow);
    }

    remove() {
        if(this.parent) {
            for (let i = 0; i < this.parent._children.length; i++) {
                let parent = this.parent;
                if (parent._children[i] === this) {
                    parent.clearReverseChain();
                    parent._children.splice(i, 1);
                    parent.update({}, this);
                    while (!(parent instanceof Scene)) parent = parent.parent;
                    parent.event.unRegister(this);
                    break;
                }
            }
        } else {
            this._delay.push({
                method: this.remove,
                arguments: []
            });
        }
    }

}