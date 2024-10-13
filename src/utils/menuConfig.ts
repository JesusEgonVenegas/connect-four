import pvpImage from "@assets/images/player-vs-player.svg";

interface MenuButtonConfig {
  label: string;
  imageSrc: string;
  onClickHandler: string;
  className?: string;
  altText?: string;
}

export const MENU_BUTTONS: MenuButtonConfig[] = [
  {
    label: "Play vs player",
    imageSrc: pvpImage,
    onClickHandler: "handleShowGame",
    className: "playVsPlayer",
    altText: "Play vs Player icon",
  },
  {
    label: "Game rules",
    imageSrc: "",
    onClickHandler: "handleRulesButton",
    className: "gameRules",
    altText: "Game Rules icon",
  },
];
