import { useEffect, useState } from "react";
import "./App.css";
import Game from "./Game";
import Menu from "./Menu";
import Rules from "./Rules";

function App() {
  const [showGame, setShowGame] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [pva, setPva] = useState(true);

  useEffect(() => {
    if (showMenu) {
      document.documentElement.style.setProperty(
        "--bodyColor",
        "rgb(92, 45, 213)",
      );
    } else {
      document.documentElement.style.setProperty(
        "--bodyColor",
        "rgb(121, 69, 255)",
      );
    }
  }, [showMenu]);

  const handleRulesButton = () => {
    setShowRules(true);
    setShowMenu(false);
  };

  const handleGoMenu = () => {
    setShowRules(false);
    setShowMenu(true);
    setShowGame(false);
  };

  const handleShowGame = () => {
    setShowRules(false);
    setShowMenu(false);
    setShowGame(true);
    setPva(false);
  };

  const handlePvaButton = () => {
    setShowRules(false);
    setShowMenu(false);
    setShowGame(true);
    setPva(true);
  };

  return (
    <div className="app">
      {showMenu && (
        <Menu
          handleShowGame={handleShowGame}
          handleRulesButton={handleRulesButton}
          handlePvaButton={handlePvaButton}
        />
      )}

      {showGame && <Game handleGoMenu={handleGoMenu} vsAi={pva} />}
      {showRules && <Rules handleGoMenu={handleGoMenu} />}
    </div>
  );
}

export default App;
