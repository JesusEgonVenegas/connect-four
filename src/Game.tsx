import { useState } from 'react';
import './Game.css';
import boardBL from './assets/images/board-layer-black-large.svg';
import boardWL from './assets/images/board-layer-white-large.svg';
import markerY from './assets/images/marker-yellow.svg';
import markerR from './assets/images/marker-red.svg';

const ROWS = 6;
const COLS = 7;
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;
let currentPlayer = PLAYER_ONE;
const SPACES = [33, 120, 210, 295, 385, 472, 561];

function createBoard() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0)
  );
}

const Game = () => {
  const [board, setBoard] = useState(createBoard()); // initialize game board
  const [lastRow, setLastRow] = useState([0, 0, 0, 0, 0, 0, 0]); // keep track of last row that was filled in each column
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONE);
  const [moveCounter, setMoveCounter] = useState(0);
  const [hoverState, setHoverState] = useState<string | -1>('');
  const [currentPlayerMarker, setCurrentPlayerMarker] = useState(markerY);
  const [translate, setTranslate] = useState(33);
  const [markerStyle, setMarkerStyle] = useState({});

  function placeChip(col: number) {
    // function to place a chip in a given column
    for (let i = 0; i < ROWS; i++) {
      // loop through each row in the column
      if (board[ROWS - 1 - i][col] === 0) {
        // if the cell is empty
        setLastRow((prev) => {
          // update lastRow state
          const newRow = [...prev];
          newRow[col] = ROWS - 1 - i;
          return newRow;
        });
        return ROWS - 1 - i; // return the row index
      }
    }
    return -1; // if the column is full, return -1
  }

  // This function checks if a player has won the game given their last move and their player number,
  // which is either 1 or 2. The lRow and lCol parameters represent the row and column of the last move.
  const winCheck = (player: number, row: number, col: number) => {
    // The directions array contains the four directions we need to check: horizontal, vertical,
    // diagonal (/), and diagonal (\). Each direction is represented as an array with two values:
    // the change in row and the change in column that we need to add to our current row and column
    // to move in that direction.
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal /
      [-1, 1], // diagonal \
    ];

    // We loop through each direction in the directions array.
    for (
      let directionIndex = 0;
      directionIndex < directions.length;
      directionIndex++
    ) {
      const [deltaRow, deltaCol] = directions[directionIndex];
      let count = 0;

      // We check in both directions along this direction. To do this, we loop through -1 and 1.
      for (let direction = -1; direction <= 1; direction += 2) {
        // We initialize our i and j variables to the row and column of the last move, and then
        // add or subtract the change in row and column (dx and dy) multiplied by the direction (dir).
        let currentRow = row + direction * deltaRow;
        let currentCol = col + direction * deltaCol;

        // We continue looping as long as we are within the bounds of the board and the current
        // square is occupied by the current player.
        while (
          currentRow >= 0 &&
          currentRow < ROWS &&
          currentCol >= 0 &&
          currentCol < COLS &&
          board[currentRow][currentCol] === player
        ) {
          count++; // We increment our count variable to keep track of how many squares we've checked.
          currentRow += direction * deltaRow; // We update our currentRow and currentCol variables to move in the current direction.
          currentCol += direction * deltaCol;
        }
      }

      // If we've found at least three squares in a row occupied by the current player in this direction,
      // we declare a win and return.
      if (count >= 3) {
        // alert('win');
        console.log('win');
        return;
      }
    }
  };

  const handleClick = (col: number) => {
    // function to handle user clicks on a column
    const row = placeChip(col); // place a chip in the column
    if (row === -1) return; // if the column is full, do nothing

    setBoard((prev) => {
      // update the game board
      const newBoard = [...prev];
      newBoard[row][col] = currentPlayer;
      return newBoard;
    });

    // counts how many moves happened
    // Wins can only happen after move 7 so we can avoid calling the winCheck until then
    setMoveCounter(moveCounter + 1);

    // checks for win condition

    winCheck(currentPlayer, row, col);

    // switches players after every move
    if (currentPlayer === PLAYER_ONE) setCurrentPlayer(PLAYER_TWO);
    else setCurrentPlayer(PLAYER_ONE);
    if (currentPlayer === PLAYER_ONE) setCurrentPlayerMarker(markerR);
    else setCurrentPlayerMarker(markerY);
  };

  const handleHover = (space: any) => {
    const translate = SPACES[space];
    setTranslate(translate);
    setMarkerStyle({
      transform: `translateX(${translate}px)`,
      content: `url(${currentPlayerMarker})`,
      transition: `all 0.2s ease-in-out`,
    });
    setHoverState(space);
  };

  return (
    <>
      <div
        className={`marker ${hoverState === -1 ? 'marker-hide' : ''}`}
        style={markerStyle}
      ></div>
      <div className="board">
        <div
          className="boardBlack"
          style={{
            content: `url(${boardBL})`,
          }}
        ></div>
        <div
          className="boardWhite"
          style={{
            content: `url(${boardWL})`,
          }}
        ></div>
        <div className="gameBoard" onMouseOut={() => setHoverState(-1)}>
          {board.map((row, colIndex) => (
            <div className={`column ${colIndex}`}>
              {row.map((space, spaceIndex) => (
                <div
                  className={`space ${spaceIndex}`}
                  onClick={() => handleClick(spaceIndex)}
                  onMouseOver={() => handleHover(spaceIndex)}
                >
                  {space > 0 && <div className={`player${space}`}></div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Game;
