import { useEffect, useState } from "react";
import { ToastContainer} from 'react-toastify';
import {  getCartData } from "../../../Service/user_service";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { IallProduct } from "../../../Interfaces/common_interfaces";
import StripeCheckout from "react-stripe-checkout";
import "./buy_product.css";
import { toastMessageSuccess } from "../../../Utilities/common_tostify";
import { apiResponseMessages } from "../../../apiResponseMessages"


function BuyPrdct() {
  
  const [data, setData] = useState<IallProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const id = window.location.pathname.split("/").pop();

  const fetchData = async () => {
    try {
      const dataList = await getCartData();
      setData(dataList.productData);
      setIsLoading(true);
    } catch (error) {
      console.log(apiResponseMessages.error_in_fetching_product, error);
    }
  };
  
  const filteredProduct = data.find((item: IallProduct) => item._id === id);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="buy-container">
      {filteredProduct ? (
        <Card className="productCard">
          <Card.Img
            variant="top"
            src={filteredProduct.image}
            alt="Product"
            className="productImg"
          />
          <Card.Body>
            <Card.Title className="productname">
              {filteredProduct.productname}
            </Card.Title>
            <Card.Title className="description">
              {filteredProduct.description}
            </Card.Title>
            <Card.Text className="price">
              Price: ${filteredProduct.price}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <p>No product found.</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default BuyPrdct;
