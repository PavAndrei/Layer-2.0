type ProductGalleryProps = {
  image: string;
  title: string;
};

export const ProductGallery = ({ image, title }: ProductGalleryProps) => {
  return (
    <div className="rounded border border-gray-200 bg-gray-100">
      <img src={image} alt={title} className="h-auto w-full object-cover" />
    </div>
  );
};

