import {Item as Abstract} from "./item";

export class Img extends Abstract
{
    constructor(props) {
        props.zIndex = 2;
        super(props);
        if(props.src === undefined) throw new Error('src must be defined for Img');
        this.state.src = props.src;
        this._img = new Image();
        this._img.onload = () => {
            if(!this.state.width) {
                this.state.width = this._img.width;
                if(props.axisLeft === undefined) {
                    this.state.axisLeft = this.state.width /2;
                }
            }
            if(!this.state.height) {
                this.state.height = this._img.height;
                if(props.axisTop === undefined) {
                    this.state.axisTop = this.state.height /2;
                }
            }

            this.update({}, true);
        };
        this._img.src = props.src;
    }

    props() {
        let obj = super.props();
        obj.src = 'src';
        return obj;
    }

    draw(ctx) {
        ctx.drawImage(this._img, this.left, this.top, this.width, this.height);
    }
}