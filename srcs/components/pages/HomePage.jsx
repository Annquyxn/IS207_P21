import LeftColumn from "@/components/features/columns/LeftColumn";
import CenterColumn from "@/components/features/columns/CenterColumn";
import RightColumn from "@/components/features/columns/RightColumn";
import ProductPage from "@/components/pages/ProductPage";
import ShockDeal from "@/components/features/voucher/ShockDeal";
import ChatButton from "@/components/features/chatBot/ChatButton";

function HomePage() {
  return (
    <main className="bg-white px-4 py-6">
      <div className="p-5">
        <ShockDeal />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <LeftColumn />
        <CenterColumn />
        <RightColumn />
      </div>

      <div className="mt-6">
        <ProductPage />
      </div>

      <div className="mt-auto">
        <ChatButton />
      </div>
    </main>
  );
}

export default HomePage;
