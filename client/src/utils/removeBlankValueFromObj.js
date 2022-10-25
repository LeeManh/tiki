const removeBlankValueFromObj = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      return v != null;
    })
  );
};

export default removeBlankValueFromObj;
