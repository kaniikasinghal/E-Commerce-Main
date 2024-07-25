import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  clearCart,
  deleteCartService,
  getCartData,
} from "../../../../Service/user_service";
import {
  ICheckoutProps,
  IallProduct,
} from "../../../../Interfaces/common_interfaces";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Proceedtopay from "../../../../Payments/Proceedtopay";
import "./Cart.css";
import { apiResponseMessages } from "../../../../apiResponseMessages";

function CartPage() {
  const [data, setData] = useState<IallProduct[]>([]);
  const [dlt2, setDlt2] = useState<boolean>(false);
  const [clr, setClr] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const STRIPE_PK_TEST = "pk_test_51NdB4sHpYC6F94CMkmCgO4b0dAjAjzkiKxnitd3AjjDL59nfTbc0Y8Z4aX2wiVl8CBIY6Fe3js0RHrmjxTPCrbSX00U2Hc5rs8";
  const stripePromise = loadStripe(STRIPE_PK_TEST as string);

  const fetchData = async () => {
    try {
      const res = await getCartData();
      console.log("res==",  res)
      const CartList = res.CartData;
      console.log(CartList);
      setData(res.CartData);
    } catch (error) {
      console.log(apiResponseMessages.error_in_fetching_product, error);
    }
  };

  const delete_Product = async (id: string) => {
    setDlt2(true);
    console.log("id", id);
    try {
      const resp = await deleteCartService(id);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
    setDlt2(false);
  };

  const clearAll = async () => {
    try {
      const resp = await clearCart();
      setClr(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ dlt2, clr]);

  return (
    <>
      <div className="cart-container">
        {data && data.length
          ? data.map((item: IallProduct, index) => (
              <Card key={index} className="productCard">
                <Card.Img
                  variant="top"
                  src={item.image}
                  alt="Product"
                  className="productImg"
                />
                <Card.Body>
                  <Card.Title>{item.productname}</Card.Title>
                  <Card.Title>{item.description}</Card.Title>
                  <Card.Text>Price: {item.price}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => delete_Product(item._id)}
                    disabled={dlt2}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            ))
          : null}
      </div>

      {showCheckout && (
        <div>
          <Elements stripe={stripePromise}>
            <Proceedtopay data={data} />
          </Elements>
        </div>
      )}
      {data && data.length && !showCheckout ? (
        <Button
          variant="primary"
          className="PAYIT"
          onClick={() => setShowCheckout(true)}
        >
          Proceed to Pay
        </Button>
      ) : null}
    </>
  );
}

export default CartPage;



