import { useEffect, useState } from "react";
import "./Game.css";
import boardBL from "./assets/images/board-layer-black-large.svg";
import boardWL from "./assets/images/board-layer-white-large.svg";
import markerY from "./assets/images/marker-yellow.svg";
import markerR from "./assets/images/marker-red.svg";
import playerOne from "./assets/images/player-one.svg";
import playerTwo from "./assets/images/player-two.svg";
import boardFooterR from "./assets/images/turn-background-red.svg";
import boardFooterY from "./assets/images/turn-background-yellow.svg";
import Menubar from "./Menubar";
import PauseMenu from "./PauseMenu";
import boardBS from "./assets/images/board-layer-black-small.svg";
import boardWS from "./assets/images/board-layer-white-small.svg";

const ROWS = 6;
const COLS = 7;
const PLAYER_ONE: number = 1;
const PLAYER_TWO: number = 2;
const SPACES = [33, 120, 210, 295, 385, 472, 561];
const SPACES_MOBILE = [5, 50, 97, 143, 190, 236, 283];

function createBoard() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0),
  );
}

interface Props {
  handleGoMenu: () => void;
}

const Game = ({ handleGoMenu }: Props) => {
  const [board, setBoard] = useState(createBoard()); // initialize game board
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONE);
  const [moveCounter, setMoveCounter] = useState(0);
  const [hoverState, setHoverState] = useState<number>(null);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timerPaused, setTimerPaused] = useState(false);
  const [winCounter, setWinCounter] = useState({
    [PLAYER_ONE]: 0,
    [PLAYER_TWO]: 0,
  });
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  function placeChip(col: number) {
    for (let i = 0; i < ROWS; i++) {
      if (board[ROWS - 1 - i][col] === 0) {
        return ROWS - 1 - i; // return the row index
      }
    }
    return -1; // if the column is full, return -1
  }

  const checkDirection = (
    player: number,
    row: number,
    col: number,
    deltaRow: number,
    deltaCol: number,
  ) => {
    let count = 0;
    for (let direction = -1; direction <= 1; direction += 2) {
      let currentRow = row + direction * deltaRow;
      let currentCol = col + direction * deltaCol;
      while (
        currentRow >= 0 &&
        currentRow < ROWS &&
        currentCol >= 0 &&
        currentCol < COLS &&
        board[currentRow][currentCol] === player
      ) {
        count++;
        currentRow += direction * deltaRow;
        currentCol += direction * deltaCol;
      }
    }
    return count;
  };

  const winCheck = (player: number, row: number, col: number) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal /
      [-1, 1], // diagonal \
    ];
    return directions.some(
      ([deltaRow, deltaCol]) =>
        checkDirection(player, row, col, deltaRow, deltaCol) >= 3,
    );
  };

  const handleClick = (col: number) => {
    if (gameWon) return;
    const row = placeChip(col);
    if (row === -1) return;

    setBoard((prev) => {
      const newBoard = [...prev];
      newBoard[row][col] = currentPlayer;
      return newBoard;
    });

    setMoveCounter((prev) => prev + 1);

    if (moveCounter >= 6 && winCheck(currentPlayer, row, col)) {
      setGameWon(true); // setGameWon state to true
      setWinCounter((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1,
      }));
      return;
    }

    setCurrentPlayer((prev) => (prev === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE));
    setTimer(30); // After every move the timer gets reset back to 30
    setTimerPaused(false); // and also it unpauses just in case...
  };

  const footerClass = gameWon
    ? currentPlayer === PLAYER_ONE
      ? "footer-player-one"
      : "footer-player-two"
    : "footer-default";

  const handleHover = (colIndex: number) => {
    const translate =
      windowWidth > 501 ? SPACES[colIndex] : SPACES_MOBILE[colIndex];
    setHoverState(colIndex);
  };

  var markerStyle = {
    transform: `translateX(${windowWidth > 501 ? SPACES[hoverState] : SPACES_MOBILE[hoverState]}px)`,
    transition: `all 0.5s ease-in-out`,
    opacity: hoverState !== -1 ? 1 : 0,
  };

  const handleRestart = () => {
    setBoard(createBoard());
    setCurrentPlayer(PLAYER_ONE);
    setMoveCounter(0);
    setGameWon(false);
    setShowPauseMenu(false);
    setTimer(30);
    setTimerPaused(false);
  };

  useEffect(() => {
    if (!timerPaused && !gameWon) {
      const elTimer = setInterval(() => setTimer((prev) => prev - 1), 1000);

      if (timer <= 0) {
        setTimerPaused(true);
        setCurrentPlayer((prev) =>
          prev === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE,
        );
        setTimer(30);
        setTimerPaused(false);
      }

      return () => clearInterval(elTimer);
    }
  }, [timerPaused, gameWon, timer]);

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
              className="playerLabelImg leftImage"
              style={{ content: `url(${playerOne})` }}
            ></span>
            <div className="playerLabelText">
              <h2>Player 1</h2>
              <p className="playerScore">{winCounter[PLAYER_ONE]}</p>
            </div>
          </div>
          <div className="gameContainer">
            <img
              className="marker"
              src={currentPlayer === PLAYER_ONE ? markerR : markerY}
              style={markerStyle}
            ></img>
            <div className="board">
              <div
                className="boardBlack"
                style={{
                  content: `url(${windowWidth > 501 ? boardBL : boardBS})`,
                }}
              ></div>
              <div
                className="boardWhite"
                style={{
                  content: `url(${windowWidth > 501 ? boardWL : boardWS})`,
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
              <div className={`footerContainer `}>
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
                        currentPlayer === PLAYER_ONE ? "white" : "black"
                      }`,
                    }}
                  >
                    Player {currentPlayer}'s turn
                  </span>
                  <h2
                    className="boardFooterSeconds"
                    style={{
                      color: `${
                        currentPlayer === PLAYER_ONE ? "white" : "black"
                      }`,
                    }}
                  >
                    {timer}s
                  </h2>
                </div>
              </div>
            </div>

            <div className={`footer ${footerClass}`}> </div>
          </div>

          <div className="playerLabel rightLabel">
            <div
              className="playerLabelImg rightImage"
              style={{ content: `url(${playerTwo})` }}
            ></div>

            <div className="playerLabelText right">
              <h2>Player 2</h2>
              <p className="playerScore">{winCounter[PLAYER_TWO]}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
