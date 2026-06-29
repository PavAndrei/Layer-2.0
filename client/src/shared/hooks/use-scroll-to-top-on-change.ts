import { useEffect, useRef } from 'react';

type UseScrollToTopOnChangeOptions = ScrollToOptions & {
  skipInitialScroll?: boolean;
};

export const useScrollToTopOnChange = (
  dependency: unknown,
  {
    behavior = 'smooth',
    left,
    skipInitialScroll = true,
    top = 0,
  }: UseScrollToTopOnChangeOptions = {},
) => {
  const isInitialRenderRef = useRef(true);
  const previousDependencyRef = useRef(dependency);

  useEffect(() => {
    const isInitialRender = isInitialRenderRef.current;
    const hasDependencyChanged = previousDependencyRef.current !== dependency;
    previousDependencyRef.current = dependency;

    if (isInitialRender) {
      isInitialRenderRef.current = false;

      if (skipInitialScroll) return;
    }

    if (!isInitialRender && !hasDependencyChanged) return;

    window.scrollTo({
      behavior,
      left,
      top,
    });
  }, [behavior, dependency, left, skipInitialScroll, top]);
};
