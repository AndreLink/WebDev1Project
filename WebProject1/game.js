let canvas;
let c;

let init = false;

let kills = {generics:0, spiralers:0, gunners:0, splitters:0, hives:0, bullets:0, splitterlings:0, whirlers:0, cannibals:0};
let shots = {rifle:0, cannon:0, shotgun:0, smg:0, fountain:0};

let timePassedMS;

let tickInterval = 16;
let fps = 1000/tickInterval;

let hue = 0;

let mouseX = 0;
let mouseY = 0;

let keyIsPressed = new Array(256);
let arrowKeyIsPressed = {up:false, left:false, right:false, down:false}

let gun = 0;
let prevGun=0;
let gunText = "";

let refreshIntervalID;

let titlePullPointsX = 23;
let titlePullPointsY = 7;
let titlePullPoints = [	0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,0,0,0,1,1,1,1,0,
    1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,
    1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,
    0,1,1,1,0,0,1,0,0,0,1,0,1,1,1,1,1,0,1,1,1,1,0,
    0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,
    1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,
    0,1,1,1,0,0,0,1,1,1,0,0,1,0,0,0,1,0,1,0,0,0,0,]
var pullStrength = 1;

let pause = false;

let firingCooldown = 0;

let tuem;

let player = {
    x:256,
    y:256,
    vx:0,
    vy:0,
    size:8,
    speed:160,
    //color:'#262626'
    color: 'black',
    shade:'white'
};

let bulletsMax = 128;
let bulletIndex = 0;
let bullets = new Array(bulletsMax);

let enemiesMax = 128;
let enemies = new Array(enemiesMax);

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
    window.clearInterval(refreshIntervalID);
    refreshIntervalID = window.setInterval(tick, tickInterval);
    timePassedMS = 1;

    player.x = canvas.width/2;
    player.y = canvas.height/2;
    enemies = new Array(enemiesMax);
    selectGun(1);
    pause = false;

    player.x = canvas.width/2;
    player.y = canvas.height/2;
    c.moveTo(256, 256);
    tuem = 1945;
}

//draws the title screen
function drawSoap()
{
    //get the canvas object
    canvas = document.getElementById("gameCanvas");
    c = canvas.getContext("2d");

    //get some mouse listeners
    canvas.onmousemove = mouseMoveListener;

    let titleMax = canvas.width * canvas.height / 3000;
    if(titleMax > enemiesMax) titleMax = enemiesMax;

    player.x=canvas.width * 0.98;
    player.y=canvas.height * 0.98;

    for(let i = 0; i < titleMax; i += 15)
    {
        newEnemy(1,0.7);newEnemy(1,0.7);newEnemy(1,0.7);newEnemy(1,0.7);
        newEnemy(2,0.5);
        newEnemy(3);newEnemy(3);newEnemy(3);newEnemy(3);newEnemy(3);newEnemy(3);newEnemy(3);newEnemy(3);
        newEnemy(4,0.5);
        newEnemy(5,0.5);
    }

    //send the player to hell so he wont annoy us
    player.x = 1000000;
    player.y = 1000000;

    refreshIntervalID = window.setInterval(tickPassive, tickInterval);

    renderGame();
}

//keyboard listener
function keyPressListener(e)
{
    keyIsPressed[e.key.charCodeAt(0)] = true;

    if( e.key.charCodeAt(0) === '1'.charCodeAt(0) ) selectGun(1);
    if( e.key.charCodeAt(0) === '2'.charCodeAt(0) ) selectGun(2);
    if( e.key.charCodeAt(0) === '3'.charCodeAt(0) ) selectGun(3);
    if( e.key.charCodeAt(0) === '4'.charCodeAt(0) ) selectGun(4);
    if( e.key.charCodeAt(0) === '5'.charCodeAt(0) ) selectGun(5);

    if( e.keyCode === 37) arrowKeyIsPressed.left = true;
    if( e.keyCode === 38) arrowKeyIsPressed.up = true;
    if( e.keyCode === 39) arrowKeyIsPressed.right = true;
    if( e.keyCode === 40) arrowKeyIsPressed.down = true;

    if( e.key.charCodeAt(0) === 'q'.charCodeAt(0) ) swapGun();
    if( e.key.charCodeAt(0) === 'p'.charCodeAt(0) ) pause = !pause;

    if(!pause)
    {
        //Pfeiltasten und Leertaste verschieben Bildschirm, stört beim Spielen
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40:
            case 32: e.preventDefault(); break;
            default: break;
        }
    }
}

//keyboard listener
function keyReleaseListener(e)
{
    keyIsPressed[e.key.charCodeAt(0)] = false;

    if( e.keyCode === 37) arrowKeyIsPressed.left = false;
    if( e.keyCode === 38) arrowKeyIsPressed.up = false;
    if( e.keyCode === 39) arrowKeyIsPressed.right = false;
    if( e.keyCode === 40) arrowKeyIsPressed.down = false;
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
    for(let i=0; i<256; i++) keyIsPressed[i] = false;
}


//mouse click listener
function mouseDownListener(e)
{
}

//changes the gun
function selectGun(g)
{
    if(gun === g) return;
    prevGun = gun;
    gun = g;
    if(g === 1) gunText = "Weapon: Rifle (1)";
    if(g === 2) gunText = "Weapon: Cannon (2)";
    if(g === 3) gunText = "Weapon: Shotgun (3)";
    if(g === 4) gunText = "Weapon: SMG (4)";
    if(g === 5) gunText = "Weapon: Fountain (5)";
}

//swaps current gun with the previously used one
function swapGun()
{
    let tmp = gun;
    selectGun(prevGun);
    prevGun = tmp;
}


//makes the player use his weapon
//mode:
//0,1 = regular
//2 = big shot
//3 = shotgun
//4 = minigun
//5 = fountain
function shoot(mode, r, l, d, u)
{
    if(firingCooldown > 0) return;

    let x = 0;
    let y = 0;

    if( r ) x += 1;
    if( l ) x -= 1;
    if( d ) y += 1;
    if( u ) y -= 1;

    if(x === 0 && y === 0) return;

    if(x !== 0 && y !== 0) {x *= 0.7; y*= 0.7;}

    //rifle
    //DPS: 90
    if(mode === 0 || mode === 1)
    {
        shootBullet(x,y,12,480);
        firingCooldown = 8;
        shots.rifle++;
    }
    //cannon
    //DPS: 100
    if(mode === 2)
    {
        shootBullet(x,y,50,240);
        firingCooldown = 30;
        shots.cannon++;
    }
    //shotgun; generates 8 random angles between -0,35 and 0.35 radians
    //DPS: 109
    if(mode === 3)
    {
        for(let i=0; i < 8; i++)
        {
            let angle = 0.35 - 0.7 * Math.random();
            shootBullet(x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle), 5,720);
        }
        firingCooldown = 22;
        shots.shotgun += 8;
    }
    //smg; adds random spread to projectile speed
    //DPS: 105
    if(mode === 4)
    {
        let dx = 0.1 - 0.2 * Math.random()
        let dy = 0.1 - 0.2 * Math.random()
        shootBullet(x + dx, y + dy, 1.75,960);
        firingCooldown = 1;
        shots.smg++;
    }
    //fountain, sprays stuff all over the place, but mainly in the front
    //note: player speed is halved during usage
    //DPS: 120
    if(mode === 5)
    {
        let angle = Math.PI - Math.PI * ((Math.random()+Math.random()+Math.random()+Math.random()))/2;
        shootBullet(x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle), 4,720);
        firingCooldown = 2;
        shots.fountain++;
    }

}

//creates one player bullet with given position, size and speed
function shootBullet(x,y,size,speed)
{
    let vx; let vy;
    let speedAbs;
    if( (x === 0 && y === 0) || x === null || y === null)
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

    let px = player.x + (radius(player) * vx / speed);
    let py = player.y + (radius(player) * vy / speed);

    let newBullet = {
        x:px,
        y:py,
        vx:vx,
        vy:vy,
        size:size,
        //color:'#884411'
        color:player.color,
        shade:player.shade
    };

    //try to find an empty position in the bullet array
    for(var i = 0; i < bulletsMax; i++)
    {
        if(bullets[i] == null){
            bullets[i] = newBullet;
            bulletIndex = i+1;
            return;
        }
    }
    bullets[bulletIndex++] = newBullet;
    if(bulletIndex >= bulletsMax) bulletIndex = 0;
}

//main game loop
function tick()
{
    if(!init) return;

    //draw everything
    render();

    if(pause) return;

    timePassedMS += tickInterval;
    if(firingCooldown > 0)firingCooldown--;

    //magic
    secure();

    //player movement, firing, bullet movement
    playerActions();

    //make enemies do stuff
    enemyLogic();
};

//dont touch
function secure()
{
    tuem += tickInterval;

    if( tuem - timePassedMS !== 1944)
    {
        timePassedMS = -1;
        gameOver();
    }
}

//title screen loop
function tickPassive()
{
    //enemy collision
    enemyEnemy();

    //draw "soap"
    enemiesFormation();

    //shoo away from cursor because why not
    enemiesMouse();

    //if(pullStrength > 0.2) pullStrength -= 0.001;

    //render
    renderGame();
}

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
    for(let i = 0; i<enemiesMax; i++){
        if(enemies[i] != null){
            let x = enemies[i].x;
            let y = enemies[i].y;

            let dx= player.x-x;
            let dy= player.y-y;
            //purples chase enemies, not player
            if ( enemies[i].type === 7 && enemies[enemies[i].targetIndex] != null)
            {
                dx=enemies[enemies[i].targetIndex].x-x;
                dy=enemies[enemies[i].targetIndex].y-y;
            }
            let d=Math.sqrt(dx * dx + dy * dy);

            let vx = dx/d;
            let vy = dy/d;

            //enemy movement
            if(enemies[i].type < 128)
            {
                //yellow enemy spiraling
                if(enemies[i].type === 3 || enemies[i].type === 6)
                {
                    let vxt = vx;
                    let vyt = vy;
                    vx = vxt*Math.cos(enemies[i].angle) - vyt*Math.sin(enemies[i].angle)
                    vy = vxt*Math.sin(enemies[i].angle) + vyt*Math.cos(enemies[i].angle)
                }
                //orange enemy remembers movement direction for spawning minions behind it
                if(enemies[i].type === 5)
                {
                    let d = Math.sqrt(vx*vx+vy*vy)
                    enemies[i].vx = vx/d;
                    enemies[i].vy = vy/d;
                }
                //move
                enemies[i].x += vx * enemies[i].speed / fps;
                enemies[i].y += vy * enemies[i].speed / fps;
            }
            else
            {
                enemies[i].x += enemies[i].vx / fps;
                enemies[i].y += enemies[i].vy / fps;
            }

            //blue enemies shooting
            if(enemies[i].type === 2)
            {
                let shootChance = 0.01;
                if(Math.random() <= shootChance) enemyShoot(enemies[i]);
            }
            //purple enemies shooting and looking for other enemies to eat
            if(enemies[i].type === 7)
            {
                //always seek largest enemy on the field
                let bestSize = 0;
                for(let j =0; j < enemiesMax; j++)
                {
                    if(enemies[j] && i !== j && enemies[j].type !== 7 && enemies[j].size > bestSize){
                        enemies[i].targetIndex = j;
                        bestSize = enemies[j].size;
                    }
                }

                let shootChance = 0.005 * enemies[i].size;
                if(Math.random() <= shootChance)
                {
                    let shotSize = enemies[i].size / 10;
                    let spread = 0.314; //about 18 degrees spread
                    enemyShoot(enemies[i], shotSize, spread);
                    enemies[i].size -= shotSize/2;
                }
            }
            //orange enemies spawning minions (of type 3, yellow)
            if(enemies[i].type === 5)
            {
                let spawnChance = 0.01;
                if(Math.random() <= spawnChance)
                {
                    for(let j = 0; j < enemiesMax; j++)
                    {
                        if(enemies[j] == null)
                        {
                            let angle;
                            if(Math.random() < 0.5)angle = Math.PI / 5;
                            else angle = -Math.PI / 2.5;

                            let x = enemies[i].x - enemies[i].vx * radius(enemies[i]) * 1.1;
                            let y = enemies[i].y - enemies[i].vy * radius(enemies[i]) * 1.1;
                            let size = enemies[i].size/10;

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

            //cleanup
            if(enemies[i].x === null || enemies[i].x === undefined || isNaN(enemies[i].x)) enemies[i] = null;
            if(enemies[i].y === null || enemies[i].y === undefined || isNaN(enemies[i].y)) enemies[i] = null;
        }
    }
}
//enemy-bullet interaction
function enemyBullet()
{for(let e = 0; e<enemiesMax; e++){
    for(let b = 0; b<bulletsMax; b++){

        if( enemies[e] && bullets[b] &&
            collide(enemies[e], bullets[b]))
        {
            //green enemies split if they are large enough
            if( enemies[e].type === 4 && enemies[e].size >= 5)
            {
                split(enemies[e].x, enemies[e].y, enemies[e].color, enemies[e].size, enemies[e].speed, 5);
                bullets[b].size -= enemies[e].size;

                if(enemies[e].original === true) kills.splitters++;

                enemies[e] = null;

                if(bullets[b].size <= 0) bullets[b] = null;
            }
            //other enemies just take some damage
            else
            {
                let d = Math.min(enemies[e].size, bullets[b].size);
                if(d>4) d = 4;
                enemies[e].size -= d;
                bullets[b].size -= d;

                //player heals from dealing damage
                player.size += d*0.1;

                if(bullets[b].size <= 0) bullets[b] = null;
                if(enemies[e].size <= 0)
                {
                    if(enemies[e].type === 1) kills.generics++;
                    if(enemies[e].type === 2) kills.gunners++;
                    if(enemies[e].type === 3) kills.spiralers++;
                    if(enemies[e].type === 4) kills.splitterlings++;
                    if(enemies[e].type === 5) kills.hives++;
                    if(enemies[e].type === 6) kills.whirlers++;
                    if(enemies[e].type === 7) kills.cannibals++;
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
    //special case: type 7 consumes other enemies to grow larger
    for(let a = 0; a<enemiesMax; a++)
    {
        if(enemies[a] && enemies[a].type === 7)
        {
            for(let b = 0; b<enemiesMax; b++)
            {
                if(enemies[b]
                    && a !== b
                    && enemies[b].type !== 128
                    && collide(enemies[a],enemies[b]))
                {
                    let sizeRatio = enemies[a].size / ( enemies[a].size + enemies[b].size);
                    enemies[a].x = enemies[a].x*sizeRatio  +  enemies[b].x*(1-sizeRatio);
                    enemies[a].y = enemies[a].y*sizeRatio  +  enemies[b].y*(1-sizeRatio);
                    enemies[a].size += enemies[b].size*1.3;
                    enemies[b] = null;
                }
            }
        }
    }
    for(let a = 0; a<enemiesMax; a++){

        for(let b = a+1; b<enemiesMax; b++){
            if(a != b
                && enemies[a]
                && enemies[b]
                && enemies[a].type < 128
                && enemies[b].type < 128
                && enemies[a].type != 6
                && enemies[b].type != 6
                && enemies[a].type != 7
                && enemies[b].type != 7
            )
            {
                let dx= enemies[a].x-enemies[b].x;
                let dy= enemies[a].y-enemies[b].y;
                let d = Math.sqrt(dx * dx + dy * dy) *0.9;
                let r = radius(enemies[a]) + radius(enemies[b]);
                let err = r-d;
                err = err * err * err; //magic happens here
                if(err > 1000) err = 1000;

                if(d < r)
                {
                    enemies[a].x += Math.min(5,dx/(d* 5) * err / enemies[a].size);
                    enemies[a].y += Math.min(5,dy/(d* 5) * err / enemies[a].size);
                    enemies[b].x -= Math.min(5,dx/(d* 5) * err / enemies[b].size);
                    enemies[b].y -= Math.min(5,dy/(d* 5) * err / enemies[b].size);
                }
            }
        }
    }
}

//manages the player actions (movement, firing)
function playerActions()
{
    if(keyIsPressed['a'.charCodeAt(0)]) player.x -= player.speed/fps;
    if(keyIsPressed['d'.charCodeAt(0)]) player.x += player.speed/fps;
    if(keyIsPressed['w'.charCodeAt(0)]) player.y -= player.speed/fps;
    if(keyIsPressed['s'.charCodeAt(0)]) player.y += player.speed/fps;

    if(player.x < 0) player.x = 0;
    if(player.y < 0) player.y = 0;
    if(player.x > canvas.width) player.x = canvas.width;
    if(player.y > canvas.height) player.y = canvas.height;

    //player weapons
    shoot(gun, arrowKeyIsPressed.right, arrowKeyIsPressed.left, arrowKeyIsPressed.down, arrowKeyIsPressed.up);
    /*if(arrowKeyIsPressed.up) shoot(0,gun);
    if(arrowKeyIsPressed.left) shoot(1,gun);
    if(arrowKeyIsPressed.down) shoot(2,gun);
    if(arrowKeyIsPressed.right) shoot(3,gun);*/
    /*
    keep this?
    if(keyIsPressed['i'.charCodeAt(0)]) shoot(0,gun);
    if(keyIsPressed['j'.charCodeAt(0)]) shoot(1,gun);
    if(keyIsPressed['k'.charCodeAt(0)]) shoot(2,gun);
    if(keyIsPressed['l'.charCodeAt(0)]) shoot(3,gun);
    */

    //bullet movement
    for(let i = 0; i<bulletsMax; i++){
        if(bullets[i] != null){
            bullets[i].x += bullets[i].vx/fps;
            bullets[i].y += bullets[i].vy/fps;

            if(bullets[i].x < -20){ bullets[i] = null; continue;};
            if(bullets[i].y < -20){ bullets[i] = null; continue;};
            if(bullets[i].x > canvas.width + 20){ bullets[i] = null; continue;};
            if(bullets[i].y > canvas.height + 20){ bullets[i] = null; continue;};
        }
    }
}

//moves enemies to specified positions to write "SOAP"
function enemiesFormation()
{
    for(let ix = 0; ix < titlePullPointsX; ix++){
        for(let iy = 0; iy < titlePullPointsY; iy++){
            let i = ix+titlePullPointsX*iy;
            if(titlePullPoints[i] === 1)
            {
                let x = canvas.width * ((ix+1)/(titlePullPointsX+1));
                let y = canvas.height * ((iy+1)/(titlePullPointsY+1));

                for(let a = 0; a<enemiesMax; a++)
                {
                    if(enemies[a] != null){
                        let dx = x-enemies[a].x;
                        let dy = y-enemies[a].y;
                        let d = Math.sqrt(dx*dx + dy*dy);

                        let force = Math.pow(d,-2) * 1000 * pullStrength;
                        if(force > 1) force = 1;
                        if(force > d) force = d;

                        enemies[a].x += force * (dx/d);
                        enemies[a].y += force * (dy/d);
                    }
                }
            }
        }}
}


//makes enemies scared of the cursor

function enemiesMouse()
{
    for(let a=0;a<enemiesMax;a++)
    {
        if(enemies[a] != null){
            let dx = enemies[a].x - mouseX;
            let dy = enemies[a].y - mouseY;
            let d = Math.sqrt(dx*dx + dy*dy);

            let force = Math.pow(d,-2) * 1000 * 4;
            if(force > 10) force = 10;
            if(force > d) force = d;

            enemies[a].x += force * (dx/d);
            enemies[a].y += force * (dy/d);
        }
    }
}

//manages the creation of enemies
function enemySpawning()
{
    //spawn rates increase linearly over time; doubled after one minute, tripled after two...
    let newEnemyChance = 0.006 + timePassedMS / 10000000;
    newEnemyChance *= 60/fps;

    //red
    if(Math.random() <= newEnemyChance * 1.00) newEnemy(1);

    //blue, 25% as likely as red, start appearing after 15 seconds
    if(Math.random() <= newEnemyChance * 0.25 && timePassedMS >  15*1000) newEnemy(2);

    //yellow, twice as likely as red, start appearing after 30 seconds
    if(Math.random() <= newEnemyChance * 2.00 && timePassedMS >  30*1000) newEnemy(3);

    //green, 20% as likely as red, start appearing after 45 seconds
    if(Math.random() <= newEnemyChance * 0.20 && timePassedMS >  45*1000) newEnemy(4);

    //orange, 10% as likely as red, start appearing after 60 seconds
    if(Math.random() <= newEnemyChance * 0.10 && timePassedMS >  60*1000) newEnemy(5);

    //purple, 10% as likely as red, start appearing after 75 seconds
    if(Math.random() <= newEnemyChance * 0.10 && timePassedMS >  75*1000) newEnemy(7);
}



//creates smaller enemies with the same size as the original
//careful, have to call it with individual values instead of the original object,
//because in the context it is used the original object might get deleted before this function finished executing!
function split(x, y, color, size, speed, n)
{
    let c = n;
    let r = radius({size:size});
    for(let i = 0; i < enemiesMax  && n > 0; i++)
    {
        if(enemies[i] == null)
        {
            let newX = (Math.sin(Math.PI * n * 2 / c) * r) + x;
            let newY = (Math.cos(Math.PI * n * 2/ c) * r) + y;

            enemies[i] = {x:newX, y:newY, size:size/c, color:color, speed:speed*1.5, type:4, original:false}

            n--;
        }
    }
}



//Returns the on-screen radius of an entity e
function radius(e)
{
    return 4*Math.sqrt(e.size);
}



//creates an enemy with size factor s and type t at a random location
function newEnemy(t, s)
{
    if(t == null) t = 1;
    if(s == null) s = 1;

    let x;
    let y;

    while(true)
    {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;

        if(Math.abs( x - player.x) > 150 || Math.abs( y - player.y) > 150) break;
    }

    putEnemy(t, s, x, y);
}

//spawns an enemy of given type at the given position
function putEnemy(t, sf, x, y)
{
    for(let i=0; i<enemiesMax; i++)
    {
        if(enemies[i] == null)
        {
            //blue snipers
            if( t === 2)
            {
                let s = 50 *( 0.2+Math.random());
                enemies[i] = {x:x, y:y, size:s*sf, color:'#0820ff', speed:30, type:t,
                    projectileSpeed: 360};
                break;
            }
            //yellow spiralers
            if( t === 3)
            {
                let s = 10 *( 0.2+Math.random());
                let angle = 0.2 - 0.4 * Math.random();
                if(Math.random() < 0.5)
                {
                    angle += Math.PI / 4;
                }
                else{
                    angle -= Math.PI / 4;
                }
                enemies[i] = {x:x, y:y, size:s*sf, color:'#dddd18', speed:180, type:t, angle:angle};
                break;
            }
            //green splitters
            if( t === 4)
            {
                let s = 50 *( 0.2+Math.random());
                enemies[i] = {x:x, y:y, size:s*sf, color:'#209020', speed:90, type:t, original:true};
                break;
            }
            //orange carriers that spawn extra fast yellow spiralers
            if( t === 5)
            {
                let s = 60 *( 0.2+Math.random());
                enemies[i] = {x:x, y:y, size:s*sf, color:'#e07000', speed:30, type:t, vx:0, vy:0};
                break;
            }
            //purple blobs that consume other enemies to shoot their mass at the player
            if( t === 7)
            {
                let s = 6 *( 0.2+Math.random());
                enemies[i] = {x:x, y:y, size:s*sf, color:'#a010e0', speed:120, type:t, projectileSpeed: 540, targetIndex:0};
                break;
            }
            //default enemy
            let s = 25 *( 0.2+Math.random());
            enemies[i] = {x:x, y:y, size:s*sf, color:'#dd0808', speed:120, type:t};

            break;
        }
    }
}

//makes enemy e shoot at the player
function enemyShoot(e, size, spread)
{
    if(size == null) size=e.size/4;
    if(spread == null) spread=0;
    for(let i=0; i<enemiesMax; i++)
    {
        if(enemies[i] == null)
        {
            let dx = player.x - e.x;
            let dy = player.y - e.y;
            let d=Math.sqrt(dx*dx+dy*dy);
            let vx = dx/d * e.projectileSpeed;
            let vy = dy/d * e.projectileSpeed;

            if(spread !== 0)
            {
                let a = spread - 2*spread*Math.random();
                let tmp = vx;
                vx = vx*Math.cos(a) - vy*Math.sin(a);
                vy = tmp*Math.sin(a)+ vy*Math.cos(a);
            }

            enemies[i] = {x:e.x, y:e.y, size:size, vx:vx, vy:vy, color:e.color, speed:e.projectileSpeed, type:128};
            break;
        }
    }
}


//draws the circle that represents an entity
function drawObject(e)
{
    let linewidth = 5;
    if(e == null) return;
    if(e.shade != null){
        c.fillStyle = e.shade;
        c.lineWidth = linewidth;
        c.beginPath();
        c.arc(e.x,e.y,radius(e),0,2*Math.PI);
        c.fill();
    }
    if(e.color != null){
        c.strokeStyle = e.color;
        c.lineWidth = linewidth;
        c.beginPath();
        c.arc(e.x,e.y,radius(e),0,2*Math.PI);
        c.stroke();
    }
}


//checks if two entities are touching
function collide(a, b)
{
    let dx = a.x-b.x;
    let dy = a.y-b.y;
    let d = Math.sqrt(dx * dx + dy * dy);

    if(d <= (radius(a) + radius(b))) return true;
    else return false;
}



//draws everything
//has to be separated from the game logic to prevent flickering
function render()
{
    renderGame();
    renderHud();
}

//renders background, enemies, player, bullets
function renderGame()
{
    c.clearRect(0,0,canvas.width,canvas.height);
    c.fillStyle = "white";
    if(pause) c.fillStyle = "#001010";
    c.fillRect(0,0,canvas.width,canvas.height);

    for(let i = 0; i<bulletsMax; i++){
        if(bullets[i] != null){
            drawObject(bullets[i]);
        }
    }

    for(let i = 0; i<enemiesMax; i++){
        if(enemies[i] != null){
            drawObject(enemies[i]);
        }
    }

    drawObject(player);
}

//draws the hud
function renderHud()
{

    c.font = "14px Arial";
    c.strokeStyle = "#666666";
    c.lineWidth = 1;
    c.strokeText(gunText, 10, 23);
    c.strokeText("Time survived: " + timePassedMS/1000 + "s", 10, canvas.height-10);
}
// zählt alle kills zusammen
function killsTotal()
{
    let result = 0;
    for (let property in kills) {
        if (kills.hasOwnProperty(property)) {
            result += kills[property];
        }
    }
    //bullets, splitterlings und whirlers würde ich nicht als kills zählen, das sind eher projektile als gegner
    //ich zieh vorerst einfach wieder ab, k?
    result -= kills.bullets;
    result -= kills.splitterlings;
    result -= kills.whirlers;

    return result;
}

// schreibt die Spielergebnisse in hidden fields und submitted zum game over screen
function submitResults()
{
    document.getElementById('time').value = timePassedMS;
    document.getElementById('kills').value = killsTotal();
    document.getElementById('game_id').value = Math.floor(Math.random() * 100000).toString();
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









