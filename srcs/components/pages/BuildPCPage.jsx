import { useEffect, useState } from "react";
import { fetchPCComponents } from "@/components/services/buildpcService";
import Breadcrumb from "@/components/features/buildPC/Breadcrumb";
import ConfigurationArea from "@/components/features/buildPC/ConfigurationArea";

function BuildPCPage() {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPCComponents();
      setComponents(data);
    };
    loadData();
  }, []);

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb />
        <ConfigurationArea components={components} />
      </div>
    </div>
  );
}

export default BuildPCPage;
