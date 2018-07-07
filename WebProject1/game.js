var canvas;
var c;

var init = false;

var kills = {generics:0, spiralers:0, gunners:0, splitters:0, hives:0, bullets:0, splitterlings:0, whirlers:0};
var shots = {rifle:0, cannon:0, shotgun:0, smg:0, fountain:0};

var timePassedMS;
var tickInterval = 16;

var hue = 0;

var mouseX;
var mouseY;

var keyIsPressed = new Array(256);
var arrowKeyIsPressed = {up:false, left:false, right:false, down:false}

var gun = 0;
var prevGun=0;
var gunText = "";

var firingCooldown = 0;

var player = {
	x:256,
	y:256, 
	vx:0, 
	vy:0, 
	size:8, 
	speed:160,
	color:'#161616'
	};

var bulletsMax = 64;
var bulletIndex = 0;
var bullets = new Array(bulletsMax);

var enemiesMax = 128;
var enemies = new Array(enemiesMax);

//this runs at the start
function launch()
{
	if (init === true) return;
	init = true;
	
	//get the canvas object
	canvas = document.getElementById("gameCanvas");
	c = canvas.getContext("2d");
	
	//get a keyboard listener
	window.onkeydown = keyPressListener;
	window.onkeyup = keyReleaseListener;
	
	//get some mouse listeners
	canvas.onmousemove = mouseMoveListener;
	canvas.onmousedown = mouseDownListener;
	
	//gotta reset key states when loosing focus because keylisteners aren't working then
	canvas.onfocusout = focusLost;
	
	//start the game loop
	window.setInterval(tick, tickInterval);
	timePassedMS = 0;
	
	selectGun(1);
	
	player.x = canvas.width/2;
	player.y = canvas.height/2;
	c.moveTo(256, 256);
};

//keyboard listener
function keyPressListener(e)
{
	keyIsPressed[e.key.charCodeAt(0)] = true;
	
	if( e.key.charCodeAt(0) == '1'.charCodeAt(0) ) selectGun(1);
	if( e.key.charCodeAt(0) == '2'.charCodeAt(0) ) selectGun(2);
	if( e.key.charCodeAt(0) == '3'.charCodeAt(0) ) selectGun(3);
	if( e.key.charCodeAt(0) == '4'.charCodeAt(0) ) selectGun(4);
	if( e.key.charCodeAt(0) == '5'.charCodeAt(0) ) selectGun(5);
	
	if( e.keyCode == 37) arrowKeyIsPressed.left = true;
	if( e.keyCode == 38) arrowKeyIsPressed.up = true;
	if( e.keyCode == 39) arrowKeyIsPressed.right = true;
	if( e.keyCode == 40) arrowKeyIsPressed.down = true;
	
	if( e.key.charCodeAt(0) == 'q'.charCodeAt(0) ) swapGun();
}

//keyboard listener
function keyReleaseListener(e)
{
	keyIsPressed[e.key.charCodeAt(0)] = false;
	
	if( e.keyCode == 37) arrowKeyIsPressed.left = false;
	if( e.keyCode == 38) arrowKeyIsPressed.up = false;
	if( e.keyCode == 39) arrowKeyIsPressed.right = false;
	if( e.keyCode == 40) arrowKeyIsPressed.down = false;
}

//mouse movement listener
function mouseMoveListener(e)
{
	mouseX=e.clientX - canvas.getBoundingClientRect().left;
	mouseY=e.clientY - canvas.getBoundingClientRect().top;
}

//Just reset the keys.
//Don't pause the game, pausing is for weaklings!
//TODO: find out why it doesn't work
function focusLost()
{
	for(var i=0; i<256; i++) keyIsPressed[i] = false;
}


//mouse click listener
function mouseDownListener(e)
{
}

//changes the gun
function selectGun(g)
{
	prevGun = gun;
	gun = g;
	if(g == 1) gunText = "Weapon: Rifle (1)";
	if(g == 2) gunText = "Weapon: Cannon (2)";
	if(g == 3) gunText = "Weapon: Shotgun (3)";
	if(g == 4) gunText = "Weapon: SMG (4)";
	if(g == 5) gunText = "Weapon: Fountain (5)";
}

//swaps current gun with the previously used one
function swapGun()
{
	var tmp = gun;
	selectGun(prevGun);
	prevGun = tmp;
}


//makes the player use his weapon
//direction: 0=up, 1=left, 2=down, 3=right
//mode: 
//0,1 = regular
//2 = big shot
//3 = shotgun
//4 = minigun
//5 = fountain (TODO)
function shoot(direction, mode)
{
	if(firingCooldown > 0) return;
	
	var x = 0;
	var y = 0;
	
	if( direction == 1 ) x=-1;
	if( direction == 0 ) y=-1;
	if( direction == 3 ) x=1;
	if( direction == 2 ) y=1;

	
	//rifle
	if(mode == 0 || mode == 1)
	{
		shootBullet(x,y,8,480);
		firingCooldown = 12;
		shots.rifle++;
	}
	//cannon
	if(mode == 2)
	{
		shootBullet(x,y,36,240);
		firingCooldown = 36;
		shots.cannon++;
	}
	//shotgun; generates 8 random angles between -0,35 and 0.35 radians
	if(mode == 3)
	{
		for(var i=0; i < 8; i++)
		{
			var angle = 0.35 - 0.7 * Math.random();
			shootBullet(x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle), 5,540);
		}
		firingCooldown = 24;
		shots.shotgun += 8;
	}
	//smg; adds random variation to projectile speed
	if(mode == 4)
	{
		var dx = 0.1 - 0.2 * Math.random()
		var dy = 0.1 - 0.2 * Math.random()
		shootBullet(x + dx, y + dy, 2,720);
		firingCooldown = 2;
		shots.smg++;
	}
	//fountain, sprays stuff all over the place, but mainly in the front
	if(mode == 5)
	{
		var angle = Math.PI - Math.PI * ((Math.random()+Math.random()+Math.random()+Math.random()))/2;
		shootBullet(x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle), 4,720);
		firingCooldown = 2;
		shots.fountain++;
	}
	
}

//creates one player bullet with given position, size and speed
function shootBullet(x,y,size,speed)
{
	var vx; var vy;
	var speedAbs;
	if(x == 0 && y == 0)
	{
		
		vx = (mouseX-player.x);
		vy = (mouseY-player.y);
	
		speedAbs = Math.sqrt(vx * vx + vy * vy);
	
		newBullet.vx *= speed/speedAbs;
		newBullet.vy *= speed/speedAbs;
	}
	else
	{
		vx = x * speed;
		vy = y * speed;
	}
	
	var x = player.x + (radius(player) * vx / speed);
	var y = player.y + (radius(player) * vy / speed);
	
	var newBullet = {
		x:x, 
		y:y, 
		vx:vx, 
		vy:vy,
		size:size,
		color:'#884411'
		};
	
	//bullet = newBullet;
	bullets[bulletIndex++] = newBullet;
	if(bulletIndex >= bulletsMax) bulletIndex = 0;
}

//this runs regularly
function tick()
{
	if(!init) return;
	
	timePassedMS += tickInterval;
    if(firingCooldown > 0)firingCooldown--;
  
	//player movement, firing, bullet movement
	playerActions();
	
	//make enemies do stuff
	enemyLogic();
	
	render();
};


//manages the behavior of enemies
function enemyLogic()
{
	//spawning new enemies
	enemySpawning();
	
	//enemy movement and type-specific behavior
	enemyTick();
	
	//makes enemies and bullets take damage when touching each other
	enemyBullet();
	
	//keeps them from bundling up into hideous blobs
	enemyEnemy();
}

//basic enemy behavior
function enemyTick()
{
	for(var i = 0; i<enemiesMax; i++){
		if(enemies[i] != null){
			var x = enemies[i].x;
			var y = enemies[i].y;
			
			var dx= player.x-x;
			var dy= player.y-y;
			var d=Math.sqrt(dx * dx + dy * dy);
			
			var vx = dx/d;
			var vy = dy/d;
			
			//enemy movement
			if(enemies[i].type < 128)
			{
				//yellow enemy spiraling
				if(enemies[i].type == 3 || enemies[i].type == 6)
				{
					var vxt = vx;
					var vyt = vy;
					vx = vxt*Math.cos(enemies[i].angle) - vyt*Math.sin(enemies[i].angle)
					vy = vxt*Math.sin(enemies[i].angle) + vyt*Math.cos(enemies[i].angle)
				}
				//orange enemy remembers movement direction for spawning minions behind it
				if(enemies[i].type == 5)
				{
					var d = Math.sqrt(vx*vx+vy*vy)
					enemies[i].vx = vx/d;
					enemies[i].vy = vy/d;
				}
				//move
				enemies[i].x += vx * enemies[i].speed / 60;
				enemies[i].y += vy * enemies[i].speed / 60;
			}
			else
			{
				enemies[i].x += enemies[i].vx / 60;
				enemies[i].y += enemies[i].vy / 60;
			}
			
			//blue enemies shooting
			if(enemies[i].type == 2)
			{
				var shootChance = 0.01;
				if(Math.random() <= shootChance) enemyShoot(enemies[i]);
			}
			//orange enemies spawning minions (of type 3, yellow)
			if(enemies[i].type == 5)
			{
				var spawnChance = 0.01;
				if(Math.random() <= spawnChance)
				{
					for(var j = 0; j < enemiesMax; j++)
					{
						if(enemies[j] == null)
						{
							var angle;
							if(Math.random() < 0.5)angle = Math.PI / 5;
							else angle = -Math.PI / 2.5;
							
							var x = enemies[i].x - enemies[i].vx * radius(enemies[i]) * 1.1;
							var y = enemies[i].y - enemies[i].vy * radius(enemies[i]) * 1.1;
							var size = enemies[i].size/10;
				
							enemies[j] = {x:x, y:y, size:size, color:'#e07000', speed:300, type:6, angle:angle};
							break;
						}
					}
				}
			}
			
			//check collision with player
			if( collide(enemies[i], player))
			{
				player.size -= enemies[i].size;
			
				if(player.size <= 0) 
				{
					player.size = 0;
					gameOver();
				}
				
				enemies[i] = null;
				continue;
			}
			
			//remove enemy bullets when they leave the screen
			if(enemies[i].type >= 128)
			{
				if(enemies[i].x < 0){ enemies[i] = null; continue;}
				if(enemies[i].y < 0){ enemies[i] = null; continue;}
				if(enemies[i].x > canvas.width){ enemies[i] = null; continue;}
				if(enemies[i].y > canvas.height){ enemies[i] = null; continue;}
			}
			//keep enemies from leaving screen
			else
			{
				if(enemies[i].x < 0) enemies[i].x = 0;
				if(enemies[i].y < 0) enemies[i].y = 0;
				if(enemies[i].x > canvas.width) enemies[i].x = canvas.width;
				if(enemies[i].y > canvas.height) enemies[i].y = canvas.height;
			}
		}
	}
}
//enemy-bullet interaction
function enemyBullet()
{for(var e = 0; e<enemiesMax; e++){
		for(var b = 0; b<bulletsMax; b++){
			
			if( enemies[e] && bullets[b] &&
				collide(enemies[e], bullets[b]))
			{
				//green enemies split if they are large enough
				if( enemies[e].type == 4 && enemies[e].size >= 5)
				{
					split(enemies[e].x, enemies[e].y, enemies[e].color, enemies[e].size, enemies[e].speed, 5);
					bullets[b].size -= enemies[e].size;
					
					if(enemies[e].original == true) kills.splitters++;
					
					enemies[e] = null;
					
					if(bullets[b].size <= 0) bullets[b] = null;
				}
				//other enemies just take some damage
				else 
				{
					var d = Math.min(enemies[e].size, bullets[b].size);
					enemies[e].size -= d;
					bullets[b].size -= d;
					
					//player heals from dealing damage
					player.size += d*0.1;
				
					if(bullets[b].size <= 0) bullets[b] = null;
					if(enemies[e].size <= 0)
					{	
						if(enemies[e].type == 1) kills.generics++;
						if(enemies[e].type == 2) kills.gunners++;
						if(enemies[e].type == 3) kills.spiralers++;
						if(enemies[e].type == 4) kills.splitterlings++;
						if(enemies[e].type == 5) kills.hives++;
						if(enemies[e].type == 6) kills.whirlers++;
						if(enemies[e].type >= 128) kills.bullets++;
						enemies[e] = null;
					}
				}
			}
		}
	}
}
//enemy-enemy interaction, prevents them from moving into each other
function enemyEnemy()
{
	for(var a = 0; a<enemiesMax; a++){
		for(var b = 0; b<enemiesMax; b++){
			if(a != b
			&& enemies[a] 
			&& enemies[b] 
			&& enemies[a].type < 128 
			&& enemies[b].type < 128
			&& enemies[a].type != 6
			&& enemies[b].type != 6
			)
			{
				var dx= enemies[a].x-enemies[b].x;
				var dy= enemies[a].y-enemies[b].y;
				var d = Math.sqrt(dx * dx + dy * dy) *1.1;
				var r = radius(enemies[a]) + radius(enemies[b]);
				var err = r-d;
				
				if(d < r)
				{
					enemies[a].x += dx/(d* 100) * err * err;
					enemies[a].y += dy/(d* 100) * err * err;
					enemies[b].x -= dx/(d* 100) * err * err;
					enemies[b].y -= dy/(d* 100) * err * err;
				}
			}
		}
	}
}

//manages the player actions (movement, firing)
function playerActions()
{
	if(keyIsPressed['a'.charCodeAt(0)]) player.x -= player.speed/60;
	if(keyIsPressed['d'.charCodeAt(0)]) player.x += player.speed/60;
	if(keyIsPressed['w'.charCodeAt(0)]) player.y -= player.speed/60;
	if(keyIsPressed['s'.charCodeAt(0)]) player.y += player.speed/60;
	
	if(player.x < 0) player.x = 0;
	if(player.y < 0) player.y = 0;
	if(player.x > canvas.width) player.x = canvas.width;
	if(player.y > canvas.height) player.y = canvas.height;
	
	//player weapons
	if(arrowKeyIsPressed.up) shoot(0,gun);
	if(arrowKeyIsPressed.left) shoot(1,gun);
	if(arrowKeyIsPressed.down) shoot(2,gun);
	if(arrowKeyIsPressed.right) shoot(3,gun);
	
	//bullet movement
	for(var i = 0; i<bulletsMax; i++){
		if(bullets[i] != null){
			bullets[i].x += bullets[i].vx/60;
			bullets[i].y += bullets[i].vy/60;
		}
	}
}



//manages the creation of enemies
function enemySpawning()
{
	//spawn rates increase linearly over time; doubled after one minute, tripled after two...
	var newEnemyChance = 0.006 + timePassedMS / 10000000;
	
	//red
	if(Math.random() <= newEnemyChance * 1.00) newEnemy( Math.random() * 32, 1);
	
	//blue, 25% as likely as red, start appearing after 30 seconds
	if(Math.random() <= newEnemyChance * 0.25 && timePassedMS >  30*1000) newEnemy( Math.random() * 32, 2);
	
	//yellow, twice as likely as red, start appearing after 15 seconds
	if(Math.random() <= newEnemyChance * 2.00 && timePassedMS >  15*1000) newEnemy( Math.random() * 32, 3);
	
	//green, 20% as likely as red, start appearing after 45 seconds
	if(Math.random() <= newEnemyChance * 0.20 && timePassedMS >  45*1000) newEnemy( Math.random() * 32, 4);
	
	//purple, 10% as likely as red, start appearing after 60 seconds
	if(Math.random() <= newEnemyChance * 0.10 && timePassedMS > 60*1000) newEnemy( Math.random() * 32, 5);
}



//creates smaller enemies with the same size as the original
//careful, have to call it with individual values instead of the original object,
//because in the context it is used the original object might get deleted before this function finished executing!
function split(x, y, color, size, speed, n)
{
	var c = n;
	var r = radius({size:size});
	for(var i = 0; i < enemiesMax  && n > 0; i++)
	{
		if(enemies[i] == null)
		{
			var newX = (Math.sin(Math.PI * n / c) * r) + x;
			var newY = (Math.cos(Math.PI * n / c) * r) + y;
			
			enemies[i] = {x:newX, y:newY, size:size/c, color:color, speed:speed*1.5, type:4, original:false}
			
			n--;
		}
	}
}



//Returns the on-screen radius of an entity e
function radius(e)
{
	return 5*Math.sqrt(e.size);
}



//creates an enemy with size s and type t at a random location
function newEnemy(s, t)
{
	if(s == null) s = 8;
	if(t === null) s = 0;
	
	var x;
	var y;
	
	while(true)
	{
		x = Math.random() * canvas.width;
		y = Math.random() * canvas.height;
		
		if(Math.abs( x - player.x) > 150 || Math.abs( y - player.y) > 150) break;
	}
	
	for(var i=0; i<enemiesMax; i++)
	{
		if(enemies[i] == null)
		{
			//blue snipers
			if( t == 2)
			{
				enemies[i] = {x:x, y:y, size:s*2, color:'#0820ff', speed:30, type:t, 
				projectileSpeed: 360};
				break;
			}
			//yellow spiralers
			if( t == 3)
			{
				var angle = 0.2 - 0.4 * Math.random();
				if(Math.random() < 0.5)
				{
					angle += Math.PI / 4;
				}
				else{
					angle -= Math.PI / 4;
				}
				enemies[i] = {x:x, y:y, size:s/6, color:'#dddd18', speed:180, type:t, angle:angle};
				break;
			}
			//green splitters
			if( t == 4)
			{
				enemies[i] = {x:x, y:y, size:s*2, color:'#209020', speed:90, type:t, original:true};
				break;
			}
			//orange carriers that spawn extra fast yellow spiralers
			if( t == 5)
			{
				enemies[i] = {x:x, y:y, size:s*2, color:'#e07000', speed:30, type:t, vx:0, vy:0};
				break;
			}
			//default enemy
			enemies[i] = {x:x, y:y, size:s, color:'#dd0808', speed:120, type:t};
			
			break;
		}
	}
}


//makes enemy e shoot at the player
function enemyShoot(e)
{
	for(var i=0; i<enemiesMax; i++)
	{
		if(enemies[i] == null)
		{
			var dx = player.x - e.x;
			var dy = player.y - e.y;
			var d=Math.sqrt(dx*dx+dy*dy);
			var vx = dx/d * e.projectileSpeed;
			var vy = dy/d * e.projectileSpeed;
			
			enemies[i] = {x:e.x, y:e.y, size:e.size/4, vx:vx, vy:vy, color:e.color, speed:e.projectileSpeed, type:128};
			break;
		}
	}
}


//draws the circle that represents an entity
function drawObject(e)
{
	c.strokeStyle = e.color;
	c.lineWidth = 3;
	c.beginPath();
	c.arc(e.x,e.y,radius(e),0,2*Math.PI);
	c.stroke();
}


//checks if two entities are touching
function collide(a, b)
{
	var dx = a.x-b.x;
	var dy = a.y-b.y;
	var d = Math.sqrt(dx * dx + dy * dy);
	
	if(d <= (radius(a) + radius(b))) return true;
	else return false;
}



//draws everything
//has to be separated from the game logic to prevent flickering
function render()
{
	c.clearRect(0,0,canvas.width,canvas.height)
	drawObject(player);
	
	for(var i = 0; i<bulletsMax; i++){
		if(bullets[i] != null){
			drawObject(bullets[i]);
		}
	}
	
	for(var i = 0; i<enemiesMax; i++){
		if(enemies[i] != null){
			drawObject(enemies[i]);
		}
	}
	
	c.font = "14px Arial";
	c.strokeStyle = "#666666";
	c.lineWidth = 1;
	c.strokeText(gunText, 10, 23);
	c.strokeText("Time survived: " + timePassedMS/1000 + "s", 10, canvas.height-10);
}

// zählt alle kills zusammen
function killsTotal()
{
    var result = 0;
    for (var property in kills) {
        if (kills.hasOwnProperty(property)) {
            result += kills[property];
        }
    }
    return result;
}

// schreibt die Spielergebnisse in hidden fields und submitted zum game over screen
function submitResults()
{
    document.getElementById('points').value = timePassedMS;
    document.getElementById('kills').value = killsTotal();
    document.getElementById('game_data').submit();
}

//idk??
function gameOver()
{
	console.log("you died!");
	console.log({kills:kills, shots:shots, gameTime:timePassedMS});
	init = false;
	submitResults();
}









