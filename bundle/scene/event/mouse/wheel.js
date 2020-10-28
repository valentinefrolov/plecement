import {MouseMove} from "./mousemove";

export class Wheel extends MouseMove
{
    constructor(event, element, node) {
        super(event, element, node);
        this.delta = 0;
    }

    detect(e) {
        const event = this.pos(e);
        if(event) {
            e.preventDefault();
            this.delta += e.deltaY;
            event.delta = this.delta;
            this.event.execute(this, event);
        }
    }
}