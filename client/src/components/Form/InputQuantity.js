import React from "react";

const InputQuantity = ({ quantity, onClick, id }) => {
  return (
    <div className="items-center border inline-flex rounded">
      <button
        className="w-[28px] h-[28px] border-r"
        onClick={() => onClick({ math: "minus", id })}
      >
        -
      </button>

      <div className="w-[40px] text-center">{quantity}</div>

      <button
        className="w-[28px] h-[28px] border-l"
        onClick={() => onClick({ math: "plus", id })}
      >
        +
      </button>
    </div>
  );
};

export default InputQuantity;
