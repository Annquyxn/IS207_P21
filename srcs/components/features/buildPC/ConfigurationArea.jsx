import React, { useEffect, useState } from "react";
import fetchPCComponents from "@/components/services/fetchPCComponents"; // Giả sử bạn đã import đúng đường dẫn API

const ConfigurationArea = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const getComponents = async () => {
      const response = await fetchPCComponents();
      if (response.success) {
        setComponents(response.data);
      } else {
        console.error("Failed to fetch components:", response.message);
      }
    };

    getComponents();
  }, []);

  return (
    <section className="configuration-area">
      <div className="component-container">
        <div className="component-list">
          {components.length === 0 ? (
            <p>No components available</p>
          ) : (
            components.map((component) => (
              <div key={component.id} className="component-row">
                <img
                  src={component.iconUrl}
                  alt={component.name}
                  className="component-icon"
                />
                <div className="component-name">{component.name}</div>
                <button className="select-button">Chọn</button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ConfigurationArea;

// export function ConfigurationArea({ components }) {
//   const defaultComponents = [
//     "CPU",
//     "Mainboard",
//     "Card màn hình",
//     "RAM",
//     "Ổ cứng SSD",
//     "Ổ cứng HDD",
//     "Case máy tính",
//     "Nguồn máy tính",
//     "Tản nhiệt CPU",
//     "Màn hình",
//     "Chuột",
//     "Bàn phím",
//     "Tai nghe gaming",
//     "Phần mềm",
//   ];

//   const displayComponents =
//     Array.isArray(components) && components.length > 0
//       ? components
//       : defaultComponents;

//   const formatName = (name) => {
//     if (typeof name !== "string") {
//       return "";
//     }
//     return name.replace(/\s+/g, "-").toLowerCase();
//   };

//   return (
//     <section className="configuration-area">
//       <div className="component-container">
//         <div className="component-list">
//           {displayComponents.length === 0 && (
//             <div className="no-components-message">No components available</div>
//           )}

//           {displayComponents.map((name, index) => (
//             <div key={name + index} className="component-row">
//               <img
//                 src={`https://cdn.builder.io/api/v1/image/assets/TEMP/${formatName(
//                   name
//                 )}.png`}
//                 alt={name}
//                 className="component-icon"
//               />
//               <div className="component-name">{name}</div>
//               <button className="select-button">Chọn</button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default ConfigurationArea;
