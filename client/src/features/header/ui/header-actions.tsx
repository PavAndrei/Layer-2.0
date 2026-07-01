import {
  BurgerMenuIcon,
  FavoriteIcon,
  UserIcon,
} from './header-icons';
import { HeaderCartButton } from './header-cart-button';

type HeaderActionsProps = {
  cartItemsCount: number;
  isMobileMenuOpen: boolean;
  onMobileMenuOpen: () => void;
};

const ICON_BUTTON_CLASS_NAME =
  'transition-colors hover:text-accent-hover cursor-pointer';

export const HeaderActions = ({
  cartItemsCount,
  isMobileMenuOpen,
  onMobileMenuOpen,
}: HeaderActionsProps) => {
  return (
    <div className="flex items-center gap-5 text-typography-heading order-3 sm:order-2 lg:order-3">
      <button
        type="button"
        className={ICON_BUTTON_CLASS_NAME}
        aria-label="User profile"
      >
        <UserIcon size={24} />
      </button>

      <button
        type="button"
        className={ICON_BUTTON_CLASS_NAME}
        aria-label="Favorites"
      >
        <FavoriteIcon size={24} />
      </button>

      <HeaderCartButton
        itemsCount={cartItemsCount}
        className={ICON_BUTTON_CLASS_NAME}
      />

      <button
        type="button"
        className={`${ICON_BUTTON_CLASS_NAME} block sm:hidden`}
        aria-label="Open menu"
        aria-expanded={isMobileMenuOpen}
        onClick={onMobileMenuOpen}
      >
        <BurgerMenuIcon size={24} />
      </button>
    </div>
  );
};
