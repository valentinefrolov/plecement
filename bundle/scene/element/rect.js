import {Element as Abstract} from "../element";

export class Rect extends Abstract
{
    constructor(props) {
        super(props);

        this.state.fill = props.fill || 'transparent';
        this.state.strokeWidth = props.strokeWidth || 0;
        this.state.strokeStyle = props.strokeStyle || 'transparent';
    }

    get fill() {
        return this.state.fill;
    }

    get strokeWidth() {
        return this.state.strokeWidth;
    }

    get strokeStyle() {
        return this.state.strokeStyle;
    }

    draw(ctx) {
        ctx.beginPath();

        const pos = {
            left: this.state.float ? this.left : parseInt(this.left)+.5,
            top: this.state.float ? this.top : parseInt(this.top)+.5,
            width: this.state.float ? this.width : parseInt(this.width),
            height: this.state.float ? this.height : parseInt(this.height),
        };

        ctx.rect(pos.left, pos.top, pos.width, pos.height);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
        ctx.closePath();
    }


}