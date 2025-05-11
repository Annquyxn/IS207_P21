import { ChevronDownIcon, TicketIcon } from "@heroicons/react/outline";
import AddressForm from "../components/AddressForm";
import OrderSummary from "../components/OrderSummary";
import SubmitOrderButton from "../components/SubmitOrderButton";

function ShippingInfoPage() {
  const handleSubmitOrder = () => {
    console.log("Order submitted");
    // Xử lý đặt hàng ở đây
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">Đặt hàng</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <AddressForm />
        <OrderSummary />
        <SubmitOrderButton onClick={handleSubmitOrder} />
      </div>
    </div>
  );
}

export default ShippingInfoPage;
