import React from "react";

const Badge = ({ count }) => {
  if (!count || count === 0) return null;

  return (
    <span
      className="position-absolute top-0 start-100 translate-middle bg-danger text-white"
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        fontSize: "0.7rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {count}
    </span>
  );
};

export default Badge;
