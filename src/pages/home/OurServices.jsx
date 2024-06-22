import React from "react";

const serviceLists = [
  { id: 1, title: "Catering", des: "Încântă-ți oaspeții cu arome deosebite și prezentări surprinzătoare.", img: "/images/home/services/icon1.png" },
  { id: 2, title: "Mâncare la Oală", des: "Pregătim mâncare delicioasă și variată pentru întreaga săptămână, fără stres.", img: "/images/home/services/icon2.png" },
  { id: 3, title: "Organizare Evenimente", des: "Aducem fiecare eveniment la viață, oferind servicii complete de organizare.", img: "/images/home/services/icon3.png" },
  { id: 4, title: "Catering Evenimente", des: "Adăugăm gust și eleganță fiecărui eveniment, fie că este organizat la noi sau la altă locație.", img: "/images/home/services/icon4.png" },
]

const OurServices = () => {
  return (
    <div className="section-container my-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2">
          <div className="text-left md:w-4/5">
            <p className="subtitle">Povestea și Serviciile Noastre</p>
            <h2 className="title font-primary">Tradiție și Servicii Culinare</h2>
            <p className="my-5 text-secondary leading-[30px]">
              Inspirați de pasiune, creăm experiențe gastronomice de neuitat și oferim servicii excepționale, combinând arta culinară cu ospitalitatea călduroasă.
            </p>

            {/* 
  <button className="bg-orange font-semibold btn text-white px-8 py-3 rounded-full">
    Explorează
  </button>
*/}

          </div>
        </div>
        <div className="md:w-1/2">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 items-center">
            {
              serviceLists.map((service) => (
                <div key={service.id} className="shadow-md rounded-sm py-5 px-4 text-center space-y-2 text-orange cursor-pointer hover:border hover:border-orange transition-all duration-200">
                  <img src={service.img} alt="" className=" mx-auto" />
                  <h5 className="pt-3 font-semibold"> {service.title}</h5>
                  <p className="text-[#f0b775]">{service.des}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
