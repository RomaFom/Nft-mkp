import cn from 'classnames';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import {
  AiOutlineClear,
  AiOutlineClose,
  AiOutlineFire,
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import { RiVoiceprintFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { useDapp } from '@/DappContext';
import { RoutePaths } from '@/routes';
import { useUser } from '@/UserContext/UserContext';

import { checkAddressEquality } from '../../../utils/helpers';
import styles from './SideBar.module.scss';

type Props = {
  isSideBarOpen: boolean;
  setSideBarOpen: Dispatch<SetStateAction<boolean>>;
};

const SideBar: React.FC<Props> = ({ setSideBarOpen, isSideBarOpen }) => {
  const { wallet, owner, web3Handler } = useDapp();
  // const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { user, setUser } = useUser();
  return (
    <aside className={cn(styles.sidebar, isSideBarOpen && styles.open)}>
      <div className={styles['sidebar-inner']}>
        <header className={styles['sidebar-header']}>
          <button
            type="button"
            className={styles['sidebar-burger']}
            onClick={() => {
              setSideBarOpen(prev => !prev);
            }}
          >
            {isSideBarOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
          {/*<AiOutlineHome className={styles['sidebar-logo']} />*/}
          {/*<img src="./assets/blocklord-logo.png" className="sidebar-logo" />*/}
        </header>
        <nav className={styles['sidebar-nav']}>
          <Link to={RoutePaths.HOME}>
            <button type="button">
              <AiOutlineHome className={styles.image} />
              <span className={cn(isSideBarOpen && styles.show)}>Home</span>
            </button>
          </Link>

          {!user && (
            <>
              <Link to={RoutePaths.LOGIN}>
                <button type="button">
                  <AiOutlineLogin className={styles.image} />
                  <span className={cn(isSideBarOpen && styles.show)}>
                    Login
                  </span>
                </button>
              </Link>
              <Link to={RoutePaths.SIGN_UP}>
                <button type="button">
                  <AiOutlineUserAdd className={styles.image} />
                  <span className={cn(isSideBarOpen && styles.show)}>
                    Sign Up
                  </span>
                </button>
              </Link>
            </>
          )}

          {user && (
            <>
              {wallet && checkAddressEquality(owner, wallet ? wallet : '') && (
                <Link to={RoutePaths.CREATE}>
                  <button type="button">
                    <RiVoiceprintFill className={styles.image} />
                    <span className={cn(isSideBarOpen && styles.show)}>
                      Create
                    </span>
                  </button>
                </Link>
              )}
              <Link to={RoutePaths.MY_LISTINGS}>
                <button type="button">
                  <AiOutlineFire className={styles.image} />
                  <span className={cn(isSideBarOpen && styles.show)}>
                    My Listings
                  </span>
                </button>
              </Link>
              <Link to={RoutePaths.MY_PURCHASES}>
                <button type="button">
                  <AiOutlineClear className={styles.image} />
                  <span className={cn(isSideBarOpen && styles.show)}>
                    My Purchases
                  </span>
                </button>
              </Link>
            </>
          )}
        </nav>
        <footer className={styles['sidebar-footer']}>
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem('auth_mkp');
                setUser(null);
              }}
              type="button"
            >
              <AiOutlineLogout className={styles.image} />
              <span className={cn(isSideBarOpen && styles.show)}>Logout</span>
            </button>
          )}
        </footer>
      </div>
    </aside>
  );
};
export default SideBar;
