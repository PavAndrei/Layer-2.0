import { useCallback, useMemo } from 'react';
import type { SetStateAction } from 'react';
import { useSearchParams } from 'react-router';

type UrlStateParam<Value> = {
  parse: (searchParams: URLSearchParams) => Value;
  serialize: (searchParams: URLSearchParams, value: Value) => void;
};

type UrlStateSchema<State> = {
  [Key in keyof State]: UrlStateParam<State[Key]>;
};

type UseUrlStateOptions = {
  replace?: boolean;
};

type SetUrlStateOptions = {
  replace?: boolean;
};

export type UrlStateSetter<State> = (
  value: SetStateAction<State>,
  options?: SetUrlStateOptions,
) => void;

const isNilOrEmpty = (value: string | null | undefined) => {
  return value === null || value === undefined || value === '';
};

export const stringParam = ({
  name,
  defaultValue = '',
}: {
  name: string;
  defaultValue?: string;
}): UrlStateParam<string> => ({
  parse: (searchParams) => searchParams.get(name) ?? defaultValue,
  serialize: (searchParams, value) => {
    if (value === defaultValue) {
      searchParams.delete(name);
      return;
    }

    searchParams.set(name, value);
  },
});

export const numberParam = ({
  name,
  defaultValue,
  validate = Number.isFinite,
}: {
  name: string;
  defaultValue: number;
  validate?: (value: number) => boolean;
}): UrlStateParam<number> => ({
  parse: (searchParams) => {
    const value = Number(searchParams.get(name));

    return validate(value) ? value : defaultValue;
  },
  serialize: (searchParams, value) => {
    if (value === defaultValue) {
      searchParams.delete(name);
      return;
    }

    searchParams.set(name, String(value));
  },
});

export const booleanParam = ({
  name,
  defaultValue = false,
}: {
  name: string;
  defaultValue?: boolean;
}): UrlStateParam<boolean> => ({
  parse: (searchParams) => {
    const value = searchParams.get(name);

    if (isNilOrEmpty(value)) return defaultValue;

    return value === 'true';
  },
  serialize: (searchParams, value) => {
    if (value === defaultValue) {
      searchParams.delete(name);
      return;
    }

    searchParams.set(name, String(value));
  },
});

export const arrayParam = <Value extends string>({
  name,
  defaultValue = [],
  allowedValues,
}: {
  name: string;
  defaultValue?: Value[];
  allowedValues?: readonly Value[];
}): UrlStateParam<Value[]> => ({
  parse: (searchParams) => {
    const value = searchParams.get(name);

    if (isNilOrEmpty(value)) return defaultValue;

    const values = value.split(',') as Value[];

    if (!allowedValues) return values;

    return values.filter((item) => allowedValues.includes(item));
  },
  serialize: (searchParams, value) => {
    if (value.length === 0) {
      searchParams.delete(name);
      return;
    }

    searchParams.set(name, value.join(','));
  },
});

export const customParam = <Value>(
  param: UrlStateParam<Value>,
): UrlStateParam<Value> => param;

export const parseUrlState = <State>(
  searchParams: URLSearchParams,
  schema: UrlStateSchema<State>,
): State => {
  return Object.entries(schema).reduce((state, [key, param]) => {
    return {
      ...state,
      [key]: (param as UrlStateParam<State[keyof State]>).parse(searchParams),
    };
  }, {} as State);
};

export const buildUrlStateSearchParams = <State>(
  state: State,
  schema: UrlStateSchema<State>,
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  Object.entries(schema).forEach(([key, param]) => {
    (param as UrlStateParam<State[keyof State]>).serialize(
      searchParams,
      state[key as keyof State],
    );
  });

  return searchParams;
};

export const useUrlState = <State>(
  schema: UrlStateSchema<State>,
  options: UseUrlStateOptions = {},
): [State, UrlStateSetter<State>] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(
    () => parseUrlState(searchParams, schema),
    [searchParams, schema],
  );

  const setState = useCallback<UrlStateSetter<State>>(
    (value, updateOptions) => {
      const nextState =
        typeof value === 'function'
          ? (value as (previousState: State) => State)(state)
          : value;
      const nextSearchParams = buildUrlStateSearchParams(nextState, schema);

      if (nextSearchParams.toString() === searchParams.toString()) {
        return;
      }

      setSearchParams(nextSearchParams, {
        replace: updateOptions?.replace ?? options.replace,
      });
    },
    [options.replace, schema, searchParams, setSearchParams, state],
  );

  return [state, setState];
};
