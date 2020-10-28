import {Box} from "./box";
import {Layer} from "./layer";
import {Event, prepareOptions} from './event';

export class Scene extends Box
{
    constructor(props) {
        super(props);

        this.node = props.node;
        this.event = new Event(this.node);

        if(!this.node) throw new Error('Node property must be defined for class Scene');
        if(!this.node.getAttribute('tabindex')) this.node.setAttribute('tabindex', 0);
        if(window.getComputedStyle(this.node).position === 'static') this.node.style.position = 'relative';

        this.render = this.render.bind(this);
        this._requestId = null;
    }

    get left() {return Math.floor(this.state.left);}
    get top() {return Math.floor(this.state.top);}

    _update() {
        let width = this.width, height = this.height;
        for(let i=0; i < this.children.length; i++) {
            const layer = this.children[i];
            if(layer.width + layer.left > width) width = layer.width + layer.left;
            if(layer.height + layer.top > height) height = layer.height + layer.top;
        }

        this.state.width = width;
        this.state.height = height;

        this.node.style.width = width + 'px';
        this.node.style.height = height + 'px';
        this.node.style.outline = 'none';
    }

    add(element) {
        if(!(element instanceof Layer)) throw new Error('element added to Scene must be instance of Layer');
        super.add(element);
        this.node.appendChild(element.node);
        this._update();
    }

    clearReverseChain() {
        this._reversChain = [];
    }

    render() {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i]._shouldRender) {
                this.children[i].render();
            }
        }
        this._requestId = null;
        super.render();
    }

    update(props, flow) {
        if(flow) this._shouldRender = true;
        let changed = false;
        props = props || {};
        for(let i in props) {
            if(props.hasOwnProperty(i) && this.state.hasOwnProperty(i) && this.state[i] !== props[i]) {
                this.state[i] = props[i];
                this._shouldRender = true;
                changed = true;
            }
        }
        if(changed) {
            this._update();
        }
        if(!this._requestId) {
            this._requestId = requestAnimationFrame(this.render);
        }
    }

    addEventListener(type, callback, options, flow) {
        this.event.register(type, flow||this, callback, prepareOptions(this.node, options));
    }


}