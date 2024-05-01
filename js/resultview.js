"use strict";

import { View } from "./view.js";

export class ResultView extends View{
    constructor(context){
        super(context);
    }
    // 描画する
    draw(reslutMessage){
        // 結果を描画
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.font = "24px Arial";
        this.context.fillStyle = "white";
        this.context.fillText(
            reslutMessage,
            this.context.canvas.width / 2,
            this.context.canvas.height / 2
        );
    }
}