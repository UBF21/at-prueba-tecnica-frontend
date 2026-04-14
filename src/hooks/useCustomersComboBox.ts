import { useQuery } from '@tanstack/react-query';
import { getCustomersComboBox } from '../api/customers';

/**
 * Hook to fetch customers as a combobox list.
 * Used for dropdowns and select fields.
 */
export function useCustomersComboBox() {
  return useQuery({
    queryKey: ['customers-combobox'],
    queryFn: async () => {
      const response = await getCustomersComboBox();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch customers');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
