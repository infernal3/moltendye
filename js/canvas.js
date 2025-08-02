/**
 * Original script by infernal3
 */
const el = e => document.getElementById(e);
const cv = () => el("app");
const cx = () => cv().getContext("2d");
const wx = () => window.innerWidth;
const wy = () => window.innerHeight;
const data = {menu: 0, options: {difficulty: 1, color: 1, tps: 30, debug: false}, achievements: []};
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
    cx().fillStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    cx().strokeStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
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
    clickables.push({x1: 300, y1: 270, x2: 620, y2: 300, handler: Achievements});
    cx().fillText("Start Game", 40, 240);
    cx().fillText("Options", 40, 300);
    cx().fillText("Achievements", 300, 300);
    cx().fillText("infernal3's Bullet Hell", 20, 50);
}
const Options = function() {
    clickables = [];
    cx().reset();
    cx().fillStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    cx().strokeStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    data.menu = 2;
    cx().font = "35px monospace";
    cx().fillText("Options Menu", 180, 60);
    
    cx().font = "16px monospace";
    cx().fillText("Movement Controls: WASD (Cannot change)", 20, 105);
    cx().fillText(`Ticks/Second: ${data.options.tps}`, 20, 130);
    cx().strokeRect(25, 170, 200, 30);
    cx().fillText("Change Ticks/Second", 30, 190);
    clickables.push({x1: 25, x2: 225, y1: 170, y2: 200, handler: () => {
        data.options.tps = data.options.tps > 100 ? 15 : data.options.tps * 2;
        Options();
    } });
    cx().fillText(`Difficulty coefficient: ${data.options.difficulty.toFixed(3)}`, 20, 240);
    cx().strokeRect(25, 280, 200, 30);
    cx().strokeRect(300, 280, 200, 30);
    cx().fillText("Increase Difficulty", 30, 300);
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
    cx().fillText("Decrease Difficulty", 305, 300);
    cx().fillText(`Color scheme: ${data.options.color == 1 ? "Light":"Dark"}`, 20, 350);
    cx().fillText("Change color scheme", 30, 410);
    cx().strokeRect(25, 390, 200, 30);
    clickables.push({x1: 25, x2: 225, y1: 390, y2: 420, handler: () => {
        data.options.color = 1 - data.options.color;
        document.body.style = `background-color: ${data.options.color == 1 ? "#fdfdfd" : "#000000"} !important;`;
        cx().strokeStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
        Options();
    } });
    cx().fillText(`Debug Info: ${data.options.debug ? "ON" : "OFF"}`, 20, 460);
    cx().fillText("Toggle Debug Info", 30, 520);
    cx().strokeRect(25, 500, 200, 30);
    clickables.push({x1: 25, x2: 225, y1: 500, y2: 530, handler: () => {
        data.options.debug = !data.options.debug;
        Options();
    } });
    cx().font = "30px monospace";
    cx().fillText(`Return to menu`, 20, 580);
    clickables.push({x1: 20, x2: 500, y1: 550, y2: 580, handler: TitleScreen});
}
const Achievements = function() {
    clickables = [];
    cx().reset();
    cx().fillStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    cx().strokeStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    data.menu = 12;
    cx().font = "35px monospace";
    cx().fillText("Achievements Menu", 120, 60);
    cx().font = "14px monospace";
    cx().fillText(`${data.achievements.length} / 9 unlocked`, 180, 100);
    cx().strokeRect(40, 120, 120, 120);
    cx().strokeRect(160, 120, 120, 120);
    cx().strokeRect(280, 120, 120, 120);
    cx().strokeRect(40, 240, 120, 120);
    cx().strokeRect(160, 240, 120, 120);
    cx().strokeRect(280, 240, 120, 120);
    cx().strokeRect(40, 360, 120, 120);
    cx().strokeRect(160, 360, 120, 120);
    cx().strokeRect(280, 360, 120, 120);

    cx().font = "30px monospace";
    cx().fillText(`Return to menu`, 20, 580);
    clickables.push({x1: 20, x2: 500, y1: 550, y2: 580, handler: TitleScreen});
}
const StartGame = function() {
    clickables = [];
    cx().reset();
    cx().fillStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    cx().strokeStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    data.menu = -1;
    data.player = {x: 320, y: 320};
    data.playerHealth = 3;
    data.bullets = [];
    data.controls = {left: false, up: false, down: false, right: false};
    data.lastUpdate = data.lastSpawnTry = data.startTime = Date.now();
    data.bufferID = window.setInterval(GameTick, parseInt(1000 / data.options.tps));
}
const GameTick = function() {
    GameUpdateTick(Date.now() - data.lastUpdate);
    GameDrawTick();
}
const GameUpdateTick = function(dt) {
    data.lastUpdate = Date.now();
    PlayerMoveFunction(0.12727922061357858 * dt, 0.18 * dt);
    let removable = [];
    let Ecoef = data.options.difficulty + ((data.lastUpdate - data.startTime)/360000);
    if(Date.now() - data.lastSpawnTry > (1700 / Ecoef)){
        data.lastSpawnTry = Date.now();
        
        let array = ["wave1", "wave2", "wave3", "wave4", "ambient1", "ambient2", "ambient3", "ambient4", "line1", "line2"];
        if(Ecoef > 1.4){
            array.push("medium2", "medium4"); // see spawns.js for more info
        } if(Ecoef > 1.7){
            array.push("medium1", "medium3");
        } if(Ecoef > 2){
            S_DATA.hard = [`${data.player.x-120} ${data.player.y-120} 50 5.49778714378 5 2`,
                           `${data.player.x-120} ${data.player.y+120} 50 0.7853981633974483 5 2`,
                           `${data.player.x+120} ${data.player.y+120} 50 2.356194490192345 5 2`,
                           `${data.player.x+120} ${data.player.y-120} 50 3.9269908169872414 5 2`
                          ];
            array.push("hard");
        }
        SpawnFunction(S_DATA[array[parseInt(Math.random() * array.length)]]);
    }
    for(let i=0;i<data.bullets.length;i++){
        SPEED_MODIFIER = Ecoef * dt/1000;
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
        cx().fillStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
        cx().strokeStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
        let img = new Image();
        img.src = "https://infernal3.github.io/moltendye/image/game_over.png";
        img.width = "40px";
        img.height = "24px";
        img.addEventListener("load",GameOverDrawImageHelper);
        cx().font = "20px monospace";
        cx().fillText(`You survived ${((data.lastUpdate-data.startTime)/1000)} seconds.`, 100, 400);
        cx().fillText(`Your difficulty coefficient was ${data.options.difficulty.toFixed(3)}.`, 100, 430);
        cx().font = "30px monospace";
        cx().fillText(`Return to menu`, 100, 470);
        clickables = [{x1: 100, x2: 600, y1: 440, y2: 480, handler: TitleScreen}];
        if(data.options.debug) DrawDebugInfo();
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
    cx().fillStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    cx().strokeStyle = data.options.color == 1 ? "#000000" : "#fdfdfd";
    cx().rect(2, 2, 620, 620);
    cx().stroke();
    cx().beginPath();
    cx().arc(data.player.x, data.player.y, 16, 0, 2 * Math.PI, false);
    cx().stroke();
    cx().font = "11px monospace";
    cx().fillText(""+data.playerHealth, data.player.x-2, data.player.y+5);
    for(let i of data.bullets){
        cx().beginPath();
        cx().arc(i.x, i.y, i.r, 0, 2 * Math.PI, false);
        cx().stroke();
    }
    if(data.options.debug) DrawDebugInfo();
}
const DrawDebugInfo = function() {
    cx().font = "11px monospace";
    cx().fillText("player: "+JSON.stringify(data.player), 640, 50);
    cx().fillText("playerHealth: "+data.playerHealth, 640, 65);
    cx().fillText("bullets: "+data.bullets.length, 640, 80);
    cx().fillText("bulletsRaw: "+JSON.stringify(data.bullets), 640, 200);
    cx().fillText("controls: "+JSON.stringify(data.controls), 640, 95);
    cx().fillText("options: "+JSON.stringify(data.options), 640, 110);
    cx().fillText("lastUpdate: "+data.lastUpdate, 640, 125);
    cx().fillText("lastSpawnTry: "+data.lastSpawnTry, 640, 140);
    cx().fillText("startTime: "+data.startTime, 640, 155);
    cx().fillText("effective_difficulty: "+(data.options.difficulty + ((data.lastUpdate - data.startTime)/360000)), 640, 170);
}
window.addEventListener("contextMenu",PreventDefault,{passive: false});
cv().addEventListener("mouseup",ClickHandler,{passive: true});
window.addEventListener("load",LoadFunction,{passive: true});
window.addEventListener("keyup",KeyUpHandler,{passive: true});
window.addEventListener("keydown",KeyDownHandler,{passive: true});
