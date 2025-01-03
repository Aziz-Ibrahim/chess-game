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
        }
        selectedSquare = null;
        clearSelection();
    } else if (square.piece && isCurrentPlayerPiece(square.piece)) {
        selectedSquare = {
            row,
            col
        };
        square.element.classList.add("selected");
    }
}

function isCurrentPlayerPiece(piece) {
    return (currentPlayer === 'white' && piece === piece.toUpperCase()) ||
        (currentPlayer === 'black' && piece === piece.toLowerCase());
}

function clearSelection() {
    board.forEach((row) =>
        row.forEach((square) => square.element.classList.remove("selected"))
    );
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const movingPiece = board[fromRow][fromCol].piece;
    const targetPiece = board[toRow][toCol].piece;
    board[fromRow][fromCol].piece = null;
    board[fromRow][fromCol].element.innerHTML = "";

    // En passant capture
    if (movingPiece.toLowerCase() === 'p' && enPassantTarget && toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
        const captureRow = currentPlayer === 'white' ? toRow + 1 : toRow - 1;
        board[captureRow][toCol].piece = null;
        board[captureRow][toCol].element.innerHTML = "";
    }

    board[toRow][toCol].piece = movingPiece;
    const icon = document.createElement("i");
    icon.className = pieceIcons[movingPiece];
    board[toRow][toCol].element.innerHTML = "";
    board[toRow][toCol].element.appendChild(icon);

    // Add bounce animation if capturing opponent piece
    if (targetPiece && !isCurrentPlayerPiece(targetPiece)) {
        icon.classList.add('fa-bounce');
        setTimeout(() => icon.classList.remove('fa-bounce'), 800);
    }

    // Update en passant target
    enPassantTarget = null;
    if (movingPiece.toLowerCase() === 'p' && Math.abs(fromRow - toRow) === 2) {
        enPassantTarget = {
            row: (fromRow + toRow) / 2,
            col: fromCol
        };
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol].piece;
    const targetPiece = board[toRow][toCol].piece;
    if (targetPiece && isCurrentPlayerPiece(targetPiece)) {
        return false; // Prevent attacking own pieces
    }

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (piece.toLowerCase()) {
        case 'p':
            const direction = piece === 'P' ? -1 : 1;
            const startRow = piece === 'P' ? 6 : 1;
            if (colDiff === 0 && !targetPiece) {
                if (toRow - fromRow === direction) return true;
                if (fromRow === startRow && toRow - fromRow === 2 * direction && !board[fromRow + direction][fromCol].piece) return true;
            }
            if (colDiff === 1 && rowDiff === 1 && targetPiece && !isCurrentPlayerPiece(targetPiece)) {
                return true;
            }
            if (colDiff === 1 && rowDiff === 1 && enPassantTarget && enPassantTarget.row === toRow && enPassantTarget.col === toCol) {
                return true;
            }
            return false;
        case 'r':
            return fromRow === toRow || fromCol === toCol;
        case 'n':
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
        case 'b':
            return rowDiff === colDiff;
        case 'q':
            return rowDiff === colDiff || fromRow === toRow || fromCol === toCol;
        case 'k':
            return rowDiff <= 1 && colDiff <= 1;
        default:
            return false;
    }
}

initializeBoard();