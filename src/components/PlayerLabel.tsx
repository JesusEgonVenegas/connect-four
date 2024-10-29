import { PLAYER_ONE, PLAYER_TWO } from "@/constants/gameConstants";
import playerOne from "@assets/images/player-one.svg";
import playerTwo from "@assets/images/player-two.svg";

interface props {
  player: number;
  score: number;
}

const PlayerLabel = ({ player, score }: props) => {
  return (
    <div className={`playerLabel ${player === PLAYER_TWO ? "rightLabel" : ""}`}>
      <span
        className={`playerLabelImg ${player === PLAYER_ONE ? "leftImage" : "rightImage"}`}
        style={{
          content: `url(${player === PLAYER_ONE ? playerOne : playerTwo})`,
        }}
      ></span>
      <div
        className={`playerLabelText ${player === PLAYER_TWO ? "right" : ""}`}
      >
        <h2>{player === PLAYER_ONE ? "Player 1" : "Player 2"}</h2>
        <p className="playerScore">{score}</p>
      </div>
    </div>
  );
};

export default PlayerLabel;
