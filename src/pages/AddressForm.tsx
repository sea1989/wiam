import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../context/FormDataContext';
import type { FormErrors } from '../types';

const AddressForm: React.FC = () => {
  const navigate = useNavigate();
  const { data, update, jobCategories, jobCategoriesStatus, jobCategoriesError, loadJobCategories } = useFormData();
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (jobCategoriesStatus === 'idle') {
      void loadJobCategories();
    }
  }, [jobCategoriesStatus, loadJobCategories]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!data.workplace.trim()) {
      newErrors.workplace = 'Выберите место работы';
    }
    if (!data.address.trim()) {
      newErrors.address = 'Укажите адрес проживания';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      navigate('/loan');
    }
  };

  const handleBack = () => {
    navigate('/personal');
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="workplace">Место работы</label>
        <select
          id="workplace"
          name="workplace"
          value={data.workplace}
          onChange={(event) => update({ workplace: event.target.value })}
          disabled={jobCategoriesStatus !== 'loaded'}
          required
        >
          <option value="">{jobCategoriesStatus === 'loading' ? 'Загрузка...' : 'Выберите значение'}</option>
          {jobCategories.map((category) => (
            <option key={category.slug} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {jobCategoriesStatus === 'error' && (
          <div className="error">
            {jobCategoriesError}
            <br />
            <button
              type="button"
              className="secondary"
              onClick={() => {
                void loadJobCategories();
              }}
            >
              Повторить попытку
            </button>
          </div>
        )}
        {errors.workplace && <span className="error">{errors.workplace}</span>}
      </div>

      <div className="field">
        <label htmlFor="address">Адрес проживания</label>
        <input
          id="address"
          name="address"
          type="text"
          value={data.address}
          onChange={(event) => update({ address: event.target.value })}
          required
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>

      <div className="button-row">
        <button className="secondary" type="button" onClick={handleBack}>
          Назад
        </button>
        <button className="primary" type="submit" disabled={jobCategoriesStatus !== 'loaded'}>
          Далее
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
