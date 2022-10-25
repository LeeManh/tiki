import React from "react";

const Input = ({ title, type = "text", name, value, onChange }) => {
  return (
    <div className="space-y-2">
      <span className="font-semibold">{title} : </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border-2 px-2 py-1 rounded border-slate-300 w-full"
      />
    </div>
  );
};

export default Input;
