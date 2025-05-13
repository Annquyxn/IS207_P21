// import { useEffect, useState } from "react";
// import { fetchPCComponents } from "@/srcs/components/services/buildpcService";
import Breadcrumb from "@/components/features/buildPC/Breadcrumb";
// import ConfigurationArea from "@/components/buildPC/ConfigurationArea";

function BuildPCPage() {
  // const [components, setComponents] = useState([]);

  // useEffect(() => {
    const loadData = async () => {
      // const data = await fetchPCComponents();
      // setComponents(data);
    };
    loadData();
  // }, []);

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-4">
      <Breadcrumb />
      {/* <ConfigurationArea components={components} /> */}
    </div>
  );
}

export default BuildPCPage;
