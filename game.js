var conf = {
	FPS:25,
	score:0,
	highscore:0,
	playing:false,
	dodjcfc:0,
	weapon: 1,
	cnvid:0,
	intervalSp:2000,
	firingInt:100,
	firingEInt:2500,
	reloaded: true,
	erelo: true,
	lives: 5
}
	Bullets = [];
	Enimies = [];
canvas = none;
function preDraw(id){
	//Canvas initialization
	canvas = document.getElementById(id)
	ctx = canvas.getContext('2d');
	canvas.width= window.innerWidth;
	canvas.height = window.innerHeight;
	document.onkeydown = keydown;
	drawMap();
	canvas.style.cursor = 'crosshair';
	ctx.font = 'bold 75px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ccc';
	ctx.fillText('Space Battle', canvas.width/2, canvas.height/2-75);
	ctx.font = 'bold 25px courier';
    ctx.fillText('Press SPACEBAR to start', canvas.width/2, canvas.height/2);
	ctx.fillText('Also press SPACEBAR to pause', canvas.width/2, canvas.height/2+25);
	ctx.fillText('You will play without cursor, be careful', canvas.width/2, canvas.height/2+50);
}
function init(id){
	conf.lives=15
	conf.cnvid = id;
	player = new Player();
	canvas.style.cursor = 'none';
	spawning = setInterval(spawnEnemy,conf.intervalSp)
	//dodjing = setInterval(function(){conf.dodjcfc=randomInteger(-1,1)},1000);
        firing = setInterval(function(){conf.reloaded = true;conf.erelo = true;},conf.firingInt);
	firingE = setInterval(function(){for(var i = 0; i < Enimies.length; i++)shootE(Enimies[i].x-75,Enimies[i].y,-1,Enimies[i].speed+10,randomInteger(-5,5))},conf.firingEInt);
	document.onmousedown = function(){shoot(player.x+75,player.y+25,1,30,0)};
	document.onmousemove = Mouse;
	document.onkeydown = keydown;
	updating = setInterval(update,1000/conf.FPS);
	
	
}

function update(){
	drawMap();
	player.draw();
	updateBullets();
	updateEnimies();
	testForBulletCollision();
	testForPlayerCollision();
	DrawScore();
	
}
function drawTile(){
	
}
function drawMap(){
        canvas.width= window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.fillStyle = '#000000';
	
	ctx.fillRect(0,0,window.innerWidth,window.innerHeight);		
}	



function keydown(e){
	
	switch(e.keyCode){
		case 87: //W
				
			break;
		case 83: //S
				
			break;
		case 65: //A
				
			break;
		case 68: //D
				
			break;
		case 32: //SPACEBAR
			if(conf.playing){
				Pause();
			}else{
				Resume();    
			}
			break;
	}
}
function keyUp(e){
	switch(e.keyCode){
		case 87: //W
				
			break;
		case 83: //S
				
			break;
		case 65: //A
				
			break;
		case 68: //D
				
			break;
	}
}
function Mouse(e){
	if(e.clientY > 0 && e.clientY < canvas.height) player.y = e.clientY - player.height/2;
        if(e.clientX > 0 && e.clientX < canvas.width) player.x = e.clientX - player.width/2;
}
function Player(){
	this.x = canvas.width / 10;
	this.y = canvas.height / 2 - 25;
	this.width = 50;
	this.height = 50;
	this.hp = 3;
	this.ammo = 100;
	this.draw = function(){
		ctx.fillStyle = "#0f0";
		for(var i = 0; i < conf.lives; i++){
			
			ctx.fillRect(this.x + i*10,this.y+this.height+20 ,5,5);
                }
		ctx.fillStyle = '#fff';
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.fillStyle = '#00f';
		ctx.fillRect(this.x+this.width/4,this.y+this.height/4,this.width/2,this.height/2);
		ctx.fillStyle = '#fff';
		ctx.fillRect(this.x+this.width,this.y+this.height/4,this.width/2,this.height/2);
		ctx.fillRect(this.x,this.y-this.height/4,this.width/2,this.height/2);
		ctx.fillRect(this.x,this.y+this.height-this.height/4,this.width/2,this.height/2);
		}
}
function shoot(x,y,mod,spd,spdy){
        if(conf.reloaded){
	newBullet = new Bullet(x,y,mod>0?'#0f0':'#f00',10,spd*mod,spdy);
	console.log('Shooted ');
	Bullets.push(newBullet);
        conf.reloaded = false;}
}
function shootE(x,y,mod,spd,spdy){
	newBullet1 = new Bullet(x,y,mod>0?'#0f0':'#f00',5,spd*mod,spdy-10);
	newBullet1.width = 5;
        newBullet2 = new Bullet(x,y,mod>0?'#0f0':'#f00',5,spd*mod,spdy-5);
	newBullet2.width = 5;
        newBullet3 = new Bullet(x,y,mod>0?'#0f0':'#f00',5,spd*mod,spdy);
	newBullet3.width = 5;
        newBullet4 = new Bullet(x,y,mod>0?'#0f0':'#f00',5,spd*mod,spdy+5);
	newBullet4.width = 5;
        newBullet5 = new Bullet(x,y,mod>0?'#0f0':'#f00',5,spd*mod,spdy+10);
        newBullet5.width = 5;
	console.log('Shooted ');
	Bullets.push(newBullet1,newBullet2,newBullet3,newBullet4,newBullet5);
        
}
function updateBullets(){
	for(var i = 0; i < Bullets.length; i++){
	if(Bullets[i] != undefined && Bullets[i] != 0){
			if(Bullets[i].x < canvas.width){
				Bullets[i].x += Bullets[i].speed;
				Bullets[i].y += Bullets[i].speedY;
				Bullets[i].draw();
			}else{
				
				console.log('Bullet '+Bullets[i].speed +' breaks and has been deleted. Total bullets:'+ Bullets.length)
			Bullets.splice(i,1);
}
			
		}
	}
}
function collision(objA, objB) {
	if(objA != undefined && objB != undefined && objA != 0 && objB != 0)
    if (objA.x+objA.width  > objB.x &&
        objA.x             < objB.x+objB.width &&
        objA.y+objA.height > objB.y &&
        objA.y             < objB.y+objB.height) {
            return true;
        }
        else {
            return false;
            }
    }
function collisionOnY(objA, objB) {
	if(objA != undefined && objB != undefined && objA != 0 && objB != 0)
    if (objA.y+objA.height > objB.y &&
        objA.y             < objB.y+objB.height
        ) {
            return true;
        }
        else {
            return false;
            }
    }
function updateEnimies(){
	for(var i = 0; i < Enimies.length; i++){
	if(Enimies[i] != undefined && Enimies[i] != 0){
			if(Enimies[i].x > 0){
                                
				console.log(Enimies[i].color)
				Enimies[i].x -= Enimies[i].speed;
				if(Enimies[i].y > 50 && Enimies[i].y < canvas.height-50){
					if(collisionOnY(Enimies[i], player)){
					conf.dodjcfc = player.y>Enimies[i].y?-1:1;
					Enimies[i].y += Enimies[i].speed/3.0*conf.dodjcfc;}

				}

							
				
				Enimies[i].color = '#' + randomInteger(10,99) + randomInteger(10,99) + randomInteger(10,99);
				Enimies[i].draw();
				
			}else{
				
				if(conf.lives <= 0){
				    new Enemy(Enimies[i].x,Enimies[i].y,'#f00').draw();
				
				    Stop();
                                    Enimies.splice(i,Enimies.length);
                                }else{
                                  conf.lives--;
				Enimies.splice(i,1);}

				
				
				console.log('Enimie breaks and has been deleted. Total Enimies:'+ Enimies.length)
			}
			
		}
	}
}
function Bullet(x,y,color,height,speed,speedY){
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = height;
	this.color = color;
	this.speed = speed;
        this.speedY = speedY;
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
}
function Enemy(x,y,color){
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = 50;
	this.color = '#fff';
	this.speed = randomInteger(5,10);
        this.hp = 3;
	this.draw = function(){
		ctx.fillStyle = "#0f0";
		for(var i = 0; i < this.hp; i++){
			ctx.fillRect(this.x + i*10,this.y+this.height+10,5,5);
                }
			
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.fillStyle = '#f00';
		ctx.fillRect(this.x+this.width/4,this.y+this.height/4,this.width/2,this.height/2);
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x+this.width,this.y+this.height/4,this.width/2,this.height/2);
		
	}
}
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }

function spawnEnemy(){
	newEnemy = new Enemy(canvas.width - canvas.width / 20,randomInteger(75,canvas.height-75),'#0f0')
	Enimies.push(newEnemy);
}
function testForBulletCollision(){
	
	for(var i = 0; i < Enimies.length; i++)
		for(var j = 0; j < Bullets.length; j++)
			if(collision(Bullets[j],Enimies[i]) && Bullets[j].speed > 0){
				console.log('Bullet with index '+ j +'shooted to enemy with index '+ i);
				if(Enimies[i].hp==1){
				Enimies.splice(i,1);
				Bullets.splice(j,1);
				conf.score += 1;
				increaseSpawnSpeed();}else{Enimies[i].hp-=1;Bullets.splice(j,1);}
			}else{
				continue;
			}
}


function testForPlayerCollision(){
		for(var j = 0; j < Bullets.length; j++)
			if(collision(Bullets[j],player)){
				console.log('Bullet with index '+ j +'shooted to player');
				conf.lives--;
if(conf.lives<=0)Stop(); 
				Bullets.splice(j,1);
				increaseSpawnSpeed();
				if(conf.lives>0){
				ctx.fillStyle = '#ff0000';
	                        ctx.fillRect(0,0,window.innerWidth,window.innerHeight);	}
			}else{
				continue;
			}
}
function DrawScore(){
	ctx.font = 'bold 25px courier';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ccc';
    ctx.fillText('Score:'+conf.score+'   Highscore:'+conf.highscore + '     Lifes:'+conf.lives, 10, 0);
}
function Stop(){
	clearInterval(updating);
	clearInterval(spawning);
	clearInterval(firingE);
	clearInterval(firing);
	conf.playing = false;
	document.onmousemove = '';
	document.onmousedown = '';
	if(conf.score>conf.highscore)conf.highscore = conf.score;
	canvas.style.cursor = 'crosshair';
	Bullets = [];
	Enimies = [];
	ctx.font = 'bold 50px courier';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ccc';
    ctx.fillText('Game Over', canvas.width/2, canvas.height/2-50);
	ctx.fillStyle = '#00f';
	ctx.fillText('Score: '+conf.score, canvas.width/2, canvas.height/2);
	ctx.fillStyle = '#ccc';
	ctx.fillText('SPACEBAR - Restart', canvas.width/2, canvas.height/2+50);
	conf.score = 0;
}
function Pause(){
	clearInterval(updating);
	clearInterval(spawning);
	clearInterval(firingE);
	clearInterval(firing);
	conf.playing = false;
	document.onmousemove = '';
	document.onmousedown = '';
	ctx.font = 'bold 50px courier';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ccc';
    ctx.fillText('Paused', canvas.width/2, canvas.height/2);
	canvas.style.cursor = 'crosshair';
}
function Resume(){
	init(conf.cnvid);
	conf.playing = true;
	canvas.style.cursor = 'none';
}
function increaseSpawnSpeed(){
	if(conf.score % 10 == 0 && conf.score!=0)
		if(conf.intervalSp > 200){
			console.log('Speed increased');
			conf.intervalSp -= 100;
		}
}