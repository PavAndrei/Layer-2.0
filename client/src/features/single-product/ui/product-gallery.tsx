import { useEffect, useMemo, useState } from 'react';
import type { Swiper as SwiperClass } from 'swiper/types';
import { A11y, Keyboard, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import type { ProductImage } from '../../../entities/product';

type ProductGalleryProps = {
  images: ProductImage[];
  title: string;
};

export const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const hasMultipleImages = images.length > 1;
  const activeThumbsSwiper =
    thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null;
  const imagesSignature = useMemo(
    () => images.map((image) => image.src).join('|'),
    [images],
  );

  useEffect(() => {
    if (mainSwiper && !mainSwiper.destroyed) {
      mainSwiper.slideTo(0, 0);
    }

    if (thumbsSwiper && !thumbsSwiper.destroyed) {
      thumbsSwiper.slideTo(0, 0);
    }
  }, [imagesSignature, mainSwiper, thumbsSwiper]);

  const handleThumbClick = (index: number) => {
    if (mainSwiper && !mainSwiper.destroyed) {
      mainSwiper.slideTo(index);
    }

    if (thumbsSwiper && !thumbsSwiper.destroyed) {
      thumbsSwiper.slideTo(index);
    }
  };

  if (images.length === 0) {
    return (
      <div className="aspect-4/5 rounded border border-gray-200 bg-gray-100" />
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
      <Swiper
        modules={[A11y, Keyboard, Navigation, Thumbs]}
        onSwiper={setMainSwiper}
        navigation={hasMultipleImages}
        keyboard={{ enabled: true }}
        spaceBetween={12}
        thumbs={{ swiper: activeThumbsSwiper }}
        className="w-full overflow-hidden rounded border border-gray-200 bg-gray-100"
      >
        {images.map((image) => (
          <SwiperSlide key={image.src}>
            <div className="aspect-4/5 bg-gray-100 sm:aspect-3/4 lg:aspect-4/5">
              <img
                src={image.src}
                alt={image.alt || title}
                className="h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {hasMultipleImages && (
        <Swiper
          modules={[A11y, Thumbs]}
          onSwiper={setThumbsSwiper}
          slidesPerView={4}
          spaceBetween={8}
          watchSlidesProgress
          breakpoints={{
            640: {
              slidesPerView: 5,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
          className="w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.src} className="h-auto">
              <button
                type="button"
                aria-label={`Show ${image.alt || title}`}
                onClick={() => handleThumbClick(index)}
                className="block aspect-square w-full cursor-pointer overflow-hidden rounded border border-gray-200 bg-gray-100 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black [.swiper-slide-thumb-active_&]:opacity-100"
              >
                <img
                  src={image.src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
