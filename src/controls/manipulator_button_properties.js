class ManipulatorButtonProperties {
    constructor(text, imgFilePath){

        this._imgFilePath = imgFilePath;
        this._text = text;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get imgFilePath() {
        return this._imgFilePath;
    }

    set imgFilePath(value) {
        this._imgFilePath = value;
    }
}

export {ManipulatorButtonProperties}