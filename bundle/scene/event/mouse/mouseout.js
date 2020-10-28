import {MouseOver} from "./mouseover";

export class MouseOut extends MouseOver
{
    detect(e) {

        const node = this.node.getBoundingClientRect();
        const pos = {
            x: e.clientX - node.left,
            y: e.clientY - node.top,
        };
        const chain = this.element.reverseChain;

        let currentFocus = null;
        for(let i = 0; i < chain.length; i++) {
            const box = chain[i].box;
            if (
                pos.x >= box.left &&
                pos.x <= box.left + box.width &&
                pos.y >= box.top &&
                pos.y <= box.top + box.height
            ) {
                currentFocus = chain[i];
                break;
            }
        }

        if(this.focus && this.focus !== currentFocus) {
            const index = chain.indexOf(this.focus);
            const box = chain[index].box;
            const event = new MouseEvent(this.type(), e);
            event.nodeX = pos.x;
            event.nodeY = pos.y;
            event.elementX = pos.x - box.left;
            event.elementY = pos.y - box.top;
            event.element = chain[index];
            event.original = e;
            this.event.execute(this, event);
        }

        this.focus = currentFocus;
    }
}