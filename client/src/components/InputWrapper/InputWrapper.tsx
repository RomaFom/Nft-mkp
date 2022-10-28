import React from 'react';

import styles from './InputWrapper.module.scss';
type Props = {
  children: React.ReactNode;
  labelId?: string;
  labelText?: string;
  labelActionButton?: React.ReactNode | null;
  tooltip?: React.ReactNode;
};
const InputFormField: React.FC<Props> = ({
  labelId,
  labelText,
  labelActionButton = null,
  children,
  tooltip,
}) => {
  return (
    <div className={styles.inputWrapper}>
      {labelId && (
        <span className="d-flex justify-content-between">
          <label className="d-block pb-2 d-flex" htmlFor={labelId}>
            {labelText} {tooltip}
          </label>
          {labelActionButton}
        </span>
      )}
      <div className="input-field d-block">{children}</div>
    </div>
  );
};
export default InputFormField;
