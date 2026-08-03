export const formatBlogPostTag = (tag: string) => {
  return tag
    .split('-')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
};
