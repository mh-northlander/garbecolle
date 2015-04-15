enchant();

//// var
var game;
var game

var T = {
    NERD : 0,
    PREP : 1,
    OTHER : 2
};

var gomi; // gomibako
var jock; // jock man
var chars = []; // preps and nerds
var dist; // distination for preps

var score;
var born;  // counter for born

var scorelabel;
var roomlabel;
var gameoverlabel;
var infolabel;

var baseBornCount = 40;
var scorePerOne = 10;
var minBornCount = 20;
var baseNerdizePos = 500;
var NerdizePerOne = 10;
var minNerdizePos = 250;
var CHARMAX  = 24;
var CHARINIT = 10;

var G_FPS = 20;
var G_WIDTH = 420; // window size
var G_HEIGHT = 320;
var S_WIDTH = 350;
var S_HEIGHT = 320;
var P_WIDTH = 22;
var P_HEIGHT = 52;

//// class
function Chara(w,h,x,y){
    Sprite.call(this,w,h)
    this.x = x;
    this.y = y;
    this.rad = 0;
    this.count = 0;
    this.iswait = true;
    this.type = T.OTHER;
}
Chara.prototype = Object.create(Sprite.prototype);
//Chara.prototype.constructor = Chara;

function Prep(x,y){
    Chara.call(this,P_WIDTH,P_HEIGHT,x,y);
    //this.image = game.assets["img/prep.png"];
    this.image = game.assets["img/jock.png"];
    this.count = Math.random() * game.fps;
    this.drag = false;
    this.type = T.PREP;

    // each frame
    this.addEventListener(enchant.Event.ENTER_FRAME, function(){
        if(this.drag) {
            return;
        }
        if(Math.random() * nerdizePos() < 1){
            var tmpscene = this.parentNode;
            this.parentNode.removeChild(this);
            Nerd.call(this,this.x,this.y);
            tmpscene.addChild(this);
            return;
        }
        if(this.iswait) { //wait
            this.count -= 1;
            if(this.count < 0){ // init for move
                this.iswait = false;
                var toX = (Math.random()-0.5) * 120 + dist.x - P_WIDTH/2;
                var toY = (Math.random()-0.5) * 120 + dist.y - P_HEIGHT/2;
                this.rad = Math.atan2(toY-this.y, toX-this.x);
                this.count = Math.sqrt((toX-this.x)*(toX-this.x) +
                                       (toY-this.y)*(toY-this.y));
            }
            return;
        } else { // move
            this.moveBy(Math.cos(this.rad)*2, Math.sin(this.rad)*2);
            this.count -= 2;
            if(this.count < 0){ // init for wait
                this.iswait = true;
                this.count = Math.random() * game.fps;
            }
            return;
        }
    });
    this.addEventListener(enchant.Event.TOUCH_START, function(e){
        this.deltaX = e.x - this.x;
        this.deltaY = e.y - this.y;
        this.drag = true;
    });
    this.addEventListener(enchant.Event.TOUCH_MOVE, function(e){
        this.x = e.x - this.deltaX;
        this.y = e.y - this.deltaY;
    });
    this.addEventListener(enchant.Event.TOUCH_END, function(e){
        if(this.intersect(gomi)){
            this.parentNode.removeChild(this);
            chars.splice(chars.indexOf(this),1);
            game.pushScene(createGameoverScene("有用な人材を除去しました"));
        }

        // wait then move
        this.iswait = false;
        this.count = -1;

        this.drag = false;
    });
}
Prep.prototype = Object.create(Chara.prototype);
//Prep.prototype.constructor = Prep;

function Nerd(x,y){
    Chara.call(this,P_WIDTH,P_HEIGHT,x,y);
    this.image = this.image = game.assets["img/nerd.png"];
    this.count = Math.random() * game.fps;
    this.drag = false;
    this.atedge = false;
    this.horiz = false;
    this.type = T.NERD;

    // each frame
    this.addEventListener(enchant.Event.ENTER_FRAME, function(){
        if(this.drag) {
            return;
        }
        if(this.iswait) { //wait
            this.count -= 1;
            if(this.count < 0){ // init for move
                this.iswait = false;
                if(!this.atedge){
                    var toX = (Math.random()-0.5) * 50 + jock.x;
                    var toY = (Math.random()-0.5) * 50 + jock.y;
                    this.rad = Math.atan2(this.y-toY, this.x-toX);
                    this.count = Math.sqrt((toX-this.x)*(toX-this.x) +
                                           (toY-this.y)*(toY-this.y));
                    if(this.count < 20){
                        this.count += 20;
                    }
                } else { // at edge
                    if(this.horiz){
                        if(Math.random() < 0.5)
                            this.rad = 0;
                        else
                            this.rad = Math.PI;
                    } else {
                        if(Math.random() < 0.5)
                            this.rad = Math.PI/2;
                        else
                            this.rad = -Math.PI/2;
                    }
                    this.count = Math.random()*40+40;
                }
            }
            return;
        } else { // move
            this.moveBy(Math.cos(this.rad)*2, Math.sin(this.rad)*2);
            if(!this.atedge){
                if(this.x < 10 ||
                   this.x + this.width > S_WIDTH - 10){
                    this.atedge = true;
                    this.horiz = false;
                    this.count = 0;
                }
                if(this.y < 10 ||
                   this.y + this.height > S_HEIGHT - 30){
                    this.atedge = true;
                    this.horiz = true;
                    this.count = 0;
                }
            } else {
                if(this.horiz){
                    if(this.x < 10){
                        this.x = 10;
                        this.rad = 0;
                    }
                    if(this.x + this.width > S_WIDTH - 10){
                        this.x = S_WIDTH - this.width - 10;
                        this.rad = Math.PI;
                    }
                } else {
                    if(this.y < 10){
                        this.y = 10;
                        this.rad = -Math.PI/2;
                    }
                    if(this.y + this.height > S_HEIGHT - 30){
                        this.y = S_HEIGHT - this.height - 30;
                        this.rad = Math.PI/2;
                    }
                }
            }
            this.count -= 2;
            if(this.count < 0){ // init for wait
                this.iswait = true;
                this.count = (Math.random() + 1) * game.fps * 1;
            }
            return;
        }
    });
    this.addEventListener(enchant.Event.TOUCH_START, function(e){
        this.deltaX = e.x - this.x;
        this.deltaY = e.y - this.y;
        this.drag = true;
    });
    this.addEventListener(enchant.Event.TOUCH_MOVE, function(e){
        this.x = e.x - this.deltaX;
        this.y = e.y - this.deltaY;
    });
    this.addEventListener(enchant.Event.TOUCH_END, function(e){
        if(this.intersect(gomi)){
            this.parentNode.removeChild(this);
            score += scorePerOne;
            scorelabel.text = "score: " + score;
            infolabel.text  = infotext();
            chars.splice(chars.indexOf(this),1);
        }

        // wait then move
        if(this.x > S_WIDTH - this.width + 5){
            this.iswait = false;
            this.count = -1;
            this.atedge = true;
            this.horiz = false;
        } else {
            this.iswait = false;
            this.count = -1;
            this.atedge = false;
        }
        this.drag = false;
    });
}
Nerd.prototype = Object.create(Chara.prototype);
//Nerd.prototype.constructor = Nerd;

function Jockman(){
    Chara.call(this,P_WIDTH,P_HEIGHT,100,100);
    //this.image = game.assets["img/jock.png"];
    this.count = Math.random() * game.fps;

    this.addEventListener(enchant.Event.ENTER_FRAME, function(){
        if(this.iswait) { //wait
            this.count -= 1;
            if(this.count < 0){ // init for move
                this.iswait = false;
                var ps = chars.filter(function(elem){
                    return elem.type == T.PREP;
                });
                var toX = 0.0; var toY = 0.0;
                for(var i=0; i<ps.length; i++){
                    toX += ps[i].x;
                    toY += ps[i].y;
                }
                toX /= ps.length; toY /= ps.length;
                toX += (Math.random()-0.5) * 40;
                toY += (Math.random()-0.5) * 40;
                this.rad = Math.atan2(toY-this.y, toX-this.x);
                this.count = Math.sqrt((toX-this.x)*(toX-this.x) +
                                       (toY-this.y)*(toY-this.y));
            }
            return;
        } else { // move
            this.moveBy(Math.cos(this.rad)*2, Math.sin(this.rad)*2);
            this.count -= 2;
            if(this.count < 0){ // init for wait
                this.iswait = true;
                this.count = Math.random() * game.fps;
            }
            return;
        }
    });
}
Jockman.prototype = Object.create(Chara.prototype);
//Jockman.prototype.constructor = Jockman; //??

function Distination(){
    Chara.call(this,10,10,S_WIDTH/2,S_HEIGHT/2);
    this.count = Math.random() * game.fps;

    this.addEventListener(enchant.Event.ENTER_FRAME, function(){
        if(this.iswait) { //wait
            this.count -= 1;
            if(this.count < 0){ // init for move
                this.iswait = false;
                var toX = (Math.random()-0.5) * 100 + S_WIDTH/2;
                var toY = (Math.random()-0.5) * 150 + S_HEIGHT/2;
                this.rad = Math.atan2(toY-this.y, toX-this.x);
                this.count = Math.sqrt((toX-this.x)*(toX-this.x) +
                                       (toY-this.y)*(toY-this.y));
            }
            return;
        } else { // move
            this.moveBy(Math.cos(this.rad)*2, Math.sin(this.rad)*2);
            this.count -= 2;
            if(this.count < 0){ // init for wait
                this.iswait = true;
                this.count = Math.random() * game.fps;
            }
            return;
        }
    });
}
Distination.prototype = Object.create(Chara.prototype);
//Distination.prototype.constructor = Distination; //??

function Gomibako(){
    Chara.call(this,60,55,G_WIDTH-70,G_HEIGHT-80);
    this.image = game.assets["img/gomi.png"];
}
Gomibako.prototype = Object.create(Chara.prototype);
//Gomibako.prototype.constructor = Gomibako; //??


//// func
var bornCount = function(){
    return Math.max(minBornCount, baseBornCount - score/scorePerOne);
};
var nerdizePos = function(){
    return Math.max(minNerdizePos, baseNerdizePos - score);
};

var infotext = function(){
    return createName() + " : " + createInfo();
};
var createInfo = function(){
    var infos=["輪に入らず一人で絵を描いていた",
               "輪に入らず一人で本を読んでいた",
               "\"魔法使い\"になった",
               "新興宗教に入信した",
               "友達ができなかった",
               "高校デビューに失敗した",
               "同人活動にハマった",
               "２浪した",
               "就職活動に失敗した",
               "留年した",
               "リストラされた"];
    return infos[Math.floor(Math.random()*infos.length)];
};

//// scene
var createTitleScene = function(){
    var scene = new Scene;

    var title = new Label("Garbage Collection");
    title.font = "30px cursive";
    title.x = G_WIDTH/2 - 130;
    title.y = 80;
    scene.addChild(title);

    var button = new Sprite(100,70);
    button.image = game.assets["img/startbutton.png"];
    button.x = G_WIDTH/2 - button.width/2;
    button.y = 130 + title.height;
    scene.addChild(button);
    button.addEventListener(enchant.Event.TOUCH_START, function(){
        game.popScene();
        game.pushScene(createGameScene());
        //game.replaceScene(createGameScene());
    });

    return scene;
};

var createGameScene = function(){
    var scene = new Scene;

    // char ini
    jock = new Jockman();
    scene.addChild(jock);
    dist = new Distination();
    scene.addChild(dist);
    chars = [];
    for(var i=0; i<CHARINIT; i++){
        chars.push(new Prep(Math.random()*(S_WIDTH -P_WIDTH),
                            Math.random()*(S_HEIGHT-P_HEIGHT)));
        scene.addChild(chars[chars.length-1]);
    }

    // score init
    score = 0;
    scorelabel = new Label("score: " + score);
    scorelabel.x = G_WIDTH-80;
    scorelabel.y = G_HEIGHT-17;
    scene.addChild(scorelabel);

    // label init
    var social = new Label("社会資源");
    social.x = G_WIDTH-70;
    social.y = G_HEIGHT-130;
    scene.addChild(social);

    roomlabel = new Label(CHARMAX-chars.length);
    roomlabel.x = G_WIDTH-30;
    roomlabel.y = G_HEIGHT-110;
    scene.addChild(roomlabel);

    infolabel = new Label("");
    infolabel.font = "13px cursive";
    infolabel.x = 10;
    infolabel.y = G_HEIGHT - 17;
    scene.addChild(infolabel);



    // frame
    born = 60;
    scene.addEventListener(enchant.Event.ENTER_FRAME, function(){
        // label
        roomlabel.text = CHARMAX-chars.length;

        // new comer
        if(born > 0) {
            born -= 1;
        } else {
            if(chars.length >= CHARMAX){
                game.pushScene(createGameoverScene("社会資源が枯渇しました"));
            }
            chars.push(new Prep(G_WIDTH-40, 10));
            scene.addChild(chars[chars.length-1]);
            born = bornCount();
        }
    });

    return scene;
};

var createGameoverScene = function(str){
    var scene = new Scene;

    var logo = new Label("Game Over");
    logo.font = "30px cursive";
    logo.x = G_WIDTH/2 - 130;
    logo.y = 80;
    scene.addChild(logo);

    var tex = new Label(str);
    tex.font = "15px cursive";
    tex.x = G_WIDTH/2 - 50;
    tex.y = 120;
    scene.addChild(tex);

    var button = new Sprite(100,70);
    button.image = game.assets["img/startbutton.png"];
    button.x = 20;
    button.y = G_HEIGHT - button.height - 20;
    scene.addChild(button);
    button.addEventListener(enchant.Event.TOUCH_START, function(){
        game.popScene();
        game.popScene();
        game.pushScene(createGameScene());
        //game.replaceScene(createGameScene());
    });

    return scene;
}


//// main
window.onload = function(){
    game = new Game(G_WIDTH,G_HEIGHT);
    game.fps = G_FPS;
    game.preload("img/prep.png","img/jock.png","img/nerd.png");
    game.preload("img/gomi.png","img/startbutton.png");

    game.onload = function(){
        game.rootScene.backgroundColor = "#ffaaaa";

        // gomibako
        gomi = new Gomibako();
        game.rootScene.addChild(gomi);

        game.replaceScene(createTitleScene());
    };
    game.start();
};
