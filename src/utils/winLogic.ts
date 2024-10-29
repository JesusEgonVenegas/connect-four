import { COLS, ROWS } from "@/constants/gameConstants";

export const checkWin = (
  board: number[][],
  row: number,
  col: number,
  currentPlayer: number,
): boolean => {
  const directions = [
    { dr: 0, dc: 1 }, // Horizontal
    { dr: 1, dc: 0 }, // Vertical
    { dr: 1, dc: 1 }, // Diagonal (bottom-right)
    { dr: 1, dc: -1 }, // Diagonal (bottom-left)
  ];

  for (const { dr, dc } of directions) {
    let count = 1;

    // check in both directions (positive and negative)
    for (const sign of [-1, 1]) {
      let r = row + sign * dr;
      let c = col + sign * dc;

      while (
        r >= 0 &&
        r < board.length &&
        c >= 0 &&
        c < board[0].length &&
        board[r][c] === currentPlayer
      ) {
        count++;
        if (count === 4) return true;
        r += sign * dr;
        c += sign * dc;
      }
    }
  }
  return false;
};

export const checkWinN = (board: number[][], piece: number) => {
  // Check horizontal locations
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (
        board[r][c] === piece &&
        board[r][c + 1] === piece &&
        board[r][c + 2] === piece &&
        board[r][c + 3] === piece
      ) {
        return true;
      }
    }
  }

  // Check vertical locations
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c] === piece &&
        board[r + 2][c] === piece &&
        board[r + 3][c] === piece
      ) {
        return true;
      }
    }
  }

  // Check positively sloped diagonals
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c + 1] === piece &&
        board[r + 2][c + 2] === piece &&
        board[r + 3][c + 3] === piece
      ) {
        return true;
      }
    }
  }

  // Check positively sloped diagonals
  for (let c = 0; c < COLS - 3; c++) {
    for (let r = 3; r < ROWS - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r - 1][c + 1] === piece &&
        board[r - 2][c + 2] === piece &&
        board[r - 3][c + 3] === piece
      ) {
        return true;
      }
    }
  }
  return false;
};
