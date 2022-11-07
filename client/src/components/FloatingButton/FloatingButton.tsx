import { Button, useToast } from '@chakra-ui/react';
import cn from 'classnames';
import React from 'react';
import { RiWalletLine } from 'react-icons/ri';

import Tooltip from '@/components/Tooltip';
import { useDapp } from '@/DappContext';
import useCopyClipboard from '@/hooks/useCopyClipboard';
import { useUser } from '@/UserContext/UserContext';

import { cropAddress } from '../../../utils/helpers';
import styles from './FloatingButton.module.scss';
const FloatingButton: React.FC = () => {
  const { wallet, web3Handler } = useDapp();
  const { user } = useUser();

  const [_, copy] = useCopyClipboard();
  const toast = useToast();
  const handleClick = async (): Promise<void> => {
    const isCopied = await copy(wallet);
    if (isCopied) {
      toast({
        title: 'Address copied',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    user && (
      <div className={cn(styles.float)}>
        {!wallet && (
          <div className={styles.myFloat}>
            <Tooltip
              handleClick={web3Handler}
              className={'addressFloat'}
              text={"Let's connect your wallet"}
            >
              <RiWalletLine />
            </Tooltip>
          </div>
        )}

        {wallet && (
          <div className={styles.myFloat}>
            <Tooltip
              handleClick={handleClick}
              className={'addressFloat'}
              text={cropAddress(wallet, 10)}
            >
              <RiWalletLine />
            </Tooltip>
          </div>
        )}
      </div>
    )
    // </Container>
  );
};

export default FloatingButton;
