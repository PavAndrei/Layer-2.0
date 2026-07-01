import { CheckIcon } from '../../../shared/ui';
import type { AuthBenefitsContent } from '../model';

type AuthBenefitsProps = AuthBenefitsContent;

export const AuthBenefits = ({ items, title }: AuthBenefitsProps) => {
  return (
    <aside className="hidden h-full border-l border-border-strong pl-10 md:flex md:flex-col md:justify-center">
      <div className="max-w-sm space-y-6">
        <h2 className="heading-3 text-typography-heading">{title}</h2>

        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 block-medium text-typography-primary"
            >
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-primary text-accent-primary"
              >
                <CheckIcon className="size-4" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
