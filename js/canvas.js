/**
 * Original script by infernal3 - Moltendye
 */
const el = e => document.getElementById(e);
const cv = () => el("app");
const cx = () => cv().getContext("2d");
const wx = () => window.innerWidth;
const wy = () => window.innerHeight;
const data = {menu: 0};
var clickables = [];

const LoadFunction = function() {
    cv().width = wx() - 16;
    cv().height = wy() - 16;
    TitleScreen();
}
const PreventDefault = function(E) { E.preventDefault(); }
const ClickHandler = function(E) {
    for (var i of clickables){
        if((typeof i)==='object'){
            if(i.x1 <= E.offsetX && i.x2 >= E.offsetX && i.y1 <= E.offsetY && i.y2 >= E.offsetY) i.handler();
        }
    }
}
const TitleScreen = function() {
    clickables = [{x1: 40, y1: 330, x2: 340, y2: 360, handler: ()=>{window.location.href = "https://infernal3.github.io/#"} }];
    cx().reset();
    cx().font = "30px monospace";
    cx().fillText("Quit Game", 40, 360);
    if(wx() < 640 || wy() < 640) {
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
    data.controls = {left: false, up: false, down: false, right: false};
    data.lastUpdate = Date.now();
    window.setInterval(GameTick, 25);
}
const GameTick = function() {
    GameUpdateTick(Date.now() - data.lastUpdate());
    GameDrawTick();
}
const GameUpdateTick = function(dt) {
    var DIAGONAL = 0.028284271247461905 * dt, STRAIGHT = 0.04 * dt;
    data.lastUpdate = Date.now();
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
}
const GameDrawTick = function() {
    cx().reset();
    cx().rect(2, 2, 620, 620);
    cx().stroke();
    cx().beginPath();
    cx().circle(data.player.x, data.player.y, 16, 0, 2 * Math.PI, false);
    cx().stroke();
}
cv().addEventListener("contextMenu",PreventDefault,{passive: false});
cv().addEventListener("mouseup",ClickHandler,{passive: true});
window.addEventListener("load",LoadFunction,{passive: true});
