import React from "react";


const Banner = () => {

  return (
    <div className={`max-w-screen-3x1 container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100% mt-10 `}>
      <div className={`py-24 flex flex-col md:flex-row-reverse items-center justify-between gap-8 `}>

        {/* img */}
        <div className="md:w-1/2">
    
          <div className="flex flex-col md:flex-row items-center justify-around -mt-14 gap-4">
           
           
          </div>
        </div>

        {/* texts */}
        <div className="md:w-1/2 px-4 space-y-7">
        <h2 className="md:text-5xl text-4xl font-primary font-bold md:leading-snug leading-snug">
        Scufundă-te în Deliciile <span className="text-orange"> Mâncărurilor</span> Delicioase
          </h2>
          <p className="text-[#4A4A4A] text-xl">
          Unde Fiecare Farfurie Împletește o Poveste de Măiestrie Culinară
          </p>
          <button className="bg-orange font-semibold btn text-white px-8 py-3 rounded-full">
          Comandă acum
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Banner;
