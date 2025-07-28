/**
 * Original script by infernal3 - Moltendye
 */
const el = e => document.getElementById(e);
const cv = () => el("app");
const cx = () => cv().getContext("2d");
const wx = () => window.innerWidth;
const wy = () => window.innerHeight;
const data = {menu: 0, options: {difficulty: 1}};
var clickables = [];

const LoadFunction = function() {
    cv().width = wx() - 16;
    cv().height = wy() - 16;
    TitleScreen();
}
const RemovableFilters = function(E) { return !E.removeFlag; }
const PreventDefault = function(E) { E.preventDefault(); }
const ClickHandler = function(E) {
    for (var i of clickables){
        if((typeof i)==='object'){
            if(i.x1 <= E.offsetX && i.x2 >= E.offsetX && i.y1 <= E.offsetY && i.y2 >= E.offsetY) i.handler();
        }
    }
}
const KeyUpHandler = function(E) {
    if(data.menu >= 0) return;
    switch(E.key){
        case "a":
        case "A":
        case "LeftArrow":
            data.controls.left = false;
            break;
        case "w":
        case "W":
        case "UpArrow":
            data.controls.up = false;
            break;
        case "s":
        case "S":
        case "DownArrow":
            data.controls.down = false;
            break;
        case "d":
        case "D":
        case "RightArrow":
            data.controls.right = false;
            break;
    }
}
const KeyDownHandler = function(E) {
    if(data.menu >= 0) return;
    switch(E.key){
        case "a":
        case "A":
        case "LeftArrow":
            data.controls.left = true;
            break;
        case "w":
        case "W":
        case "UpArrow":
            data.controls.up = true;
            break;
        case "s":
        case "S":
        case "DownArrow":
            data.controls.down = true;
            break;
        case "d":
        case "D":
        case "RightArrow":
            data.controls.right = true;
            break;
    }
}
const TitleScreen = function() {
    clickables = [{x1: 40, y1: 330, x2: 340, y2: 360, handler: ()=>{window.location.href = "https://infernal3.github.io/#"} }];
    cx().reset();
    cx().font = "30px monospace";
    cx().fillText("Quit Game", 40, 360);
    if(wx() < 640 || wy() < 640) {
        cx().font = "14px monospace";
        cx().fillText("Your screen is too small to play!", 0, 40);
        cx().fillText(`Current dims: (${wx()}, ${wy()})`, 0, 80);
        cx().fillText(`Required: (640, 640) or more`, 0, 120);
        return;
    }
    clickables.push({x1: 40, y1: 210, x2: 340, y2: 240, handler: StartGame});
    clickables.push({x1: 40, y1: 270, x2: 340, y2: 300, handler: Options});
    cx().fillText("Start Game", 40, 240);
    cx().fillText("Options", 40, 300);
}
const Options = function() {
    clickables = [];
    cx().reset();
    data.menu = 2;
    cx().font = "35px monospace";
    cx().fillText("Options Menu", 180, 60);
    
    cx().font = "16px monospace";
    cx().fillText("[WORK IN PROGRESS]", 20, 200);
    cx().fillText(`Difficulty coefficient: ${data.options.difficulty.toFixed(3)}`, 20, 240);
    cx().strokeRect(25, 280, 200, 30);
    cx().strokeRect(300, 280, 200, 30);
    cx().fillText("Increase Difficulty", 25, 300);
    clickables.push({x1: 25, x2: 225, y1: 280, y2: 310, handler: () => {
        data.options.difficulty *= 1.1;
        if(data.options.difficulty > 10) data.options.difficulty = 10.834705943388395;
        Options();
    } });
    clickables.push({x1: 300, x2: 500, y1: 280, y2: 310, handler: () => {
        data.options.difficulty /= 1.1;
        if(data.options.difficulty < 0.7) data.options.difficulty = 0.6830134553650705;
        Options();
    } });
    cx().fillText("Decrease Difficulty", 300, 300);
    cx().font = "30px monospace";
    cx().fillText(`Return to menu`, 20, 520);
    clickables.push({x1: 20, x2: 520, y1: 500, y2: 540, handler: TitleScreen});
}
const StartGame = function() {
    clickables = [];
    cx().reset();
    data.menu = -1;
    data.player = {x: 320, y: 320};
    data.playerHealth = 3;
    data.bullets = [];
    data.controls = {left: false, up: false, down: false, right: false};
    data.lastUpdate = data.lastSpawnTry = data.startTime = Date.now();
    data.bufferID = window.setInterval(GameTick, 25);
}
const GameTick = function() {
    GameUpdateTick(Date.now() - data.lastUpdate);
    GameDrawTick();
}
const GameUpdateTick = function(dt) {
    data.lastUpdate = Date.now();
    PlayerMoveFunction(0.12727922061357858 * dt, 0.18 * dt);
    let removable = [];
    if(Date.now() - data.lastSpawnTry > (1700 / data.options.difficulty)){
        data.lastSpawnTry = Date.now();
        let array = ["wave1", "wave2", "wave3", "wave4", "ambient1", "ambient2", "ambient3", "ambient4", "line1", "line2"];
        if(data.options.difficulty > 1.4){
            array.push("medium1", "medium2");
        } if(data.options.difficulty > 1.7){
            array.push("medium3", "medium4");
        } if(data.options.difficulty > 2){
            S_DATA.hard = [`${data.player.x-120} ${data.player.y-120} 40 5.49778714378 5 1`,
                           `${data.player.x-120} ${data.player.y+120} 40 0.7853981633974483 5 1`,
                           `${data.player.x+120} ${data.player.y+120} 40 2.356194490192345 5 1`,
                           `${data.player.x+120} ${data.player.y-120} 40 3.9269908169872414 5 1`
                          ];
            array.push("hard");
        }
        SpawnFunction(S_DATA[array[parseInt(Math.random() * array.length)]]);
    }
    for(let i=0;i<data.bullets.length;i++){
        SPEED_MODIFIER = data.options.difficulty * dt/1000;
        data.bullets[i].x += (data.bullets[i].xv * SPEED_MODIFIER);
        data.bullets[i].y += (data.bullets[i].yv * SPEED_MODIFIER);
        let dcoef = Math.sqrt(Math.pow(data.player.x - data.bullets[i].x, 2) + Math.pow(data.player.y - data.bullets[i].y, 2));
        if(dcoef <= 16 + data.bullets[i].r) {
            // A collision occurred!
            data.bullets[i].removeFlag = true;
            console.log("player took damage from bullet: "+JSON.stringify(data.bullets[i]));
            data.playerHealth--;
            if(data.playerHealth <= 0) GameOver();
        }
        data.bullets[i].l -= dt/1000;
        if(data.bullets[i].l < 0) data.bullets[i].removeFlag = true;
    }
    data.bullets = data.bullets.filter(RemovableFilters);
}
const GameOverDrawImageHelper = function() {
    cx().drawImage(this, 50, 25, 540, 324);
}
const GameOver = function() {
    window.clearInterval(data.bufferID);
    data.menu = 4;
    window.setTimeout(()=>{
        cx().reset();
        let img = new Image();
        img.src = "https://infernal3.github.io/moltendye/image/game_over.png";
        img.width = "40px";
        img.height = "24px";
        img.addEventListener("load",GameOverDrawImageHelper);
        cx().font = "20px monospace";
        cx().fillText(`You survived ${((data.lastUpdate-data.startTime)/1000)} seconds.`, 100, 400);
        cx().font = "30px monospace";
        cx().fillText(`Return to menu`, 100, 460);
        clickables = [{x1: 100, x2: 600, y1: 440, y2: 480, handler: TitleScreen}];
    }, 200);
}
const PlayerMoveFunction = function(DIAGONAL, STRAIGHT){
    switch((data.controls.left ? 8 : 0) + (data.controls.up ? 4 : 0) + (data.controls.down ? 2 : 0) + (data.controls.right ? 1 : 0)){
        case 12:
            data.player.x -= DIAGONAL;
            data.player.y -= DIAGONAL;
            break;
        case 5:
            data.player.x += DIAGONAL;
            data.player.y -= DIAGONAL;
            break;
        case 10:
            data.player.x -= DIAGONAL;
            data.player.y += DIAGONAL;
            break;
        case 3:
            data.player.x += DIAGONAL;
            data.player.y += DIAGONAL;
            break;
        case 8:
        case 14:
            data.player.x -= STRAIGHT;
            break;
        case 4:
        case 13:
            data.player.y -= STRAIGHT;
            break;
        case 2:
        case 11:
            data.player.y += STRAIGHT;
            break;
        case 1:
        case 7:
            data.player.x += STRAIGHT;
            break;
    }
    data.player.x = Math.max(16, Math.min(604, data.player.x));
    data.player.y = Math.max(16, Math.min(604, data.player.y));
}
const SpawnFunction = function(arr) {
    for(let i of arr){
        let strs = i.split(" ");
        data.bullets.push({
            x: parseFloat(strs[0]),
            y: parseFloat(strs[1]),
            xv: parseFloat(strs[2]) * Math.cos(strs[3]),
            yv: parseFloat(strs[2]) * -1 * Math.sin(strs[3]),
            r: parseFloat(strs[4]),
            l: parseFloat(strs[5]),
            removeFlag: false
        });
    }
}
const GameDrawTick = function() {
    cx().reset();
    cx().rect(2, 2, 620, 620);
    cx().stroke();
    cx().beginPath();
    cx().arc(data.player.x, data.player.y, 16, 0, 2 * Math.PI, false);
    cx().stroke();
    
    for(let i of data.bullets){
        cx().beginPath();
        cx().arc(i.x, i.y, i.r, 0, 2 * Math.PI, false);
        cx().stroke();
    }
}
window.addEventListener("contextMenu",PreventDefault,{passive: false});
cv().addEventListener("mouseup",ClickHandler,{passive: true});
window.addEventListener("load",LoadFunction,{passive: true});
window.addEventListener("keyup",KeyUpHandler,{passive: true});
window.addEventListener("keydown",KeyDownHandler,{passive: true});
