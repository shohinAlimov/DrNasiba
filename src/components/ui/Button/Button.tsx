import { FC, MouseEventHandler } from 'react';

import { Loader } from '../Loader/Loader';

export interface IButtonProps {
  title: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string; // Allow passing additional classes
}

export const Button: FC<IButtonProps> = ({
  type,
  title,
  onClick,
  isLoading,
  isDisabled,
  variant = '',
  size = '',
  className = '', // Default to an empty string
}) => {
  // Merge custom className with existing class logic
  const classNames = `btn ${variant && `btn--${variant}`}${size && `btn--${size}`} ${className}`.trim();

  return (
    <button
      className={classNames}
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
    >
      {isLoading ? <Loader /> : title}
    </button>
  );
};
