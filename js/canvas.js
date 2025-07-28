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
    clickables.push({x1: 40, y1: 270, x2: 340, y2: 300, handler: ()=>{console.log("Options")} });
    cx().fillText("Start Game", 40, 240);
    cx().fillText("Options", 40, 300);
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
    if(Date.now() - data.lastSpawnTry > 1700){
        data.lastSpawnTry = Date.now();
        index = ["wave1", "wave2", "wave3", "wave4", "ambient1", "ambient2", "ambient3", "ambient4", "line1", "line2"][parseInt(Math.random() * 10)];
        SpawnFunction(S_DATA[index]);
    }
    for(let i=0;i<data.bullets.length;i++){
        data.bullets[i].x += (data.bullets[i].xv * dt/1000);
        data.bullets[i].y += (data.bullets[i].yv * dt/1000);
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
const GameOver = function() {
    window.clearInterval(data.bufferID);
    data.menu = 4;
    window.setTimeout(()=>{
        cx().reset();
        let img = new Image();
        img.src = "./image/game_over.png"
        cx().drawImage(img, 50, 0, 540, 324)
        cx().font = "20px monospace";
        cx().fillText(`You survived ${((data.lastUpdate-data.startTime)/1000)} seconds.`, 100, 400);
    }, 500);
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
