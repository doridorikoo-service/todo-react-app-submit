export const NO_DUE_DATE_LABEL = '기간없음';

export function formatDueDateLabel(dueDate) {
  return dueDate?.trim() ? dueDate : NO_DUE_DATE_LABEL;
}
