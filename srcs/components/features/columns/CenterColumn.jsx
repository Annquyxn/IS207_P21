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

  return (
    <section className='relative w-full max-w-full overflow-hidden rounded-lg'>
      <Slider {...settings}>
        <ShockDeal />
      </Slider>
    </section>
  );
}

export default CenterColumn;
