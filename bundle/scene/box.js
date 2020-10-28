import {Scene} from "./scene";

export class Box
{
    constructor(props) {
        this.state = {};

        props = props || {};

        this._parent = null;
        this._children = [];
        this._delay = [];
        this._shouldRender = true;
        this._reversChain = [];
        this._zIndex = props.zIndex || 0;

        this.state.left   = props.left || 0;
        this.state.top    = props.top || 0;
        this.state.width  = props.width || 0;
        this.state.height = props.height || 0;

        this.name = props.name || this.constructor.name;
    }

    get depth() {
        let parent = this._parent;
        let depth = 0;
        while (parent) {
            depth++;
            parent = parent.parent;
        }
        return depth;
    }
    set parent (element) {
        this._parent = element;
        for(let i = 0; i < this._delay.length; i++) {
            this._delay[i].method.apply(this, this._delay[i].arguments);
            this._delay.splice(i--, 1);
        }
    }

    get parent () {return this._parent;}
    get children() {return this._children;}

    get width() {return Math.ceil(this.state.width);}
    get height() {return Math.ceil(this.state.height);}

    get left() {return this.parent.left + Math.floor(this.state.left);}
    get top() {return this.parent.top + Math.floor(this.state.top);}

    add(element) {
        element.parent = this;
        element.update({}, element);
        this._children.push(element);
        this.sortByZIndex();
    }

    zIndex (index) {
        if(this.parent) {
            if(this._zIndex !== index) {
                this._zIndex = index;
                this.parent.sortByZIndex();
            }
        } else {
            this._delay.push({
                method: this.zIndex,
                arguments: [index]
            });
        }
    }

    sortByZIndex() {
        this.clearReverseChain();
        this._children.sort((a, b) => {
            return a._zIndex > b._zIndex ? 1 : (a._zIndex < b._zIndex ? -1 : 0);
        });
    }

    clearReverseChain() {
        this._reversChain = [];
        if(this.parent)
            this.parent.clearReverseChain();
    }

    get reverseChain() {
        if(!this._reversChain.length) {
            for(let i = this.children.length-1; i >= 0; i--) {
                const childChain = this.children[i].reverseChain;
                for(let j = 0; j < childChain.length; j++) {
                    this._reversChain.push(childChain[j]);
                }
            }
            this._reversChain.push(this);
            this._reversChain.sort((a, b) => {
                const aDepth = a.depth;
                const bDepth = b.depth;
                return aDepth > bDepth ? -1 : (aDepth > bDepth ? 1 : 0);
            });
        }

        return this._reversChain;
    }

    addEventListener(type, callback, options, flow) {
        if(this.parent) {
            this.parent.addEventListener(type, callback, options, flow || this);
        } else {
            this._delay.push({
                method: this.addEventListener,
                arguments: [type, callback, options, flow || this]
            });
        }
    }

    removeEventListener(type, callback, phase, flow) {
        // TODO
    }

    find(name) {
        const found = [];
        for(let i = 0; i < this.children.length; i++) {
            if(this.children[i].name === name) {
                found.push(this.children[i]);
            }
        }
        if(found.length === 1) return found[0];
        return found;
    }

    update(props, flow) {
        if(this.parent) {
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
            this.parent.update({}, this);
            return changed;
        } else {
            this._delay.push({
                method: this.update,
                arguments: [props, flow]
            })
        }

    }

    get points() {

        return [
            {left: this.left, top: this.top},
            {left: this.left + this.width, top: this.top},
            {left: this.left + this.width, top: this.top + this.height},
            {left: this.left, top: this.top + this.height},
        ];

    }


    get box () {

        const points = this.points;

        const x = [];
        const y = [];

        for(let i=0; i < points.length; i++) {
            x.push(points[i].left);
            y.push(points[i].top);
        }

        const minX = Math.min(...x);
        const minY = Math.min(...y);

        return {
            left: minX,
            top: minY,
            width: Math.max(...x) - minX,
            height: Math.max(...y) - minY
        }
    }

    render() {
        this._shouldRender = false;
    }
}