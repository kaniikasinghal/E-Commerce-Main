import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./wish_list.css";
import { addToCartService, deleteWishlistService, getWishList } from "../../../../Service/user_service";
import { IcartProduct } from "../../../../Interfaces/common_interfaces";
import { apiResponseMessages } from "../../../../apiResponseMessages";

function Wishlist() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled1, setButtonDisabled1] = useState<boolean>(false);
  const [isId1, setIsId1] = useState<String>("");
  const [isId2, setIsId2] = useState<String>("");
  const [dlt, setDlt] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const dataList = await getWishList();
      console.log("wishlist", dataList);
      setData(dataList.data);
      setIsLoading(true);
    } catch (error) {
      console.log(apiResponseMessages.error_in_fetching_product , error);
    }
  };

  const addToCart = async (data: IcartProduct) => {
    const { _id, productname, price, description, image } = data;
    setButtonDisabled1(true);
    setIsId1(_id);
    try {
      if (true) {
        alert(apiResponseMessages.product_added_successfully_to_cart);
      }
    } catch (error) {
      console.log(error);
    }
    setButtonDisabled1(false);
  }; 

  const delete_Product = async (id:string) => {
    setDlt(true)
    setIsId2(id)
    try {
        const resp=await deleteWishlistService(id);
        console.log(resp);
    } catch (error) {
      console.log(error);
    }
    setDlt(false);
  };

  useEffect(() => {
    fetchData();
  }, [isLoading,dlt]);
  return (
    <>
      <div className="cart-container">
        {data && data.length
          ? data.map((item: IcartProduct, index) => (
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
                    variant="success"
                    onClick={() => addToCart(item)}
                    disabled={isId1 === item._id && isButtonDisabled1}
                  >
                    Add To Cart
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    variant="primary"
                    onClick={() => delete_Product(item._id)}
                    disabled={isId2 === item._id && dlt}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            ))
          : null}
      </div>
    </>
  );
}

export default Wishlist;

 