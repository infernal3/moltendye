/**
 * Original script by infernal3 - Moltendye
 */
const el = e => document.getElementById(e);
const cv = () => el("app");
const cx = () => cv().getContext("2d");
const wx = () => window.innerWidth;
const wy = () => window.innerHeight;
const data = {menu: 0};
console.log("debug flag 0");
const TitleScreen = function() {
    cx().reset();
    cx().font = "30px monospace";
    console.log("debug flag 1");
    if(wx() < 640 || wy() < 640) {
        cx().fillText("Your screen is too small to play this!", 0, 0);
        cx().fillText(`Current dims: (${wx()}, ${wy()})`, 0, 40);
        cx().fillText(`Required: (640, 640) or more`, 0, 40);
        return;
    }
    cx().fillText("Start Game", 40, 240);
    cx().fillText("Options", 40, 300);
    cx().fillText("Quit Game", 40, 360);
    console.log("debug flag 2");
}
window.addEventListener("load",TitleScreen,{passive: true});
