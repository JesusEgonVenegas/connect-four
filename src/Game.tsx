import { useEffect, useRef, useState } from "react";
import "./Game.css";
import Menubar from "./Menubar";
import PauseMenu from "./PauseMenu";
import { checkWin } from "./utils/winLogic";
import { useTimer } from "./hooks/useTimer";
import Board from "./components/Board";
import PlayerLabel from "./components/PlayerLabel";
import {
  PLAYER_ONE,
  PLAYER_TWO,
  ROWS,
  COLS,
  SPACES,
} from "./constants/gameConstants";
import PlayerMarker from "./components/PlayerMarker";
import BoardFooter from "./components/BoardFooter";

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
          <PlayerLabel player={PLAYER_ONE} score={winCounter[PLAYER_ONE]} />
          <div className="gameContainer">
            <PlayerMarker
              currentPlayer={gameState.currentPlayer}
              markerRef={markerRef}
            />
            <Board
              windowWidth={windowWidth}
              board={board}
              handleMouseOut={handleMouseOut}
              handleClick={handleClick}
              handleMouseOver={handleMouseOver}
            />

            <BoardFooter
              gameWon={gameState.gameWon}
              handleRestart={handleRestart}
              currentPlayer={gameState.currentPlayer}
              timer={timer}
            />
          </div>
          <PlayerLabel player={PLAYER_TWO} score={winCounter[PLAYER_TWO]} />
        </div>
        <div className={`footer ${footerClass}`} />
      </div>
    </>
  );
};

export default Game;
