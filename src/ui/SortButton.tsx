import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

import { ReactComponent as SortName } from '../assets/sortName.svg';
import { SortFields } from '../type/user.interface';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  sortFunc: (field: SortFields) => void;
  field: SortFields;
}

const SortButton: FC<PropsWithChildren<Props>> = ({
  children,
  sortFunc,
  field,
  ...atr
}) => {
  return (
    <>
      <button
        {...atr}
        type="button"
        className="flex gap-2 items-center hover:shadow-lg transition-all rounded-sm"
        onClick={() => sortFunc(field)}
      >
        {children}
        <SortName />
      </button>
    </>
  );
};

export default SortButton;
