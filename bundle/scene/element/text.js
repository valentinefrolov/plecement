import {Rect} from "./rect";

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

export class Text extends Rect
{
    constructor(props) {
        super(props);

        if(props.text === undefined) throw new Error('text must be defined for element Text');

        this.state.text = props.text;
        this.state.font = props.font || '14px sans-serif';
        this.state.height = parseInt(this.state.font);
        this.state.width = getTextWidth(this.state.text, this.state.font);

    }

    draw(ctx) {

        ctx.beginPath();

        ctx.font = this.state.font;

        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.fillText(this.state.text, this.left, this.top);

        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeText(this.state.text, this.left, this.top);

        ctx.closePath();

        this.state.width = getTextWidth(this.state.text, this.state.font);
    }
}