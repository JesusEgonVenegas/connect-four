import { ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

const ButtonGroup = ({ children, className = "buttons" }: ButtonGroupProps) => {
  return <div className={className}>{children}</div>;
};

export default ButtonGroup;
