import React from 'react';

import styles from './Tooltip.module.scss';
type Props = {
  text: string;
  children: React.ReactNode;
  className?: string;
  handleClick?: () => Promise<void> | void;
};
import cn from 'classnames';
const Tooltip: React.FC<Props> = ({
  text,
  children,
  className,
  handleClick,
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={styles.tooltip} onClick={handleClick}>
      {children}
      <span
        className={cn(
          styles.tooltiptext,
          className && styles[`tooltiptext-${className}`],
        )}
      >
        {text}
      </span>
    </div>
  );
};
export default Tooltip;
