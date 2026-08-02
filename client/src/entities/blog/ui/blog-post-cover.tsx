import type { BlogPostCoverImage } from '../model';

type BlogPostCoverProps = {
  coverImage?: BlogPostCoverImage;
  title: string;
  variant?: 'card' | 'detail';
};

const variantClasses = {
  card: 'aspect-[4/3]',
  detail: 'aspect-[16/7] max-h-110',
} as const;

export const BlogPostCover = ({
  coverImage,
  title,
  variant = 'card',
}: BlogPostCoverProps) => {
  if (coverImage?.src) {
    return (
      <img
        src={coverImage.src}
        alt={coverImage.alt || title}
        className={`w-full rounded border border-border-soft object-cover ${variantClasses[variant]}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex w-full items-end rounded border border-border-soft bg-background-secondary p-4 ${variantClasses[variant]}`}
    >
      <span className="badge text-typography-muted">Layer Journal</span>
    </div>
  );
};
