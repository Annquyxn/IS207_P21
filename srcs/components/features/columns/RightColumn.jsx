function RightColumn() {
  const links = ['#', '#', '#']; // Cập nhật thêm một link cho ảnh thứ 3
  const images = [
    'https://file.hstatic.net/200000722513/file/thang_04_layout_web_-03.png',
    'https://file.hstatic.net/200000722513/file/thang_04_layout_web_-02.png',
    'https://file.hstatic.net/200000722513/file/thang_04_layout_web_-07.png',
  ];

  return (
    <div className='flex flex-col gap-5 px-2 pt-2 h-full'>
      {images.map((src, idx) => (
        <a
          key={idx}
          href={links[idx]}
          target='_blank'
          rel='noopener noreferrer'
          className='block rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300'
          style={{ flex: 1, minHeight: 0 }}
        >
          <img
            src={src}
            alt={`Right image ${idx + 1}`}
            className='w-full h-full object-contain rounded-2xl max-w-full'
            style={{ display: 'block' }}
          />
        </a>
      ))}
    </div>
  );
}

export default RightColumn;
