const CategoryItem = ({ icon, name, active }) => (
  <li
    className={`flex flex-col items-center gap-2 text-sm font-medium transition duration-300 transform hover:scale-105 ${
      active ? 'text-orange-500' : 'text-gray-600 hover:text-orange-400'
    }`}
  >
    <div
      className={`bg-white shadow p-3 rounded-xl transition-shadow ${
        active ? 'shadow-lg' : 'hover:shadow-md'
      }`}
    >
      <img
        src={icon}
        alt={`${name} icon`}
        className='w-14 h-14 object-contain'
      />
    </div>
    <span>{name}</span>
  </li>
);

const categories = [
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/8de31b67bb86a2d4661235ebcbcf8a793e244d2d',
    name: 'Tất cả giảm giá',
    active: false,
  },
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/91b9904702d63974275c8d4e827ac1cb92405424',
    name: 'Shock Deal',
    active: true,
  },
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/66e132a5a8e246d520c117a1ae3ca71972564d8c',
    name: 'Siêu sale hè',
    active: false,
  },
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3eab2f96b8bdb6099fc29be1c73cb6884a99c8e4',
    name: 'Xả kho cuối tuần',
    active: false,
  },
];

const CategoryNav = () => (
  <nav className='mt-10'>
    <ul className='flex flex-wrap justify-center gap-6 px-4'>
      {categories.map((cat, index) => (
        <CategoryItem key={index} {...cat} />
      ))}
    </ul>
  </nav>
);

const ShockDeal = () => {
  return (
    <section className='relative bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 py-8'>
      {/* Floating orb lights */}
      <div className='absolute top-6 left-6 w-10 h-10 bg-orange-300 rounded-full blur-md z-0' />
      <div className='absolute bottom-6 right-10 w-14 h-14 bg-red-400 rounded-full blur-lg animate-pulse z-0' />
      <div className='absolute top-1/3 right-16 w-6 h-6 bg-yellow-400 rounded-full blur-sm animate-bounce z-0' />

      <header className='text-center relative z-10 mb-12'>
        <div className='inline-block px-10 py-4 relative animate-[wiggle_1.5s_infinite]'>
          <h1 className='text-[44px] md:text-[56px] font-extrabold text-orange-600 bg-white px-8 py-4 border-4 border-orange-300 shadow-xl rounded-[80px_0_80px_0]'>
            SHOCK DEAL 🔥
          </h1>
          <p className='mt-2 text-sm md:text-base text-orange-700 font-medium'>
            Ưu đãi sốc mỗi ngày - Số lượng giới hạn
          </p>
          <div className='absolute -top-4 -right-4 w-8 h-8 bg-orange-400 rounded-full blur-md' />
          <div className='absolute -top-6 left-6 w-6 h-6 bg-red-400 rounded-full blur-sm animate-bounce' />
          <div className='absolute -bottom-4 right-10 w-4 h-4 bg-yellow-400 rounded-full blur-sm animate-pulse' />
        </div>
      </header>

      <CategoryNav />
    </section>
  );
};

export default ShockDeal;
