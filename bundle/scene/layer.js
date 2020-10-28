import {Box} from "./box";
import {Element} from "./element";
import {prepareOptions} from "./event";

export class Layer extends Box
{
    constructor(props) {
        super(props);

        if(this.width === 0 || this.height === 0) throw new Error('width or height is not defined for Layer');

        this.node = document.createElement('CANVAS');
        this.node.width = this.state.width;
        this.node.height = this.state.height;
        this.node.style.position = 'absolute';
        this.node.style.left = this.state.left + 'px';
        this.node.style.top = this.state.top + 'px';

        this.ctx = this.node.getContext('2d');
    }

    add(element) {
        if(!(element instanceof Element)) throw new Error('element added to Layer must be instance of Element');
        super.add(element);
    }

    render() {
        this.ctx.clearRect(this.left, this.top, this.width, this.height);
        for(let i=0; i < this.children.length; i++) {
            this.children[i].render(this.ctx);
        }
        super.render();
    }

    update(props, flow) {
        const changed = super.update(props, flow);
        if(changed) {
            this.node.width = this.width;
            this.node.height = this.height;
            this.node.style.left = this.left + 'px';
            this.node.style.top = this.top + 'px';
        }
    }

}