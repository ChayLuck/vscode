//çalışacağımız canvası alıyourz
canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//boyut
canvas.width = 1024
canvas.height = 576

//çalışılacak alan siyah
c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.7

//yeni bir obje oluşturduğumuz zaman otomatik pozisyonata
//{}içine alarak tek objede istenen şeyleri taşıyoruz
//hepsi gelmesi de gerekmiyor
class Sprite {
    constructor({position,velocity,colour = "blue"}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 70
        this.lastKey
        this.attackBox = {
            position:this.position,
            width:100,
            height:50,
        }
        this.colour = colour
        this.isAttacking
    }

    draw(){
        c.fillStyle = this.colour
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
        
        if(this.isAttacking){
        c.fillStyle = "green"
        c.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height)}
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        } else {this.velocity.y += gravity}
    }

    attack(){
        this.isAttacking = true
        setTimeout(()=>{
            this.isAttacking = false
        }, 100)
    }
}

//Objeleri konumlarla oluşturduk
const player = new Sprite({
position: {x:0,y:0},
velocity: {x:0,y:1}}) 

const enemy = new Sprite({
position: {x:400,y:100},
velocity: {x:0,y:1},
colour: "red"}) 

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

//let lastKey ama gerekmiyor artık

//animation loop - sürekli frame talebi
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black' //arkayı her update öncesi sil
    c.fillRect(0,0,canvas.width,canvas.height)
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
    if (player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height &&
        player.isAttacking
    ){
        player.isAttacking = false
        console.log("attacked");

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
    }
    console.log(event.key);
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
    console.log(event.key);
})