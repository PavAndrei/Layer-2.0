import type { LinkProps } from 'react-router';
import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import type { Product } from '../model';
import { ProductCard } from './product-card';

type ProductRecommendationsSectionProps = {
  productLinkState?: LinkProps['state'];
  products: Product[];
  title: string;
};

export const ProductRecommendationsSection = ({
  productLinkState,
  products,
  title,
}: ProductRecommendationsSectionProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl font-semibold">{title}</h2>
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
              to={`/products/${product.slug}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
