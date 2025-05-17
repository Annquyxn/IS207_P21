import Slider from 'react-slick';
import ShockDeal from '../voucher/ShockDeal';

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

  const banners = [
    'https://file.hstatic.net/200000722513/file/man_hinh_thang_04_banner_web_slider_800x400.jpg',
    'https://file.hstatic.net/200000722513/file/thang_04_laptop_gaming_banner_web_slider_800x400.jpg',
    'https://file.hstatic.net/200000722513/file/asus_zenbook_a14_800x400.png',
  ];

  return (
    <section className='relative w-full max-w-full overflow-hidden rounded-lg'>
      <Slider {...settings}>
        <div className='w-full h-[408px] overflow-hidden bg-orange-50'>
          <ShockDeal />
        </div>

        {banners.map((src, idx) => (
          <div key={idx} className='w-full h-[408px] overflow-hidden'>
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
