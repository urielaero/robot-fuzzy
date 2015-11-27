var threatCalc = function(threat){
    return fuzzylogic.triangle(threat, 0, 0, 2);
};

threatCalc(20);


var game = new Phaser.Game(950, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });
function preload() {

    game.load.image('block', 'imgs/block.png');
    game.load.image('nav', 'imgs/nave.png');
    game.load.image('galaxy', 'imgs/galaxy.jpg');

}

var sprite;
var bounds;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    bounds = new Phaser.Rectangle(0, 0, 800, 600);

    var background = game.add.sprite(0, 0, 'galaxy');
    background.scale.setTo(.69)


    var blocks = [];

    for(var i=0; i < 10; i++){
        var tx = randint(100, 700)
        ty = randint(100, 700);
        blocks.push(loop(tx, ty)); 
    }

    function loop(x, y){
        x = x || 865
        y = y || 100
        var block = game.add.sprite(x, y, 'block');
        block.scale.setTo(.4)
        block.inputEnabled = true;
        block.anchor.set(0.5);
        block.input.boundsRect = bounds;
        block.input.enableDrag();
    
        block.events.onDragStop.add(function(item){	
            blocks.push(item);
            loop();
        }); 
        return block;
    }
    loop();

    //nave
    var nav = game.add.sprite(10, 300, 'nav');
    nav.inputEnabled = true;
    nav.anchor.set(0.5);
    nav.input.boundsRect = bounds;
    nav.events.onInputDown.add(init, this);
   
    var nav_tween = game.add.tween(nav);
    function init(){
        console.log('MOVE!!');
        setInterval(move, 300);
        //move();
    }
    
    function move(){
        var tmpBlock = blocks.map(function(b){return {x: b.x, y: b.y}});
        tmpBlock = tmpBlock.filter(function(b){
                console.log(b.x, nav.x);
                return b.x > nav.x && (b.x - nav.x) < 200;
            });

        var top = tmpBlock.filter(function(b){
            return b.y < nav.y;
        }).length;

        var bottom = tmpBlock.filter(function(b){
            return b.y > nav.y;
        }).length;

        var front = tmpBlock.filter(function(b){
            return Math.abs(b.y - nav.y) < 50;
        }).length;
       
        if(!front){
            nav.x += 60;
        }else if(threatCalc(top) > 0.5){
            nav.y -= 60;
        }else if(threatCalc(bottom) >= 0.5){
            nav.y += 60;
        }else if(top < bottom){
            nav.y -= 60;
        }else{
            nav.y += 60;
        }
        console.log(blocks);
    }
}

function randint(min, max) {
    return Math.random() * (max - min) + min;
}
