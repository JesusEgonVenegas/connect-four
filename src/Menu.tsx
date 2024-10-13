import "./Menu.css";
import playVsPlayer from "./assets/images/player-vs-player.svg";
import MenuButton from "./components/MenuButton";
import Logo from "./components/Logo";
import ButtonGroup from "./components/ButtonGroup";

interface Props {
  handleRulesButton: () => void;
  handleShowGame: () => void;
}

const Menu = ({ handleRulesButton, handleShowGame }: Props) => {
  return (
    <div className="menuContainer">
      <Logo />
      <ButtonGroup className="buttons">
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
      </ButtonGroup>
    </div>
  );
};

export default Menu;
