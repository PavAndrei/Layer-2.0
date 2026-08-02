import { Button, TextInput } from '../../../shared/ui';

type BlogPostsFiltersFormProps = {
  onReset: () => void;
  onSearchChange: (search: string) => void;
  search: string;
};

export const BlogPostsFiltersForm = ({
  onReset,
  onSearchChange,
  search,
}: BlogPostsFiltersFormProps) => {
  return (
    <form
      className="grid gap-3 rounded border border-border-soft bg-background-surface p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
      onSubmit={(event) => event.preventDefault()}
    >
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
    </form>
  );
};
