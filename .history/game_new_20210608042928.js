var conf = {
    FPS: 30,
    baseHP: 10,
    baseEHP: 4,
    baseSPT: 6000,
    baseSPD: 5000,
    baseENE: 2,
    increaseDifficultyEvery: 15,
    baseAmmo: 5,
    baseAAmmo: 3,
    shootSPD: 700,
    spdmod: 1.02,
    packPeriod: 30000,
    maxOnScreen: 3
}

var session = {
    score: 0,
    highscore: 0,
    isPlaying: false,
    playerHp: conf.baseHP,
    entities: {
        shells: [],
        bullets: [],
        enemies: [],
        pups: [],
        mapProps: [],
        bosses: []
    },
    canvas: null,
    player: null,
    ctx: null,
    enemiesHP: conf.baseEHP,
    spawnSpeed: conf.baseSPT,
    enemiesFireSPD: conf.baseSPD,
    enemiesEvasion: conf.baseENE,
    ammo: conf.baseAmmo,
    abilityAmmo: conf.baseAAmmo,
    shootSPD: conf.shootSPD,
    maxOnScreen: conf.maxOnScreen
}
var resources = {
    playerShip: loadImage('ship.png'),
    enemyShip: [
        loadImage('enemy.png'),
        loadImage('enemy1.png'),
        loadImage('enemy2.png'),
        loadImage('enemy3.png'),
        loadImage('enemy4.png')
    ],
    enemyBoss: loadImage('enemy_boss.png')
}

var t = {}

function loadImage(src) {
    img = new Image();
    img.src = src;
    return img;
}

function randInt(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

class Enemy{
    constructor(x,y, weaponType) {
        this.x = x;
        this.y = y;
        this.hp = 10;
        this.width = 75;
        this.height = 75;
        this.weaponType = weaponType;
        this.vX = this.weaponType*-1;
        this.vY = randInt(-5,5);
        return this;
    }
    setHp(hp){
        this.hp = hp;
        return this;
    }
    hurt(){
        this.hp--;
        session.ctx.fillStyle = '#ff0000';
        session.ctx.fillRect(this.x,this.y,this.width,this.height);
        return this;
    }
    setVelocity(vX, vY){
        this.vX = vX;
        this.vY = vY;
        return this;
    }
    draw() {

        session.ctx.drawImage(resources.enemyShip[this.weaponType-1],this.x,this.y,this.width,this.height);
        session.ctx.fillStyle = '#fff';
        for (var i = this.hp; i > 0; i--) {
            session.ctx.fillRect(this.x+7*i,this.y+this.height+10,5,5);
            
        }
        return this;
    }
}

class EnemyBoss{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.hp = session.enemiesHP*2;
        this.width = 200;
        this.height = 200;
        this.rspd = 200;
        this.vX = 0;
        this.vY = 0;
        this.onDeath = () => {};
        return this;
    }
    setHp(hp){
        this.hp = hp;
        return this;
    }
    setDeathCallback(callback){
        this.onDeath = callback;
        return this;
    }
    hurt(){
        this.hp--;
        session.ctx.fillStyle = '#ff0000';
        session.ctx.fillRect(this.x,this.y,this.width,this.height);
        if (this.hp == 0) this.onDeath();
        return this;
    }
    setVelocity(vX, vY){
        this.vX = vX;
        this.vY = vY;
        return this;
    }
    
    draw() {

        session.ctx.drawImage(resources.enemyBoss,this.x,this.y,this.width,this.height);
        session.ctx.fillStyle = '#fff';
        for (var i = this.hp; i > 0; i--) {
            session.ctx.fillRect(this.x+7*i,this.y+this.height+10,5,5);
            
        }
        return this;
    }
}

class Player{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        this.hp = 10;
        this.width = 75;
        this.height = 75;
        this.weaponType = 1;
        this.ammo = session.ammo;
        this.abilityAmmo = session.abilityAmmo;
        return this;
    }
    setHp(hp){
        this.hp = hp;
        return this;
    }
    setAmmo(ammo){
        this.ammo = ammo;
        return this;
    }
    addAmmo(ammo){
        this.ammo += ammo;
        return this;
    }
    heal(hp){
        this.hp += hp;
        return this;
    }
    hurt(){
        this.hp--;
        session.ctx.fillStyle = '#f00';
        session.ctx.fillRect(this.x,this.y,this.width,this.height);
        return this;
    }
    setVelocity(vX, vY){
        this.vX = vX;
        this.vY = vY;
        return this;
    }
    draw() { 
        session.ctx.drawImage(resources.playerShip,this.x,this.y,this.width,this.height);
        session.ctx.fillStyle = '#f00';
        for (var i = 0; i < this.hp; i++) {
            session.ctx.fillRect(50+15*i,10,10,20); 
        }
        session.ctx.fillStyle = '#fff';
        // for (var i = 0; i < this.ammo; i++) {
        //     session.ctx.fillRect(50+15*i,40,10,20); 
        // }
        session.ctx.fillStyle = '#FF7000';
        for (var i = 0; i < this.abilityAmmo; i++) {
            session.ctx.fillRect(50+15*i,40,10,20); 
        }
        session.canvas.style.cursor = 'crosshair';
        session.ctx.font = 'bold 75px monospace';
        session.ctx.textAlign = 'right';
        session.ctx.textBaseline = 'top';
        session.ctx.fillStyle = '#ccc';
        session.ctx.fillText(session.score, session.canvas.width-50, 50);
        session.ctx.font = 'bold 25px monospace';
        session.ctx.fillText(this.hp, 40, 10);
        // session.ctx.fillText(this.ammo, 40, 40);
        session.ctx.fillText(this.abilityAmmo, 40, 40);
        return this;
    }
}

class Prop{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        return this;
    }
    setVelocity(vX, vY){
        this.vX = vX;
        this.vY = vY;
        return this;
    }
    draw() { 
        session.ctx.fillStyle = '#fff';
        session.ctx.fillRect(this.x,this.y,2,2);
        return this;
    }
}

class Pack{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        this.width = 50;
        this.height = 50;
        this.effect = 0;
        this.duration = 0; //sec
        return this;
    }
    setVelocity(vX, vY){
        this.vX = vX;
        this.vY = vY;
        return this;
    }
    setEffect(effect){
        this.effect = effect;
        return this;
    }
    setDuration(duration){
        this.duration = duration;
        return this;
    }
    draw() { 
        let color = {
            1 : "#00ffff",
            2 : "#0000ff",
            3 : "#00ff00"
        }
        let text = {
            1 : "+SPD",
            2 : "+UPG",
            3 : "+HP!"
        }
        session.ctx.fillStyle = color[this.effect];
        session.ctx.fillRect(this.x,this.y,this.width,this.height);
        session.ctx.textAlign = 'right';
        session.ctx.textBaseline = 'top';
        session.ctx.fillStyle = '#ccc';
        session.ctx.fillText(text[this.effect], this.x + this.width, this.y + this.height);
        return this;
    }
}

class Bullet{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        this.width = 10;
        this.height = 10;
        this.color = '#000';
        return this;
    }
    setVelocity(vX, vY){
        this.vX = vX;
        this.vY = vY;
        return this;
    }
    setColor(color){
        this.color = color;
        return this;
    }
    setSize(size){
        this.width = size;
        this.height = size;
        return this;
    }
    draw() { 
        session.ctx.fillStyle = this.color;
        session.ctx.fillRect(this.x,this.y,this.width,this.height);
        return this;
    }
}

class mapProp{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        this.width = 50;
        this.height = 50;
        return this;
    }
    setVelocity(vX, vY){
        this.vX = vX;
        this.vY = vY;
        return this;
    }
    draw() { 
        session.ctx.fillStyle = '#fff';
        session.ctx.fillRect(this.x,this.y,5,5);
        return this;
    }
}

function init(canvas){
    session.canvas = document.getElementById(canvas);
    session.ctx = session.canvas.getContext('2d');

    session.canvas.width= window.innerWidth;
    session.canvas.height = window.innerHeight;

    document.onmousemove = playerMove;
    // document.onmousedown = playerShoot;

    session.player = new Player(100,window.innerHeight/2);
    session.player.setHp(conf.baseHP);

    document.onkeydown = keydown;

    mapGenerator();

    session.canvas.style.cursor = 'crosshair';
    session.ctx.font = 'bold 75px monospace';
    session.ctx.textAlign = 'center';
    session.ctx.textBaseline = 'top';
    session.ctx.fillStyle = '#ccc';
    session.ctx.fillText('Space Battle', session.canvas.width/2, session.canvas.height/2-75);
    session.ctx.font = 'bold 25px courier';
    session.ctx.fillText('Press SPACEBAR to start', session.canvas.width/2, session.canvas.height/2);
    session.ctx.fillText('Also press SPACEBAR to pause', session.canvas.width/2, session.canvas.height/2+25);
    session.ctx.fillText('You will play without cursor, be careful', session.canvas.width/2, session.canvas.height/2+50);
    session.ctx.fillText('Q - Ability (turns enemies bullets to your bullets)', session.canvas.width/2, session.canvas.height/2+75);
    session.ctx.fillText('R - Reload gun', session.canvas.width/2, session.canvas.height/2+100);

}

function togglePause() {
    if(session.isPlaying){
        clearInterval(t.updateTimer);
        clearInterval(t.particleTimer);
        clearInterval(t.spawnTimer);
        clearInterval(t.shootTimer);
        clearInterval(t.bossTimer);
        clearInterval(t.shooterTimer);
        clearInterval(t.packSpawn);
        session.isPlaying = false;

        document.onmousemove = null;
        document.onmousedown = null;

        session.ctx.font = 'bold 50px courier';
        session.ctx.textAlign = 'center';
        session.ctx.textBaseline = 'top';
        session.ctx.fillStyle = '#ccc';
        session.ctx.fillText('Paused', session.canvas.width/2, session.canvas.height/2);
        session.canvas.style.cursor = 'crosshair';
    }else{
        t.updateTimer = setInterval(update,1000/conf.FPS);
        t.particleTimer = setInterval(particleGenerator,100);
        t.spawnTimer = setInterval(spawnEnemy,session.spawnSpeed);
        t.shootTimer = setInterval(enemyShoot,session.enemiesFireSPD);
        t.bossTimer = setInterval(bossShoot,200);
        t.shooterTimer = setInterval(playerShoot, session.shootSPD);
        t.packSpawn = setInterval(spawnPup, conf.packPeriod);
        session.isPlaying = true;

        document.onmousemove = playerMove;
        // document.onmousedown = playerShoot;

        session.canvas.style.cursor = 'none';
    }
}

function resetGame() {
    togglePause();
    mapGenerator();
    if(session.score>session.highscore)
        session.highscore = session.score;
    session.canvas.style.cursor = 'crosshair';
    session.entities = {
        shells: [],
        bullets: [],
        enemies: [],
        pups: [],
        mapProps: [],
        bosses: []
    };
    session.ctx.font = 'bold 50px courier';
    session.ctx.textAlign = 'center';
    session.ctx.textBaseline = 'top';
    session.ctx.fillStyle = '#ccc';
    session.ctx.fillText('Game Over', session.canvas.width/2, session.canvas.height/2-50);
    session.ctx.fillStyle = '#00f';
    session.ctx.fillText('Score: '+session.score, session.canvas.width/2, session.canvas.height/2);
    session.ctx.fillStyle = '#ccc';
    session.ctx.fillText('SPACEBAR - Restart', session.canvas.width/2, session.canvas.height/2+50);
    session.score = 0;
    session.player.hp = conf.baseHP;
    session.enemiesHP = conf.baseEHP;
    session.enemiesEvasion = conf.baseENE;
    session.ammo = conf.baseAmmo;
    session.abilityAmmo = conf.baseAAmmo;
}

function update() {
    mapGenerator();
    enemyHitCheck();
    playerHitCheck();
    session.player.draw();
    enemyEvasion();
    updateEnemies();
    updateBullets();
    updatePups();
    pupPickup();
}

function mapGenerator(){
    session.ctx.fillStyle = '#000000';
    session.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    updateProps();
}

function playerMove(e){
    if(e.clientY > 0 && e.clientY < session.canvas.height) session.player.y = e.clientY - 25;
    if(e.clientX > 0 && e.clientX < session.canvas.width) session.player.x = session.canvas.width/5  ;
}

function spawnEnemy(){
    if(session.entities.enemies.length < session.maxOnScreen){
        newEnemy = new Enemy(
            session.canvas.width - session.canvas.width / 20,
            randInt(75,session.canvas.height-75),
            randInt(1,5)
        );
        newEnemy.setHp(session.enemiesHP);
        session.entities.enemies.push(newEnemy);
        }
}

function particleGenerator(){
    newProp = new Prop(session.canvas.width - session.canvas.width / 20,randInt(75,session.canvas.height-75));
    newProp.setVelocity(-10,0);
    session.entities.mapProps.push(newProp);
}

function updateEnemies(){
    Enemies = session.entities.enemies;
    Bosses = session.entities.bosses;
    for (var i = Enemies.length - 1; i >= 0; i--){
        if(Enemies[i].x < session.canvas.width/3*2){
            Enemies[i].vX *= -1;
        }else{
            if (Enemies[i].x > session.canvas.width - 100 & Enemies[i].vX > 0) Enemies[i].vX *= -1;
        }
        if(Enemies[i].y > session.canvas.height-100){
            Enemies[i].vY *= -1;
        }else{
            if (Enemies[i].y < 10) Enemies[i].vY *= -1;
        }
        Enemies[i].x += Enemies[i].vX;
        Enemies[i].y += Enemies[i].vY;
        Enemies[i].draw();
    }
    for (var i = Bosses.length - 1; i >= 0; i--){
        if(Bosses[i].x > 0){
            Bosses[i].x += Bosses[i].vX;
            Bosses[i].y += Bosses[i].vY;
            Bosses[i].draw();
        }else{
            session.entities.bosses.splice(i,1);
            session.player.hurt();
        }
    }
}

function updateProps(){
    props = session.entities.mapProps;
    for (var i = props.length - 1; i >= 0; i--) {
        if(props[i].x > 0){
            props[i].x += props[i].vX;
            props[i].y += props[i].vY;
            props[i].draw();
        }else{
            session.entities.mapProps.splice(i,1);
        }
    }
}
function updatePups(){
    props = session.entities.pups;
    for (var i = props.length - 1; i >= 0; i--) {
        if(props[i].x > 0){
            props[i].x += props[i].vX;
            props[i].y += props[i].vY;
            props[i].draw();
        }else{
            session.entities.pups.splice(i,1);
        }
    }
}

function updateBullets(){
    bullets = session.entities.bullets;
    shells = session.entities.shells;
    for (var i = bullets.length - 1; i >= 0; i--) {
        if(bullets[i].x < session.canvas.width &&
           bullets[i].x > 0 &&
           bullets[i].y < session.canvas.height &&
           bullets[i].y > 0){
            bullets[i].x += bullets[i].vX;
            bullets[i].y += bullets[i].vY;
            bullets[i].draw();
        }else{
            session.entities.bullets.splice(i,1);
        }
    }
    for (var i = shells.length - 1; i >= 0; i--) {
        if(shells[i].x < session.canvas.width &&
           shells[i].x > 0 &&
           shells[i].y < session.canvas.height &&
           shells[i].y > 0){
            shells[i].x += shells[i].vX;
            shells[i].y += shells[i].vY;
            shells[i].draw();
        }else{
            session.entities.shells.splice(i,1);
        }
    }
}

function playerShoot() {
    if(session.player.ammo > 0){
        if(Boolean(t.reloading)){
            clearInterval(t.reloading);
            delete t.reloading;
        }
        switch (session.player.weaponType) {
            case 1:
                shells = [
                    new Bullet(session.player.x + session.player.width, session.player.y + session.player.height / 2).setVelocity(20, 0).setColor('#0f0')
                ];
                session.entities.bullets = session.entities.bullets.concat(shells);
                break;
            case 4:
                shells = [
                    new Bullet(session.player.x + session.player.width, session.player.y).setVelocity(15, 1).setColor('#0f0'),
                    new Bullet(session.player.x + session.player.width, session.player.y + session.player.height / 2).setVelocity(20, 0).setColor('#0f0'),
                    new Bullet(session.player.x + session.player.width, session.player.y + session.player.height).setVelocity(15, -1).setColor('#0f0'),
                ];
                session.entities.bullets = session.entities.bullets.concat(shells);
                break;
            case 3:
                shells = [
                    new Bullet(session.player.x + session.player.width, session.player.y).setVelocity(15, 0).setColor('#0f0'),
                    new Bullet(session.player.x + session.player.width, session.player.y + session.player.height).setVelocity(15, 0).setColor('#0f0'),
                ];
                session.entities.bullets = session.entities.bullets.concat(shells);
                break;
            case 2:
                shells = [
                    new Bullet(session.player.x + session.player.width, session.player.y).setVelocity(15, 0).setColor('#0f0').setSize(10)
                ];
                session.entities.bullets = session.entities.bullets.concat(shells);
                break;
            case 5:
                shells = [
                    new Bullet(session.player.x + session.player.width, session.player.y).setVelocity(15, 5).setColor('#0f0'),
                    new Bullet(session.player.x + session.player.width, session.player.y).setVelocity(12, 3).setColor('#0f0'),
                    new Bullet(session.player.x + session.player.width, session.player.y).setVelocity(10, 0).setColor('#0f0'),
                    new Bullet(session.player.x + session.player.width, session.player.y).setVelocity(12, -3).setColor('#0f0'),
                    new Bullet(session.player.x + session.player.width, session.player.y).setVelocity(15, -5).setColor('#0f0')
                ];
                session.entities.bullets = session.entities.bullets.concat(shells);
                break;
        }
        
    }else{
        playerReload()
    }
}

function playerAbility() {
    if(session.player.abilityAmmo > 0){
    //     bullets = [
    //         new Bullet(session.player.x+25,session.player.y-session.player.height/5*2).setVelocity(15,0).setColor('#0f0').setSize(15),
    //         new Bullet(session.player.x+25,session.player.y).setVelocity(15,0).setColor('#0f0').setSize(15),
    //         new Bullet(session.player.x+25,session.player.y+session.player.height*1/5*2).setVelocity(15,0).setColor('#0f0').setSize(15),
    //         new Bullet(session.player.x+25,session.player.y+session.player.height*2/5*2).setVelocity(15,0).setColor('#0f0').setSize(15),
    //         new Bullet(session.player.x+25,session.player.y+session.player.height*3/5*2).setVelocity(15,0).setColor('#0f0').setSize(15)
    //     ];
    //     session.entities.bullets = session.entities.bullets.concat(bullets);
        for (var i = 0; i < session.entities.shells.length; i++) {
            session.entities.shells[i].setColor('#0f0');
        }
        session.entities.bullets = session.entities.bullets.concat(session.entities.shells);
        session.entities.shells = [];

        session.player.abilityAmmo--;
      
    }
}

function playerReload(){
    if(session.player.ammo == 0 && !Boolean(t.reloading)){
        t.reloading = setInterval(playerReload,200);
        document.onmousedown = null;
    }
    if(session.player.ammo < session.ammo){
        if(Boolean(t.reloading)){
            session.player.ammo++;
        }else{
            t.reloading = setInterval(playerReload,200);
            document.onmousedown = null;
        }
    }
    if(session.player.ammo >= session.ammo && Boolean(t.reloading)){
        clearInterval(t.reloading);
        delete t.reloading;
        document.onmousedown = playerShoot;
    }
}

function enemyShoot() {
    Enemies = session.entities.enemies;
    Bosses = session.entities.bosses;
    for(var i = 0; i < Enemies.length; i++){
        shells = []
        switch(Enemies[i].weaponType){
            case 5:
                shells = [
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-10,0).setColor('#F00')
                ];
                session.entities.shells = session.entities.shells.concat(shells);
                break;
            case 2:
                shells = [
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-15,1).setColor('#F00'),
                    new Bullet(Enemies[i].x-25,Enemies[i].y+Enemies[i].height/2).setVelocity(-20,0).setColor('#F00'),
                    new Bullet(Enemies[i].x-25,Enemies[i].y+Enemies[i].height).setVelocity(-15,-1).setColor('#F00'),
                ];
                session.entities.shells = session.entities.shells.concat(shells);
                break;
            case 3:
                shells = [
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-15,0).setColor('#F00'),
                    new Bullet(Enemies[i].x-25,Enemies[i].y+Enemies[i].height).setVelocity(-15,0).setColor('#F00'),
                ];
                session.entities.shells = session.entities.shells.concat(shells);
                break;
            case 4:
                shells = [
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-15,0).setColor('#F00').setSize(10)
                ];
                session.entities.shells = session.entities.shells.concat(shells);
                break;
            case 1:
                shells = [
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-15,5).setColor('#F00'),
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-12,3).setColor('#F00'),
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-10,0).setColor('#F00'),
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-12,-3).setColor('#F00'),
                    new Bullet(Enemies[i].x-25,Enemies[i].y).setVelocity(-15,-5).setColor('#F00')
                ];
                session.entities.shells = session.entities.shells.concat(shells);
                break;
        }
        console.log(shells);
        
    }
}

function bossShoot() {
    Bosses = session.entities.bosses;
    for (var i = 0; i < Bosses.length; i++) {
        newBullet = new Bullet(Bosses[i].x-25,Bosses[i].y+100)
        .setVelocity(-15,randInt(-5,5))
        .setColor('#F00')
        .setSize(30);
        session.entities.shells.push(newBullet);
    }
}

function collision(objA, objB) {
    if(objA != undefined && objB != undefined && objA != 0 && objB != 0)
    if (objA.x+objA.width  > objB.x &&
        objA.x             < objB.x+objB.width &&
        objA.y+objA.height > objB.y &&
        objA.y             < objB.y+objB.height){
            return true;
        }
        else {
            return false;
        }
    else return "UNDEF"
}

function collisionOnY(objA, objB) {
    if(objA != undefined && objB != undefined && objA != 0 && objB != 0)
    if (objA.y+objA.height > objB.y &&
        objA.y             < objB.y+objB.height){
            return true;
        }
        else{
            return false;
        }
    }

function enemyHitCheck() {
    Bullets = session.entities.bullets;
    Enemies = session.entities.enemies;
    Bosses = session.entities.bosses;

    for(var i = 0; i < Enemies.length; i++)
        for(var j = 0; j < Bullets.length; j++)
            if(collision(Bullets[j],Enemies[i])){
                if(Enemies[i].hp==1){
                    session.score++;
                    Enemies.splice(i,1);
                    Bullets.splice(j,1);
                    if(session.score % conf.increaseDifficultyEvery == 0)increaseDifficulty();
                }else{
                    Enemies[i].hurt();
                    Bullets.splice(j,1);
                } 
            }
    for(var i = 0; i < Bosses.length; i++)
        for(var j = 0; j < Bullets.length; j++)
            if(collision(Bullets[j],Bosses[i])){
                if(Bosses[i].hp==1){
                    session.score++;
                    // session.player.hp = session.playerHp;
                    session.playerHp+=2;
                    Bosses[i].onDeath();
                    Bosses.splice(i,1);
                    Bullets.splice(j,1);
                    if(session.score % conf.increaseDifficultyEvery == 0)increaseDifficulty();
                }else{
                    Bosses[i].hurt();
                    Bullets.splice(j,1);
                } 
            }
}

function pupPickup() {
    let pups = session.entities.pups;
    for(var i = 0; i < pups.length; i++){
        if(collision(session.player, pups[i])){
            console.log("PUP");
            clearInterval(t.shooterTimer);
            switch (pups[i].effect) {
                case 1:
                    session.shootSPD = session.shootSPD / conf.spdmod;
                    break;
                case 2:
                    if (session.player.weaponType < 5)session.player.weaponType++;
                    else session.shootSPD = session.shootSPD / conf.spdmod;
                    break;
                case 3:
                    session.player.hp += 5;
                    break
                default:
                    break;
            }
            session.entities.pups.splice(i,1);
            t.shooterTimer = setInterval (playerShoot, session.shootSPD);
        }
    }
}

function enemyEvasion() {
    Enemies = session.entities.enemies;
    Bosses = session.entities.bosses;
    for (var i = Enemies.length - 1; i >= 0; i--) {
        if(collisionOnY(Enemies[i],session.player)){
            if(Enemies[i].y > 50 && Enemies[i].y < session.canvas.height - 100){
                if(session.player.y > Enemies[i].y){
                    Enemies[i].y-=session.enemiesEvasion;
                }else{
                    Enemies[i].y+=session.enemiesEvasion;
                }
            }
        }
    }
    for (var i = Bosses.length - 1; i >= 0; i--) {
        if(collisionOnY(Bosses[i],session.player)){
            if(Bosses[i].y > 50 && Bosses[i].y < session.canvas.height - 100){
                if(session.player.y > Bosses[i].y){
                    Bosses[i].y-=session.enemiesEvasion*2;
                }else{
                    Bosses[i].y+=session.enemiesEvasion*2;
                }
            }
        }
    }
}
function spawnPup() {
    let pup = new Pack(session.canvas.width, randInt(50, session.canvas.height-50))
        .setVelocity(-10, 0)
        .setEffect(randInt(1,3));
    session.entities.pups.push(pup); 
}
function increaseDifficulty() {
    session.enemiesHP++;
    session.maxOnScreen+=2;
    session.spawnSpeed -= session.spawnSpeed > 100 ? 250 : 0;
    session.enemiesFireSPD -= session.enemiesFireSPD ? 150 : 0;
    session.enemiesEvasion += 0.5;
    session.player.abilityAmmo++;
    // session.ammo+=5;
    clearInterval(t.spawnTimer);
    clearInterval(t.shootTimer);
    t.spawnTimer = setInterval(spawnEnemy,session.spawnSpeed);
    t.shootTimer = setInterval(enemyShoot,session.enemiesFireSPD);
    newBoss = new EnemyBoss(
        session.canvas.width,
        session.canvas.height/2 - 100
    );
    newBoss.setVelocity(-1,0);
    newBoss.setDeathCallback(spawnPup);
    session.entities.bosses.push(newBoss);
}

function playerHitCheck() {
    Shells = session.entities.shells;
    for(var j = 0; j < Shells.length; j++)
        if(collision(Shells[j],session.player)){
            if(session.player.hp<=1){
                Shells.splice(j,1);
                resetGame();
            }else{
                session.player.hurt();
                Shells.splice(j,1);
            } 
        }
}

function keydown(e){  
    switch(e.keyCode){
        case 32: //SPACEBAR
            togglePause();
            break;
        case 82:
            playerReload();
            break;
        case 81:
            playerAbility();
            break;
    }
}