import {Element} from "../../element";
import {MouseMove} from "./mousemove";

export class MouseOver extends MouseMove
{
    constructor(event, element, node) {
        super(event, element, node);
        this.focus = null;
    }

    setDefault() {
        this.node.addEventListener('mousemove', this.detect);
    }

    detect(e) {

        const event = this.pos(e);
        if(event) {
            if(this.focus !== event.element) {
                this.focus = event.element;
                this.event.execute(this, event);
            }
        } else {
            this.focus = null;
        }
    }

}