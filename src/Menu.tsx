import './Menu.css';
import playVsPlayer from './assets/images/player-vs-player.svg';
import Logo from './assets/images/logo.svg';

interface Props {
  handleRulesButton: () => void;
  handleShowGame: () => void;
}

const Menu = ({ handleRulesButton, handleShowGame }: Props) => {
  return (
    <div className="menuContainer">
      <div className="logo" style={{ content: `url(${Logo})` }}></div>
      <div className="buttons">
        <button className="playVsPlayer" onClick={() => handleShowGame()}>
          Play vs player{' '}
          <span
            className="buttonSmiley"
            style={{ content: `url(${playVsPlayer})` }}
          ></span>
        </button>
        <button className="gameRules" onClick={() => handleRulesButton()}>
          Game rules
        </button>
      </div>
    </div>
  );
};

export default Menu;
