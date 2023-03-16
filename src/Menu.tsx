import './Menu.css';
import playVsPlayer from './assets/images/player-vs-player.svg';
import Logo from './assets/images/logo.svg';
const Menu = () => {
  return (
    <div className="menuContainer">
      <div className="logo" style={{ content: `url(${Logo})` }}></div>
      <div className="buttons">
        <button className="playVsPlayer">
          Play vs player{' '}
          <span
            className="buttonSmiley"
            style={{ content: `url(${playVsPlayer})` }}
          ></span>
        </button>
        <button className="gameRules">Game rules</button>
      </div>
    </div>
  );
};

export default Menu;
