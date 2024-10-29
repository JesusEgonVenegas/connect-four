import {
  COLS,
  EMPTY,
  PLAYER_ONE,
  PLAYER_TWO,
  ROWS,
} from "@/constants/gameConstants";
import { getAvailableRow } from "./getAvailableRow";
import { checkWinN } from "./winLogic";

export const minimax = (
  board: number[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
): { score: number; column: number } => {
  const validLocations = getValidLocations(board);
  const isTerminal = isTerminalNode(board);

  if (depth == 0 || isTerminal) {
    if (isTerminal) {
      if (checkWinN(board, PLAYER_TWO)) {
        return { score: 10000, column: -1 };
      } else if (checkWinN(board, PLAYER_ONE)) {
        return { score: -10000, column: -1 };
      } else {
        return { score: 0, column: -1 };
      }
    } else {
      return { score: scorePosition(board, PLAYER_TWO), column: -1 };
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let bestColumn =
      validLocations[Math.floor(Math.random() * validLocations.length)];

    for (const col of validLocations) {
      const tempBoard = cloneBoard(board);
      // const row = placeChip(tempBoard, col, PLAYER_TWO);
      const row = getAvailableRow(tempBoard, col);
      placeChip(tempBoard, row, col, PLAYER_TWO);
      console.log(tempBoard);

      const newScore = minimax(tempBoard, depth - 1, alpha, beta, false).score;

      if (newScore > value) {
        value = newScore;
        bestColumn = col;
      }

      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        break; // Alpha-beta pruning
      }
    }
    return { score: value, column: bestColumn };
  } else {
    let value = Infinity;
    let bestColumn =
      validLocations[Math.floor(Math.random() * validLocations.length)];

    for (const col of validLocations) {
      const tempBoard = cloneBoard(board);
      // const row = placeChip(tempBoard, col, PLAYER_ONE);
      const row = getAvailableRow(tempBoard, col);
      placeChip(tempBoard, row, col, PLAYER_ONE);

      const newScore = minimax(tempBoard, depth - 1, alpha, beta, true).score;

      if (newScore < value) {
        value = newScore;
        bestColumn = col;
      }

      beta = Math.min(beta, value);
      if (alpha >= beta) {
        break;
      }
    }
    return { score: value, column: bestColumn };
  }
};

const cloneBoard = (board: number[][]): number[][] => {
  return board.map((row) => [...row]);
};

const placeChip = (
  board: number[][],
  row: number,
  col: number,
  player: number,
): void => {
  board[row][col] = player;
};

const isTerminalNode = (board: number[][]) => {
  return (
    checkWinN(board, PLAYER_ONE) ||
    checkWinN(board, PLAYER_TWO) ||
    getValidLocations(board).length === 0
  );
};

const scorePosition = (board: number[][], piece: number) => {
  let score = 0;

  // Center column preference
  const centerArray = board.map((row) => row[Math.floor(COLS / 2)]);
  const centerCount = centerArray.filter((cell) => cell === piece).length;
  score += centerCount * 3;

  // Horizontal scoring
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = board[r].slice(c, c + 4);
      score += evaluateWindow(window, piece);
    }
  }

  // Vertical scoring
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      const window = [
        board[r][c],
        board[r + 1][c],
        board[r + 2][c],
        board[r + 3][c],
      ];
      score += evaluateWindow(window, piece);
    }
  }

  // Positive diagonal scoring
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [
        board[r][c],
        board[r + 1][c + 1],
        board[r + 2][c + 2],
        board[r + 3][c + 3],
      ];
      score += evaluateWindow(window, piece);
    }
  }

  // Negative diagonal scoring
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [
        board[r][c + 3],
        board[r + 1][c + 2],
        board[r + 2][c + 1],
        board[r + 3][c],
      ];
      score += evaluateWindow(window, piece);
    }
  }

  return score;
};

const sumScore = (board: [][], player: number, evaluationBoard: [][]) => {
  return board.reduce((acc: number, row: [], rIdx: number) => {
    return (
      acc +
      row.reduce((rowAcc: number, cell: number, cIdx: number) => {
        return cell === player ? rowAcc + evaluationBoard[rIdx][cIdx] : rowAcc;
      }, 0)
    );
  }, 0);
};

const evaluateWindow = (window: number[], piece: number) => {
  const opponentPiece = piece;
  let score = 0;

  const pieceCount = window.filter((cell) => cell === piece).length;
  const emptyCount = window.filter((cell) => cell === EMPTY).length;
  const opponentCount = window.filter((cell) => cell === opponentPiece).length;

  if (pieceCount === 4) {
    score += 100;
  } else if (pieceCount === 3 && emptyCount === 1) {
    score += 5;
  } else if (pieceCount === 2 && emptyCount === 2) {
    score += 2;
  }

  if (opponentCount === 3 && emptyCount === 1) {
    score -= 4;
  }

  return score;
};

const isValidLocation = (board: number[][], col: number) => {
  return board[ROWS - 1][col] === EMPTY;
};

const getValidLocations = (board: number[][]) => {
  let validLocations = [];
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === EMPTY) {
      validLocations.push(col);
    }
  }
  return validLocations;
};

// const scorePosition = (board: [][], piece: number) => {
//   let score = 0;
//   let playerPiece = PLAYER_ONE;
//
//   let evaluationBoard = [
//     [6, 6, 9, 7, 9, 10, 6],
//     [4, 5, 9, 8, 10, 10, 4],
//     [5, 7, 12, 15, 15, 12, 9],
//     [4, 7, 13, 13, 15, 10, 8],
//     [6, 8, 14, 12, 17, 10, 7],
//     [7, 9, 12, 14, 15, 10, 7],
//   ];
//
//   let pieceScore = sumScore(board, piece, evaluationBoard);
//
//   let playerScore = sumScore(board, playerPiece, evaluationBoard);
//   score = pieceScore - playerScore;
//   return score;
// };
