export type Gender = 'Мужской' | 'Женский';

export interface PersonalData {
  phone: string;
  firstName: string;
  lastName: string;
  gender: Gender | '';
}

export interface AddressData {
  workplace: string;
  address: string;
}

export interface LoanData {
  amount: number;
  term: number;
}

export interface FormState extends PersonalData, AddressData, LoanData {}

export interface FormErrors {
  [key: string]: string | undefined;
}
