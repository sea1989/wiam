import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { useFormData } from '../context/FormDataContext';
import type { FormErrors } from '../types';

interface ResultSnapshot {
  firstName: string;
  lastName: string;
  amount: number;
  term: number;
}

const amountFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const LoanForm: React.FC = () => {
  const navigate = useNavigate();
  const { data, update, reset } = useFormData();

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultSnapshot, setResultSnapshot] = useState<ResultSnapshot | null>(null);

  useEffect(() => {
    if (!data.phone || !data.firstName || !data.lastName || !data.gender) {
      navigate('/personal', { replace: true });
    }
  }, [data.firstName, data.gender, data.lastName, data.phone, navigate]);

  useEffect(() => {
    if (!data.workplace || !data.address) {
      navigate('/address', { replace: true });
    }
  }, [data.address, data.workplace, navigate]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!data.amount) {
      newErrors.amount = 'Выберите сумму займа';
    }
    if (!data.term) {
      newErrors.term = 'Выберите срок займа';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `${data.firstName} ${data.lastName}` }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке заявки');
      }

      await response.json();
      setResultSnapshot({
        firstName: data.firstName,
        lastName: data.lastName,
        amount: data.amount,
        term: data.term,
      });
      setIsModalOpen(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Неизвестная ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setResultSnapshot(null);
    reset();
    navigate('/personal');
  };

  const formattedAmount = useMemo(() => amountFormatter.format(data.amount), [data.amount]);

  return (
    <>
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <div className="slider-field">
          <div className="slider-label">
            <span>Сумма займа</span>
            <span>{formattedAmount}</span>
          </div>
          <input
            type="range"
            min={200}
            max={1000}
            step={100}
            value={data.amount}
            onChange={(event) => update({ amount: Number(event.target.value) })}
          />
          {errors.amount && <span className="error">{errors.amount}</span>}
        </div>

        <div className="slider-field">
          <div className="slider-label">
            <span>Срок займа</span>
            <span>{data.term} дней</span>
          </div>
          <input
            type="range"
            min={10}
            max={30}
            step={1}
            value={data.term}
            onChange={(event) => update({ term: Number(event.target.value) })}
          />
          {errors.term && <span className="error">{errors.term}</span>}
        </div>

        {apiError && <span className="error">{apiError}</span>}

        <div className="button-row">
          <button className="secondary" type="button" onClick={() => navigate('/address')} disabled={isSubmitting}>
            Назад
          </button>
          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Подать заявку'}
          </button>
        </div>
      </form>

      {isModalOpen && resultSnapshot && (
        <Modal
          title="Заявка отправлена"
          message={
            <>
              Поздравляем, {resultSnapshot.lastName} {resultSnapshot.firstName}. Вам одобрена{' '}
              {amountFormatter.format(resultSnapshot.amount)} на {resultSnapshot.term} дней.
            </>
          }
          onClose={handleModalClose}
          actionLabel="Понятно"
        />
      )}
    </>
  );
};

export default LoanForm;
