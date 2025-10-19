import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { FormState } from '../types';

// Добавляем интерфейс для категорий
interface JobCategory {
  slug: string;
  name: string;
  // добавьте другие поля, которые возвращает API
}

interface FormDataContextValue {
  data: FormState;
  update: (values: Partial<FormState>) => void;
  reset: () => void;
  jobCategories: JobCategory[];
  jobCategoriesStatus: 'idle' | 'loading' | 'loaded' | 'error';
  jobCategoriesError: string | null;
  loadJobCategories: () => Promise<void>;
}

const defaultState: FormState = {
  phone: '',
  firstName: '',
  lastName: '',
  gender: '',
  workplace: '',
  address: '',
  amount: 200,
  term: 10,
};

const FormDataContext = createContext<FormDataContextValue | undefined>(undefined);

export const FormDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<FormState>(defaultState);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [jobCategoriesStatus, setJobCategoriesStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [jobCategoriesError, setJobCategoriesError] = useState<string | null>(null);

  const update = useCallback((values: Partial<FormState>) => {
    setData((prev) => ({ ...prev, ...values }));
  }, []);

  const reset = useCallback(() => {
    setData(defaultState);
  }, []);

  const loadJobCategories = useCallback(async () => {
    if (jobCategoriesStatus === 'loading' || jobCategoriesStatus === 'loaded') {
      return;
    }

    setJobCategoriesStatus('loading');

    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      if (!response.ok) {
        throw new Error('Не удалось получить список категорий');
      }
      const result = (await response.json()) as JobCategory[];
      setJobCategories(result);
      setJobCategoriesError(null);
      setJobCategoriesStatus('loaded');
    } catch (error) {
      setJobCategoriesError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      setJobCategoriesStatus('error');
    }
  }, [jobCategoriesStatus]);

  const value = useMemo<FormDataContextValue>(
    () => ({
      data,
      update,
      reset,
      jobCategories,
      jobCategoriesStatus,
      jobCategoriesError,
      loadJobCategories,
    }),
    [data, jobCategories, jobCategoriesStatus, jobCategoriesError, loadJobCategories, update, reset]
  );

  return <FormDataContext.Provider value={value}>{children}</FormDataContext.Provider>;
};

export const useFormData = (): FormDataContextValue => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData должен использоваться внутри FormDataProvider');
  }
  return context;
};
