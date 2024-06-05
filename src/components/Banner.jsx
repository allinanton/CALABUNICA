import React from "react";

const Banner = () => {

  return (
    <div className="max-w-screen-3xl container mx-auto xl:px-18 bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC] mt-10">
      <div className="py-20 flex flex-col items-center gap-2">

        {/* img */}
        <div className="w-full relative">
          <img src="/images/home/banner/banner4.png" alt="Banner" className="w-full h-auto" />
        </div>

      </div>
    </div>
  );
};

export default Banner;
