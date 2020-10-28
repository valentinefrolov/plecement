import {Element as Abstract} from "../element";

export class Path extends Abstract
{
    constructor(props) {
        super(props);

        if(props.path === undefined) throw new Error('coords must be defined for Line');

        this.state.path = props.path;
        this.state.strokeWidth = props.strokeWidth || 1;
        this.state.strokeStyle = props.strokeStyle || 'black';
        this.state.fill = props.fill || null;

        this.getSize();

        if(props.axisLeft === undefined) this.state.axisLeft = this.width / 2;
        if(props.axisTop === undefined) this.state.axisTop = this.height / 2;
    }

    getSize() {
        const x = [], y =[];
        for(let i=0;i < this.state.path.length; i++) {
            x.push(this.state.path[i][0]);
            y.push(this.state.path[i][1]);
        }
        this.state.width = Math.max(...x) - Math.min(...x);
        this.state.height = Math.max(...y) - Math.min(...x);
    }

    get path () {
        return this.state.path;
    }

    get strokeWidth() {
        return this.state.strokeWidth;
    }

    get strokeStyle() {
        return this.state.strokeStyle;
    }

    get fill() {
        return this.state.fill;
    }

    draw(ctx) {
        ctx.beginPath();

        for(let i =0 ; i < this.path.length; i++) {
            if(i === 0) {
                ctx.moveTo(this.left + this.state.path[i][0], this.top + this.state.path[i][1]);
            } else {
                ctx.lineTo(this.left + this.state.path[i][0], this.top + this.state.path[i][1]);
            }
        }

        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();

        if(this.fill) {
            ctx.fillStyle = this.fill;
            ctx.fill();
        }

        ctx.closePath();




    }

    update(props, flow) {
        if(!flow) this.getSize();
        super.update(props, flow);
    }
}