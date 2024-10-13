import React from "react";
import checkMark from "@assets/images/icon-check.svg";

interface CheckMarkProps {
  onClick: () => void;
}

const CheckMark: React.FC<CheckMarkProps> = ({ onClick }) => {
  return (
    <img
      className="checkMark"
      src={checkMark}
      alt="check mark"
      onClick={onClick}
    />
  );
};

export default CheckMark;
