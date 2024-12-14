import React from "react";

const Empty = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img className="h-96" src={imgSrc} alt="No content available" />

      <p className="w-1/2 text-md font-medium  font-serif text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default Empty;
