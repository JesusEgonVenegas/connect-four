interface MenuProps {
  onContinue: () => void;
  onReset: () => void;
}

const Menu: React.FC<MenuProps> = ({ onContinue, onReset }) => {
  return (
    <div className="menu">
      <h2>Game Paused</h2>
      <button onClick={onContinue}>Continue</button>
      <button onClick={onReset}>Reset Game</button>
    </div>
  );
};

export default Menu;
