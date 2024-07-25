import SignupModal from "./components/Auth/SignUp/signup";
import { Routes, Route } from "react-router-dom";
import { useSelector, RootStateOrAny } from "react-redux";
import PrivateRoutes from "./private_routes";
import { WithHeader } from "./private_routes";
import HomePage from "./components/Views.ts/homepage"
import NotFound from "./components/Error.tsx/not_found";
import './App.css'
import LoginModel from "./components/Auth/Login/login_page";
import Profile from "./components/Views.ts/User_Profile/user_profile";
import UserDashboard from "./components/Views.ts/User_Dashboard/DashboardUser";
import AdminDashboard from "./components/Views.ts/Admin_Dashboard/admin_dash";
import AllProduct from "./components/Admin_Func/all_product";
import AddProduct from "./components/Admin_Func/add_product";
import { RoutesPath } from "./Constants/routes_constants";
import AddCategory from "./components/Admin_Func/add_category";
import Cart from "./components/users/CartAndWishlist/Cart/Cart";
import BuyPrdct from "./components/users/Buy/buy_product";
import Wishlist from "./components/users/CartAndWishlist/WishList/wish_list";
import LandingPage from "./components/Views.ts/homepage";
import Userlist from "./components/Views.ts/User_List/userL_lst";

function PublicRoutes() {
  
  const isAdmin = useSelector((state: RootStateOrAny) => state.AuthReducer.authData.isAdmin);
  
  return (
    <div className="App">
      <Routes>
        <Route
          path={RoutesPath.LANDINGPAGE}
          element={
            <PrivateRoutes Component={LandingPage} route={RoutesPath.LANDINGPAGE}
            />
          }
        />
        <Route
          path={RoutesPath.SIGNUP}
          element={ 
            <PrivateRoutes Component={SignupModal} route={RoutesPath.SIGNUP} />
          }
        />
        <Route
          path={RoutesPath.LOGIN}
          element={
            <PrivateRoutes Component={LoginModel} route={RoutesPath.LOGIN} />
          }
        />
        <Route
          path={RoutesPath.USERDASHBOARD}
          element={ isAdmin===false?(
            <WithHeader Component={UserDashboard} route={RoutesPath.USERDASHBOARD}/>):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
        <Route
          path={RoutesPath.CART}
          element={ isAdmin===false?(
            <WithHeader Component={Cart} route={RoutesPath.CART}/>):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
        <Route
          path={RoutesPath.BUY}
          element={ isAdmin===false?(
            <WithHeader Component={BuyPrdct} route={RoutesPath.BUY}/>):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
        <Route
          path={RoutesPath.WISHLIST}
          element={ isAdmin===false?(
            <WithHeader Component={Wishlist} route={RoutesPath.WISHLIST}/>):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
        <Route
          path={RoutesPath.USERPROFILE}
          element={ isAdmin===false ?(
            <WithHeader Component={Profile} route={RoutesPath.USERPROFILE} />):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
        <Route
          path={RoutesPath.ADMINDASHBOARD}
          element={ isAdmin?(
            <WithHeader Component={AdminDashboard} route={RoutesPath.ADMINDASHBOARD}/>):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
        <Route
          path={RoutesPath.ALLPRODUCT}
          element={ isAdmin?(
            <WithHeader Component={AllProduct} route={RoutesPath.ALLPRODUCT} />):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
        <Route
          path={RoutesPath.ADDPRODUCT}
          element={ isAdmin?(
            <WithHeader Component={AddProduct} route={RoutesPath.ADDPRODUCT} />):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
        <Route
          path={RoutesPath.ADDCATEGORY}
          element={ isAdmin?(
            <WithHeader Component={AddCategory} route={RoutesPath.ADDCATEGORY} />):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
          <Route
          path={RoutesPath.SEEUSERLIST}
          element={ isAdmin?(
            <WithHeader Component={Userlist} route={RoutesPath.SEEUSERLIST} />):(
              <WithHeader Component={NotFound} route={RoutesPath.UNAUTHORIZED}/>
            )
          }
        />
      </Routes>
    </div>
  );
}

export default PublicRoutes;
