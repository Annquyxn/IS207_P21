import DashboardCard from '../../features/admin/dasboard/DashboardCard';
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
  );
};

export default Dashboard;
