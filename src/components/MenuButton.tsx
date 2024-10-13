interface MenuButtonProps {
  label: string;
  imageSrc: string;
  onClick: () => void;
  className?: string;
  altText?: string;
}

const MenuButton = ({
  label,
  imageSrc,
  onClick,
  className,
  altText,
}: MenuButtonProps) => {
  return (
    <button className={className} onClick={onClick}>
      {label}
      {imageSrc && (
        <img src={imageSrc} alt={altText || label} className="buttonIcon" />
      )}
    </button>
  );
};

export default MenuButton;
