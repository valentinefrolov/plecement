import {Rect} from "./rect";

export class Ellipse extends Rect
{

    constructor(props) {
        super(props);

        this.state.fill = props.fill || 'transparent';
        this.state.strokeWidth = props.strokeWidth === undefined ? 1 : props.strokeWidth;
        this.state.strokeStyle = props.strokeStyle === undefined ? 'black' : props.strokeStyle;
    }


    draw(ctx) {

        const center = {
            x: this.left + (this.width/2),
            y: this.top + (this.height/2),
        };

        ctx.beginPath();

        ctx.ellipse(center.x, center.y, this.width/2, this.height/2, 0, 0, 2 * Math.PI);

        ctx.fillStyle = this.fill;
        ctx.fill();

        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();

        ctx.stroke();
    }


}