function ConfigurationArea({ components }) {
  const defaultComponents = [
    "CPU",
    "Mainboard",
    "Card màn hình",
    "RAM",
    "Ổ cứng SSD",
    "Ổ cứng HDD",
    "Case máy tính",
    "Nguồn máy tính",
    "Tản nhiệt CPU",
    "Màn hình",
    "Chuột",
    "Bàn phím",
    "Tai nghe gaming",
    "Phần mềm",
  ];

  return (
    <section className="configuration-area">
      <div className="component-container">
        <div className="component-list">
          {(components.length > 0 ? components : defaultComponents).map(
            (name, index) => (
              <div key={index} className="component-row">
                <img
                  src={`https://cdn.builder.io/api/v1/image/assets/TEMP/${index}.png`}
                  alt=""
                  className="component-icon"
                />
                <div className="component-name">{name}</div>
                <button className="select-button">Chọn</button>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default ConfigurationArea;
