import { Button, ButtonGroup, Flex, HStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import { useDapp } from '@/DappContext';
import { RoutePaths } from '@/routes';
import { useUser } from '@/UserContext/UserContext';

import { checkAddressEquality, cropAddress } from '../../../utils/helpers';

const Navbar: React.FC = () => {
  const { wallet, owner, web3Handler } = useDapp();
  // const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { user, setUser } = useUser();

  return (
    // <Container py={{ base: '4', lg: '5' }}>
    <div
      style={{ paddingTop: '20px', paddingLeft: '50px', paddingRight: '50px' }}
    >
      <HStack spacing="10" justify="space-between">
        <Flex style={{ width: '80%' }} justify="space-between" flex="1">
          <ButtonGroup variant="link" spacing="8">
            <Button key={'Home'}>
              <Link to={RoutePaths.HOME}>Home</Link>
            </Button>
            {!user && (
              <>
                <Button key={'Login'}>
                  <Link to={RoutePaths.LOGIN}>Login</Link>
                </Button>
                <Button key={'Sign Up'}>
                  <Link to={RoutePaths.SIGN_UP}>Sign Up</Link>
                </Button>
              </>
            )}
            {user && (
              <>
                {wallet && checkAddressEquality(owner, wallet ? wallet : '') && (
                  <Button key={'Create'}>
                    <Link to={RoutePaths.CREATE}>Create</Link>
                  </Button>
                )}
                <Button key={'Listings'}>
                  <Link to={RoutePaths.MY_LISTINGS}>My Listings</Link>
                </Button>
                <Button key={'Purchase'}>
                  <Link to={RoutePaths.MY_PURCHASES}>My NFT&apos;s</Link>
                </Button>
              </>
            )}
          </ButtonGroup>
          <HStack spacing="3">
            {user && !wallet ? (
              <Button
                onClick={web3Handler}
                colorScheme="teal"
                variant="outline"
              >
                Connect Wallet
              </Button>
            ) : (
              <p>{cropAddress(wallet, 10)}</p>
            )}
            {user && (
              <Button
                colorScheme="whiteAlpha"
                onClick={() => {
                  localStorage.removeItem('auth_mkp');
                  setUser(null);
                  // console.log('logout');
                }}
              >
                Logout
              </Button>
            )}
          </HStack>
        </Flex>
      </HStack>
    </div>
    // </Container>
  );
};

export default Navbar;
