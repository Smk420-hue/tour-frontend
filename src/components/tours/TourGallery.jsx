import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TourGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={15}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop
        className="rounded-2xl shadow-md"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={typeof img === "string" ? img : img.imageUrl || img.url}
              alt={`Tour image ${idx + 1}`}
              className="w-full h-72 md:h-96 object-cover rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TourGallery;
