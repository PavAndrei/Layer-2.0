import { useMemo, useState } from 'react';

import { Button } from '../../../shared/ui';

type AdminReviewExpandableTextProps = {
  text: string;
};

const REVIEW_TEXT_PREVIEW_LENGTH = 240;

export const AdminReviewExpandableText = ({
  text,
}: AdminReviewExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = text.length > REVIEW_TEXT_PREVIEW_LENGTH;

  const previewText = useMemo(() => {
    if (!canExpand || isExpanded) return text;

    return `${text.slice(0, REVIEW_TEXT_PREVIEW_LENGTH).trimEnd()}...`;
  }, [canExpand, isExpanded, text]);

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="block-small text-typography-secondary">{previewText}</p>

      {canExpand && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Show less' : 'Read full review'}
        </Button>
      )}
    </div>
  );
};
