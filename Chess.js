class Chess {
    constructor() {
        this.board = this.initializeBoard();
        this.turn = "white";
        this.enPassant = null; // Tracks en passant target square
        this.castlingRights = {
            white: {
                king: true,
                queen: true
            },
            black: {
                king: true,
                queen: true
            }
        };
    }

    initializeBoard() {
        return [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"]
        ];
    }

    displayBoard() {
        console.clear();
        this.board.forEach(row => console.log(row.map(piece => piece || ".").join(" ")));
        console.log(`Turn: ${this.turn}`); // Fixed syntax error here
    };

    isPawnPromotion(piece, x) {
        return (piece === "P" && x === 0) || (piece === "p" && x === 7);
    }

    promotePawn(x, y, newPiece) {
        const piece = this.board[x][y];
        if (this.isPawnPromotion(piece, x)) {
            this.board[x][y] = newPiece;
        } else {
            console.log("Invalid promotion.");
        }
    }

    canCastle(color, side) {
        const row = color === "white" ? 7 : 0;
        if (!this.castlingRights[color][side]) return false;

        if (side === "king") {
            return this.board[row][4] === (color === "white" ? "K" : "k") &&
                this.board[row][7] === (color === "white" ? "R" : "r") &&
                this.board[row][5] === "" &&
                this.board[row][6] === "";
        } else if (side === "queen") {
            return this.board[row][4] === (color === "white" ? "K" : "k") &&
                this.board[row][0] === (color === "white" ? "R" : "r") &&
                this.board[row][1] === "" &&
                this.board[row][2] === "" &&
                this.board[row][3] === "";
        }
        return false;
    }

    performCastling(color, side) {
        if (!this.canCastle(color, side)) {
            console.log("Invalid castling.");
            return;
        }

        const row = color === "white" ? 7 : 0;
        if (side === "king") {
            this.board[row][4] = "";
            this.board[row][7] = "";
            this.board[row][6] = color === "white" ? "K" : "k";
            this.board[row][5] = color === "white" ? "R" : "r";
        } else if (side === "queen") {
            this.board[row][4] = "";
            this.board[row][0] = "";
            this.board[row][2] = color === "white" ? "K" : "k";
            this.board[row][3] = color === "white" ? "R" : "r";
        }
        this.castlingRights[color].king = false;
        this.castlingRights[color].queen = false;
    }

    movePiece(start, end) {
        const [sx, sy] = start;
        const [ex, ey] = end;
        const piece = this.board[sx][sy];

        if (!piece || (piece.toUpperCase() === piece && this.turn !== "white") ||
            (piece.toLowerCase() === piece && this.turn !== "black")) {
            console.log("Invalid move: wrong turn.");
            return;
        }

        if (piece.toLowerCase() === "p" && Math.abs(sx - ex) === 2) {
            this.enPassant = [ex, ey];
        } else {
            this.enPassant = null;
        }

        // En passant capture
        if (piece.toLowerCase() === "p" && ey !== sy && this.board[ex][ey] === "") {
            this.board[sx][ey] = "";
        }

        this.board[ex][ey] = piece;
        this.board[sx][sy] = "";

        if (this.isPawnPromotion(piece, ex)) {
            this.promotePawn(ex, ey, piece === "P" ? "Q" : "q"); // Default promotion to queen
        }

        this.turn = this.turn === "white" ? "black" : "white";
    }
}