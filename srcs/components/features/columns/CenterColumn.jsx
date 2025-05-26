import Slider from 'react-slick';
import Banner0 from '@/assets/banner/banner-0.png';
import Banner1 from '@/assets/banner/banner-1.png';
import Banner2 from '@/assets/banner/banner-2.png';
import Banner3 from '@/assets/banner/banner-3.png';
import Banner4 from '@/assets/banner/banner-4.png';
import Banner5 from '@/assets/banner/banner-5.png';

function CenterColumn() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: 'transparent',
          padding: '2px 0',
          bottom: '2px',
          position: 'absolute',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <ul style={{ margin: 0, padding: 0, display: 'flex', gap: '6px' }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: '14px',
          height: '2px',
          borderRadius: '1px',
          backgroundColor: '#2563eb',
          opacity: 0.5,
          cursor: 'pointer',
          margin: '0 auto',
        }}
      />
    ),
  };

  const banners = [Banner0, Banner1, Banner2, Banner3, Banner4, Banner5];

  return (
    <section className='relative w-full max-w-full overflow-hidden rounded-lg'>
      <Slider {...settings}>
        {banners.map((src, idx) => (
          <div
            key={idx}
            className='w-full h-[408px] overflow-hidden object-contain'
          >
            <img
              src={src}
              alt={`banner-${idx}`}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]'
            />
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default CenterColumn;
