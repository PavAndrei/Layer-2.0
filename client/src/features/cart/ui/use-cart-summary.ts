import { useState } from 'react';

type UseCartSummaryParams = {
  onClearCart: () => void;
};

export const useCartSummary = ({ onClearCart }: UseCartSummaryParams) => {
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const closeClearConfirm = () => {
    setIsClearConfirmOpen(false);
  };

  const openClearConfirm = () => {
    setIsClearConfirmOpen(true);
  };

  const handleClearCart = () => {
    onClearCart();
    closeClearConfirm();
  };

  return {
    closeClearConfirm,
    handleClearCart,
    isClearConfirmOpen,
    openClearConfirm,
  };
};
