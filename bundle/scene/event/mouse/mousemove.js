import {Abstract} from "../abstract";

export class MouseMove extends Abstract
{
    constructor(storage, element, node) {
        super(storage, element, node);
        this.detect = this.detect.bind(this);
        this.setDefault();
    }

    setDefault() {
        this.node.addEventListener(this.type(), this.detect);
    }

    pos(e) {

        const node = this.node.getBoundingClientRect();
        const pos = {
            x: e.clientX - node.left,
            y: e.clientY - node.top,
        };
        const chain = this.element.reverseChain;

        for(let i = 0; i < chain.length; i++) {
            const box = chain[i].box;
            if (
                pos.x >= box.left &&
                pos.x <= box.left + box.width &&
                pos.y >= box.top &&
                pos.y <= box.top + box.height
            ) {
                const event = new MouseEvent(this.type(), e);
                event.nodeX = pos.x;
                event.nodeY = pos.y;
                event.elementX = pos.x - box.left;
                event.elementY = pos.y - box.top;
                event.element = chain[i];
                event.original = e;
                return event;
            }
        }
        return null;
    }


    detect(e) {
        const event = this.pos(e);
        if(event) {
            this.event.execute(this, event);
        }
    }

    type() {
        return this.constructor.name.toLowerCase();
    }

    remove(callback) {
        this.node.removeEventListener(this.type(), this.detect);
    }
}