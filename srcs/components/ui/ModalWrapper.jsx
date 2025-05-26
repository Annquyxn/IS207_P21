import { useNavigate } from 'react-router-dom';

function ModalWrapper({ children }) {
  const navigate = useNavigate();
  return (
    <div className='fixed inset-0 z-50 flex justify-center items-start pt-[12vh] bg-black/30'>
      <div className='bg-white rounded-xl relative max-w-4xl w-full p-0'>
        <button
          onClick={() => navigate('/home', { replace: true })}
          className='absolute top-3 right-4 text-white text-3xl font-bold hover:text-black '
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default ModalWrapper;
