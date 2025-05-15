import React from "react";

const CategoryItem = ({ icon, name, active }) => (
  <li className="flex flex-col items-center gap-3 text-lg font-semibold transition-transform duration-300 transform hover:scale-105">
    <div className="bg-white shadow-md p-4 rounded-xl hover:shadow-xl">
      <img
        src={icon}
        alt={`${name} icon`}
        className="w-[80px] h-[80px] object-contain"
      />
    </div>
    <span
      className={`transition-colors duration-300 ${
        active ? "text-[#FF8C00]" : "text-gray-700 hover:text-orange-500"
      }`}
    >
      {name}
    </span>
  </li>
);

const CategoryNav = () => (
  <nav className="mt-12">
    <ul className="flex list-none gap-10 flex-wrap justify-center px-4">
      <CategoryItem
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8de31b67bb86a2d4661235ebcbcf8a793e244d2d"
        name="Tất cả giảm giá"
        active={false}
      />
      <CategoryItem
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/91b9904702d63974275c8d4e827ac1cb92405424"
        name="Shock Deal"
        active={true}
      />
      <CategoryItem
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/66e132a5a8e246d520c117a1ae3ca71972564d8c"
        name="Siêu sale hè"
        active={false}
      />
      <CategoryItem
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3eab2f96b8bdb6099fc29be1c73cb6884a99c8e4"
        name="Xả kho cuối tuần"
        active={false}
      />
    </ul>
  </nav>
);

const ShockDeal = () => {
  return (
    <section className="relative bg-gradient-to-br from-yellow-100 via-orange-200 to-red-200 py-20 px-6">
      {/* 🔥 SVG Fire Animation Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://www.transparenttextures.com/patterns/fire.png"
          alt="flames"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 🔥 Animated Fire SVG Flames - top left */}
      <img
        src="https://www.svgrepo.com/show/509807/flame.svg"
        alt="SVG flame"
        className="absolute -top-10 -left-10 w-24 h-24 animate-bounce z-10 opacity-80"
      />
      {/* 🔥 Bottom right flame SVG */}
      <img
        src="https://www.svgrepo.com/show/509807/flame.svg"
        alt="SVG flame"
        className="absolute bottom-0 right-0 w-28 h-28 animate-pulse z-10 opacity-60"
      />

      {/* 🔥 Animated glowing orbs */}
      <div className="absolute -top-6 -left-6 w-16 h-16 bg-orange-400 rounded-full blur-md animate-ping z-0" />
      <div className="absolute bottom-10 right-10 w-20 h-20 bg-red-500 rounded-full blur-lg animate-pulse z-0" />
      <div className="absolute top-32 right-20 w-10 h-10 bg-yellow-300 rounded-full blur-sm animate-bounce z-0" />

      <header className="text-center relative z-10">
        <div className="inline-block px-12 py-6 relative animate-[wiggle_1.5s_infinite]">
          <h1 className="text-[60px] md:text-[70px] font-bold text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 px-10 py-6 border-4 border-orange-300 shadow-2xl rounded-[120px_0_100px_0]">
            SHOCK DEAL 🔥
          </h1>

          {/* 🔥 Sparkle glow around title */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-orange-500 rounded-full blur-md animate-ping" />
          <div className="absolute -top-8 left-6 w-8 h-8 bg-red-400 rounded-full blur-sm animate-bounce" />
          <div className="absolute -bottom-6 right-12 w-6 h-6 bg-yellow-400 rounded-full blur-sm animate-pulse" />
        </div>
      </header>

      <CategoryNav />
    </section>
  );
};

export default ShockDeal;
