import React from "react";

const ProductGallery = () => {
  return (
    <section className="w-full">
      <div className="relative bg-gray-300 h-[300px] rounded-lg">
        <div className="main-image absolute inset-0"></div>
        <div className="absolute top-1/2 w-full flex justify-between transform -translate-y-1/2">
          <button className="bg-white/70 p-2 rounded-full cursor-pointer">
            <i className="ti ti-chevron-left"></i>
          </button>
          <button className="bg-white/70 p-2 rounded-full cursor-pointer">
            <i className="ti ti-chevron-right"></i>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <button className="bg-gray-200 px-2.5 py-1.5 rounded-lg cursor-pointer text-lg">
          <i className="ti ti-chevron-left"></i>
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((item) => (
            <button
              key={item}
              className="w-[60px] h-[60px] bg-gray-300 border-2 border-transparent rounded-md cursor-pointer"
            ></button>
          ))}
        </div>
        <button className="bg-gray-200 px-2.5 py-1.5 rounded-lg cursor-pointer text-lg">
          <i className="ti ti-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};

export default ProductGallery;
