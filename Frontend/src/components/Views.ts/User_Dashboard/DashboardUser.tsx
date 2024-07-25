import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector, RootStateOrAny } from "react-redux";
import {
  fetchCategories,
  getAllProductService,
  getProductByCategory,
  addToCartService,
  addToWishlist
} from "../../../Service/user_service";
import "./DashboardUser.css";
import { IallProduct, IcartProduct } from "../../../Interfaces/common_interfaces";
import { Button } from "react-bootstrap";
import { apiResponseMessages } from "../../../apiResponseMessages";

const UserDashboard = () => {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [isButtonDisabled1, setButtonDisabled1] = useState<boolean>(false);
  const [isId1, setIsId1] = useState<string>("");
  const [isButtonDisabled2, setButtonDisabled2] = useState<boolean>(false);
  const [isId2, setIsId2] = useState<string>("");

  const isLoggedin = useSelector(
    (state: RootStateOrAny) => state.AuthReducer.isLoggedIn
  );

  const user_id = useSelector(
    (state: RootStateOrAny) => state.AuthReducer.authData.user_id
  );

  const fetchData = async () => {
    try {
      const dataList = await getAllProductService();
      setData(dataList.productData);
    } catch (error) {
      console.log("Data Fetching ", error);
    }
  };

  const loadCategory = async () => {
    try {
      const dataList = await fetchCategories();
      setCategory(dataList.data);
    } catch (error) {
      console.log("Error during fetching data: ", error);
    }
  };

  const location = window.location;
  const history = window.history;

  if (isLoggedin) {
    history.pushState(null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }


  const handleFilter = async (id: string) => {
    try {
      const dataList = await getProductByCategory(id);
      setData(dataList.productData);
    } catch (error) {
      console.log("Error during filtering data", error);
    }
  };

  const addToCart = async (data: IcartProduct) => {
    const { _id } = data;
    setButtonDisabled1(true);
    setIsId1(_id);
    try {
      const resp = await addToCartService({ user_id, _id });
      if (resp.status === 200) {
        alert("Nice Choice :) Product has been added!");
      }
    } catch (error) {
      console.log(error);
    }
    setButtonDisabled1(false);
  };

  const addToFav = async (data: IcartProduct) => {
    const { _id } = data;
    setButtonDisabled2(true);
    setIsId2(_id);
    try {
      const resp = await addToWishlist({ user_id, _id });
      if (resp.status === 200) {
        alert(apiResponseMessages.but_it_from_cart);
      }
      if (resp.status === 400) {
        alert(resp.message);
      }
    } catch (error) {
      console.log(error);
    }
    setButtonDisabled2(false);
  };

  useEffect(() => {
    fetchData();
    loadCategory();
  }, []);

  return (
    <div className="product-container">
      <div className="filter-container">
        <p className="filter-title">Filter by Category:</p>
        <div className="filter-item" onClick={fetchData}>
          Show All
        </div>
        {category && category.length
          ? category.map((item: any, index) => (
              <div
                key={index}
                className="filter-item"
                onClick={() => handleFilter(item._id)}
              >
                {item.category_name}
              </div>
            ))
          : null}
        <div className="clear-filter" onClick={fetchData}>
          Clear Filter
        </div>
      </div>
      <div className="product-list">
        {data && data.length
          ? data.map((item: IallProduct, index) => (
              <Card key={index} className="product-card">
                <Card.Img variant="top" src={item.image} alt="Product" />
                <Card.Body>
                  <Card.Title className="product-title">
                    {item.productname}
                  </Card.Title>
                  <Card.Text className="product-description">
                    {item.description}
                  </Card.Text>
                  <Card.Text className="product-price">
                    Price: {item.price}
                  </Card.Text>
                  <div className="action-buttons">
                    <button
                      className="action-button addToCart"
                      onClick={() => addToCart(item)}
                      disabled={isId1 === item._id && isButtonDisabled1}
                    >
                      Add To Cart
                    </button>
                    <button
                      className="action-button addToWishlist"
                      onClick={() => addToFav(item)}
                      disabled={isId2 === item._id && isButtonDisabled2}
                    >
                      Wishlist
                    </button>
                  </div>
                </Card.Body>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
};

export default UserDashboard;
