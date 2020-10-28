import {Element as Abstract} from "../element";

export class Line extends Abstract
{
    constructor(props) {
        super(props);

        if(props.coords === undefined) throw new Error('coords must be defined for Line');

        this.state.coords = props.coords;
        this.state.strokeWidth = props.strokeWidth || 1;
        this.state.strokeStyle = props.strokeStyle || 'black';

        this._update();

        if(props.axisLeft === undefined) {
            this.state.axisLeft = this.width / 2;
        }

        if(props.axisTop === undefined) {
            this.state.axisTop = this.height / 2;
        }


    }
    
    _update() {
        this.state.left = parseInt(Math.min(this.state.coords[0].left, this.state.coords[1].left));
        this.state.width = parseInt(Math.max(this.state.coords[0].left, this.state.coords[1].left)) - this.state.left;
        this.state.top = parseInt(Math.min(this.state.coords[0].top, this.state.coords[1].top));
        this.state.height = parseInt(Math.max(this.state.coords[0].top, this.state.coords[1].top) - this.state.top);
    }

    update(props, flow){
        super.update(props, flow);
        this._update();
    }
    
    get coords() {
        const coords = [
            {
                left: this.state.coords[0].left - this.state.left - this.state.axisLeft,
                top: this.state.coords[0].top - this.state.top - this.state.axisTop,
            },
            {
                left: this.state.coords[1].left - this.state.left - this.state.axisLeft,
                top: this.state.coords[1].top - this.state.top - this.state.axisTop,
            },
        ];
        if(!this.state.float) {
            coords[0].left = parseInt(coords[0].left)-.5;
            coords[1].left = parseInt(coords[1].left)-.5;
            coords[0].top = parseInt(coords[0].top)-.5;
            coords[1].top = parseInt(coords[1].top)-.5;
        }
        return coords;
    }
    
    get strokeWidth() {
        return this.state.strokeWidth;
    }

    get strokeStyle() {
        return this.state.strokeStyle;
    }

    draw(ctx) {
        ctx.beginPath();

        const coords = this.coords;
        
        ctx.moveTo(coords[0].left, coords[0].top);
        ctx.lineTo(coords[1].left, coords[1].top);

        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();

        ctx.closePath();

    }
}