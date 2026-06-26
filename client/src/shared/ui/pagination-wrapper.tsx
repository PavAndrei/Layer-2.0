import { Pagination } from './pagination';

export const PaginationWrapper = ({
  total,
  currentPage,
  limit = 12,
  onPageChange,
}: {
  total: number;
  currentPage: number;
  limit?: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <Pagination
      total={total}
      limit={limit}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );
};
