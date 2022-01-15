import platform from '../../public/assets/img/platform.png'
import hills from '../../public/assets/img/hills.png'
import background from '../../public/assets/img/background.png'
import platformSmallTall from '../../public/assets/img/platformSmallTall.png'

import spriteRunLeft from '../../public/assets/img/spriteRunLeft.png'
import spriteRunRight from '../../public/assets/img/spriteRunRight.png'
import spriteStandLeft from '../../public/assets/img/spriteStandLeft.png'
import spriteStandRight from '../../public/assets/img/spriteStandRight.png'

import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1920
canvas.height = 684
const gravity = 1.5

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
class Player {
  constructor(){
    this.sound = new Audio()
    this.sound.src = '../../public/assets/audio/joia.wav'
    this.speed = 10
    this.position = {
      x: 100,
      y: 100
    }
    this.velocity = {
      x: 0,
      y: 1
    }
    this.width = 60
    this.height = 150
    this.image = createImage(spriteStandRight)
    this.frames = 0
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875
      }
    }

    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = 177
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0, 
      this.currentCropWidth,
      400, 
      this.position.x, 
      this.position.y, 
      this.width, 
      this.height
      )
  }

  update() {
    this.frames++

    if(this.frames === 0){
      this.sound.play()
    }
    
    if (this.frames > 59 && 
      (this.currentSprite === this.sprites.stand.right || 
      this.currentSprite === this.sprites.stand.left)){
      this.frames = 0
    }
    else if(this.frames > 29 && 
      (this.currentSprite === this.sprites.run.right || 
      this.currentSprite === this.sprites.run.left)){
      this.frames = 0
    }
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if(this.position.y + this.height + this.velocity.y <= canvas.height){
      this.velocity.y += gravity
    }
    
  }  
}
// Objects
class Object {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }
}
class Platform {
  constructor({x, y, image}){
    this.position = {
      x,
      y
    }
    this.image = image
    this.width = image.width
    this.height = image.height

    
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  }
}

class GenericObject {
  constructor({x, y, image}){
    this.position = {
      x,
      y
    }

    this.image = image
    this.width = image.width
    this.height = image.height

  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  }
}

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

let platformImage = createImage(platform)

let player = new Player()
let platforms = []

let genericObjects = []

let currentKey
let lastKey
let objects = new Object()
let keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}

let scrollOffset = 0

function init(){
  platformImage = createImage(platform)
  objects = []
  for (let i = 0; i < 400; i++) {
    objects.push()
  }
  player = new Player()
  platforms = [
    new Platform({
      x: platformImage.width * 4 + 400 - 2 + platformImage.width,
      y: 260, 
      image: createImage(platformSmallTall) }),
    new Platform({
        x: platformImage.width * 6 + 400 - 3 + platformImage.width,
        y: 160, 
        image: createImage(platformSmallTall) }),
    new Platform({
    x: -1,
    y: 560,
    image: platformImage
    }), 
    new Platform({
    x: platformImage.width - 3, 
    y: 560, 
    image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 200,
      y: 560, 
      image: platformImage }),
    new Platform({
      x: platformImage.width * 3 + 400,
      y: 560, 
      image: platformImage }),
    new Platform({
      x: platformImage.width * 4 + 400 - 2,
      y: 560, 
      image: platformImage }), 
    new Platform({
      x: platformImage.width * 5 + 700 - 2,
      y: 560, 
      image: platformImage }),
    new Platform({
      x: platformImage.width * 7 + 1000 - 2,
      y: 560, 
      image: platformImage }),
    new Platform({
        x: platformImage.width * 8 + 1000 - 2,
        y: 560, 
        image: platformImage })
  ]

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background)
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills)
    })
  ],
  
  scrollOffset = 0
}
// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y)
  objects.forEach(object => {
    object.update()
  })
  genericObjects.forEach((genericObject) => {
    genericObject.draw()
  })

  
  platforms.forEach((platform) => {
    platform.draw()
  })
  player.update()

  if(keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed
  }
  else if((keys.left.pressed && player.position.x > 100) || 
  keys.left.pressed && scrollOffset === 0 && player.position.x > 0 ) {
    player.velocity.x = -player.speed
  }
  else {
    player.velocity.x = 0
    if(keys.right.pressed) {
      scrollOffset += player.speed
      platforms.forEach((platform) => {
        platform.position.x -= player.speed
      })
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66
      })
    
    } else if(keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed

      platforms.forEach((platform) => {
        platform.position.x += player.speed
      })
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66
      })
    }
  }

  
  //Plataform collision detection
  platforms.forEach((platform) => {
    if(player.position.y + player.height <= 
      platform.position.y && player.position.y + 
      player.height + player.velocity.y >= 
      platform.position.y && player.position.x + 
      player.width >= platform.position.x && 
      player.position.x <= platform.position.x + 
      platform.width) {
      player.velocity.y = 0
    }
  })

  if(
    keys.right.pressed &&
    currentKey === 'right' && 
    player.currentSprite !== player.sprites.run.right) {
    player.frames = 1
    player.currentSprite = player.sprites.run.right
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  }
  else if(
    keys.left.pressed &&
    currentKey === 'left' && 
    player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
    }
  else if(
    !keys.left.pressed &&
    currentKey === 'left' && 
    player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left
      player.currentCropWidth = player.sprites.stand.cropWidth
      player.width = player.sprites.stand.width
  }
  else if(
    !keys.right.pressed &&
    currentKey === 'right' && 
    player.currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
  }
  // win condition
  if(scrollOffset >  platformImage.width * 5 + 300 - 2) {
    console.log(scrollOffset)
  }

  // lose condition
  if(player.position.y > canvas.height){
    init()
  }
}
init()
animate() 

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})
addEventListener('keydown', ({ keyCode}) => {
  switch (keyCode) {
    case 37:
      console.log('left')
      keys.left.pressed = true
      currentKey = 'left'
      break;
    case 40:
      console.log('down')
      break;
    case 39:
      console.log('right')
      keys.right.pressed = true
      currentKey = 'right'
      break;
    case 38:
      console.log('up')
      player.velocity.y -= 10
      break;
  }
  console.log(keys.right.pressed)
})

addEventListener('keyup', ({ keyCode}) => {
  switch (keyCode) {
    case 37:
      console.log('left')
      keys.left.pressed = false
      break;
    case 40:
      console.log('down')
      break;
    case 39:
      console.log('right')
      keys.right.pressed = false
      player.currentSprite = player.sprites.stand.right
      player.currentCropWidth = player.sprites.stand.cropWidth
      player.width = player.sprites.stand.width
      break;
    case 38:
      console.log('up')
      player.velocity.y -= 10
      break;
  }
})

