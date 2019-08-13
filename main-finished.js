
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

// Ball的draw method
Ball.prototype.draw = function () {
  ctx.beginPath()
  ctx.fillStyle = this.color
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  ctx.fill()
}

// Ball的update method
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

// 定義邪惡圈：inherit Shape
function EvilCircle(x, y, velX, velY, color, size, exists) {
  Shape.call(this, x, y, exists)
  this.color = color
  this.size = size
  this.velX = velX
  this.velY = velY
}

// 定義邪惡圈的draw method
EvilCircle.prototype.draw = function () {
  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.strokeStyle = this.color
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
  ctx.stroke()
}

// 定義邪惡圈的update method
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

// 建立balls array，讓所有球的物件儲存於此
let balls = []
while (balls.length < 20) {
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

// Ball的collisionDetect method
Ball.prototype.collisionDetect = function () {
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
    window.onkeydown = function (e) {
      if (e.keyCode === 37) {
        _this.x -= _this.velX * 15;
      } else if (e.keyCode === 39) {
        _this.x += _this.velX * 15;
      } else if (e.keyCode === 38) {
        _this.y -= _this.velY * 15;
      } else if (e.keyCode === 40) {
        _this.y += _this.velY * 15;
      }
    }
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
        ballCounts -= 2
        ballCountDisplay.textContent = ballCounts
      }
    }
  }
}

// ============執行=========================
// 建立一個evilCircle實例
let evilCircle = new EvilCircle(150, 150, 1, 1, 'white', 15, true)
evilCircle.setControls()
// 設定loop
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

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