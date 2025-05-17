const ProductGallery = ({ image }) => {
  return (
    <section className='w-full mb-6'>
      <div className='bg-gray-100 rounded-xl overflow-hidden aspect-video shadow'>
        <img
          src={image}
          alt='Sản phẩm'
          className='w-full h-full object-contain'
        />
      </div>
    </section>
  );
};

export default ProductGallery;
