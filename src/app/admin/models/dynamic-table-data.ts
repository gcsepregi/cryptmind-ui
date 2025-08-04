export interface DynamicTableData<T> {
  data: T[];
  total: number;
  pageSize: number;
  pageIndex: number;
}
