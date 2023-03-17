import './PauseMenu.css';

interface Props {
  handleContinue: () => void;
  handleRestart: () => void;
  handleGoMenu: () => void;
}

const PauseMenu = ({ handleContinue, handleRestart, handleGoMenu }: Props) => {
  return (
    <>
      <div className="overlay"></div>
      <div className="pauseContainer">
        <h1>Pause</h1>
        <button onClick={handleContinue}>Continue game</button>
        <button onClick={handleRestart}>Restart</button>
        <button onClick={handleGoMenu}>Quit Game</button>
      </div>
    </>
  );
};

export default PauseMenu;
