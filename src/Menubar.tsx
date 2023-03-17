import Logo from './assets/images/logo.svg';
import './Menubar.css';

interface Props {
  restartFunction: () => void;
}

const Menubar = ({ restartFunction }: Props) => {
  return (
    <div className="menuBarContainer">
      <button className="openMenuBtn">Menu</button>
      <div className="menuBarLogo" style={{ content: `url(${Logo})` }}></div>
      <button className="menuBarRestart" onClick={restartFunction}>
        Restart
      </button>
    </div>
  );
};

export default Menubar;
