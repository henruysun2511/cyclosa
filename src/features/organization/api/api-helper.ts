export function toBackendPaginationParams<T extends { page?: number }>(
  params: T
): Record<string, unknown> {
  const { page, ...rest } = params;
  return {
    ...rest,
    page: page !== undefined && page > 0 ? page - 1 : 0,
  };
}

