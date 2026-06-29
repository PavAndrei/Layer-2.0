import { Button } from '../../../shared/ui';

type CartQuantityControlProps = {
  quantity: number;
  canDecrease: boolean;
  canIncrease: boolean;
  stockMessage: string;
  onDecrease: () => void;
  onIncrease: () => void;
};

export const CartQuantityControl = ({
  quantity,
  canDecrease,
  canIncrease,
  stockMessage,
  onDecrease,
  onIncrease,
}: CartQuantityControlProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="secondary"
          disabled={!canDecrease}
          aria-label="Decrease quantity"
          onClick={onDecrease}
        >
          -
        </Button>
        <span className="block-medium min-w-8 text-center text-typography-heading">
          {quantity}
        </span>
        <Button
          size="icon"
          variant="secondary"
          disabled={!canIncrease}
          aria-label="Increase quantity"
          onClick={onIncrease}
        >
          +
        </Button>
      </div>
      <span className="block-small text-typography-secondary">
        {stockMessage}
      </span>
    </div>
  );
};
