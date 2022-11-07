import cn from 'classnames';
import React, { useRef } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import ReactPortal from '@/components/ReactPortal';
import useOnClickOutside from '@/hooks/useOnClickOutside';

import styles from './Modal.module.scss';
type Props = {
  children: React.ReactNode;
  show: boolean;
  setShow: (value: boolean) => void;
  title?: string;
};

const Modal: React.FC<Props> = ({ children, show, setShow, title }) => {
  const nodeRef = useRef(null);

  const handleClickOutside = (): void => setShow(false);

  useOnClickOutside(nodeRef, handleClickOutside);

  return show ? (
    <ReactPortal wrapperId={'modal-root'}>
      <>
        <div className={cn(styles['modal-body'], show && styles.open)}>
          <div className={styles.background} />
          <div className={cn(styles.modal)} ref={nodeRef}>
            <div className={styles['modal-content']}>
              <div className={styles.closeBtn}>
                <RiCloseLine
                  className={styles.closeIcon}
                  onClick={() => setShow(false)}
                />
              </div>
              {title && <div className={styles.title}>{title}</div>}
              {children}
            </div>
            {/*<div className="modal-content">{children}</div>*/}
          </div>
        </div>
      </>
    </ReactPortal>
  ) : null;
};

export default Modal;
