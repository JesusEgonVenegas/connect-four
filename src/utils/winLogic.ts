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
