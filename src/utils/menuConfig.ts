import pvpImage from "@assets/images/player-vs-player.svg";
export const MENU_BUTTONS = [
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
