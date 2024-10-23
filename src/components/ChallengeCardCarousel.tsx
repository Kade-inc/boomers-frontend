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
    infinite: true,
    speed: 500,
    slidesToShow: 1,
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
  };
  return (
    <div className="max-w-lg mx-auto">
      <Slider {...settings}>
        {slides.map((slide: Challenge) => (
          <div key={slide._id}>
            <div className="h-64 flex items-center justify-center text-white">
              <ChallengesCard
                key={slide._id}
                challenge={slide}
                teamsInformation={teamsData}
                styles={`w-full`}
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
