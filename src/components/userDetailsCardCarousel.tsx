import React, { useState } from "react";
import Slider from "react-slick";
import UserDetailsCard from "./UserDetailsCard";
import Team from "../entities/Team";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarouselProps {
  users: Team[];
}

const UserDetailsCardCarousel: React.FC<CarouselProps> = ({ users }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!users || users.length === 0) {
    return <div>No user details available</div>;
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    afterChange: (index: number) => setCurrentSlide(index),
    customPaging: (i: number) => (
      <div
        className={`w-2 h-2 rounded-full ${
          i === currentSlide ? "bg-[#7E7E7E]" : "bg-gray-300"
        }`}
      />
    ),
    dotsClass: "slick-dots flex justify-center mt-4",
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //       infinite: false,
    //       dots: true,
    //     },
    //   },
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     },
    //   },
    // ],
  };

  return (
    <div className="max-w-full mx-auto">
      <Slider {...settings}>
        {users.map((user) => (
          <div key={user._id} className="h-64 flex items-center text-white">
            <UserDetailsCard team={user} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default UserDetailsCardCarousel;
