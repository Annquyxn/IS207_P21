import DashboardCard from '../../features/admin/dasboard/DashboardCard';
import PowerBIEmbed from '@/components/services/PowerBIEmbed.jsx';
import {
  MdInventory,
  MdAttachMoney,
  MdShoppingCart,
  MdPeopleAlt,
} from 'react-icons/md';
import { useCountProduct } from '../../features/admin/dasboard/useCountProduct';

const Dashboard = () => {
  const { totalProducts, isLoading } = useCountProduct();

  return (
    <div className='space-y-10'>
      <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 max-w-5xl mx-auto'>
        <DashboardCard
          title={'Tổng số sản phẩm'}
          value={totalProducts}
          icon={<MdInventory />}
          isLoading={isLoading}
        />
        <DashboardCard
          title='Tổng đơn hàng'
          value={''}
          icon={<MdShoppingCart />}
        />
        <DashboardCard
          title='Tổng số người dùng'
          value={''}
          icon={<MdPeopleAlt />}
        />
        <DashboardCard
          title='Tổng doanh thu'
          value={``}
          icon={<MdAttachMoney />}
        />
      </div>

      <div className='bg-white shadow-md rounded-2xl p-6 max-w-5xl mx-auto'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Dashboard Visualization</h2>
        <PowerBIEmbed />
      </div>
    </div>
  );
};

export default Dashboard;
