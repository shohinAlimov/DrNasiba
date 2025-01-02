import { FC, ReactNode } from 'react';

export interface IFormFieldProps {
  label: string;
  children: ReactNode;
  errorMessage?: string;
  className?: string;
}

export const FormField: FC<IFormFieldProps> = ({
  label,
  children,
  errorMessage,
}) => {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>

      {children}

      {errorMessage && (
        <span className="form-field__error">{errorMessage}</span>
      )}
    </label>
  );
};
