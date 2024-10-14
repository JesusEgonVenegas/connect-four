interface PauseButtonConfig {
  label: string;
  imageSrc: string;
  onClickHandler: string;
  className?: string;
  altText?: string;
}

export const PAUSE_MENU: PauseButtonConfig[] = [
  {
    label: "Continue game",
    imageSrc: "",
    onClickHandler: "handleContinue",
    altText: "Continue game",
  },
  {
    label: "Restart",
    imageSrc: "",
    onClickHandler: "handleRestart",
    altText: "Restart",
  },
  {
    label: "Quit game",
    imageSrc: "",
    onClickHandler: "handleGoMenu",
    altText: "Quit",
  },
];
