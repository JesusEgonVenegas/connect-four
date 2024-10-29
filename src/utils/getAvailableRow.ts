import { ROWS } from "@/constants/gameConstants";

export function getAvailableRow(board: number[][], col: number) {
  for (let i = 0; i < ROWS; i++) {
    if (board[ROWS - 1 - i][col] === 0) {
      return ROWS - 1 - i; // return the row index
    }
  }
  return -1;
}
