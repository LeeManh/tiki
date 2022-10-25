import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper";

const images = [
  "https://salt.tikicdn.com/ts/banner/59/5f/5a/8f2f8b155dae310805a4b89e64cd7afb.png",
  "https://salt.tikicdn.com/cache/w1080/ts/banner/e6/f8/a2/23ee6c70d287314f661fa2baad7d76ce.png.webp",
  "https://salt.tikicdn.com/cache/w1080/ts/banner/41/81/87/d2fc690104e43519b1b9e928bb4ab11f.png.webp",
  "https://salt.tikicdn.com/cache/w1080/ts/banner/39/9e/1c/4b441951409c3863421605dd6d2f8621.jpg.webp",
];

const Banner = () => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  return (
    <>
      <div className="relative hidden md:block">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation, Pagination]}
          className="w-full h-full"
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
          }}
        >
          {images.map((image, i) => (
            <SwiperSlide className="h-full !w-[80%]" key={i}>
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover rounded"
              />
            </SwiperSlide>
          ))}

          <button
            ref={navigationPrevRef}
            className="absolute top-1/2 left-1 z-50 px-4 cursor-pointer flex justify-center items-center w-[40px] h-[40px] bg-gray-300/30 rounded-full "
          >
            <NavigateBeforeIcon />
          </button>
          <button
            ref={navigationNextRef}
            className="absolute top-1/2 right-1 z-50 px-4 cursor-pointer flex justify-center items-center w-[40px] h-[40px] bg-gray-300/30 rounded-full"
          >
            <NavigateNextIcon />
          </button>
        </Swiper>
      </div>
      <div className="block md:hidden">
        <img src={images[0]} alt="" className="rounded" />
      </div>
    </>
  );
};

export default Banner;
