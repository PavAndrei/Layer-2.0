type BlogPostContentProps = {
  contentHtml: string;
};

export const BlogPostContent = ({
  contentHtml,
}: BlogPostContentProps) => {
  return (
    <article
      className="flex flex-col gap-5 text-typography-primary [&_a]:text-accent-primary [&_a]:underline [&_a]:underline-offset-3 [&_blockquote]:border-l-2 [&_blockquote]:border-accent-primary [&_blockquote]:pl-4 [&_blockquote]:text-typography-secondary [&_h2]:block-title [&_h2]:text-typography-heading [&_li]:pl-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:leading-7 [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};
