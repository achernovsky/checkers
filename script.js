/* draw board and pieces */

const board = document.getElementById('board');
let darkCounter = 0;
let squareID = 0;

const addPiece = (color, square, isKing) => {
    let piece = document.createElement('div');
    square.appendChild(piece);
    let king = (isKing) ? 'king' : '';
    piece.setAttribute('class', `piece ${color} ${king}`);
}

for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
        let square = document.createElement('div');
        board.appendChild(square);
        square.setAttribute('id', `${squareID}`);
        squareID++;
        if ((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0))
            square.setAttribute('class', 'square light-square');
        else {
            darkCounter++;
            square.setAttribute('class', 'square dark-square');
            if (darkCounter <= 12)
                addPiece('black', square, false);
            if (darkCounter >= 21)
                addPiece('red', square, false);
        }
    }

/* variables */

let isRedTurn = true;
let redPiecesCount = 12;
let blackPiecesCount = 12;
let captureMade = false;
let checkingDoubleCapture = false;
let checkingOtherPiecesCaptureMoves = false;
const squares = document.querySelectorAll('.square');

const selectedPiece = {
    index: -1,
    color: '',
    isKing: false,
    moveTopLeft: -1,
    moveTopRight: -1,
    moveBottomLeft: -1,
    moveBottomRight: -1,
    captureTopLeft: -1,
    captureTopRight: -1,
    captureBottomLeft: -1,
    captureBottomRight: -1
}

const move = {
    originalIndex: -1,
    newIndex: -1,
    capturedIndex: -1,
    isBurned: false
}

const piecesArray = []

for (let i = 0; i < 12; i++){
    piecesArray.push({color: 'black', isKing: false})
}

for (let i = 0; i < 12; i++){
    piecesArray.push({color: 'red', isKing: false})
}

const boardArray = [
    'light-square',     piecesArray[0],     'light-square',     piecesArray[1],     'light-square',     piecesArray[2],     'light-square',     piecesArray[3],
    piecesArray[4],     'light-square',     piecesArray[5],     'light-square',     piecesArray[6],     'light-square',     piecesArray[7],     'light-square',
    'light-square',     piecesArray[8],     'light-square',     piecesArray[9],     'light-square',     piecesArray[10],    'light-square',     piecesArray[11],
    null,               'light-square',     null,               'light-square',     null,               'light-square',     null,               'light-square', 
    'light-square',     null,               'light-square',     null,               'light-square',     null,               'light-square',     null, 
    piecesArray[12],    'light-square',     piecesArray[13],    'light-square',     piecesArray[14],    'light-square',     piecesArray[15],    'light-square',
    'light-square',     piecesArray[16],    'light-square',     piecesArray[17],    'light-square',     piecesArray[18],    'light-square',     piecesArray[19],
    piecesArray[20],    'light-square',     piecesArray[21],    'light-square',     piecesArray[22],    'light-square',     piecesArray[23],    'light-square'
]

/* game functions */

const otherPiecesCanCapture = () => {
    let result = false;
    let addEventListenerToSquareserColor = selectedPiece.color;
    for (let i = 0; i < boardArray.length; i++) {
        if (boardArray[i] !== null && boardArray[i] !== 'light-square' && boardArray[i].color === addEventListenerToSquareserColor) {
            selectPiece(i);
            setCaptureMoves(i);
            if (hasCapturingOptions()) {
                result = hasCapturingOptions();
                console.log(selectedPiece)
                break;
            }
        }
    }
    return result;
}

const checkForWinner = () => {
    if (redPiecesCount === 0)
        alert('Black Won!');
    if (blackPiecesCount === 0)
        alert('Red Won!')    
}

const checkForMultipleCaptures = (index) => {
    resetSelectedPiece();
    selectPiece(index);
    setCaptureMoves(index);
    if (hasCapturingOptions())
        checkingDoubleCapture = true;
    else
        checkingDoubleCapture = false;
}

const checkForPromotion = (index) => {
    if ((isRedTurn && index <= 7) || (!isRedTurn && index >= 56))
        boardArray[index].isKing = true;
}

const updatePiecesCount = (color) => {
    color === 'red' ? blackPiecesCount-- : redPiecesCount--;
    console.log(redPiecesCount + ' : ' + blackPiecesCount);
}

const removePieceFromBoard = (indexToRemove) => {
    squares[indexToRemove].innerHTML = '';
}

const resetMoveData = () => {
    move.originalIndex = -1;
    move.newIndex = -1;
    move.capturedIndex = -1;
    move.isBurned = false;
}

const drawMove = () => {
    if (move.capturedIndex > -1)
        removePieceFromBoard(move.capturedIndex);
    if (!move.isBurned)
        addPiece(boardArray[move.newIndex].color ,squares[move.newIndex], boardArray[move.newIndex].isKing);
    removePieceFromBoard(move.originalIndex);
}

const makeCaptureMove = (index) => {
    move.capturedIndex = index - ((index - selectedPiece.index) / 2);
    boardArray[move.capturedIndex] = null;
    captureMade = true;
    updatePiecesCount(selectedPiece.color);
    makeMove(index);
}

const makeMove = (index) => {
    let OriginalSelectedPieceIndex = selectedPiece.index;
    if (!captureMade && (hasCapturingOptions() || otherPiecesCanCapture())) {
        alert('You missed a capture, your piece is burned!');
        boardArray[selectedPiece.index] = null;
        move.originalIndex = selectedPiece.index;
        move.isBurned = true;
        isRedTurn ? updatePiecesCount('black') : updatePiecesCount('red');
    } else {
        boardArray[index] = boardArray[OriginalSelectedPieceIndex];
        checkForPromotion(index);
        boardArray[OriginalSelectedPieceIndex] = null;
        move.newIndex = index;
        move.originalIndex = OriginalSelectedPieceIndex;
    }
    drawMove();
    resetMoveData();
    captureMade = false;
    checkForWinner();
}

const hasCapturingOptions = () => {
    return (
        selectedPiece.captureTopLeft !== -1 ||
        selectedPiece.captureTopRight !== -1 ||
        selectedPiece.captureBottomLeft !== -1 ||
        selectedPiece.captureBottomRight !== -1
    )
}

const canCapture = (index) => {
    return (
        index === selectedPiece.captureTopLeft ||
        index === selectedPiece.captureTopRight ||
        index === selectedPiece.captureBottomLeft ||
        index === selectedPiece.captureBottomRight
    )
}

const canMove = (index) => {
    return (
        index === selectedPiece.moveTopLeft ||
        index === selectedPiece.moveTopRight ||
        index === selectedPiece.moveBottomLeft ||
        index === selectedPiece.moveBottomRight
    )
}

const setCaptureMoves = (index) => {
    if (isRedTurn) {
        if (boardArray[index - 18] === null && 
            squares[index - 18] !== 'light-square' &&
            (boardArray[index - 9] !== null && boardArray[index - 9].color === 'black'))
            selectedPiece.captureTopLeft = index - 18;
        if (boardArray[index - 14] === null && 
            squares[index - 14] !== 'light-square' &&
            (boardArray[index - 7] !== null && boardArray[index - 7].color === 'black'))
            selectedPiece.captureTopRight = index - 14;
    }
    if (!isRedTurn) {
        if (boardArray[index + 18] === null && 
            squares[index + 18] !== 'light-square' &&
            (boardArray[index + 9] !== null && boardArray[index + 9].color === 'red'))
            selectedPiece.captureBottomRight = index + 18;
        if (boardArray[index + 14] === null && 
            squares[index + 14] !== 'light-square' &&
            (boardArray[index + 7] !== null && boardArray[index + 7].color === 'red'))
            selectedPiece.captureBottomLeft = index + 14;   
    }
    if (isRedTurn && selectedPiece.isKing) {
        if (boardArray[index + 18] === null && 
            squares[index + 18] !== 'light-square' &&
            (boardArray[index + 9] !== null && boardArray[index + 9].color === 'black'))
            selectedPiece.captureBottomRight = index + 18;
        if (boardArray[index + 14] === null && 
            squares[index + 14] !== 'light-square' &&
            (boardArray[index + 7] !== null && boardArray[index + 7].color === 'black'))
            selectedPiece.captureBottomLeft = index + 14;    
    }
    if (!isRedTurn && selectedPiece.isKing) {
        if (boardArray[index - 18] === null && 
            squares[index - 18] !== 'light-square' &&
            (boardArray[index - 9] !== null && boardArray[index - 9].color === 'red'))
            selectedPiece.captureTopLeft = index - 18;
        if (boardArray[index - 14] === null && 
            squares[index - 14] !== 'light-square' &&
            (boardArray[index - 7] !== null && boardArray[index - 7].color === 'red'))
            selectedPiece.captureTopRight = index - 14;
    }
}

const setMoves = (index) => {
    if (isRedTurn || selectedPiece.isKing) {
        if (boardArray[index - 9] === null && squares[index - 9] !== 'light-square')
            selectedPiece.moveTopLeft = index - 9;
        if (boardArray[index - 7] === null && squares[index - 7] !== 'light-square')
            selectedPiece.moveTopRight = index - 7;
    }
    if (!isRedTurn || selectedPiece.isKing) {
        if (boardArray[index + 9]  === null && squares[index + 9] !== 'light-square')
            selectedPiece.moveBottomRight = index + 9;
        if (boardArray[index + 7] === null && squares[index + 7] !== 'light-square')
            selectedPiece.moveBottomLeft = index + 7;  
    }
}

const resetSelectedPiece = () => {
    selectedPiece.index = -1;
    selectedPiece.color = '';
    selectedPiece.isKing = false;
    selectedPiece.moveTopLeft = -1;
    selectedPiece.moveTopRight = -1;
    selectedPiece.moveBottomLeft = -1;
    selectedPiece.moveBottomRight = -1;
    selectedPiece.captureTopLeft = -1;
    selectedPiece.captureTopRight = -1;
    selectedPiece.captureBottomLeft = -1;
    selectedPiece.captureBottomRight = -1;
}

const selectPiece = (index) => {
    resetSelectedPiece();
    selectedPiece.index = index;
    selectedPiece.color = boardArray[index].color;
    selectedPiece.isKing = boardArray[index].isKing;
}

const respondToClickEvents = (event) => {
    let index = parseInt(event.currentTarget.id);
    if (boardArray[index] !== null && boardArray[index] !== 'light-square' && !checkingDoubleCapture) {
        if ((isRedTurn && boardArray[index].color === 'red') ||
        (!isRedTurn && boardArray[index].color === 'black')) {
            selectPiece(index);
            setMoves(index);
            setCaptureMoves(index);
        }
    }
    if (boardArray[index] === null) {
        if (canMove(index) && !checkingDoubleCapture) {
            makeMove(index);
            isRedTurn = !isRedTurn;
            resetSelectedPiece();
        }
        else if (canCapture(index)) {
            makeCaptureMove(index);
            checkForMultipleCaptures(index);
            if (!checkingDoubleCapture) {
                isRedTurn = !isRedTurn;
                resetSelectedPiece();
            }
        }
    }
}

const addEventListenerToSquares = () => {
    squares.forEach(square => square.addEventListener(('click'), respondToClickEvents))
}

addEventListenerToSquares();