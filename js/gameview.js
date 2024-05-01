"use strict";

import { View } from "./view.js";
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Block, HardBlock} from "./block.js";
import { Bar } from "./bar.js";
import { Sound } from "./sound.js";

export class GameView extends View{
    #ball = null;
    #paddle = null;
    #blocks = [];
    #bar = null;
    // パドルとボールが衝突したときの効果音
    #paddleBallSound;
    // ブロックとボールが衝突したときの効果音
    #blockBallSound;

    // ゲーム結果
    resultMessage = "";

    constructor(context){
        super(context);
        
        this.#ball = new Ball(context, 20, 440, 5, 2, 2);
        this.#paddle = new Paddle(context, 30, 460, 40, 4, 5);
        this.#blocks = [
            new Block(context, 10, 40, 52, 20),
            new Block(context, 72, 40, 52, 20),
            new HardBlock(context, 196, 130, 52, 20),
            new HardBlock(context, 256, 130, 52, 20),
        ];
        this.#bar = new Bar(context);

        this.#paddleBallSound = new Sound("sounds/hit.mp3");
        this.#blockBallSound = new Sound("sounds/hit2.mp3");
    }


    // プレイヤーのキーアクションを実行する
    executePlayerAction(key) {
        if(key["ArrowLeft"] || key["Left"]){
            // 左キーが押されたらパドルを左に
            this.#paddle.dx = -this.#paddle.speed;
            // 右キーが押されたらパドルを右に
        } else if (key["ArrowRight"] || key["Right"]){
            this.#paddle.dx = this.#paddle.speed;
        } else { 
            // キーが押されてない場合は停止する
            this.#paddle.dx = 0;
        }
    }

    // ゲームクリアか確認
    #isGameClear(){
        // ブロックがすべて非表示になったか確認
        const _isGameClear = this.#blocks.every((block)=> block.status === false);
        if(_isGameClear){
            // ゲーム結果設定する
            this.resultMessage = "ゲームクリア";
        }
        return _isGameClear;
    }


    // ゲームオーバーか確認
    #isGameOver(){
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDy = this.#ball.dy;

        // ボールが下の壁に衝突したか検証する
        const _isGameOver = 
        this.context.canvas.height - ballRadius < ballY + ballDy;
        // ゲーム結果を設定する
        if(_isGameOver){
            this.resultMessage = "ゲームオーバー";
        }
        return _isGameOver;
    }


    // ボールと壁の衝突を確認する
    #cheackCollisionBallAndWall(){
        const canvasWidth = this.context.canvas.width;
        const canvasHeight = this.context.canvas.height;
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;

        // ボールが左右の壁と衝突したらｘ軸の移動速度を反転する
        if (ballX + ballDx < ballRadius || 
            canvasWidth - ballRadius < ballX + ballDx){
                this.#ball.dx *= -1;
                return;
            }
        // ボールが上の壁と衝突したらｙ軸の移動速度を反転する
        if (ballY + ballDy < ballRadius + 20){
                this.#ball.dy *= -1;
                return;
            }
        // ボールが下の壁と衝突したらｙ軸の移動速度を反転する
        // if(canvasHeight - ballRadius < ballY + ballDy){
        //     this.#ball.dy *= -1;
        //     return;
        // }
    }


    // パドルと壁の衝突を確認する
    #cheackCollisionPaddleAndWall(){
        const canvasWidth = this.context.canvas.width;
        const paddleX = this.#paddle.x;
        const paddleWidth = this.#paddle.width;
        const paddleDx = this.#paddle.dx;

        if(paddleX + paddleDx < 0){
            this.#paddle.dx = 0;
            this.#paddle.x = 0;
            return
        }

        if(canvasWidth - paddleWidth < paddleX + paddleDx){
            this.#paddle.dx = 0;
            this.#paddle.x = canvasWidth - paddleWidth;
            return;
        }
    }


    // ボールとパドルの衝突を確認する
    #checkCollisionBallAndPaddle(){
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;
        const paddleX = this.#paddle.x;
        const paddleY = this.#paddle.y;
        const paddleWidth = this.#paddle.width;
        const paddleHeight = this.#paddle.heigth;
        // console.log (ballX,ballY,ballRadius,ballDx,ballDy);
        // console.log (paddleX,paddleY,paddleHeight,paddleWidth);

        // ボールとパドルが衝突したらボールを反射する
        if(paddleX - ballRadius < ballX + ballDx &&
            ballX + ballDx < paddleX + paddleWidth + ballRadius &&
            paddleY - ballRadius < ballY + ballDy &&
            ballY + ballDy < paddleY + paddleHeight + ballRadius){
            this.#ball.dy *= -1; 
        }
        // 効果音
        this.#paddleBallSound.play();
    }


    // ボールとブロックの当たり判定
    #checkCollisionBallAndBlock(){
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;

        this.#blocks.forEach((block) => {
            if(block.status === true){
                const blockX = block.x;
                const blockY = block.y;
                const blockWidth = block.width;
                const blockHeight = block.height;

                if(blockX - ballRadius < ballX + ballDx &&
                ballX + ballDx < blockX + blockWidth + ballRadius &&
                blockY - ballRadius < ballY + ballDy &&
                ballY + ballDy < blockY + blockHeight + ballRadius ){
            // ボールを反射
            this.#ball.dy *= -1;
            if(block instanceof HardBlock){
                block.hp--;
                if(block.hp === 0){
                    // ブロックを非表示
                    block.status = false;
                    // スコアを加算する
                    this.#bar.addScore(block.getPoint());
                }
            } else {
                 // ブロックを非表示
                 block.status = false;
                 // スコアを加算する
                 this.#bar.addScore(block.getPoint());
            }
        }
        }
            // 効果音
            this.#blockBallSound.play();
        }
    
    
    )
    }
    


    // 更新する
    update(){
        // ボールと壁の衝突を確認
        this.#cheackCollisionBallAndWall();
        // ボールとパドルの衝突を確認する
        this.#checkCollisionBallAndPaddle();
        // パドルと壁の衝突を確認
        this.#cheackCollisionPaddleAndWall();
        // ボールとブロックの衝突を確認
        this.#checkCollisionBallAndBlock();

        // ゲームオーバーかどうか検証する
        if(this.#isGameOver() || this.#isGameClear()){
            // ゲーム画面を非表示にする
            this.isVisible = false;
        }


        // ボールを移動
        this.#ball.move();
        // パドルを移動
        this.#paddle.move();


    }


    // 描画する
    draw(){
        // ボールを描画
        this.#ball.draw();
        // パドルを描画
        this.#paddle.draw();
        this.#blocks.forEach((block) => block.draw());
        // バーを描画
        this.#bar.draw();

    }
}