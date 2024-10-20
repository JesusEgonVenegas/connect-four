import { useEffect, useRef, useState } from "react";
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
import { checkWin } from "./utils/winLogic";
import { useTimer } from "./hooks/useTimer";

const ROWS = 6;
const COLS = 7;
const PLAYER_ONE: number = 1;
const PLAYER_TWO: number = 2;
const SPACES = [33, 120, 210, 295, 385, 472, 561];

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

  const [gameState, setGameState] = useState({
    currentPlayer: PLAYER_ONE,
    moveCounter: 0,
    gameWon: false,
  });

  const [winCounter, setWinCounter] = useState({
    [PLAYER_ONE]: 0,
    [PLAYER_TWO]: 0,
  });
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { resumeTimer, isPaused, pauseTimer, resetTimer, timer } = useTimer();

  const markerRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  function getAvailableRow(col: number) {
    for (let i = 0; i < ROWS; i++) {
      if (board[ROWS - 1 - i][col] === 0) {
        return ROWS - 1 - i; // return the row index
      }
    }
    return -1; // if the column is full, return -1
  }

  const handleClick = (col: number) => {
    if (gameState.gameWon) return;

    const row = getAvailableRow(col);
    if (row === -1) return;

    handleMove(row, col);
  };

  const handleMove = (row: number, col: number) => {
    const currentPlayer = gameState.currentPlayer;
    const gameWon = checkWin(board, row, col, currentPlayer);
    const newBoard = updateBoard(row, col, currentPlayer);

    setBoard(newBoard);

    if (gameWon) {
      onWin(currentPlayer, gameWon);
    } else {
      switchPlayer();
    }
  };

  const switchPlayer = () => {
    setGameState((prevState) => ({
      ...prevState,
      currentPlayer:
        prevState.currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE,
      moveCounter: prevState.moveCounter + 1,
    }));
    resetTimer();
  };

  const onWin = (currentPlayer: number, gameWon: boolean) => {
    setWinCounter((prevCounter) => ({
      ...prevCounter,
      [currentPlayer]: prevCounter[currentPlayer] + 1,
    }));
    pauseTimer();
    setGameState((prevState) => ({
      ...prevState,
      gameWon: gameWon,
    }));
  };

  const updateBoard = (row: number, col: number, player: number) => {
    return board.map((r, rIndex) =>
      rIndex === row ? r.map((c, cIndex) => (cIndex === col ? player : c)) : r,
    );
  };

  const footerClass = gameState.gameWon
    ? gameState.currentPlayer === PLAYER_ONE
      ? "footer-player-one"
      : "footer-player-two"
    : "footer-default";

  const handleMouseOver = (colIndex: number) => {
    if (markerRef.current) {
      markerRef.current.style.transform = `translateX(${SPACES[colIndex]}px`;
      markerRef.current.style.opacity = "1";
    }
  };

  const handleMouseOut = () => {
    if (markerRef.current) {
      markerRef.current.style.opacity = "0";
    }
  };

  const handleRestart = () => {
    setBoard(createBoard());

    setGameState({
      currentPlayer: PLAYER_ONE,
      moveCounter: 0,
      gameWon: false,
    });
    resetTimer();

    setShowPauseMenu(false);
  };

  useEffect(() => {
    if (timer <= 0 && !gameState.gameWon) {
      pauseTimer();
      switchPlayer();
    }
  }, [isPaused, gameState.gameWon, timer]);

  const handleContinue = () => {
    setShowPauseMenu(false);
    resumeTimer();
  };

  const handleShowPauseMenu = () => {
    setShowPauseMenu(true);
    pauseTimer();
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
              src={gameState.currentPlayer === PLAYER_ONE ? markerR : markerY}
              ref={markerRef}
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

              <div className="gameBoard">
                {board.map((row, colIndex) => (
                  <div className={`column ${colIndex}`} key={colIndex}>
                    {row.map((space, spaceIndex) => (
                      <div
                        key={spaceIndex}
                        className={`space ${spaceIndex}`}
                        onClick={() => handleClick(spaceIndex)}
                        onMouseLeave={() => handleMouseOut()}
                        onMouseOver={() => handleMouseOver(spaceIndex)}
                      >
                        {space > 0 && <div className={`player${space}`}></div>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className={`footerContainer `}>
                {gameState.gameWon && (
                  <div className="winnerBoard">
                    <p className="winnerPlayer">
                      Player {gameState.currentPlayer}
                    </p>
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
                      gameState.currentPlayer === PLAYER_ONE
                        ? boardFooterR
                        : boardFooterY
                    })`,
                  }}
                >
                  <span
                    className="boardFooterLabel"
                    style={{
                      color: `${
                        gameState.currentPlayer === PLAYER_ONE
                          ? "white"
                          : "black"
                      }`,
                    }}
                  >
                    Player {gameState.currentPlayer}'s turn
                  </span>
                  <h2
                    className="boardFooterSeconds"
                    style={{
                      color: `${
                        gameState.currentPlayer === PLAYER_ONE
                          ? "white"
                          : "black"
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
