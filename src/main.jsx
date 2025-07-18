import './index.css'

// Inicializar el canvas y el contexto
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')


const block_size = 20
const board_width = 14
const board_height = 30
let score = 0


canvas.width = block_size * board_width
canvas.height = block_size * board_height

context.scale(block_size, block_size)

const board = createBoard(board_width, board_height)

function createBoard(width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}
const piece = {
  position : { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

const  PEICES = [
  [
    [1,1],
    [1,1]
  ],
  [
    [1,0],
    [1,1],
    [0,1]
  ],
  [
    [0,1],
    [1,1],
    [1,0]
  ],
  [
    [1,1,1],
    [0,1,0]
  ],
  [
    [1,1,1],
    [1,0,0]
  ],
  [
    [1,1,1],
    [0,0,1]
  ],
  [
    [1,1,1,1]
  ]
]

// funcion de update del juego
// function update() {
//     draw()
//     window.requestAnimationFrame(update)

// }
let dropCounter = 0
let lastTime = 0
function update(time = 0 ) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime
  if (dropCounter > 250) {
    piece.position.y++
    dropCounter = 0

    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  draw()
  window.requestAnimationFrame(update)
}


function draw() { 
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1 ) {
        context.fillStyle = 'blue'
        context.fillRect(x, y, 1, 1)
        context.strokeStyle = 'white'
        context.lineWidth = 0.04
        context.strokeRect(x, y, 1, 1)
      }
    })
  })
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x ,y + piece.position.y , 1, 1)
        context.strokeStyle = 'white'
        context.lineWidth = 0.04
        context.strokeRect(x + piece.position.x ,y + piece.position.y , 1, 1)
      }
    })
  })

  $score.innerText = score
}

document.addEventListener('keydown', event => {
  if(event.key === 'ArrowLeft') {
    piece.position.x--
    if(checkCollision()) {
      piece.position.x++
    }
  }
  if(event.key === 'ArrowRight') {
    piece.position.x++
    if(checkCollision()) {
      piece.position.x--
    }
  }
  if(event.key === 'ArrowDown') {
    piece.position.y++
    if(checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
  if(event.key === 'ArrowUp' || event.key === 'c') {
    const rotated = []

    for(let i =0 ; i < piece.shape[0].length; i++) {
      const newRow = []
      
      for(let j = piece.shape.length - 1; j >= 0; j--) {
        newRow.push(piece.shape[j][i])
      }
      rotated.push(newRow)
    }

    const originalShape = piece.shape
    piece.shape = rotated
    if(checkCollision()) {
      piece.shape = originalShape
    }

  }


})

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value===1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })
  
  piece.position.x = Math.floor(board_width/2)-1
  piece.position.y = 0 

  piece.shape = PEICES[Math.floor(Math.random() * PEICES.length)]

  if(checkCollision()){
    window.alert('Game Over :(')
    board.forEach(row => row.fill(0))
  }
}

function removeRows() {
  const rowsToRemove = []

  board.forEach((row, y) => {
    if (row.every(value => value !== 0)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(board_width).fill(0)
    board.unshift(newRow)
    score += 10
  })
}


update()

