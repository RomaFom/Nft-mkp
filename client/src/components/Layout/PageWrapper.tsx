import React from 'react';

import styles from './PageWrapper.module.scss';
type Props = {
  children: React.ReactNode;
};

const PageWrapper: React.FC<Props> = ({ children }) => {
  return <div className={styles.pageWrapper}>{children}</div>;
};
export default PageWrapper;
