import "./Menu.css";
import { MENU_BUTTONS } from "@/utils/menuConfig";
import MenuButton from "@/components/MenuButton";
import Logo from "@/components/Logo";
import ButtonGroup from "@/components/ButtonGroup";

interface Props {
  handleRulesButton: () => void;
  handleShowGame: () => void;
  handlePvaButton: () => void;
}

const Menu = (props: Props) => {
  const handleClick = (handler: keyof Props) => {
    props[handler]();
  };

  return (
    <div className="menuContainer">
      <Logo />
      <ButtonGroup className="buttons">
        {MENU_BUTTONS.map((button, index) => (
          <MenuButton
            key={index}
            label={button.label}
            imageSrc={button.imageSrc}
            onClick={() => handleClick(button.onClickHandler as keyof Props)}
            className={button.className}
            altText={button.altText}
          />
        ))}
      </ButtonGroup>
    </div>
  );
};

export default Menu;
