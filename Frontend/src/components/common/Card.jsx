import React from "react";

const Card = ({
  children,
  hover = true,
  icon,
  iconColor,
  className = "",
  ...props
}) => {
  const baseStyles =
    "bg-white rounded-2xl p-6 shadow-md transition-all duration-200";
  const hoverStyles = hover
    ? "hover:-translate-y-2 hover:shadow-xl cursor-pointer"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {icon && (
        <div
          className="w-14 h-14 flex items-center justify-center rounded-lg mb-4 text-2xl"
          style={{
            color: iconColor,
            backgroundColor: iconColor ? `${iconColor}1A` : "#10b98120",
          }}
        >
          {icon}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
