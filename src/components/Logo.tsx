import React from "react";
import { IMAGES } from "@/utils/assets";

interface LogoProps {
  altText?: string;
  className?: string;
}

const Logo = ({ altText = "Game Logo", className = "logo" }: LogoProps) => {
  return <img src={IMAGES.logo} alt={altText} className={className} />;
};

export default Logo;
