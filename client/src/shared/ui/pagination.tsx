import { useScrollToTopOnChange } from '../hooks';

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: (number | string)[] = [];

  if (currentPage <= 3) {
    items.push(1, 2, 3, 4, '...', totalPages);
    return items;
  }

  if (currentPage >= totalPages - 2) {
    items.push(
      1,
      '...',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );

    return items;
  }

  items.push(
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  );

  return items;
};

export const Pagination = ({
  total,
  limit,
  currentPage,
  onPageChange,
}: {
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(total / limit);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const paginationItems = getPaginationItems(currentPage, totalPages);

  useScrollToTopOnChange(currentPage);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-auto mb-0">
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${isFirstPage && 'pointer-events-none'} px-2 py-1 rounded text-typography-secondary border border-border-strong hover:bg-background-hover transition-colors cursor-pointer`}
      >
        {'<'}
      </button>
      {paginationItems.map((item, index) =>
        typeof item === 'string' ? (
          <span key={`dots-${index}`}>...</span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onPageChange(item)}
            className={`${
              currentPage === item
                ? 'bg-background-primary pointer-events-none'
                : 'bg-background-secondary'
            } px-2 py-1 rounded text-typography-secondary border border-border-strong hover:bg-background-hover transition-colors cursor-pointer`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${isLastPage && 'pointer-events-none'} px-2 py-1 rounded text-typography-secondary border border-border-strong hover:bg-background-hover transition-colors cursor-pointer`}
      >
        {'>'}
      </button>
    </div>
  );
};
