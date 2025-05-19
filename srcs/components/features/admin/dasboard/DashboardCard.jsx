import Spinner from '../../../ui/Spinner';

const DashboardCard = ({ title, value, icon, isLoading }) => {
  return (
    <div className='bg-white shadow-md rounded-2xl p-6 flex items-center justify-between'>
      <div>
        <p className='text-sm text-gray-500'>{title}</p>
        {isLoading ? (
          <Spinner />
        ) : (
          <h3 className='text-2xl font-bold text-gray-800 mt-1'>{value}</h3>
        )}
      </div>
      <div className='text-3xl text-red-500'>{icon}</div>
    </div>
  );
};

export default DashboardCard;
