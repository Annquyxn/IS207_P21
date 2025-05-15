function LeftColumn() {
  const links = ['#', '#', '#', '#'];
  const images = [
    'https://file.hstatic.net/200000722513/file/thang_04_layout_web_-01.png',
    'https://file.hstatic.net/200000722513/file/thang_04_layout_web_-01.png',
    'https://file.hstatic.net/200000722513/file/thang_04_layout_web_-09.png',
    'https://file.hstatic.net/200000722513/file/thang_04_layout_web_-08.png',
  ];

  return (
    <div className='flex gap-5 px-2'>
      {images.map((src, idx) => (
        <a
          key={idx}
          href={links[idx]}
          target='_blank'
          rel='noopener noreferrer'
          className='block flex-1 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300'
          style={{ aspectRatio: '4 / 3' }}
        >
          <img
            src={src}
            alt={`Left image ${idx + 1}`}
            className='w-full h-full object-contain rounded-2xl max-w-full'
            style={{ display: 'block' }}
          />
        </a>
      ))}
    </div>
  );
}

export default LeftColumn;
