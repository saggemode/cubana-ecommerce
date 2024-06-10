import React from "react";

const truncate = (str: string) => {
  if (str.length < 25) return str;
  return str.substring(0, 25) + "...";
};

export default truncate;
