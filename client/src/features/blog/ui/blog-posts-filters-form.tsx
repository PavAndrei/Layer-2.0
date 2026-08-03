import { Button, TextInput } from '../../../shared/ui';
import { formatBlogPostTag } from '../../../entities/blog';

type BlogPostsFiltersFormProps = {
  activeTag?: string;
  availableTags?: string[];
  onClearTag?: () => void;
  onReset: () => void;
  onSearchChange: (search: string) => void;
  onTagChange?: (tag: string) => void;
  search: string;
};

export const BlogPostsFiltersForm = ({
  activeTag,
  availableTags = [],
  onClearTag,
  onReset,
  onSearchChange,
  onTagChange,
  search,
}: BlogPostsFiltersFormProps) => {
  return (
    <form
      className="flex flex-col gap-3 rounded border border-border-soft bg-background-surface p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <TextInput
          id="blog-posts-search"
          label="Search articles"
          placeholder="Search title or topic..."
          value={search}
          onChange={onSearchChange}
        />
        <Button type="button" variant="secondary" onClick={onReset}>
          Clear filters
        </Button>
      </div>
      {activeTag && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="block-small text-typography-muted">
            Filtered by tag
          </span>
          <button
            type="button"
            className="rounded border border-border-soft bg-background-secondary px-2 py-1 block-small text-typography-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
            onClick={onClearTag}
          >
            {formatBlogPostTag(activeTag)}
          </button>
        </div>
      )}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="block-small text-typography-muted">
            Popular tags
          </span>
          {availableTags.map((tag) => {
            const isActive = tag === activeTag;

            return (
              <button
                key={tag}
                type="button"
                aria-pressed={isActive}
                className={`rounded border px-2 py-1 block-small transition-colors ${
                  isActive
                    ? 'border-accent-primary bg-accent-primary text-background-surface'
                    : 'border-border-soft bg-background-secondary text-typography-secondary hover:border-accent-primary hover:text-accent-primary'
                }`}
                onClick={() => {
                  if (isActive) {
                    onClearTag?.();
                    return;
                  }

                  onTagChange?.(tag);
                }}
              >
                {formatBlogPostTag(tag)}
              </button>
            );
          })}
        </div>
      )}
    </form>
  );
};
