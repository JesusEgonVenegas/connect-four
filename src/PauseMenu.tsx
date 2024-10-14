import MenuButton from "./components/MenuButton";
import "./PauseMenu.css";
import { PAUSE_MENU } from "./utils/pauseConfig";

interface Props {
  handleContinue: () => void;
  handleRestart: () => void;
  handleGoMenu: () => void;
}

const PauseMenu = (props: Props) => {
  const handleClick = (handler: keyof Props) => {
    props[handler]();
  };

  return (
    <>
      <div className="overlay"></div>
      <div className="pauseContainer">
        <h1>Pause</h1>
        {PAUSE_MENU.map((button, index) => (
          <MenuButton
            key={index}
            imageSrc={button.imageSrc}
            onClick={() => handleClick(button.onClickHandler as keyof Props)}
            label={button.label}
            altText={button.altText}
          />
        ))}
      </div>
    </>
  );
};

export default PauseMenu;
