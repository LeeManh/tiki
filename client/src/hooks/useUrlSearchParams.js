const useUrlSearchParams = (params) => {
  //remove empty value
  const arrFilters = Object.entries(params).filter(([key, value]) =>
    Boolean(value)
  );

  //create path
  return arrFilters
    .reduce((str, [key, value]) => {
      return str + `${key !== "page" ? `${value}&` : `${key}=${value}&`}`;
    }, "")
    .slice(0, -1);
};

export default useUrlSearchParams;
