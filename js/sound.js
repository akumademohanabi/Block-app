"use strict";

export class Sound{
    #data = null;

    constructor(src, volume = 0.5, loop = false){
        this.#data = new Audio();
        // 音量を設定する
        this.#data.volume = volume;
        // ループ再生ｗｐ設定する
        this.#data.loop = loop;
    }

    // 再生する
    play(){
        this.#data.play();
    }
}