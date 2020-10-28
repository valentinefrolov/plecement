/*
Window Event Attributes:
    onafterprint   Script to be run after the document is printed
    onbeforeprint  Script to be run before the document is printed

Form Events:
    onblur         Fires the moment that the element loses focus
    onchange       Fires the moment when the value of the element is changed
    oncontextmenu  Script to be run when a context menu is triggered
    onfocus        Fires the moment when the element gets focus

Keyboard Events:
    onkeydown      Fires when a user is pressing a key
    onkeypress     Fires when a user presses a key
    onkeyup        Fires when a user releases a key

Mouse Events:
    onclick        Fires on a mouse click on the element
    ondblclick     Fires on a mouse double-click on the element
    onmousedown    Fires when a mouse button is pressed down on an element
    onmousemove    Fires when the mouse pointer is moving while it is over an element
    onmouseout     Fires when the mouse pointer moves out of an element
    onmouseover    Fires when the mouse pointer moves over an element
    onmouseup      Fires when a mouse button is released over an element
    onwheel        Fires when the mouse wheel rolls up or down over an element

Clipboard Events:
    oncopy         Fires when the user copies the content of an element
    oncut          Fires when the user cuts the content of an element
    onpaste        Fires when the user pastes some content in an element
*/
import {Scene} from './scene';
import {Paste} from "./event/clipboard/paste";
import {Cut} from "./event/clipboard/cut";
import {Copy} from "./event/clipboard/copy";
import {KeyUp} from "./event/keyboard/keyup";
import {KeyPress} from "./event/keyboard/keypress";
import {KeyDown} from "./event/keyboard/keydown";
import {Click} from "./event/mouse/click";
import {DoubleClick} from "./event/mouse/doubleclick";
import {MouseDown} from "./event/mouse/mousedown";
import {MouseMove} from "./event/mouse/mousemove";
import {MouseOut} from "./event/mouse/mouseout";
import {MouseOver} from "./event/mouse/mouseover";
import {MouseUp} from "./event/mouse/mouseup";
import {Wheel} from "./event/mouse/wheel";
import {Blur} from "./event/form/blur";
import {Change} from "./event/form/change";
import {ContextMenu} from "./event/form/contextmenu";
import {Focus} from "./event/form/focus";
import {Box} from "./box";

const EVENT_MAP = {
    'blur': Blur,
    'change': Change,
    'contextmenu': ContextMenu,
    'focus': Focus,
    'click': Click,
    'dblclick': DoubleClick,
    'mousedown': MouseDown,
    'mousemove': MouseMove,
    'mouseout': MouseOut,
    'mouseover': MouseOver,
    'mouseup': MouseUp,
    'wheel': Wheel,
    'keydown': KeyDown,
    'keypress': KeyPress,
    'keyup': KeyUp,
    'copy': Copy,
    'cut': Cut,
    'paste': Paste,
};

export function prepareOptions(_options, initial) {

    const options = {
        capture: false,
        once: false,
        break: false,
        node: null,
        disabled: false
    };

    if(_options instanceof Boolean)
        options.capture = _options;
    else if(_options instanceof HTMLElement) {
        options.node = _options;
    }
    else
        for(let i in _options) if(_options.hasOwnProperty(i) && options.hasOwnProperty(i)) options[i] = _options[i];

    if(initial instanceof Boolean)
        options.capture = initial;
    else if(initial instanceof HTMLElement) {
        options.node = initial;
    }
    else if(initial !== undefined)
        for(let i in initial) if(initial.hasOwnProperty(i) && options.hasOwnProperty(i)) options[i] = _options[i];


    return options;

}

export class Event
{
    constructor(root) {
        this.registeredListeners = {};
        this.stack = [];
        this.root = root;
    }

    break(listener) {

        const arr = this.registeredListeners[listener.type()];
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].listener !== listener) {
                arr[i].options.disabled = true;
                console.log(arr[i].options.disabled);
            }
        }
    }

    execute(listener, event) {
        const arr = this.registeredListeners[listener.type()];
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].listener === listener && !arr[i].options.disabled) {
                arr[i].callback.call(arr[i].element, event);
            }
            arr[i].options.disabled = false;
        }
    }

    register(type, element, callback, options) {

        if(EVENT_MAP[type] === undefined) {
            console.error('event handler ' + type + ' not exists');
            return;
        }
        if(!(element instanceof Box)) {
            console.error('object must be instance of Box');
            return;
        }
        if(this.registeredListeners[type] === undefined)
            this.registeredListeners[type] = [];

        this.registeredListeners[type].push({
            element: element,
            callback: callback,
            options: options,
            event: null,
            listener: new EVENT_MAP[type](this, element, options.node)
        });
    }

    unRegister(element, callback) {
        for(let type in this.registeredListeners) {
            const arr = this.registeredListeners[type];
            for (let i = 0; i < arr.length; i++) {
                if (callback && arr[i].element === element && arr[i].callback === callback) {
                    arr[i].listener.remove(callback);
                    arr.splice(i, 1);
                    break;
                } else if (!callback && arr[i].element === element) {
                    arr[i].listener.remove(arr[i].callback);
                    arr.splice(i, 1);
                    i--;
                }
            }
        }
    }

}