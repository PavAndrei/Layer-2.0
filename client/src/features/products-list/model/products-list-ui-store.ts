import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ProductsListUiState = {
  isFiltersOpen: boolean;
  setFiltersOpen: (isOpen: boolean) => void;
  toggleFilters: () => void;
};

type PersistedProductsListUiState = Pick<
  ProductsListUiState,
  'isFiltersOpen'
>;

export const useProductsListUiStore = create<ProductsListUiState>()(
  persist(
    (set) => ({
      isFiltersOpen: true,
      setFiltersOpen: (isOpen) => set({ isFiltersOpen: isOpen }),
      toggleFilters: () =>
        set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
    }),
    {
      name: 'products-list-ui-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedProductsListUiState => ({
        isFiltersOpen: state.isFiltersOpen,
      }),
      version: 1,
    },
  ),
);
