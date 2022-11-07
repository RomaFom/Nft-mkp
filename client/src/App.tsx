import { ethers } from 'ethers';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

import FloatingButton from '@/components/FloatingButton';
import SideBar from '@/components/SideBar';
import { Marketplace } from '@/contract-integration/marketplace';
import { DappContext, IDappCtx } from '@/DappContext';
import useWeb3 from '@/hooks/useWeb3';
import { IUser, UserContext, UserContextType } from '@/UserContext/UserContext';

import { User } from '../utils/api';
import { routes } from './routes';
function App(): React.ReactElement {
  const { account, owner, marketPlace, nft, web3Handler } = useWeb3();
  const [user, setUser] = React.useState<IUser | null>(null);

  const userCtx: UserContextType = {
    user,
    setUser,
  };

  const navigate = useNavigate();
  const dappCtxValues: IDappCtx = {
    nftContract: nft,
    marketplaceContract: marketPlace,
    wallet: account,
    owner: owner,
    web3Handler: web3Handler,
    Mkp: new Marketplace(marketPlace as ethers.Contract),
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_mkp');
    if (token) {
      User.getUserData(token)
        .then(res => {
          const { id, name, username, wallet } = res.data.user;
          if (!id) {
            localStorage.removeItem('auth_mkp');
            return;
          }

          setUser({ id, name, username, wallet, token });
          navigate('/');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  const renderRoutes = useRoutes(routes);
  const [isSideBarOpen, setSideBarOpen] = React.useState(false);

  return (
    <div className="App">
      <DappContext.Provider value={dappCtxValues}>
        <UserContext.Provider value={userCtx}>
          {/*<FloatingButton />*/}
          <SideBar
            isSideBarOpen={isSideBarOpen}
            setSideBarOpen={setSideBarOpen}
          />
          <main
            style={{
              marginLeft: isSideBarOpen ? '260px' : '72px',
              transition: '0.4s',
            }}
          >
            <FloatingButton />
            <Suspense
              fallback={<div className="centered-loader">Loading...</div>}
            >
              {renderRoutes}
            </Suspense>
          </main>
        </UserContext.Provider>
      </DappContext.Provider>
    </div>
  );
}

export default App;
