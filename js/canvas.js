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
    clickables.push({x1: 40, y1: 210, x2: 340, y2: 240, handler: ()=>{console.log("Start Game")} });
    clickables.push({x1: 40, y1: 270, x2: 340, y2: 300, handler: ()=>{console.log("Options")} });
    cx().fillText("Start Game", 40, 240);
    cx().fillText("Options", 40, 300);
}
cv().addEventListener("contextMenu",PreventDefault,{passive: false});
cv().addEventListener("mouseup",ClickHandler,{passive: true});
window.addEventListener("load",LoadFunction,{passive: true});
