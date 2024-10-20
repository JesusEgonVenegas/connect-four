import markerY from "@assets/images/marker-yellow.svg";
import markerR from "@assets/images/marker-red.svg";
import { PLAYER_ONE } from "@/constants/gameConstants";
import { forwardRef, useRef } from "react";

interface PlayerMarkerProps {
  currentPlayer: number;
  markerRef: React.RefObject<HTMLImageElement>;
}

const PlayerMarker = ({ currentPlayer, markerRef }: PlayerMarkerProps) => {
  const markerImage = currentPlayer === PLAYER_ONE ? markerR : markerY;

  return (
    <img
      className="marker"
      src={markerImage}
      ref={markerRef}
      alt={`Player ${currentPlayer} Marker`}
    />
  );
};

export default PlayerMarker;
