"use strict";
const ISGITHUB = (window.location.host == "erikrospo.github.io");
const ISDEBUG = (window.location.search.includes("debug"));
const ISDEV = (window.location.search.includes("dev"));
const ISPROD = (ISGITHUB && !ISDEBUG && !ISDEV);
const SHOWDEBUG = (ISDEBUG || ISDEV);
const PRODUCTION = (ISPROD && ISGITHUB);
const PROD = (PRODUCTION);
const ISLOCAL = (window.location.hostname == "localhost");
const ISLOCALIP = (window.location.hostname.startsWith("127.0.0"));
const DEBUGFLAG = (!PROD || ISDEBUG || ISDEV);
function deviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
}
const ISMOBILE = (deviceType() == "mobile");
const ISTABLET = (deviceType() == "tablet");
const ISDESKTOP = (deviceType() == "desktop");
const MOBILEVIEW = (ISMOBILE || ISTABLET || window.location.search.includes("ForceMobile"));
let SFXMuted = true;
let OptionsOpen = false;
let browserType = navigator;
console.log(browserType);
const performanceMode = true;
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
c.shadowBlur = 20;
c.shadowColor = "black";
const scoreEL = document.querySelector("#scoreEL");
const MoneyEL = document.querySelector("#moneyEL");
const ShopMoney = document.querySelector("#ShopMoney");
const startGameButton = document.querySelector("#StartGameWrapper");
const HighScoreLabel = document.querySelector("#highScoreTextModal");
const ModalEL = document.querySelector("#ModalEL");
const TitleEL = document.querySelector("#titleElement");
const BigScoreEL = document.querySelector("#BigScoreEL");
const BigScoreELLabel = document.querySelector("#PointsLabelEL");
const NameDiv = document.querySelector("#NameInputDiv");
const HighScoreList = document.querySelector("#HighScore");
HighScoreList.style.display = "block";
let relPath = PROD ? "/CanvasShooter/" : "";
const ShootSound = new Audio(relPath + "Audio/sound/Shoot.wav");
const HitNoKillSound = new Audio(relPath + "Audio/sound/HitNoKill.wav");
const HitAndKillSound = new Audio(relPath + "Audio/sound/HitAndKill.wav");
const HealthGetSound = new Audio(relPath + "Audio/sound/HealthGet.wav");
const HealthLoseSound = new Audio(relPath + "Audio/sound/HealthLose.wav");
const MissSound = new Audio(relPath + "Audio/sound/Miss.wav");
const Music1 = new Audio(relPath + "Audio/music/Music1.mp3");
Music1.muted = true;
const Music2 = new Audio("Audio/music/Music2.mp3");
const Music3 = new Audio("Audio/music/Music3.mp3");
const Music4 = new Audio("Audio/music/Music4.mp3");
const Music5 = new Audio("Audio/music/Music5.mp3");
const PauseModal = document.querySelector("#PauseModal");
const PauseModalScore = document.querySelector("#PauseModalScore");
const PauseModalScoreLabel = document.querySelector("#PauseModalScoreLabel");
const PauseModalOptionsButton = document.querySelector("#PauseModalOptionsButton");
const PauseModalPlayButton = document.querySelector("#PauseModalPlayButton");
const PauseModalOpenerButton = document.querySelector("#PauseMenuOpenerButton");
const PauseModalOpenerIcon = document.querySelector("#PauseOpenerIcon");
const OptionsMenu = document.querySelector("#OptionsModal");
const OptionsSFXSlider = document.querySelector("#SFXSlider");
const OptionsMusicSlider = document.querySelector("#MusicSlider");
const OptionsParticleSwitch = document.querySelector("#ParticleOptionsSwitch");
const OptionsBackButton = document.querySelector("#OptionsBackButton");
const OptionsParticleSpan = document.querySelector("#ParticleOptionsSpan");
const OptionsAimSlider = document.querySelector("#OptionsAimSlider");
if (DEBUGFLAG) {
    console.log(OptionsAimSlider);
}
const debugDiv = document.querySelector("#debugDiv");
const debugList = document.querySelector("#debugList");
const w = canvas.width;
const h = canvas.height;
const cw = w / 2;
const ch = h / 2;
function logx(val, base) {
    return Math.log(val) / Math.log(base);
}
function random(min = 0, max = 1) {
    return map(Math.random(), 0, 1, min, max);
}
function randomInt(min, max) {
    return Math.floor(random(min, max));
}
function map(input, input_start, input_end, output_start, output_end) {
    return output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start);
}
function threshold(p1, p2, t) {
    return (Math.sqrt((Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2))) - (2 * t) < 0);
}
function FrameIDToTime(ID) {
    var Second = ID / 60;
    return Second;
}
function distance(x1, y1, x2, y2) {
    return Math.pow(((Math.pow((x1 - x2), 2)) + (Math.pow((y1 - y2), 2))), 0.5);
}
function randomChoice(value) {
    let i = Math.floor(random() * value.length);
    return value[i];
}
function randomChoiceNot(value, not, iterations = value.length) {
    let i = randomChoice(value);
    let ic = 0;
    while (i in not && ic < iterations) {
        i = randomChoice(value);
        ic++;
    }
    if (ic >= iterations) {
        console.log("randomChoiceNot failed");
        return undefined;
    }
    return i;
}
function randomNot(min, max, not) {
    let i = random(min, max);
    while (i in not) {
        i = random(min, max);
    }
    return i;
}
function intBetweenNot(min, max, not) {
    let i = randomInt(min, max);
    while (i in not) {
        i = randomInt(min, max);
    }
    return i;
}
function coinFlip(bias = 0.5) {
    return (random() > bias);
}
function clip(n, min, max) {
    return Math.min(Math.max(n, min), max);
}
function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}
function strictScale(i, imin, imax, omin, omax) {
    return clip(map(clip(i, imin, imax), imin, imax, omin, omax), omin, omax);
}
function sum(input) {
    let result = 0;
    for (let index = 0; index < input.length; index++) {
        result += input[index];
    }
    return result;
}
function minl(numbers) {
    let v = numbers[0];
    for (let i = 0; i <= numbers.length; i++) {
        v = Math.min(v, numbers[i]);
    }
    return v;
}
function maxl(numbers) {
    let v = numbers[0];
    for (let i = 0; i <= numbers.length; i++) {
        v = Math.max(v, numbers[i]);
    }
    return v;
}
function smoothStep(x, min, max) {
    let t = (x - min) / (max - min);
    return t * t * (3 - 2 * t);
}
function sigmoid(x, k) {
    return 1 / (1 + Math.exp(-k * x));
}
function smoothSigmoid(x, k) {
    return smoothStep(sigmoid(x, k), 0, 1);
}
function min(...numbers) {
    let v = numbers[0];
    for (let i = 0; i < numbers.length; i++) {
        v = Math.min(v, numbers[i]);
    }
    return v;
}
function max(...numbers) {
    let v = numbers[0];
    for (let i = 0; i < numbers.length; i++) {
        v = Math.max(v, numbers[i]);
    }
    return v;
}
function round(Value, Place = 1) {
    return Math.round(Value / (Math.pow(10, Place))) * (Math.pow(10, Place));
}
function floor(Value, Place = 1) {
    return Math.floor(Value / (Math.pow(10, Place))) * (Math.pow(10, Place));
}
function ceil(Value, Place = 1) {
    return Math.ceil(Value / (Math.pow(10, Place))) * (Math.pow(10, Place));
}
function AddDebugItem(value, id) {
    if (!DEBUGFLAG) {
        return null;
    }
    var node = document.createElement("li");
    node.id = id;
    node.innerText = id + ": " + value.toString();
    node.classList.add("debugItem");
    debugList.appendChild(node);
    return debugList;
}
function SetDebugItem(value, id, label) {
    if (!DEBUGFLAG) {
        return null;
    }
    var node = document.getElementById(id);
    if (node == null) {
        AddDebugItem(value, id);
        node = document.getElementById(id);
    }
    if (node == null) {
        return null;
    }
    if (label == undefined || label == null) {
        label = id;
    }
    node.innerText = label + ": " + value.toString();
    return node;
}
AddDebugItem(0, "playerHealth");
AddDebugItem(innerWidth, "windowWidth");
AddDebugItem(innerHeight, "windowHeight");
AddDebugItem((Math.sqrt(w * w + h * h) / 2000), "EnemySpeedMultiplier");
AddDebugItem(window.location.href, "Url");
AddDebugItem(0, "MaxEnemies");
function CreateHealth(health, MaxHealth) {
    let Health = new HealthBar(health, MaxHealth);
    return Health;
}
class HealthBar {
    constructor(health, MaxHealth) {
        this.health = health;
        this.MaxHealth = MaxHealth;
    }
    get Health() {
        return this.health;
    }
    get maxHealth() {
        return this.MaxHealth;
    }
    set Health(health) {
        this.health = health;
        this.draw();
    }
    set maxHealth(MaxHealth) {
        this.MaxHealth = MaxHealth;
        this.draw();
    }
    addHealth(health) {
        if (this.health < this.maxHealth) {
            this.health += health;
        }
        this.draw();
        return this.health;
    }
    removeHealth(health = 1) {
        this.health -= health;
        this.draw();
        return this.health;
    }
    get willDie() {
        return ((this.health - 1) <= 0);
    }
    get dead() {
        return this.health == 0;
    }
    draw() {
        let healthBarEl = document.getElementById("healthBar");
        if (healthBarEl == null) {
            throw new Error("Health bar element not found");
        }
        let healthBarSpanCount = healthBarEl.children.length;
        let healthBarSpanMax = this.MaxHealth;
        for (let i = 0; i < healthBarSpanCount; i++) {
            try {
                healthBarEl.removeChild(healthBarEl.children[0]);
            }
            catch (error) {
                if (error instanceof TypeError) {
                    console.log("Health bar span not found");
                }
                else if (error instanceof RangeError) {
                    console.log("Health bar span not found");
                }
                else if (error instanceof ReferenceError) {
                    console.log("Health bar span not found");
                }
                console.log("Health bar span not found");
            }
        }
        for (let i = 0; i < healthBarSpanMax; i++) {
            let healthBarSpan = document.createElement("span");
            healthBarSpan.classList.add("material-icons");
            healthBarSpan.classList.add("healthBarSpan");
            healthBarEl.appendChild(healthBarSpan);
        }
        let healthBarSpans = healthBarEl.children;
        for (let i = 0; i < healthBarSpanMax; i++) {
            var el = healthBarSpans.item(i);
            el.innerText = "favorite";
            if (i < this.health) {
                el.style.color = "red";
            }
            else {
                el.style.color = "grey";
            }
        }
    }
}
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.Damage = 10;
        this.ShotSpeed = 5;
        this.ShotsFired = 1;
        this.MultiShot = 1;
        this.AutoFire = false;
        this.AutoRotate = false;
        this.ShotSize = 5;
        this.Health = CreateHealth(5, 5);
        this.Health.draw();
        this.spread = 0.2;
        this.barrelRadius = this.radius * (this.ShotSpeed / 2.5);
        SetDebugItem(this.Health.Health, "playerHealth");
    }
    update() {
        SetDebugItem(this.Health.Health, "playerHealth");
        this.draw();
        this.drawHealth();
    }
    drawHealth() {
        this.Health.draw();
    }
    draw() {
        renderWireframe(this, "player");
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, TWOPI, false);
        c.fill();
        if (ShowPlayerAim) {
            let m_angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
            let p1 = { x: this.radius * Math.cos(m_angle - this.spread) + this.x, y: this.radius * Math.sin(m_angle - this.spread) + this.y };
            let p2 = { x: this.radius * Math.cos(m_angle + this.spread) + this.x, y: this.radius * Math.sin(m_angle + this.spread) + this.y };
            let p3 = { x: this.barrelRadius * Math.cos(m_angle - this.spread * 1 / (this.barrelRadius / this.radius)) + this.x, y: this.barrelRadius * Math.sin(m_angle - this.spread * 1 / (this.barrelRadius / this.radius)) + this.y };
            let p4 = { x: this.barrelRadius * Math.cos(m_angle + this.spread * 1 / (this.barrelRadius / this.radius)) + this.x, y: this.barrelRadius * Math.sin(m_angle + this.spread * 1 / (this.barrelRadius / this.radius)) + this.y };
            c.moveTo(p1.x, p1.y);
            c.lineTo(p2.x, p2.y);
            c.lineTo(p4.x, p4.y);
            c.lineTo(p3.x, p3.y);
            c.lineTo(p1.x, p1.y);
            c.fill();
        }
    }
    get willDie() {
        return this.Health.willDie;
    }
}
class Projectile {
    constructor(x, y, r, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
    }
    draw() {
        renderWireframe(this, "projectile");
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, TWOPI, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    get IsOffScreen() {
        return ((this.x + this.radius < 0) ||
            (this.y + this.radius < 0) ||
            (this.x - this.radius > w) ||
            (this.y - this.radius > h));
    }
}
class Enemy {
    constructor(x, y, r, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = color;
        this.velocity = velocity;
        this.startingRadius = this.radius;
        this.minHealth = 5;
        this.timeCreated = Date();
        this.burning = false;
    }
    draw() {
        renderWireframe(this, "enemy");
        if (this.burning) {
            c.beginPath();
            c.arc(this.x, this.y, this.radius + 5, 0, TWOPI);
            c.fillStyle = 'rgb(255,0,0);';
            c.fill();
        }
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, TWOPI, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.IsDead || this.radius < 0) {
            return "dead";
        }
        try {
            this.draw();
        }
        catch (e) {
            if (e instanceof DOMException) {
                console.log("DOMException");
                return "dead";
            }
            else {
                alert("Error: " + e);
                throw e;
            }
        }
        return "alive";
    }
    ShouldDie(damage) {
        return (this.radius - damage < this.minHealth);
    }
    get IsDead() {
        return this.radius < this.minHealth;
    }
    damage(amount) {
        this.radius -= amount;
        return this.IsDead;
    }
}
class Particle {
    constructor(x, y, r, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        renderWireframe(this, "particle");
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, TWOPI, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= ParticleFriction;
        this.velocity.y *= ParticleFriction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= random(0.001, 0.025) * ParticleFadeSpeedMultiplier;
    }
}
class HighScore {
    constructor() {
        this.scores = [];
    }
    addScore(score) {
        if (score != 0)
            this.scores.push(score);
        this.sort();
    }
    sort() {
        this.scores.sort((a, b) => a - b);
        this.scores.reverse();
    }
    isHighScore(score) {
        return this.scores.every((value) => { return value < score; });
    }
    get Html() {
        let ScoreElement = document.createElement("ol");
        this.sort();
        for (let index = 0; index < Math.min(this.scores.length, 10); index++) {
            const element = this.scores[index];
            var node = document.createElement("li");
            switch (index) {
                case 0:
                    node.style.color = "#ffd700";
                    node.appendChild(document.createTextNode(element.toString(10)));
                    break;
                case 1:
                    node.style.color = "#c0c0c0";
                    node.appendChild(document.createTextNode(element.toString(10)));
                    break;
                case 2:
                    node.style.color = "#CD7F32";
                    node.appendChild(document.createTextNode(element.toString(10)));
                    break;
                default:
                    node.style.color = "#FFFFFF";
                    node.appendChild(document.createTextNode(element.toString(10)));
                    break;
            }
            ScoreElement.appendChild(node);
        }
        ScoreElement.style.display = "block";
        return ScoreElement.innerHTML;
    }
}
class Music {
    constructor(music) {
        this.music = music;
        this.current = 0;
        this.volume = 1;
        this.muted = false;
        this.Continue = true;
    }
    get Current() {
        return this.music[this.current];
    }
    get Volume() {
        return this.volume;
    }
    set Volume(value) {
        this.volume = value;
        this.music.forEach((value) => {
            value.volume = this.volume;
        });
        this.muted = this.volume == 0;
    }
    get Muted() {
        return this.muted;
    }
    set Muted(value) {
        this.muted = value;
        this.music.forEach((value) => {
            value.muted = this.muted;
        });
    }
    play() {
        this.stopAll();
        try {
            this.music[this.current].play();
        }
        catch (DOMException) {
            return;
        }
    }
    pause() {
        this.music[this.current].pause();
    }
    next() {
        this.current = (this.current + 1) % this.music.length;
        this.music[this.current].play();
    }
    previous() {
        this.current = (this.current - 1 + this.music.length) % this.music.length;
        this.music[this.current].play();
    }
    toggle() {
        if (this.music[this.current].paused) {
            this.music[this.current].play();
        }
        else {
            this.music[this.current].pause();
        }
    }
    shuffle() {
        this.current = randomInt(0, this.music.length - 1);
        this.music[this.current].play();
    }
    set continue(value) {
        this.Continue = value;
        if (this.Continue) {
            this.music[this.current].onended = () => {
                this.next();
            };
        }
        else {
            this.music[this.current].onended = () => {
                this.music[this.current].pause();
            };
        }
    }
    stop() {
        this.music[this.current].pause();
        this.music[this.current].currentTime = 0;
    }
    stopAll() {
        this.music.forEach((value) => {
            value.pause();
            value.currentTime = 0;
        });
    }
    get playing() {
        let count = 0;
        this.music.forEach((value) => {
            if (!value.paused) {
                count++;
            }
        });
        return count;
    }
}
const EnemySpawnTimeDecrement = 1;
const EnemySpawnBias = innerHeight / innerWidth;
const EnemyMultiplier = (Math.sqrt(w * w + h * h) / 2000);
const ProjectileSpeedMultiplier = 1;
const ProjectileColor = "white";
const PlayerColor = "white";
const PlayerRadius = 10;
const BackgroundColor = "0,0,0";
const ParticleFriction = 0.99;
const ParticleMultiplier = 2;
const ParticleSpeed = 5;
const ParticleFadeSpeedMultiplier = 1;
const ParticleCap = 50;
let MaxEnemies = 10;
const RenderWireframe = false;
const PI = Math.PI;
const TWOPI = PI * 2;
let player = new Player(cw, ch, PlayerRadius, PlayerColor);
let projectiles = [];
let enemies = [];
let particles = [];
let GameStarted = false;
let UseParticles = true;
let Paused = false;
let ShopOpen = false;
let MusicMuted = true;
let lastInterval;
let EnemySpawnTime = 50;
let animationID;
let score = 0;
let DefaultEnemySpawnTime = 50;
let enemiesToRemove = [];
let Scores = new HighScore();
let lastScore = 0;
let HealthFreq = 25000;
let EnemySpeedMult = 1;
let EnemyUpFreq = 5000;
let HS = true;
let MusicPlayer = new Music([Music1]);
MusicPlayer.play();
let ShowPlayerAim = false;
let mouse = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    down: false,
};
addEventListener("pointerdown", (evt) => {
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;
    mouse.down = true;
    spawnProjectile();
    evt.preventDefault();
});
addEventListener("pointerup", (evt) => {
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;
    mouse.down = true;
});
addEventListener("load", () => {
    PageLoad();
});
addEventListener("pointermove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.dx = event.movementX;
    mouse.dy = event.movementY;
    SetDebugItem(mouse.x.toString(), "mouse.x");
    SetDebugItem(mouse.y.toString(), "mouse.y");
    SetDebugItem(mouse.dx.toString(), "mouse.dx");
    SetDebugItem(mouse.dy.toString(), "mouse.dy");
    SetDebugItem((mouse.x + mouse.dx).toString(), "predicted mouse.x");
    SetDebugItem((mouse.y + mouse.dy).toString(), "predicted mouse.y");
});
startGameButton.addEventListener("click", () => {
    ModalEL.style.display = "none";
    init();
    animate();
});
PauseModalPlayButton.addEventListener("click", () => {
    UnpauseGame();
});
addEventListener("keypress", (event) => {
    if (event.key == "q" && GameStarted) {
        if (!Paused) {
            PauseGame();
        }
        else {
            CloseOptionsMenu();
            OptionsOpen = false;
            UnpauseGame();
        }
    }
});
PauseModalOpenerButton.addEventListener("click", () => {
    if (GameStarted) {
        if (!Paused) {
            PauseGame();
        }
        else {
            CloseOptionsMenu();
            OptionsOpen = false;
            UnpauseGame();
        }
    }
});
PauseModalOptionsButton.addEventListener("click", () => {
    OpenOptionsMenu();
    OptionsOpen = true;
});
OptionsBackButton.addEventListener("click", () => {
    CloseOptionsMenu();
    OptionsOpen = false;
});
OptionsParticleSwitch.addEventListener("change", () => {
    UseParticles = !UseParticles;
});
OptionsAimSlider.addEventListener("change", () => {
    if (OptionsAimSlider.value == "0") {
        ShowPlayerAim = false;
    }
    else {
        ShowPlayerAim = true;
    }
    player.spread = Number(OptionsAimSlider.value);
});
OptionsSFXSlider.addEventListener("change", () => {
    if (OptionsSFXSlider.value == "0") {
        SFXMuted = true;
    }
    else {
        SFXMuted = false;
    }
    UpdateSFXSlider();
});
OptionsMusicSlider.addEventListener("change", () => {
    if (OptionsMusicSlider.value == "0") {
        MusicMuted = true;
    }
    else {
        MusicMuted = false;
    }
    MusicPlayer.Volume = parseFloat(OptionsMusicSlider.value);
    PlayMusic();
    MusicPlayer.shuffle();
    MusicPlayer.continue = true;
});
function animate() {
    animationID = requestAnimationFrame(animate);
    SetDebugItem(innerWidth, "windowWidth");
    SetDebugItem(innerHeight, "windowHeight");
    SetDebugItem(innerHeight * innerWidth, "WindowArea");
    SetDebugItem((Math.sqrt(innerWidth * innerWidth + innerHeight * innerHeight) / 2000), "EnemySpeedMultiplier");
    if (!Paused) {
        if (((animationID % Math.floor(EnemySpawnTime) == 0 && enemies.length < MaxEnemies) || enemies.length < MaxEnemies - 5)) {
            SpawnEnemy();
            EnemySpawnTime -= 0.125;
            EnemySpawnTime = clamp(EnemySpawnTime, 1, DefaultEnemySpawnTime * 2);
        }
        SetDebugItem(EnemySpawnTime, "SpawnTime");
        player.update();
        c.fillStyle = 'rgba(0,0,0,0.1)';
        c.fillRect(0, 0, w, h);
        if (UseParticles) {
            particles.forEach((particle, index) => {
                if (particle.alpha <= 0 || index > ParticleCap) {
                    particles.splice(index, 1);
                }
                else {
                    particle.update();
                }
            });
        }
        projectiles.forEach((projectile, index) => {
            projectile.update();
            if (projectile.IsOffScreen) {
                projectiles.splice(index, 1);
                if (!SFXMuted) {
                    MissSound.play();
                }
            }
        });
        enemies.forEach((enemy, index) => {
            let r = enemy.update();
            if (r == "dead") {
                enemies.splice(index, 1);
            }
            else {
                const dist = distance(player.x, player.y, enemy.x, enemy.y);
                if (dist - enemy.radius - player.radius < 0) {
                    if (player.willDie) {
                        player.Health.removeHealth();
                        gameOver(animationID);
                    }
                    else {
                        player.Health.removeHealth();
                        if (!SFXMuted) {
                            HealthLoseSound.play();
                            if (!DEBUGFLAG) {
                                console.log("HealthLoseSound");
                            }
                        }
                        ;
                        enemies.splice(index, 1);
                        SetDebugItem(player.Health.Health, "playerHealth");
                        EnemySpawnTime = clamp(EnemySpawnTime + 10, 40, 70);
                        MaxEnemies = 10;
                        EnemySpeedMult = 1;
                    }
                }
                projectiles.forEach((projectile, index2) => {
                    const dist = distance(projectile.x, projectile.y, enemy.x, enemy.y);
                    if (dist - enemy.radius - projectile.radius < 0) {
                        if (UseParticles) {
                            for (let i = 0; i < Math.round(enemy.radius * 2 * ParticleMultiplier * random()); i++) {
                                particles.push(new Particle(projectile.x, projectile.y, random(1, 5), enemy.color, {
                                    x: ((random() + (projectile.velocity.x / (2 * player.ShotSpeed * ProjectileSpeedMultiplier))) * random() * ParticleSpeed),
                                    y: ((random() + (projectile.velocity.y / (2 * player.ShotSpeed * ProjectileSpeedMultiplier))) * random() * ParticleSpeed)
                                }));
                            }
                        }
                        enemy.damage(projectile.damage);
                        if (enemy.IsDead) {
                            if (!SFXMuted) {
                                HitAndKillSound.play();
                            }
                            AddScore(20 * enemy.startingRadius);
                            setTimeout(() => {
                                enemies.splice(index, 1);
                                projectiles.splice(index2, 1);
                            }, 1);
                        }
                        else {
                            if (!SFXMuted) {
                                HitNoKillSound.play();
                            }
                            AddScore(15 * enemy.radius);
                            setTimeout(() => {
                                projectiles.splice(index2, 1);
                            }, 1);
                        }
                    }
                    if (dist - enemy.radius - projectile.radius < 20) {
                        if (!SFXMuted) {
                            MissSound.play();
                        }
                    }
                });
            }
        });
        if ((lastScore % HealthFreq > score % HealthFreq) && (score != 0)) {
            player.Health.addHealth(1);
            if (!SFXMuted) {
                HealthGetSound.play();
            }
        }
        if ((lastScore % EnemyUpFreq > score % EnemyUpFreq) && (score != 0)) {
            EnemySpeedMult *= 1.001;
            EnemySpawnTime *= 0.999;
            if (coinFlip(0.2)) {
                MaxEnemies++;
            }
            MaxEnemies = clamp(MaxEnemies, 10, 45);
            EnemyUpFreq *= 0.999;
            EnemyUpFreq = round(EnemyUpFreq, -2);
            SetDebugItem(MaxEnemies, "MaxEnemies");
            SetDebugItem(EnemySpeedMult, "EnemySpawnMult");
            SetDebugItem(EnemySpawnTime, "SpawnTime");
        }
        lastScore = score;
    }
}
function init() {
    EnemySpawnTime = DefaultEnemySpawnTime;
    Paused = false;
    player = new Player(cw, ch, PlayerRadius, PlayerColor);
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreEL.innerHTML = score.toString(10);
    BigScoreEL.innerHTML = score.toString(10);
    GameStarted = true;
}
function PageLoad() {
    ModalEL.style.display = "flex";
    OptionsSFXSlider.value = "0";
    OptionsMusicSlider.value = "0";
    OptionsAimSlider.value = "0";
    HighScoreLabel.style.display = "none";
    document.body.style.display = "block";
    if (!MOBILEVIEW) {
        PauseModalOpenerButton.style.display = "none";
        PauseModalOpenerIcon.style.display = "none";
    }
    else {
        PauseModalOpenerButton.style.display = "block";
        PauseModalOpenerIcon.style.display = "block";
    }
    CloseOptionsMenu();
    UnpauseGame();
    MusicPlayer.pause();
    AddDebugItem(0, "playerLevel");
    AddDebugItem(0, "playerCashedLevels");
    AddDebugItem(false, "CantSpawn");
    AddDebugItem(5, "playerHealth");
    AddDebugItem(EnemySpawnTime, "SpawnTime");
    AddDebugItem(EnemySpawnBias, "Bias");
    player.Health.draw();
    Paused = true;
    OptionsOpen = false;
}
function UpdateSFXSlider() {
    ShootSound.muted = SFXMuted;
    HitNoKillSound.muted = SFXMuted;
    HitAndKillSound.muted = SFXMuted;
    HealthGetSound.muted = SFXMuted;
    HealthLoseSound.muted = SFXMuted;
    MissSound.muted = SFXMuted;
    if (!SFXMuted) {
        ShootSound.volume = parseFloat(OptionsSFXSlider.value);
        HitNoKillSound.volume = parseFloat(OptionsSFXSlider.value);
        HitAndKillSound.volume = parseFloat(OptionsSFXSlider.value);
        HealthGetSound.volume = parseFloat(OptionsSFXSlider.value);
        HealthLoseSound.volume = parseFloat(OptionsSFXSlider.value);
        MissSound.volume = parseFloat(OptionsSFXSlider.value);
    }
}
function PlayMusic() {
    if (!MusicMuted) {
        MusicPlayer.shuffle();
    }
}
function SpawnEnemy() {
    let x;
    let y;
    const radius = (random(4, 30) * EnemyMultiplier) + 4;
    if (coinFlip(EnemySpawnBias)) {
        x = coinFlip() ? 0 - radius : w + radius;
        y = random(0, h);
    }
    else {
        x = random(0, w);
        y = coinFlip() ? 0 - radius : h + radius;
    }
    const color = `hsl(${random(0, 360)},50%,50%)`;
    const angle = Math.atan2(ch - y, cw - x);
    const velocity = {
        x: Math.cos(angle) * EnemyMultiplier * EnemySpeedMult,
        y: Math.sin(angle) * EnemyMultiplier * EnemySpeedMult
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
}
function AddScore(Value) {
    score += floor(Value, 1);
    scoreEL.innerHTML = score.toString(10);
    BigScoreEL.innerHTML = score.toString(10);
}
function gameOver(AnimationID) {
    cancelAnimationFrame(AnimationID);
    if (Scores.scores.every((value) => { return value < score; })) {
        HS = true;
    }
    else {
        HS = false;
    }
    Scores.addScore(score);
    GameStarted = false;
    ModalEL.setAttribute("style", "display:flex;");
    HighScoreList.innerHTML = Scores.Html;
    console.log(Scores);
    HighScoreLabel.style.display = HS ? "block" : "none";
    BigScoreELLabel.style.display = "block";
    BigScoreEL.style.display = "block";
    BigScoreEL.innerText = score.toString();
    BigScoreEL.classList.add("animate-bounce");
}
function PauseGame() {
    PauseModal.style.display = "block";
    PauseModalScore.innerHTML = score.toString(10);
    Paused = true;
}
;
function UnpauseGame() {
    PauseModal.style.display = "none";
    Paused = false;
}
;
function OpenOptionsMenu() {
    OptionsParticleSpan.style.display = "block";
    OptionsMenu.style.display = "block";
    OptionsSFXSlider.style.display = "block";
    OptionsBackButton.style.display = "block";
    OptionsParticleSwitch.style.display = "block";
    OptionsAimSlider.style.display = "block";
    OptionsOpen = true;
}
;
function CloseOptionsMenu() {
    OptionsParticleSpan.style.display = "none";
    OptionsMenu.style.display = "none";
    OptionsSFXSlider.style.display = "none";
    OptionsBackButton.style.display = "none";
    OptionsParticleSwitch.style.display = "none";
    OptionsAimSlider.style.display = "none";
    OptionsOpen = false;
}
;
function spawnProjectile(x, y) {
    if (GameStarted == true && Paused == false) {
        x = x || mouse.x + (mouse.dx * 10);
        y = y || mouse.y + (mouse.dy * 10);
        const angle = Math.atan2(y - ch, x - cw);
        const velocity = {
            x: Math.cos(angle) * player.ShotSpeed * ProjectileSpeedMultiplier,
            y: Math.sin(angle) * player.ShotSpeed * ProjectileSpeedMultiplier,
        };
        const radius = 5;
        const damage = player.Damage;
        projectiles.push(new Projectile(cw, ch, radius, ProjectileColor, velocity, damage));
        if (!SFXMuted) {
            ShootSound.play();
        }
    }
}
function calculateRWA() {
    let minDist = min(innerWidth, innerHeight);
    let maxDist = max(innerWidth, innerHeight);
    let a = maxDist - minDist;
    let b = maxDist + minDist;
    let c = sigmoid(a / b, 0.5);
    let d = 1.5 - c;
    return d;
}
function renderWireframe(object, type) {
    if (DEBUGFLAG && RenderWireframe) {
        switch (type) {
            case "particle":
                c.strokeStyle = "rgb(0,0,255)";
                break;
            case "enemy":
                c.strokeStyle = "rgb(255,0,0)";
                break;
            case "projectile":
                c.strokeStyle = "rgb(0,255,0)";
                break;
            case "player":
                c.strokeStyle = "rgb(0,255,255)";
                break;
            default:
                break;
        }
        c.strokeRect(object.x - object.radius, object.y - object.radius, (object.radius * 2), (object.radius * 2));
        c.stroke();
    }
}
function sanityCheck(object) {
    if (object.radius < 0) {
        console.error(`${object} radius is negative`);
        return false;
    }
    if (object.x - object.radius < 0 || object.x + object.radius > w || object.y - object.radius < 0 || object.y + object.radius > h) {
        console.error(`${object} is out of bounds`);
        return false;
    }
    return true;
}
//# sourceMappingURL=compiled.js.map
