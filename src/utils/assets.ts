import logo from "@/assets/images/logo.svg";
import playVsPlayer from "@/assets/images/player-vs-player.svg";

export const IMAGES = {
  logo,
  playVsPlayer,
};

export const BUTTON_TEXTS = {
  playVsPlayer: "Play vs player",
  gameRules: "Game rules",
};

export const RULES = {
  objective:
    "Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).",
  howToPlay: [
    "Red goes first in the first game.",
    "Players must alternate turns, and only one disc can be dropped in each turn.",
    "The game ends when there is a 4-in-a-row or a stalemate.",
    "The starter of the previous game goes second on the next game.",
  ],
};
