import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { FormDataProvider } from './context/FormDataContext';
import PersonalForm from './pages/PersonalForm';
import AddressForm from './pages/AddressForm';
import LoanForm from './pages/LoanForm';

const steps = [
  { path: '/personal', label: 'Шаг 1 · Личные данные' },
  { path: '/address', label: 'Шаг 2 · Адрес и работа' },
  { path: '/loan', label: 'Шаг 3 · Параметры займа' },
];

const AppLayout: React.FC = () => {
  const location = useLocation();
  const currentStepIndex = Math.max(
    steps.findIndex((step) => location.pathname.startsWith(step.path)),
    0
  );

  return (
    <div className="app-shell">
      <div className="progress">{steps[currentStepIndex]?.label}</div>
      <main className="card">
        <Routes>
          <Route path="/" element={<Navigate to="/personal" replace />} />
          <Route path="/personal" element={<PersonalForm />} />
          <Route path="/address" element={<AddressForm />} />
          <Route path="/loan" element={<LoanForm />} />
          <Route path="*" element={<Navigate to="/personal" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <FormDataProvider>
    <AppLayout />
  </FormDataProvider>
);

export default App;
