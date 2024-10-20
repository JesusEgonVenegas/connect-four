import { PLAYER_ONE } from "@/constants/gameConstants";
import boardFooterR from "@assets/images/turn-background-red.svg";
import boardFooterY from "@assets/images/turn-background-yellow.svg";

interface BoardFooterProps {
  gameWon: boolean;
  currentPlayer: number;
  handleRestart: () => void;
  timer: number;
}

const BoardFooter = ({
  gameWon,
  currentPlayer,
  handleRestart,
  timer,
}: BoardFooterProps) => {
  return (
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
            color: `${currentPlayer === PLAYER_ONE ? "white" : "black"}`,
          }}
        >
          Player {currentPlayer}'s turn
        </span>
        <h2
          className="boardFooterSeconds"
          style={{
            color: `${currentPlayer === PLAYER_ONE ? "white" : "black"}`,
          }}
        >
          {timer}s
        </h2>
      </div>
    </div>
  );
};

export default BoardFooter;
