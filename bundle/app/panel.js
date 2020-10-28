import {Item as Abstract} from "./item";
import {Rect} from "../scene/element/rect";
import {data, selected, STATE_RESIZE, STATE_ROTATE, STATE_TRANSFORM, STATE_TRANSLATE} from "../app";
import {Text} from "../scene/element/text";

const wordOffsetHeight = 7;

export class Panel extends Abstract
{
    constructor(props) {

        props.zIndex = props.zIndex || 2;
        props.width = props.width || 193;
        props.height = props.height || 22;
        super(props);

        this.add(new Rect({
            width: this.state.width,
            height: this.state.height,
            fill: 'white',
            strokeWidth: 1,
            strokeStyle: 'black',
            name: 'panel'
        }));

        this.add(new Rect({
            width: wordOffsetHeight,
            height: 22,
            left: this.state.width - wordOffsetHeight,
            fill: 'transparent',
            name: 'resize'
        }));
        this.state.words = props.words || [];
        this.words = [];
        this.cursorIndex = 0;
        this.createWord = this.createWord.bind(this);
        this.keyDetector = this.keyDetector.bind(this);
        this.initialSize = {};

        this._delay.push({
            method: this.createWordsFromState,
            arguments: []
        });

        document.addEventListener('keydown', this.keyDetector);

        this.find('resize').addEventListener('mouseover', () => {
            document.body.style.cursor = this.state.rotate === 0 ? 'ew-resize' : 'ns-resize';
        });
        this.find('resize').addEventListener('mouseout', () => {
            document.body.style.cursor = '';
        });
    }

    createWordsFromState() {
        for(let i=0; i < this.state.words.length; i++) {
            this.createWord(this.state.words[i]);
        }
    }

    keyDetector(e) {
        e.stopPropagation();
        const index = selected.indexOf(this);
        if(index === -1) return;

        if(e.keyCode === 8) {
            if (this.words.length > 0) {
                const word = this.words[this.words.length - 1];
                word.remove();
                this.state.words.pop();
                this.words.pop();
            }
        } else if(
            e.keyCode === 32 ||
            e.keyCode >= 47 && e.keyCode <= 90 ||
            e.keyCode >= 96 && e.keyCode <= 111 ||
            e.keyCode >= 160 && e.keyCode <= 176 ||
            e.keyCode >= 186 && e.keyCode <= 192 ||
            e.keyCode >= 219 && e.keyCode <= 222
        ){
            this.state.words.push(e.key);
            this.createWord(e.key);
        }
    }

    remove() {
        document.removeEventListener('keydown', this.keyDetector);
        super.remove();
    }

    createWord(w) {

        const word = new Text({
            text: w,
            font: '20px Arial',
            fill: 'black',
            rotate: -1*this.state.rotate
        });


        let left = 0;
        if(this.rotate === 0) {
            left += 10;
            for(let i=0; i < this.words.length; i++) {
                left+= this.words[i].width;
            }
            word.update({left: left, top: this.height/2 + wordOffsetHeight});
            left += word.width;
        } else {
            for(let i=0; i < this.words.length; i++) {
                left+= this.words[i].height - 2;
            }
            left += word.height - 2;
            word.update({left: left, top: (this.height + word.width)/2});

        }

        if(left > this.width) {
            this.updateWidth(left);
        }

        this.words.push(word);
        this.add(word);
        this.focus();
    }

    revolve(e) {
        const x = e.nodeX - data.x;
        const y = e.nodeY - data.y;
        const angle = -1 * Math.atan(x / y) * 180 / Math.PI - (y >= 0 ? 180 : 0);

        let left = 0;

        if(angle >= 45 && angle <= 90 && this.state.rotate !== 90) {
            this.update({rotate: 90});
            for(let i=0; i < this.words.length; i++) {
                left+= this.words[i].height -2;
                this.words[i].update({rotate: -1*this.state.rotate, left: left, top: this.height/2 + this.words[i].width/2});
            }
        } else if(angle < 45 && angle >= 0 && this.state.rotate !== 0) {
            this.update({rotate: 0});
            left = 10;
            for(let i=0; i < this.words.length; i++) {
                this.words[i].update({rotate: -1*this.state.rotate, left: left, top: this.height/2 + wordOffsetHeight});
                left+= this.words[i].width;
            }
        }

        const textWidth = this.getTextWidth();
        if(textWidth > this.width) {
            this.updateWidth(textWidth);
        }
    }

    updateWidth(width) {
        this.update({
            width: width,
        });
        this.find('panel').update({
            width: width,
        });
        this.find('resize').update({
            left: width - wordOffsetHeight,
        });
        this.focus();
    }

    getTextWidth() {
        let textWidth = 10;
        if(this.rotate === 0) {
            for(let i = 0; i < this.words.length; i++) {
                textWidth += this.words[i].width;
            }
            textWidth += 10;
        } else {
            //textWidth += 10;
            for(let i = 0; i < this.words.length; i++) {
                textWidth += this.words[i].height - 2;
            }
        }
        return textWidth;
    }

    resize(e) {
        let width = this.rotate === 0 ? e.nodeX - data.x + this.initialSize.width : e.nodeY - data.y + this.initialSize.width;
        const textWidth = this.getTextWidth();
        if(width < textWidth) width = textWidth;
        this.updateWidth(width);

    }

    props() {
        let obj = super.props();
        obj.words = 'wds';
        return obj;
    }


    getState(e) {
        if(e.element.name === 'resize') {
            this.focus();
            this.initialSize = {width: this.find('panel').width, height: this.find('panel').height};
            return {
                state: STATE_RESIZE,
                data: {
                    x: e.nodeX,
                    y: e.nodeY
                },
                callback: 'resize'
            }
        } else {
            return super.getState(e);
        }
    }
}