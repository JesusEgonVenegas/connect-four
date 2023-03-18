import { useEffect, useState } from 'react';
import './Game.css';
import boardBL from './assets/images/board-layer-black-large.svg';
import boardWL from './assets/images/board-layer-white-large.svg';
import markerY from './assets/images/marker-yellow.svg';
import markerR from './assets/images/marker-red.svg';
import playerOne from './assets/images/player-one.svg';
import playerTwo from './assets/images/player-two.svg';
import boardFooterR from './assets/images/turn-background-red.svg';
import boardFooterY from './assets/images/turn-background-yellow.svg';
import Menubar from './Menubar';
import PauseMenu from './PauseMenu';

const ROWS = 6;
const COLS = 7;
const PLAYER_ONE: number = 1;
const PLAYER_TWO: number = 2;
let currentPlayer = PLAYER_ONE;
const SPACES = [33, 120, 210, 295, 385, 472, 561];

function createBoard() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0)
  );
}

interface Props {
  handleGoMenu: () => void;
}

const Game = ({ handleGoMenu }: Props) => {
  const [board, setBoard] = useState(createBoard()); // initialize game board
  const [lastRow, setLastRow] = useState([0, 0, 0, 0, 0, 0, 0]); // keep track of last row that was filled in each column
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONE);
  const [moveCounter, setMoveCounter] = useState(0);
  const [hoverState, setHoverState] = useState<string | -1>(-1);
  const [currentPlayerMarker, setCurrentPlayerMarker] = useState(markerR);
  const [translate, setTranslate] = useState(33);
  const [lastTranslate, setLastTranslate] = useState(translate);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timerPaused, setTimerPaused] = useState(false);
  const [winCounter, setWinCounter] = useState({
    [PLAYER_ONE]: 0,
    [PLAYER_TWO]: 0,
  });
  const [showPauseMenu, setShowPauseMenu] = useState(false);

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
        // setGameWon(true);
        return true;
      }
    }
  };

  const handleClick = (col: number) => {
    if (gameWon) return;
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

    if (winCheck(currentPlayer, row, col)) {
      // Win condition returns a boolean depending on if it was won or not
      setGameWon(true); // setGameWon state to true
      setWinCounter({
        // Updates the winCounter adding one to the winner
        ...winCounter,
        [currentPlayer]: winCounter[currentPlayer as keyof {}] + 1,
      });
      return;
    }

    // switches players after every move
    if (!gameWon) {
      if (currentPlayer === PLAYER_ONE) setCurrentPlayer(PLAYER_TWO);
      else setCurrentPlayer(PLAYER_ONE);
      if (currentPlayer === PLAYER_ONE) setCurrentPlayerMarker(markerY);
      else setCurrentPlayerMarker(markerR);
    }

    setTimer(30); // After every move the timer gets reset back to 30
    setTimerPaused(false); // and also it unpauses just in case...
  };

  useEffect(() => {
    if (gameWon) {
      if (currentPlayer === PLAYER_ONE) {
        document.documentElement.style.setProperty(
          '--footerColor',
          'var(--pink)'
        );
      } else {
        document.documentElement.style.setProperty(
          '--footerColor',
          'var(--yellow)'
        );
      }
    } else {
      document.documentElement.style.setProperty(
        '--footerColor',
        'var(--dark-purple)'
      );
    }
  }, [gameWon]);

  const handleHover = (space: any) => {
    const translate = SPACES[space];
    setTranslate(translate);
    setHoverState(space);
    setLastTranslate(translate);
  };

  // useEffect(() => {
  //   document.documentElement.style.setProperty(
  //     '--translate',
  //     `${lastTranslate}px`
  //   );
  // }, [lastTranslate]);

  var markerStyle = {
    transform: `translateX(${translate}px)`,
    // transform: `translateX(var(--translate${SPACES.indexOf(lastTranslate)}))`,
    // transform: `translateX(var(--translate))`,
    // animation: hoverState !== -1 ? 'pulse 1s ease-in-out infinite' : 'none',
    transition: `all 0.5s ease-in-out`,
    opacity: hoverState !== -1 ? 1 : 0,
  };

  const handleRestart = () => {
    setBoard(createBoard());
    setLastRow([0, 0, 0, 0, 0, 0, 0]);
    setCurrentPlayer(PLAYER_ONE);
    setMoveCounter(0);
    setGameWon(false);
    setCurrentPlayerMarker(markerR);
    setShowPauseMenu(false);
    setTimer(30);
    setTimerPaused(false);
  };

  useEffect(() => {
    let elTimer: number;
    if (!timerPaused) {
      elTimer = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return function cleanup() {
      console.log(`Clearing ${elTimer}`);
      clearInterval(elTimer);
    };
  }, [timerPaused]);

  useEffect(() => {
    if (timer <= 0 || gameWon) {
      setTimerPaused(true);
      setCurrentPlayer((prev) =>
        prev === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE
      );
      setCurrentPlayerMarker((prev) =>
        currentPlayer === PLAYER_ONE ? markerY : markerR
      );
      setTimer(30);
      setTimerPaused(false);
    }
  }, [timer]);

  const handleContinue = () => {
    setShowPauseMenu(false);
    setTimerPaused(false);
  };

  const handleShowPauseMenu = () => {
    setShowPauseMenu(true);
    setTimerPaused(true);
  };

  return (
    <>
      <div className="bigGameContainer">
        {showPauseMenu && (
          <PauseMenu
            handleGoMenu={handleGoMenu}
            handleRestart={handleRestart}
            handleContinue={handleContinue}
          />
        )}
        <Menubar
          handleShowPauseMenu={handleShowPauseMenu}
          restartFunction={handleRestart}
        />
        <div className="pageContainer">
          <div className="playerLabel">
            <span
              className="playerLabelImg"
              style={{ content: `url(${playerOne})` }}
            ></span>
            <div>Player 1</div>
            <div className="playerScore">{winCounter[PLAYER_ONE]}</div>
          </div>
          <div className="gameContainer">
            <img
              className="marker"
              src={currentPlayerMarker}
              style={markerStyle}
            ></img>
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
              <div className="footerContainer">
                {gameWon && (
                  <div className="winnerBoard">
                    <p className="winnerPlayer">Player {currentPlayer}</p>
                    <p className="winnerMessage">Wins</p>
                    <button className="playAgain" onClick={handleRestart}>
                      Play again
                    </button>
                  </div>
                )}
                <div
                  className="boardFooter"
                  style={{
                    backgroundImage: `url(${
                      currentPlayer === PLAYER_ONE ? boardFooterR : boardFooterY
                    })`,
                  }}
                >
                  <span
                    className="boardFooterLabel"
                    style={{
                      color: `${
                        currentPlayer === PLAYER_ONE ? 'white' : 'black'
                      }`,
                    }}
                  >
                    Player {currentPlayer}'s turn
                  </span>
                  <h2
                    className="boardFooterSeconds"
                    style={{
                      color: `${
                        currentPlayer === PLAYER_ONE ? 'white' : 'black'
                      }`,
                    }}
                  >
                    {timer}s
                  </h2>
                </div>
              </div>
            </div>

            <div className="footer"> </div>
          </div>

          <div className="playerLabel">
            <div
              className="playerLabelImg"
              style={{ content: `url(${playerTwo})` }}
            ></div>
            <div>Player 2</div>
            <div className="playerScore">{winCounter[PLAYER_TWO]}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
