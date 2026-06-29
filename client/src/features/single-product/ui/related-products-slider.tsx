import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { ProductCard, type ProductCardProps } from '../../../entities/product';

type RelatedProductsSliderProps = {
  products: ProductCardProps[];
};

export const RelatedProductsSlider = ({
  products,
}: RelatedProductsSliderProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl font-semibold">Related Products</h2>
      <Swiper
        modules={[A11y, Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          640: {
            slidesPerView: 2.2,
          },
          1024: {
            slidesPerView: 3.2,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="w-full"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className="h-auto">
            <ProductCard
              product={product}
              to={`/products/${product._id}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
