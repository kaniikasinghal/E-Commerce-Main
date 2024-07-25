import {  Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../State_Management.ts/Actions/auth_actions";
import { NavLink, useNavigate } from "react-router-dom";
import { RootStateOrAny } from "react-redux";
import './navbar.css';

function Header() {

  const isAdmin = useSelector(
    (state: RootStateOrAny) => state.AuthReducer.authData.isAdmin
  );
  const isLoggedIn = useSelector(
    (state: RootStateOrAny) => state.AuthReducer.isLoggedIn
  );


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
        <Nav className="navbar">
          {isAdmin && isLoggedIn ? (
            <>
              <NavLink to="/admin-dashboard" className="active-item">Dashboard</NavLink>

              <NavLink to="/all-product" className="active-item">All-Products</NavLink>

              <NavLink to="/user-list" className="active-item">User-List</NavLink>

              <NavLink to="/product-add" className="active-item">Add-Products</NavLink>

              <NavLink to="/category-add" className="active-item">Add-Category</NavLink>

              <NavLink to="/admin-profile" className="active-item">Admin-Profile</NavLink>

              <NavLink to="/signup" onClick={handleLogout} className="active-item">Logout</NavLink>

            </>

          ) : isLoggedIn ? (
            <>

              <NavLink to="/user-dashboard" className="active-item">Dashboard</NavLink>

              <NavLink to="/user-cart" className="active-item"> My Cart</NavLink>

              <NavLink to="/user-wishlist" className="active-item">My Favourites</NavLink>

              <NavLink to="/user-profile" className="active-item">My Profile</NavLink>

              <NavLink to="/" onClick={handleLogout}>Logout</NavLink> 

            </>
          ) : (
            <>

              <NavLink to="/signup">SignIn</NavLink>

              <NavLink to="/login">Login</NavLink>
              
            </>
          )}
        </Nav>
    </div>
  );
}

export default Header;

