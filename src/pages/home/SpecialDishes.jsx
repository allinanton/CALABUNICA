import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "../../components/Cards";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import moment from "moment-timezone";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    >
      NEXT
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "orange" }}
      onClick={onClick}
    >
      BACK
    </div>
  );
};

const SpecialDishes = () => {
  const [recipes, setRecipes] = useState([]);
  const slider = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://calabunica-server.onrender.com/menu");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const currentHour = moment.tz("Europe/Bucharest").hours();
  const isClosed = currentHour < 8 || currentHour >= 15;


  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: recipes.length,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 970,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],

    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 my-20 relative">
      <div className='text-left'>
        <p className='subtitle'>Gusturi alese: Un Festin Culinar</p>
        <h2 className='title font-primary'>Preparatele Noastre de Astăzi</h2>
      </div>
      <div className="md:absolute right-3 top-8 mb-10 md:mr-24">
        <button onClick={() => slider?.current?.slickPrev()}
          className=" bg-orange btn p-2 rounded-full ml-5"
        >
          <FaAngleLeft className=" h-8 w-8 p-1" />
        </button>
        <button
          className="bg-orange btn p-2 rounded-full ml-5"
          onClick={() => slider?.current?.slickNext()}
        >
          <FaAngleRight className=" h-8 w-8 p-1" />
        </button>
      </div>
      {isClosed ? (
        <div className="text-center my-10">
          <h2 className="text-2xl font-bold">Restaurantul este închis</h2>
          <p className="mt-4 text-gray-500">Comenzile pot fi plasate între orele 8:00 și 15:00. Vă mulțumim pentru înțelegere!</p>
        </div>
      ) : (
        <Slider ref={slider} {...settings} className="overflow-hidden mt-10 space-x-5">
          {recipes.map((item, i) => (
            <Cards item={item} key={i} />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default SpecialDishes;
