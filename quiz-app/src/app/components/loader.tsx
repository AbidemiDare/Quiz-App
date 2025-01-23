import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-white">
      <div className="border-4 border-solid border-black border-t-blue-50 border-t-4 animate-spin rounded-full w-8 h-8"></div>
    </div>
  );
};

export default Loader;
