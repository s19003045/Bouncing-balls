
// 設定畫佈
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight


// 選定result
let gameResult = document.querySelector('.result')

// 設定球數
let ballCounts = 0
let ballCountDisplay = document.querySelector('span')
// 亂數產生函式
function random(min, max) {
  let num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}


// check是否為mobile
function isMobile() {
  try { document.createEvent("TouchEvent"); return true; }
  catch (e) { return false; }
}

// Shape constructor
function Shape(x, y, velX, velY, exists) {
  this.x = x
  this.y = y
  this.velX = velX
  this.velY = velY
  this.exists = exists
}


// Ball constructor：inherit Shape
function Ball(x, y, velX, velY, color, size, exists) {
  Shape.call(this, x, y, velX, velY, exists)
  this.color = color
  this.size = size
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// Ball的draw method
Ball.prototype.draw = function () {
  ctx.beginPath()
  ctx.fillStyle = this.color
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  ctx.fill()
}

// Ball的update method：撞到邊界反彈
Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX)
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX)
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY)
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY)
  }

  this.x += this.velX
  this.y += this.velY
}

// Ball的collisionDetect method
Ball.prototype.collisionDetect = function () {
  // 球與球重疊：改變球的顏色
  for (j = 0; j < balls.length; j++) {
    // 若此球與另一球的屬性exists皆為true
    if (this.exists && balls[j].exists) {
      // 依此球與其他球的距離，來決定是否變色
      if (!(this === balls[j])) {
        let dx = this.x - balls[j].x
        let dy = this.y - balls[j].y
        let distance = Math.sqrt(dx * dx + dy * dy)

        // 若兩球球心的距離 <= 兩球半徑相加，則兩球的color變色
        if (distance <= (this.size + balls[j].size)) {
          this.color = balls[j].color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')'
        }
      }
    }

  }

  // 球撞到block：反彈
  for (j = 0; j < blocks.length; j++) {
    let blockX = blocks[j].x
    let blockY = blocks[j].y
    let blockH = blocks[j].height
    let blockW = blocks[j].width

    if (this.x >= (blockX - (blockW / 2)) && this.x <= (blockX + (blockW / 2))) {
      // 球撞到磚塊的上邊
      if (this.y < blockY && Math.abs(blockY - this.y) <= ((blockH) / 2 + this.size)) {
        this.velY = -(this.velY)
        this.y = blockY - blockH / 2 - this.size - 1
      }
      // 球撞到磚塊的下邊
      else if (this.y > blockY && Math.abs(blockY - this.y) <= ((blockH) / 2 + this.size)) {
        this.velY = -(this.velY)
        this.y = blockY + blockH / 2 + this.size + 1
      }
    }
    else if (this.y >= (blockY - (blockH / 2)) && this.y <= (blockY + (blockH / 2))) {
      // 球撞到磚塊的右邊
      if (this.x > blockX && Math.abs(blockX - this.x) <= ((blockW) / 2 + this.size + this.velX)) {
        this.velX = -(this.velX)
        this.x = blockX + blockW / 2 + this.size + 1
      }
      // 球撞到磚塊的左邊
      else if (this.x < blockX && Math.abs(blockX - this.x) <= ((blockW) / 2 + this.size + this.velX)) {
        this.velX = -(this.velX)
        this.x = blockX - blockW / 2 - this.size - 1
      }
    }

  }
}

// Ball的hitBlock method


// 定義邪惡圈：inherit Shape
function EvilCircle(x, y, velX, velY, color, size, exists) {
  Shape.call(this, x, y, 1, 1, exists)
  this.color = color
  this.size = size
  this.velX = velX
  this.velY = velY
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;


// 定義邪惡圈的draw method
EvilCircle.prototype.draw = function () {
  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.strokeStyle = this.color
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  ctx.stroke()
}

// 定義邪惡圈的checkBounds method：撞到邊界，球會縮小
EvilCircle.prototype.checkBounds = function () {

  if ((this.x + this.size) >= width) {
    this.x = width - this.size * 2
    this.size -= 1
  }

  if ((this.x - this.size) <= 0) {
    this.x = 0 + this.size * 2
    this.size -= 1
  }
  if ((this.y + this.size) >= height) {
    this.y = height - this.size * 2
    this.size -= 1
  }

  if ((this.y - this.size) <= 0) {
    this.y = 0 + this.size * 2
    this.size -= 1
  }
}

// 定義EvilCircle的update method
EvilCircle.prototype.update = function () {
  this.x += this.velX
  this.y += this.velY
}

// EvilCircle 的setControls method
EvilCircle.prototype.setControls = function () {
  // listen to keyboard
  var _this = this;

  if (isMobile()) {
    document.querySelector('canvas').addEventListener('touchstart', function (event) {

      _this.velX = (event.touches[0].pageX - _this.x) * (1 / 80)
      _this.velY = (event.touches[0].pageY - _this.y) * (1 / 80)
    })
  } else {
    // listen to mouseClick
    document.querySelector('canvas').addEventListener('click', function (event) {
      console.log(event.pageX)
      _this.velX = (event.pageX - _this.x) * (1 / 80)
      _this.velY = (event.pageY - _this.y) * (1 / 80)
      console.log(_this.velX)
      console.log(_this.velY)
    })
    // listen to keyPad：left(37), right(39), down(38), up(40)
    window.onkeydown = function (e) {
      if (e.keyCode === 37) {
        _this.velX -= 3;
      } else if (e.keyCode === 39) {
        _this.velX += 3;
      } else if (e.keyCode === 38) {
        _this.velY -= 3;
      } else if (e.keyCode === 40) {
        _this.velY += 3;
      }
    }

    // window.onkeydown = function (e) {
    //   if (e.keyCode === 37) {
    //     _this.x -= _this.velX * 15;
    //   } else if (e.keyCode === 39) {
    //     _this.x += _this.velX * 15;
    //   } else if (e.keyCode === 38) {
    //     _this.y -= _this.velY * 15;
    //   } else if (e.keyCode === 40) {
    //     _this.y += _this.velY * 15;
    //   }
    // }
  }


}

// EvilCircle 的collisionDetect method
EvilCircle.prototype.collisionDetect = function () {

  let _this = this
  for (j = 0; j < balls.length; j++) {
    // 依此球與其他球的距離，來決定是否變色
    if (balls[j].exists === true) {
      let dx = this.x - balls[j].x
      let dy = this.y - balls[j].y
      let distance = Math.sqrt(dx * dx + dy * dy)

      // 若兩球球心的距離 <= 兩球半徑相加，則兩球的color變色
      if (distance <= (this.size + balls[j].size)) {
        balls[j].exists = false
        _this.size += 2
        ballCounts -= 1
        ballCountDisplay.textContent = ballCounts
      }
    }
  }

  // 球撞到block：反彈
  for (j = 0; j < blocks.length; j++) {
    let blockX = blocks[j].x
    let blockY = blocks[j].y
    let blockH = blocks[j].height
    let blockW = blocks[j].width

    if (this.x >= (blockX - (blockW / 2) - this.size) && this.x <= (blockX + (blockW / 2) + this.size)) {
      // 球撞到磚塊的上邊
      if (this.y < blockY && Math.abs(blockY - this.y) <= ((blockH) / 2 + this.size)) {
        this.velY = -(this.velY)
        this.y = blockY - blockH / 2 - this.size - 1
      }
      // 球撞到磚塊的下邊
      else if (this.y > blockY && Math.abs(blockY - this.y) <= ((blockH) / 2 + this.size)) {
        this.velY = -(this.velY)
        this.y = blockY + blockH / 2 + this.size + 1
      }
    }
    else if (this.y >= (blockY - (blockH / 2) - this.size) && this.y <= (blockY + (blockH / 2) + this.size)) {
      // 球撞到磚塊的右邊
      if (this.x > blockX && Math.abs(blockX - this.x) <= ((blockW) / 2 + this.size + this.velX)) {
        this.velX = -(this.velX)
        this.x = blockX + blockW / 2 + this.size + 1
      }
      // 球撞到磚塊的左邊
      else if (this.x < blockX && Math.abs(blockX - this.x) <= ((blockW) / 2 + this.size + this.velX)) {
        this.velX = -(this.velX)
        this.x = blockX - blockW / 2 - this.size - 1
      }
    }

  }
}

// 定義block的constructor
function Block(x, y, width, height, color, exists) {
  Shape.call(this, x, y, 0, 0, exists)
  this.width = width
  this.height = height
  this.color = color
}

Block.prototype = Object.create(Shape.prototype);
Block.prototype.constructor = Block;

// 定義block的draw method
Block.prototype.draw = function () {
  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.fillStyle = this.color
  ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
}



// ============執行=========================
// 建立blocks array，讓所有球的物件儲存於此
let blocks = []
while (blocks.length < 20) {
  let blockWidth = random(30, 50)
  let blockHeight = random(30, 50)
  let block = new Block(
    random(0 + blockWidth, width - blockWidth),
    random(0 + blockHeight, height - blockHeight),
    blockWidth,
    blockHeight,
    'white',
    true
  )
  console.log(block)
  blocks.push(block)
}


// 建立balls array，讓所有球的物件儲存於此
let balls = []
while (balls.length < 25) {
  let size = random(10, 20)
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size,
    true
  )
  balls.push(ball)
  ballCounts += 1
  ballCountDisplay.textContent = ballCounts
}

// 建立一個evilCircle實例
let evilCircle = new EvilCircle(150, 150, 1, 1, 'white', 15, true)
evilCircle.setControls()

console.log(evilCircle)
// 設定loop
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  // 繪製blocks
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].exists === true) {
      blocks[i].draw();
    }
  }

  // 繪製balls
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists === true) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect()
    }
  }

  // 區別使用裝置，執行不同動作
  if (isMobile()) {
    evilCircle.checkBounds()
    evilCircle.update()
    evilCircle.draw()
    evilCircle.collisionDetect()
  } else {
    evilCircle.checkBounds()
    evilCircle.update()
    evilCircle.draw()
    evilCircle.collisionDetect()
  }

  // 判斷何時贏、何時輸、何時繼續loop
  if (evilCircle.size <= 0) {
    gameResult.textContent = 'You Lose'
    gameResult.classList.remove('hidden')
    cancelAnimationFrame(loop)
  } else if (ballCounts > 0) {
    requestAnimationFrame(loop);
  } else if (ballCounts === 0) {
    gameResult.textContent = 'You Win'
    gameResult.classList.remove('hidden')
    cancelAnimationFrame(loop)
  }
}

// 執行loop
loop();