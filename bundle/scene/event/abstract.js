export class Abstract
{
    constructor(event, element, node) {
        // create listener
        this.node = node;
        this.event = event;
        this.element = element;
    }

    remove() {
        throw new Error('method "remove" must be defined for ' + this.constructor.name);
    }

    type() {
        throw new Error('method "type" must be defined for ' + this.constructor.name);
    }



}