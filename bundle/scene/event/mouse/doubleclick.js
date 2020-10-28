import {MouseMove} from "./mousemove";

export class DoubleClick extends MouseMove
{
    type() {
        return 'dblclick';
    }
}