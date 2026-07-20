import { useSearchParams } from 'react-router';

import {
  DEFAULT_ADMIN_SECTION,
  isAdminSection,
  type AdminSection,
} from './admin-sections';

const getAdminSectionFromSearchParams = (
  searchParams: URLSearchParams,
): AdminSection => {
  const section = searchParams.get('section') ?? DEFAULT_ADMIN_SECTION;

  return isAdminSection(section) ? section : DEFAULT_ADMIN_SECTION;
};

export const useAdminPageState = () => {
  const [searchParams] = useSearchParams();

  return {
    activeSection: getAdminSectionFromSearchParams(searchParams),
  };
};
