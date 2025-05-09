import React from 'react';

const icons = [
  { alt: "Facebook", src: "https://cdn.builder.io/api/v1/image/assets/TEMP/75bfcbf0685d5164008fb1c27c217ced5ef22364?placeholderIfAbsent=true&apiKey=a16e8eb3709343e59b0b1c1997d522b7" },
  { alt: "Twitter", src: "https://cdn.builder.io/api/v1/image/assets/TEMP/6923c7c9df177d3512c7250291bff9f710047697?placeholderIfAbsent=true&apiKey=a16e8eb3709343e59b0b1c1997d522b7" },
  { alt: "Instagram", src: "https://cdn.builder.io/api/v1/image/assets/TEMP/73b5993fb29d875a25fd75a51c21a412c0101bf7?placeholderIfAbsent=true&apiKey=a16e8eb3709343e59b0b1c1997d522b7" },
  { alt: "YouTube", src: "https://cdn.builder.io/api/v1/image/assets/TEMP/4ddfd39a93aa3dac1fd4d5fa85c383b192b42cc2?placeholderIfAbsent=true&apiKey=a16e8eb3709343e59b0b1c1997d522b7" },
];

const SocialConnect = () => (
  <div className="social-connect">
    <h3 className="social-heading">KẾT NỐI VỚI CHÚNG TÔI</h3>
    <div className="social-icons">
      {icons.map((icon, idx) => (
        <a href="#" key={idx}>
          <img src={icon.src} alt={icon.alt} className="social-icon" />
        </a>
      ))}
    </div>
  </div>
);

export default SocialConnect;
