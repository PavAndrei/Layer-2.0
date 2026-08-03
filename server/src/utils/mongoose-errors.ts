export const isDuplicateKeyError = (error: unknown) => {
  return (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 11000
  );
};
