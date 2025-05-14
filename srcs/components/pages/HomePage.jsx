import LeftColumn from "@/components/features/columns/LeftColumn";
import CenterColumn from "@/components/features/columns/CenterColumn";
import RightColumn from "@/components/features/columns/RightColumn";

function HomePage() {
  return (
    <main className="bg-white px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <LeftColumn />
        <CenterColumn />
        <RightColumn />
      </div>
    </main>
  );
}

export default HomePage;
