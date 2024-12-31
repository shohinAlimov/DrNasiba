import { FC, MouseEventHandler } from 'react';

import './Button.css';
import { Loader } from '../Loader/Loader';

export interface IButtonProps {
  title: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const Button: FC<IButtonProps> = ({
  type,
  title,
  onClick,
  isLoading,
  isDisabled,
  variant = '',
  size = '',
}) => {
  const classNames = `btn button ${variant && `button--${variant}`} ${size && `button--${size}`}`.trim();

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
