import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Icon } from "ol/style";

const MapComponent = ({ height = "350px" }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const storeLocations = [
      {
        name: "Cửa hàng số 1",
        coordinates: [106.700981, 10.776889],
        address: "123 Đường Nguyễn Văn Linh, Quận 7",
      },
      {
        name: "Cửa hàng số 2",
        coordinates: [104.9282, 11.5564],
        address: "456 Đường 3/2, Quận 10",
      },
      {
        name: "Cửa hàng số 3",
        coordinates: [116.4074, 39.9042],
        address: "789 Đường Cách Mạng Tháng 8, Quận 3",
      },
    ];

    const markerUrl =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDMyIDQ4Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNlNTQ5NGQiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4xNSIgZD0iTTE2LjE1NCAwQzcuODc4IDAgMS4wNDUgNi43NDMgMS4wNDUgMTUuMDE5YzAgNC4zNjggMi45MTQgOS4xNzggNi4xODUgMTIuNTI3IDMuNDI4IDMuNTE3IDcuNjY2IDkuMjA0IDguMDk1IDE5LjE0Ni4yNzIgNC41MDIuNDU5IDEuMDk3Ljc3NCAwIDEuNTctNS40MDQgNS4wNTQtMTIuMDIyIDguOTc5LTE5LjE0NiAyLjQxNC00LjM2OCA3LjAyLTcuODIyIDcuMDItMTIuNTI3QzMyLjA5OCA2Ljc0MyAyNS4yNzEgMCAxNi4xNTQgMHoiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjE1IiByPSI2IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE2LjA0OCA0MWM0LjE4OSAwIDcuNTg0LTMuMzk1IDcuNTg0LTcuNTg0cy0zLjM5NS03LjU4NC03LjU4NC03LjU4NC03LjU4NCAzLjM5NS03LjU4NCA3LjU4NCAzLjM5NSA3LjU4NCA3LjU4NCA3LjU4NHoiLz48L2c+PC9zdmc+";

    const features = storeLocations.map((location) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(location.coordinates)),
        name: location.name,
        address: location.address,
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src: markerUrl,
            scale: 0.8,
            anchor: [0.5, 1],
          }),
        })
      );

      return feature;
    });

    // Create vector source and layer for markers
    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([106.695153, 10.752654]),
        zoom: 12,
      }),
    });

    const container = document.createElement("div");
    container.className =
      "ol-popup bg-white p-3 rounded-md shadow-lg border border-gray-200";
    container.style.position = "absolute";
    container.style.bottom = "12px";
    container.style.left = "-50px";
    container.style.minWidth = "200px";
    container.style.zIndex = "10";
    container.style.display = "none";

    const content = document.createElement("div");
    content.className = "font-medium";
    container.appendChild(content);

    const closer = document.createElement("div");
    closer.className =
      "absolute top-1 right-1 cursor-pointer text-gray-500 hover:text-gray-800";
    closer.innerHTML = "✕";
    container.appendChild(closer);

    mapRef.current.appendChild(container);

    map.on("click", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });

      if (feature) {
        container.style.display = "block";
        content.innerHTML = `<div class="font-bold">${feature.get(
          "name"
        )}</div><div class="text-sm mt-1">${feature.get("address")}</div>`;
        container.style.transform = `translate(${evt.pixel[0]}px, ${
          evt.pixel[1] - 30
        }px)`;
      } else {
        container.style.display = "none";
      }
    });

    closer.addEventListener("click", function () {
      container.style.display = "none";
      return false;
    });

    return () => {
      map.setTarget(null);
      mapRef.current?.removeChild(container);
    };
  }, []);

  return (
    <div className="map-container">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        Các cửa hàng GearVN
      </h2>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: height,
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      />
      <div className="text-sm mt-2 text-gray-600">
        <p>Nhấp vào bản đồ để xem thông tin chi tiết cửa hàng</p>
        <p className="mt-1">
          Hotline: <span className="font-semibold">1800 6975</span>
        </p>
      </div>
    </div>
  );
};

export default MapComponent;
