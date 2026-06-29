import type { LinkProps } from 'react-router';
import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { ProductCard, type Product } from '../../../entities/product';

type RelatedProductsSliderProps = {
  productLinkState?: LinkProps['state'];
  products: Product[];
};

export const RelatedProductsSlider = ({
  productLinkState,
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
        slidesPerView="auto"
        className="w-full"
      >
        {products.map((product) => (
          <SwiperSlide
            key={product._id}
            className="h-auto !w-full md:!w-[calc((100%_-_1rem)/2)] lg:!w-[calc((100%_-_2rem)/3)] xl:!w-[calc((100%_-_3rem)/4)]"
          >
            <ProductCard
              product={product}
              state={productLinkState}
              to={`/products/${product._id}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
