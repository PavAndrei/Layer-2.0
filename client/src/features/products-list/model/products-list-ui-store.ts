import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ProductsListUiState = {
  isDesktopFiltersOpen: boolean;
  isMobileFiltersOpen: boolean;
  closeMobileFilters: () => void;
  openMobileFilters: () => void;
  setDesktopFiltersOpen: (isOpen: boolean) => void;
  toggleDesktopFilters: () => void;
  toggleMobileFilters: () => void;
};

type PersistedProductsListUiState = Pick<
  ProductsListUiState,
  'isDesktopFiltersOpen'
>;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const useProductsListUiStore = create<ProductsListUiState>()(
  persist(
    (set) => ({
      isDesktopFiltersOpen: true,
      isMobileFiltersOpen: false,
      closeMobileFilters: () => set({ isMobileFiltersOpen: false }),
      openMobileFilters: () => set({ isMobileFiltersOpen: true }),
      setDesktopFiltersOpen: (isOpen) =>
        set({ isDesktopFiltersOpen: isOpen }),
      toggleDesktopFilters: () =>
        set((state) => ({
          isDesktopFiltersOpen: !state.isDesktopFiltersOpen,
        })),
      toggleMobileFilters: () =>
        set((state) => ({
          isMobileFiltersOpen: !state.isMobileFiltersOpen,
        })),
    }),
    {
      name: 'products-list-ui-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedProductsListUiState => ({
        isDesktopFiltersOpen: state.isDesktopFiltersOpen,
      }),
      migrate: (persistedState): PersistedProductsListUiState => {
        if (!isRecord(persistedState)) {
          return {
            isDesktopFiltersOpen: true,
          };
        }

        if (typeof persistedState.isDesktopFiltersOpen === 'boolean') {
          return {
            isDesktopFiltersOpen: persistedState.isDesktopFiltersOpen,
          };
        }

        if (typeof persistedState.isFiltersOpen === 'boolean') {
          return {
            isDesktopFiltersOpen: persistedState.isFiltersOpen,
          };
        }

        return {
          isDesktopFiltersOpen: true,
        };
      },
      version: 2,
    },
  ),
);
