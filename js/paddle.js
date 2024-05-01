"use strict";

export class Paddle{
    context;
    // ｘ軸
    x;
    // ｙ軸
    y;
    // 幅
    width;
    // 高さ
    heigth;
    // ｘ軸の移動速度
    dx = 0;
    // 移動速度
    speed;

    constructor (context, x, y, width, heigth, speed){
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = heigth;
        this.speed = speed;
    }

    // 移動する
    move(){
        this.x += this.dx;
    }  

    // 描画する
    draw(){
        this.context.beginPath();
        this.context.rect(this.x, this.y, this.width, this.heigth);
        this.context.fillStyle = "green";
        this.context.fill();
        this.context.closePath();
    }
}