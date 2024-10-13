import "./Menu.css";
import playVsPlayer from "./assets/images/player-vs-player.svg";
import Logo from "./assets/images/logo.svg";
import MenuButton from "./components/MenuButton";

interface Props {
  handleRulesButton: () => void;
  handleShowGame: () => void;
}

const Menu = ({ handleRulesButton, handleShowGame }: Props) => {
  return (
    <div className="menuContainer">
      <img className="logo" src={Logo} alt="Game Logo" />
      <div className="buttons">
        <MenuButton
          label="Play vs player"
          imageSrc={playVsPlayer}
          onClick={handleShowGame}
          className="playVsPlayer"
          altText="Play vs Player icon"
        />
        <MenuButton
          label="Game rules"
          imageSrc=""
          onClick={handleRulesButton}
          className="gameRules"
        />
      </div>
    </div>
  );
};

export default Menu;
