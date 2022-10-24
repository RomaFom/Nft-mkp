import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDapp } from "@/DappContext";
import { checkAddressEquality } from "../../utils/helpers";

interface Props {
  redirectPath?: string;
  children: ReactNode;
}

export const OwnerRoute: FC<Props> = ({ redirectPath = "/", children }) => {
  const { wallet, owner } = useDapp();
  const isOwner = checkAddressEquality(owner, wallet ? wallet : "");
  return !isOwner ? (
    <Navigate to={redirectPath} replace state={{ isRedirect: true }} />
  ) : (
    <>{children}</>
  );
};
