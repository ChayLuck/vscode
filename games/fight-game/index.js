//çalışacağımız canvası alıyourz
canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
//boyut
canvas.width = 1024
canvas.height = 576

//çalışılacak alan siyah
c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.7

//Objeleri konumlarla oluşturduk

const background = new Sprite({
    position: {x:0,y:0},
    width: canvas.width,
    height: canvas.height,
    imageSrc: './img/Battleground2.png'
})

const girl = new Sprite({
    position: {x:230,y:200},
    width: canvas.width,
    height: canvas.height,
    imageSrc: './img/64X128_Idle_Free.png',
    frameMax: 8,
    frameMax2: 4
})
const girl2 = new Sprite({
    position: {x:665,y:200},
    width: canvas.width,
    height: canvas.height,
    imageSrc: './img/64X128_Idle_Free.png',
    frameMax: 8,
    frameMax2: 4
})

const player = new Fighter({
position: {x:0,y:0},
velocity: {x:0,y:1},
offset: {x:0,y:0},
imageSrc: './img/Player1/Idle.png',
frameMax: 8,
scale: 2,
offset: {x:70,y:95}}) 

const enemy = new Fighter({
position: {x:400,y:100},
velocity: {x:0,y:1},
color: "red",
offset: {x:-50,y:0}}) 

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

//let lastKey ama gerekmiyor artık

//animation loop - sürekli frame talebi
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black' //arkayı her update öncesi sil
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    girl.update()
    girl2.update()
    player.update()
    enemy.update()
    
    //Player movement
    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -3
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 3
    } 

    //Enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -3
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 3
    } 

    //Detect collision
    if (rectangularCollision({rectangle1:player,rectangle2:enemy}) &&
        player.isAttacking
    ){
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'

    }

    if (rectangularCollision({rectangle1:enemy,rectangle2:player}) &&
        enemy.isAttacking
    ){
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'

    }
    //end game
    if (player.health <= 0 || enemy.health <= 0){
        clearTimeout(timerId)
        document.querySelector('#displayText').style.display = 'flex'
        if (player.health === enemy.health){
            document.querySelector('#displayText').innerHTML = 'Tie'}
            else if (player.health > enemy.health){
                document.querySelector('#displayText').innerHTML = 'Player Wins'} 
                else if (player.health < enemy.health){
                document.querySelector('#displayText').innerHTML = 'Enemy Wins'}
    }
}
animate()

window.addEventListener('keydown', (event) =>{
    
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
        break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
        break
        case 'w':
            player.velocity.y = -20
        break
        case ' ':
            player.attack()
        break

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