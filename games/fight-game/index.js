//çalışacağımız canvası alıyourz
canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
//boyut
canvas.width = 1024
canvas.height = 576

let gravity
const player = new Fighter({
    position: {x:0,y:0},
    velocity: {x:0,y:0},
    offset: {x:0,y:0},
    imageSrc: './img/Player1/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {x:215,y:157},
    sprites: {
        idle: {
            imageSrc: './img/Player1/Idle.png',
            framesMax: 8
        },
        attack1: {
            imageSrc: './img/Player1/Attack1.png',
            framesMax: 4
        },
        die: {
            imageSrc: './img/Player1/Die.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Player1/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Player1/Fall.png',
            framesMax: 2
        },
        run: {
            imageSrc: './img/Player1/Run.png',
            framesMax: 8
        },
        takeHit: {
            imageSrc: './img/Player1/Take hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/Player1/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {x:100,y:50},
        width: 160,
        height: 50
    }
})
const enemy = new Fighter({
    position: {x:400,y:100},
    velocity: {x:0,y:0},
    offset: {x:-50,y:0},
    imageSrc: './img/Player2/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {x:215,y:167},
    sprites: {
        idle: {
            imageSrc: './img/Player2/Idle.png',
            framesMax: 4
        },
        attack1: {
            imageSrc: './img/Player2/Attack1.png',
            framesMax: 4
        },
        die: {
            imageSrc: './img/Player2/Die.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Player2/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Player2/Fall.png',
            framesMax: 2
        },
        run: {
            imageSrc: './img/Player2/Run.png',
            framesMax: 8
        },
        takeHit: {
            imageSrc: './img/Player2/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Player2/Death.png',
            framesMax: 7
        },
    },
    attackBox: {
        offset: {x:-170,y:50},
        width: 170,
        height: 50
    },
}) 

// Function to reset everything when starting a new level
function resetUI() {
    // Reset health display
    gsap.to('#playerHealth', {
      width: '100%'
    });
    gsap.to('#enemyHealth', {
      width: '100%'
    });
    
    // Reset timer display
    timer = 60;
    document.querySelector('#timer').innerHTML = timer;
    
    // Hide any game-end text
    document.querySelector('#displayText').style.display = 'none';
    document.querySelector('#displayText').innerHTML = '';
    
    // Clear timer if it exists
    if (timerId) {
      clearTimeout(timerId);
    }
  }

function updateUIForLevel() {
    // Show or hide enemy health bar based on current level
    const enemyHealthBar = document.querySelector('div:has(> #enemyHealth)');
    if (enemyHealthBar) {
        if (currentScene === 2) {
            enemyHealthBar.style.display = 'none';
        } else {
            enemyHealthBar.style.display = 'block';
        }
    }
    
    // Update timer position when enemy health is hidden
    const timer = document.querySelector('#timer');
    if (timer) {
        if (currentScene === 2) {
            timer.style.marginLeft = 'auto';
        } else {
            timer.style.marginLeft = '0';
        }
    }
}

let currentScene = 1;

// Level manager
const levelManager = {
    currentLevel: 1,
    maxLevel: 2, // Update this as you add more levels
    
    loadLevel: function(levelNumber) {
      if (levelNumber > this.maxLevel) {
        this.gameComplete();
        return;
      }
      
      // Reset the game state
      this.resetGameState();
      
      // Initialize the new level
      if (levels[levelNumber] && levels[levelNumber].init) {
        levels[levelNumber].init();
      }
      // Update UI elements based on level
      updateUIForLevel();
    
      // Start the timer for the new level
      decreaseTimer();
      // Start the timer for the new level
      decreaseTimer();
    },
    
    resetGameState: function() {
      // Reset UI elements
      resetUI();
      
      // Reset player and enemy
      player.dead = false;
      player.health = 100;
      enemy.dead = false;
      enemy.health = 100;
      
      // Reset player and enemy positions
      player.position = { x: 100, y: 0 };
      player.velocity = { x: 0, y: 0 };
      
      enemy.position = { x: 400, y: 100 };
      enemy.velocity = { x: 0, y: 0 };
      
      // Reset AI state if it's active
      if (ai.active) {
        ai.state = 'idle';
        ai.attackCooldown = 0;
        ai.jumpCooldown = 0;
        ai.randomMoveCooldown = 0;
      }
      
      // Reset keys
      Object.keys(keys).forEach(key => {
        keys[key].pressed = false;
      });
      
      // Set initial sprites
      player.switchSprite('idle');
      enemy.switchSprite('idle');
    },
    
    nextLevel: function() {
      this.currentLevel++;
      this.loadLevel(this.currentLevel);
    },
    
    gameComplete: function() {
      // Handle game completion
      document.querySelector('#displayText').style.display = 'flex';
      document.querySelector('#displayText').innerHTML = 'Game Complete!';
    }
  };

let level = 1
let levels = {
    1: {
        init: () => {

    currentScene = 1;
    gravity = 0.7

//Objeleri konumlarla oluşturduk

    background = new Sprite({
    position: {x:0,y:0},
    width: canvas.width,
    height: canvas.height,
    imageSrc: './img/Battleground2.png',
    scale: 0.55
})
      
      // Update image references
      for (const sprite in player.sprites) {
        player.sprites[sprite].image = new Image();
        player.sprites[sprite].image.src = player.sprites[sprite].imageSrc;
      }
      
      for (const sprite in enemy.sprites) {
        enemy.sprites[sprite].image = new Image();
        enemy.sprites[sprite].image.src = enemy.sprites[sprite].imageSrc;
      }
      
      // Reset sprites
      player.switchSprite('idle');
      enemy.switchSprite('idle');

    girl = new Sprite({
    position: {x:230,y:200},
    width: canvas.width,
    height: canvas.height,
    imageSrc: './img/64X128_Idle_Free.png',
    framesMax: 8,
    framesMax2: 4,
    scale: 1.25
})
    girl2 = new Sprite({
    position: {x:765,y:200},
    width: canvas.width,
    height: canvas.height,
    imageSrc: './img/64X128_Idle_Free.png',
    framesMax: 8,
    framesMax2: 4,
    scale: 1.25
})

    doors = [ new Sprite({
    position: {x:900,y:350},
    imageSrc: './img/doorOpen.png',
    framesMax: 5,
    loop: false,
    autoplay: false,
})]

}
},

2: {
    init: () => {

currentScene = 2;
gravity = 0.7

player.position = {x:0,y:0}

player.imageSrc = './img/Player1/Idle.png';

// Update image references again
for (const sprite in player.sprites) {
    player.sprites[sprite].image = new Image();
    player.sprites[sprite].image.src = player.sprites[sprite].imageSrc;
  }
  
// Reset sprites
player.switchSprite('idle');


enemy.position = {x:-10000,y:-10000}

//Objeleri konumlarla oluşturduk

background = new Sprite({
position: {x:0,y:0},
width: canvas.width,
height: canvas.height,
imageSrc: './img/24.png',
scale: 0.55
})

doors = [ new Sprite({
position: {x:900,y:350},
imageSrc: './img/doorOpen.png',
framesMax: 5,
loop: false,
autoplay: false,
})]

gsap.to('#playerHealth', {
    width: '100%'
});

// Hide enemy health bar
const enemyHealthBar = document.querySelector('div:has(> #enemyHealth)');
if (enemyHealthBar) {
    enemyHealthBar.style.display = 'none';
}

// Update timer position
const timer = document.querySelector('#timer');
if (timer) {
    timer.style.marginLeft = 'auto';
}

// Clear any display text
document.querySelector('#displayText').style.display = 'none';

}
}

}

//çalışılacak alan siyah
c.fillRect(0,0,canvas.width,canvas.height) 

const keys = {
    a: {
        pressed : false
    },
    d: {
        pressed : false
    },

    ArrowLeft: {
        pressed : false
    },
    ArrowRight: {
        pressed : false
    },
}

decreaseTimer()

// Add this to your index.js file, just before the animate function

// AI configuration
const ai = {
    active: false, // Start with AI disabled
    difficulty: 'medium', // 'easy', 'medium', 'hard'
    thinkingTime: 0,
    lastThink: 0,
    distancePreference: {
      min: 100,
      max: 200
    },
    attackCooldown: 0,
    jumpCooldown: 0,
    randomMoveCooldown: 0,
    state: 'idle' // 'idle', 'approach', 'retreat', 'attack', 'dodge'
  };
  
  // AI status display
  function updateAIStatusDisplay() {
    // Check if AI status element exists, if not create it
    let aiStatus = document.getElementById('aiStatus');
    if (!aiStatus) {
      aiStatus = document.createElement('div');
      aiStatus.id = 'aiStatus';
      aiStatus.style.position = 'absolute';
      aiStatus.style.top = '10px';
      aiStatus.style.left = '10px';
      aiStatus.style.color = 'white';
      aiStatus.style.fontFamily = '"Press Start 2P", system-ui';
      aiStatus.style.fontSize = '10px';
      document.querySelector('body').appendChild(aiStatus);
    }
    
    // Update the text
    aiStatus.innerHTML = `AI: ${ai.active ? 'ON (' + ai.difficulty + ')' : 'OFF'}`;
  }
  
  // AI behavior function
  function updateAI() {
    if (!ai.active || enemy.dead) return;
    
    // AI thinking timing
    const now = Date.now();
    if (now - ai.lastThink < ai.thinkingTime) return;
    ai.lastThink = now;
    
    // Calculate distance between players
    const distanceX = player.position.x - enemy.position.x;
    const absoluteDistanceX = Math.abs(distanceX);
    const playerIsLeft = distanceX < 0;
    
    // Decrease cooldowns
    if (ai.attackCooldown > 0) ai.attackCooldown--;
    if (ai.jumpCooldown > 0) ai.jumpCooldown--;
    if (ai.randomMoveCooldown > 0) ai.randomMoveCooldown--;
    
    // Set difficulty parameters
    switch (ai.difficulty) {
      case 'easy':
        ai.thinkingTime = 300;
        ai.attackCooldown = Math.max(ai.attackCooldown, 0);
        ai.distancePreference = { min: 150, max: 250 };
        break;
      case 'medium':
        ai.thinkingTime = 100;
        ai.attackCooldown = Math.max(ai.attackCooldown, 0);
        ai.distancePreference = { min: 100, max: 200 };
        break;
      case 'hard':
        ai.thinkingTime = 50;
        ai.attackCooldown = Math.max(ai.attackCooldown, 0);
        ai.distancePreference = { min: 80, max: 160 };
        break;
    }
    
    // Reset movement
    keys.ArrowLeft.pressed = false;
    keys.ArrowRight.pressed = false;
    
    // Determine AI state
    if (ai.randomMoveCooldown <= 0) {
      const randomAction = Math.random();
      if (randomAction < 0.6) {
        ai.state = absoluteDistanceX < ai.distancePreference.min ? 'retreat' : 
                  (absoluteDistanceX > ai.distancePreference.max ? 'approach' : 'idle');
      } else if (randomAction < 0.8) {
        ai.state = 'attack';
      } else {
        ai.state = 'dodge';
      }
      ai.randomMoveCooldown = 30 + Math.floor(Math.random() * 30);
    }
    
    // Execute based on state
    switch (ai.state) {
      case 'approach':
        if (playerIsLeft) {
          keys.ArrowLeft.pressed = true;
          enemy.lastKey = 'ArrowLeft';
        } else {
          keys.ArrowRight.pressed = true;
          enemy.lastKey = 'ArrowRight';
        }
        break;
      
      case 'retreat':
        if (playerIsLeft) {
          keys.ArrowRight.pressed = true;
          enemy.lastKey = 'ArrowRight';
        } else {
          keys.ArrowLeft.pressed = true;
          enemy.lastKey = 'ArrowLeft';
        }
        break;
      
      case 'attack':
        // Attack if in range and attack is not on cooldown
        if (absoluteDistanceX < 200 && ai.attackCooldown <= 0) {
          enemy.attack();
          ai.attackCooldown = 1; // Set cooldown after attack
        }
        break;
      
      case 'dodge':
        // Jump to dodge if not already in air
        if (enemy.position.y >= 330 && ai.jumpCooldown <= 0) {
          enemy.velocity.y = -20;
          ai.jumpCooldown = 1;
        }
        break;
    }
    
    // Random chance to attack if close regardless of state
    if (absoluteDistanceX < 150 && ai.attackCooldown <= 0 && Math.random() < 0.1) {
      enemy.attack();
      ai.attackCooldown = 1;
    }
    
    // Random chance to jump if player is attacking
    if (player.isAttacking && enemy.position.y >= 330 && ai.jumpCooldown <= 0 && Math.random() < 0.3) {
      enemy.velocity.y = -20;
      ai.jumpCooldown = 1;
    }
  }

const overlay = {
    opacity: 0
}

levels[level].init()

//let lastKey ama gerekmiyor artık

//animation loop - sürekli frame talebi
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black' //arkayı her update öncesi sil
    c.fillRect(0,0,canvas.width,canvas.height)

    if (background) {
        background.update();
      }

    if (currentScene === 1) {
     if (girl) girl.update();
     if (girl2) girl2.update();
    }

    if (doors && doors.length > 0) {
        doors.forEach(door => {
        door.update();
      });
    }
    
    c.fillStyle = 'rgba(255,255,255,0.0)'
    c.fillRect(0,0,canvas.width,canvas.height)

    if (player) player.update();

    // Update AI status display
    updateAIStatusDisplay()
    
    // Update AI only if active
    if (ai && ai.active) {
        updateAI();
    }
    
    if (enemy) {
    enemy.update();
  }

    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    c.restore()

    //Player movement
    if (player) {
    player.velocity.x = 0

    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')}

    //jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }
}

    //Enemy movement
    if (enemy) {
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')}

    //jumping
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }
}

    //Detect collision
    if (player && enemy && rectangularCollision({ rectangle1: player, rectangle2: enemy }) && 
      player.isAttacking && player.framesCurrent === 2) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    });
  }
    //miss
    if (player && player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false;
      }

      if (player && enemy && rectangularCollision({ rectangle1: enemy, rectangle2: player }) && 
      enemy.isAttacking && enemy.framesCurrent === 2) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('#playerHealth', {
      width: player.health + '%'
    });
  }
    //miss
    if (enemy && enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
      }
    //end game
    if (player && enemy && (player.health <= 0 || enemy.health <= 0)) {
        clearTimeout(timerId);
        document.querySelector('#displayText').style.display = 'flex';
        if (player.health === enemy.health) {
          document.querySelector('#displayText').innerHTML = 'It\'s a Tie';
        } else if (player.health > enemy.health) {
          document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
        } else if (player.health < enemy.health) {
          document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
        }
    }
}

levelManager.loadLevel(1);

animate()
// Modify your event listeners to add the AI toggle option
window.addEventListener('keydown', (event) =>{
    if (!player.dead){
        if (player.preventInput) return
        switch(event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
            break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
            break
            // Replace your current door interaction code with this in your keydown event handler
case 'w':
    for (let i = 0; i < doors.length; i++) {
      const door = doors[i];
      if (
        player.position.x + player.width >= door.position.x &&
        player.position.x <= door.position.x + door.width &&
        player.position.y + player.height >= door.position.y &&
        player.position.y <= door.position.y + door.height
      ) {
        // Only allow level transition if enemy is defeated
        if (!enemy || enemy.dead) {
          player.velocity.x = 0;
          player.velocity.y = 0;
          player.preventInput = true;
          
          // Play door animation
          doors[i].play();
          
          // Fade out
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.5,
            onComplete: () => {
              // Load next level
              levelManager.nextLevel();
              
              // Fade back in
              gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                  player.preventInput = false;
                }
              });
            }
          });
          
          return;
        }
      }
    }
    // If not at a door, jump
    player.velocity.y = -20;
    break;
            case ' ':
                player.attack()
            break
        }
    }
    
    // AI controls only work when AI is off
    if (!ai.active && !enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
            break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
            break
            case 'ArrowUp':
                enemy.velocity.y = -20
            break
            case 'ArrowDown':
                enemy.attack()
            break
        }
    }
    
    // AI toggle and difficulty controls
    switch(event.key){
        case 'o':
        case 'O':
            // Toggle AI on/off
            ai.active = !ai.active;
            console.log(`AI ${ai.active ? 'activated' : 'deactivated'}`);
            // Reset enemy controls when turning AI on
            if (ai.active) {
                keys.ArrowLeft.pressed = false;
                keys.ArrowRight.pressed = false;
            }
        break
        case '1':
            ai.difficulty = 'easy';
            console.log('AI difficulty set to easy');
        break
        case '2':
            ai.difficulty = 'medium';
            console.log('AI difficulty set to medium');
        break
        case '3':
            ai.difficulty = 'hard';
            console.log('AI difficulty set to hard');
        break
    }
})

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
    }
})