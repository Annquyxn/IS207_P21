import { useNavigate } from 'react-router-dom';

function ModalWrapper({ children }) {
  const navigate = useNavigate();
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white rounded-xl shadow-xl relative max-w-md w-full p-6'>
        <button
          onClick={() => navigate('/home', { replace: true })}
          className='absolute top-3 right-4 text-gray-500 text-2xl font-bold hover:text-red-500'
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default ModalWrapper;
