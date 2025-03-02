//yeni bir obje oluşturduğumuz zaman otomatik pozisyonata
//{}içine alarak tek objede istenen şeyleri taşıyoruz
//hepsi gelmesi de gerekmiyor
class Sprite {
    constructor({position, imageSrc, scale = 1, frameMax=1, frameMax2=1, offset = {x:0,y:0}}) {  
        this.position = position
        this.height = 576
        this.width = 1024
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frameMax = frameMax
        this.frameMax2 = frameMax2
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 12
        this.offset = offset
    }

    draw(){
        c.drawImage(this.image,this.framesCurrent*(this.image.width/this.frameMax),0,this.image.width/this.frameMax,this.image.height/this.frameMax2,this.position.x - this.offset.x,this.position.y - this.offset.y,(this.width/this.frameMax)*this.scale,(this.height/this.frameMax2)*this.scale)
    }

    update(){
        this.draw()
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0){
        if(this.framesCurrent < this.frameMax - 1){
            this.framesCurrent++
        } else {this.framesCurrent = 0}
    }
}
}

class Fighter extends Sprite {
    constructor({position,velocity,color = "blue",imageSrc, scale = 1, frameMax=1, frameMax2=1, offset = {x:0,y:0}}){
        super({position, imageSrc, scale, frameMax, frameMax2, offset})
        this.velocity = velocity
        this.height = 250
        this.width = 2000
        this.lastKey
        this.attackBox = {
            position:{
            x : this.position.x,
            y : this.position.y
            },
            offset,
            width:100,
            height:50,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 12
    }

    update(){
        this.draw()
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0){
        if(this.framesCurrent < this.frameMax - 1){
            this.framesCurrent++
        } else {this.framesCurrent = 0}
    }
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 65){
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