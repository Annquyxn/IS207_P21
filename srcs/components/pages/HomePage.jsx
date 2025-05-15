import LeftColumn from "@/components/features/columns/LeftColumn";
import CenterColumn from "@/components/features/columns/CenterColumn";
import RightColumn from "@/components/features/columns/RightColumn";
import ProductPage from "@/components/pages/ProductPage";
import ChatButton from "@/components/features/chatBot/ChatButton";

function HomePage() {
  return (
    <main className='bg-white max-w-[1200px] mx-auto px-4 py-8'>
      <div className='grid grid-cols-12 gap-5' style={{ height: 'auto' }}>
        <div className='md:col-span-9 h-full mt-7'>
          <CenterColumn />
        </div>
        <div className='md:col-span-3 h-full'>
          <RightColumn />
        </div>
      </div>

      <div className='grid grid-cols-12 gap-5'>
        <div className='col-span-12'>
          <LeftColumn />
        </div>
      </div>

      <div className='mt-8'>
        <ProductPage />
      </div>

      <div className="mt-auto">
        <ChatButton />
      </div>
    </main>
  );
}

export default HomePage;
