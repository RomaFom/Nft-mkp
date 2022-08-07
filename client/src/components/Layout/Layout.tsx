import React from "react";
import Navbar from "@/components/Navbar";

type LayoutProps = {
  account: string | null;
  owner: string;
  children: React.ReactNode;
  web3Handler: () => void;
};
export const Layout: React.FC<LayoutProps> = ({
  children,
  web3Handler,
  account,
  owner,
}) => {
  return (
    <>
      <Navbar web3Handler={web3Handler} account={account} owner={owner} />
      {children}
    </>
  );
};

// export Layout;
