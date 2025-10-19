import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../context/FormDataContext';
import type { FormErrors, Gender } from '../types';

const phonePattern = /^0\d{3} \d{3} \d{3}$/;

const formatPhone = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
  if (!digitsOnly) {
    return '';
  }

  const normalized = digitsOnly[0] === '0' ? digitsOnly : `0${digitsOnly}`.slice(0, 10);
  const parts = [
    normalized.slice(0, Math.min(4, normalized.length)),
    normalized.slice(4, Math.min(7, normalized.length)),
    normalized.slice(7, Math.min(10, normalized.length)),
  ];

  return parts.filter(Boolean).join(' ');
};

const PersonalForm: React.FC = () => {
  const navigate = useNavigate();
  const { data, update } = useFormData();
  const [errors, setErrors] = useState<FormErrors>({});

  const firstStepData = useMemo(
    () => ({
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
    }),
    [data.firstName, data.gender, data.lastName, data.phone]
  );

  const handleChange = (field: 'phone' | 'firstName' | 'lastName', value: string) => {
    if (field === 'phone') {
      const formatted = formatPhone(value);
      update({ phone: formatted });
    } else {
      update({ [field]: value } as Partial<typeof firstStepData>);
    }
  };

  const handleGenderChange = (value: Gender | '') => {
    update({ gender: value });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstStepData.phone || !phonePattern.test(firstStepData.phone)) {
      newErrors.phone = 'Введите телефон в формате 0XXX XXX XXX';
    }
    if (!firstStepData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }
    if (!firstStepData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }
    if (!firstStepData.gender) {
      newErrors.gender = 'Выберите пол';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      navigate('/address');
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="phone">Телефон</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="0XXX XXX XXX"
          value={firstStepData.phone}
          onChange={(event) => handleChange('phone', event.target.value)}
          required
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div className="field">
        <label htmlFor="firstName">Имя</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={firstStepData.firstName}
          onChange={(event) => handleChange('firstName', event.target.value)}
          required
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </div>

      <div className="field">
        <label htmlFor="lastName">Фамилия</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={firstStepData.lastName}
          onChange={(event) => handleChange('lastName', event.target.value)}
          required
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}
      </div>

      <div className="field">
        <label htmlFor="gender">Пол</label>
        <select
          id="gender"
          name="gender"
          value={firstStepData.gender}
          onChange={(event) => handleGenderChange(event.target.value as Gender | '')}
          required
        >
          <option value="">Выберите значение</option>
          <option value="Мужской">Мужской</option>
          <option value="Женский">Женский</option>
        </select>
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>

      <div className="button-row">
        <span />
        <button className="primary" type="submit">
          Далее
        </button>
      </div>
    </form>
  );
};

export default PersonalForm;
