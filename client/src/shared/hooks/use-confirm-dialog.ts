import { useState } from 'react';

export const useConfirmDialog = <Payload>() => {
  const [payload, setPayload] = useState<Payload | null>(null);

  return {
    close: () => setPayload(null),
    isOpen: payload !== null,
    open: (nextPayload: Payload) => setPayload(nextPayload),
    payload,
  };
};
