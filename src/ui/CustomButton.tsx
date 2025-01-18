import classNames from 'classnames';
import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  styleBtn: 'delete' | 'cancel' | 'save';
}

const CustomButton: FC<PropsWithChildren<Props>> = ({
  children,
  styleBtn,
  ...atr
}) => {
  return (
    <button
      type="button"
      {...atr}
      className={classNames('px-10 py-2 rounded-md', {
        'bg-red-500  text-white': styleBtn === 'delete',
        'bg-red-400': styleBtn === 'cancel',
        'bg-blue-300': styleBtn === 'save',
      })}
    >
      {children}
    </button>
  );
};

export default CustomButton;
