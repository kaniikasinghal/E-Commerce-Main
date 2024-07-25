import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStateOrAny } from "react-redux";
import Header from "./Utilities/NavBar/navbar";

interface Props {
  Component: React.ComponentType;
  route: string;
}

export const WithHeader: React.FC<Props> = (props) => {
  return (
    <>
      <div className="main-box">
        <Header />
        <div className="common-box">
          <PrivateRoutes {...props} />
        </div>
      </div>
    </>
  );
};

function PrivateRoutes(props: any) {
  const { Component, route } = props;
  const isLogin = useSelector((state: any) => state.AuthReducer.isLoggedIn);
  const isAdmin = useSelector(
    (state: RootStateOrAny) => state.AuthReducer.authData.isAdmin
  );
  const token = localStorage.getItem("verifyToken");


  const beforeLoginRoutes = ["/login", "/signup", "/"];
  


  if (token) {
    if (beforeLoginRoutes.includes(route) && isAdmin) {
      return <Navigate to={"/admin-dashboard"} />;
    } else if (beforeLoginRoutes.includes(route) && !isAdmin && isLogin) {
      return <Navigate to={"/user-dashboard"} />;
    } else {
      return <Component />;
    }
  } else {
    if (beforeLoginRoutes.includes(route)) {
      return <Component />;
    } else {
      return <Navigate to={"/login"} />;
    }
  }
}

export default PrivateRoutes;
