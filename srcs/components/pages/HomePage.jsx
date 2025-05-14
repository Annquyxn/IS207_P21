import LeftColumn from "@/components/features/columns/LeftColumn";
import CenterColumn from "@/components/features/columns/CenterColumn";
import RightColumn from "@/components/features/columns/RightColumn";
import ProductPage from "@/components/pages/ProductPage";

function HomePage() {
  return (
    <main className="bg-white px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <LeftColumn />
        <CenterColumn />
        <RightColumn />
      </div>
      
      {/* ProductSelectionPage nằm bên dưới */}
      <div className="mt-6">
        <ProductPage />  {/* ProductSelectionPage chứa ProductPage */}
      </div>
    </main>
  );
}

export default HomePage;
