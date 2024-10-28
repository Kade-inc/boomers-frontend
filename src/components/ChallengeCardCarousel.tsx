import { useState } from "react";
import Slider from "react-slick";
import Team from "../entities/Team";
import ChallengesCard from "./ChallengesCard";
import Challenge from "../entities/Challenge";

interface CarouselProps {
  slides: Challenge[];
  teamsData?: Team[];
}

function ChallengeCardCarousel({ slides, teamsData }: CarouselProps) {
  if (!slides || slides.length === 0) {
    return <div>No slides available</div>; // Handle the case when there is no data
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: (index: number) => setCurrentSlide(index),
    customPaging: (i: number) => (
      <div
        className={`w-2 h-2 rounded-full ${
          i === currentSlide ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
    ),
    dotsClass: "slick-dots flex justify-center mt-4",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="max-w-lg md:max-w-full mx-auto">
      <Slider {...settings}>
        {slides.map((slide: Challenge) => (
          <div key={slide._id}>
            <div className="h-64 flex items-center text-white md:w-[350px]">
              <ChallengesCard
                key={slide._id}
                challenge={slide}
                teamsInformation={teamsData}
                styles={`w-full md:w-[350px] h-[180px]`}
                section="dashboard-section"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ChallengeCardCarousel;
