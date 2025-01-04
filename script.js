const board = [];
const chessboard = document.getElementById("chessboard");
let selectedSquare = null;
let currentPlayer = 'white';
let castlingRights = {
    white: {
        kingside: true,
        queenside: true
    },
    black: {
        kingside: true,
        queenside: true
    }
};
let enPassantTarget = null;
let kingPositions = {
    white: {
        row: 7,
        col: 4
    },
    black: {
        row: 0,
        col: 4
    }
};

const initialSetup = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const colors = ["light", "dark"];
const pieceIcons = {
    'r': 'fas fa-chess-rook black-piece',
    'n': 'fas fa-chess-knight black-piece',
    'b': 'fas fa-chess-bishop black-piece',
    'q': 'fas fa-chess-queen black-piece',
    'k': 'fas fa-chess-king black-piece',
    'p': 'fas fa-chess-pawn black-piece',
    'R': 'fas fa-chess-rook white-piece',
    'N': 'fas fa-chess-knight white-piece',
    'B': 'fas fa-chess-bishop white-piece',
    'Q': 'fas fa-chess-queen white-piece',
    'K': 'fas fa-chess-king white-piece',
    'P': 'fas fa-chess-pawn white-piece'
};

function initializeBoard() {
    let colorIndex = 0;
    for (let row = 0; row < 8; row++) {
        board[row] = [];
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.classList.add("square", colors[colorIndex]);
            if (initialSetup[row][col]) {
                const icon = document.createElement("i");
                icon.className = pieceIcons[initialSetup[row][col]];
                square.appendChild(icon);
            }
            chessboard.appendChild(square);
            board[row][col] = {
                piece: initialSetup[row][col],
                element: square,
            };
            square.addEventListener("click", () => handleSquareClick(row, col));
            colorIndex = 1 - colorIndex;
        }
        colorIndex = 1 - colorIndex;
    }
}

function handleSquareClick(row, col) {
    const square = board[row][col];
    if (selectedSquare) {
        const {
            row: selectedRow,
            col: selectedCol
        } = selectedSquare;
        if (isValidMove(selectedRow, selectedCol, row, col)) {
            movePiece(selectedRow, selectedCol, row, col);
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
            if (isCheck(currentPlayer)) {
                alert(`${currentPlayer} is in check!`);
            }
            if (isCheckmate(currentPlayer)) {
                alert(`${currentPlayer} is in checkmate! Game over.`);
            }
        }
        selectedSquare = null;
        clearSelection();
    } else if (square.piece && isCurrentPlayerPiece(square.piece)) {
        selectedSquare = {
            row,
            col
        };
        square.element.classList.add("selected");
        highlightLegalMoves(row, col);
    }
}

function isCurrentPlayerPiece(piece) {
    return (currentPlayer === 'white' && piece === piece.toUpperCase()) ||
        (currentPlayer === 'black' && piece === piece.toLowerCase());
}

function clearSelection() {
    board.forEach((row) =>
        row.forEach((square) => {
            square.element.classList.remove("selected", "highlight");
        })
    );
}

function highlightLegalMoves(fromRow, fromCol) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (isValidMove(fromRow, fromCol, row, col)) {
                board[row][col].element.classList.add("highlight");
            }
        }
    }
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const movingPiece = board[fromRow][fromCol].piece;
    const targetPiece = board[toRow][toCol].piece;
    board[fromRow][fromCol].piece = null;
    board[fromRow][fromCol].element.innerHTML = "";

    if (movingPiece && movingPiece.toLowerCase() === 'k') {
        kingPositions[currentPlayer] = {
            row: toRow,
            col: toCol
        };
    }

    board[toRow][toCol].piece = movingPiece;
    const icon = document.createElement("i");
    icon.className = pieceIcons[movingPiece];
    board[toRow][toCol].element.innerHTML = "";
    board[toRow][toCol].element.appendChild(icon);

    if (targetPiece && !isCurrentPlayerPiece(targetPiece)) {
        icon.classList.add('fa-bounce');
        setTimeout(() => icon.classList.remove('fa-bounce'), 800);
    }
}

function isValidMove() {
    return true; // Temporary placeholder for debugging
}

function isCheck(player) {
    const kingPos = kingPositions[player];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col].piece;
            if (piece && isCurrentPlayerPiece(piece) !== (player === 'white')) {
                if (isValidMove(row, col, kingPos.row, kingPos.col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isCheckmate(player) {
    if (!isCheck(player)) return false;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col].piece;
            if (piece && isCurrentPlayerPiece(piece) === (player === 'white')) {
                for (let newRow = 0; newRow < 8; newRow++) {
                    for (let newCol = 0; newCol < 8; newCol++) {
                        const tempPiece = board[newRow][newCol].piece;
                        movePiece(row, col, newRow, newCol);
                        const inCheck = isCheck(player);
                        movePiece(newRow, newCol, row, col);
                        board[newRow][newCol].piece = tempPiece;
                        if (!inCheck) return false;
                    }
                }
            }
        }
    }
    return true;
}

initializeBoard();