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

  const [gameState, setGameState] = useState({
    currentPlayer: PLAYER_ONE,
    moveCounter: 0,
    gameWon: false,
    timer: 30,
    timerPaused: false,
  });

  const [hoverState, setHoverState] = useState<number>(null);
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
      [1, 1], // diagon1al /
      [-1, 1], // diagonal \
    ];
    return directions.some(
      ([deltaRow, deltaCol]) =>
        checkDirection(player, row, col, deltaRow, deltaCol) >= 3,
    );
  };

  const handleClick = (col: number) => {
    if (gameState.gameWon) return;

    const row = placeChip(col);
    if (row === -1) return;

    const currentPlayer = gameState.currentPlayer;

    const gameWon = winCheck(currentPlayer, row, col);
    const newBoard = updateBoard(row, col, currentPlayer);

    setBoard(newBoard);

    if (gameWon) {
      onWin(currentPlayer, gameWon);
    } else {
      setGameState((prevState) => ({
        ...prevState,
        currentPlayer: currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE,
        moveCounter: prevState.moveCounter + 1,
        timer: 30,
      }));
    }
  };

  const onWin = (currentPlayer: number, gameWon: boolean) => {
    setWinCounter((prevCounter) => ({
      ...prevCounter,
      [currentPlayer]: prevCounter[currentPlayer] + 1,
    }));

    setGameState((prevState) => ({
      ...prevState,
      gameWon: gameWon,
      timerPaused: gameWon,
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

  const handleHover = (colIndex: number) => {
    setHoverState(colIndex);
  };

  var markerStyle = {
    transform: `translateX(${windowWidth > 501 ? SPACES[hoverState] : SPACES_MOBILE[hoverState]}px)`,
    transition: `all 0.5s ease-in-out`,
    opacity: hoverState !== -1 ? 1 : 0,
  };

  const handleRestart = () => {
    setBoard(createBoard());

    setGameState({
      currentPlayer: PLAYER_ONE,
      moveCounter: 0,
      gameWon: false,
      timer: 30,
      timerPaused: false,
    });

    setShowPauseMenu(false);
  };

  useEffect(() => {
    if (!gameState.timerPaused && !gameState.gameWon) {
      const elTimer = setInterval(() => {
        setGameState((prevState) => ({
          ...prevState,
          timer: prevState.timer - 1,
        }));
      }, 1000);

      if (gameState.timer <= 0) {
        setGameState((prevState) => ({
          ...prevState,
          timerPaused: true,
        }));

        setTimeout(() => {
          setGameState((prevState) => ({
            ...prevState,
            currentPlayer:
              prevState.currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE,
            timer: 30,
            timerPaused: false,
          }));
        }, 0);
      }

      return () => clearInterval(elTimer);
    }
  }, [gameState.timerPaused, gameState.gameWon, gameState.timer]);

  const handleContinue = () => {
    setShowPauseMenu(false);
    setGameState((prevState) => ({
      ...prevState,
      timerPaused: false,
    }));
  };

  const handleShowPauseMenu = () => {
    setShowPauseMenu(true);
    setGameState((prevState) => ({
      ...prevState,
      timerPaused: true,
    }));
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
                    {gameState.timer}s
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
