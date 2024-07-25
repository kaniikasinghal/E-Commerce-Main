
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import {
  getAllProduct,
  findandUpdateProduct,
  findandDeleteProduct,
  undoProduct,
} from "../../Service/admin_service";
import { RootStateOrAny, useSelector } from "react-redux";
import { IallProduct } from "../../Interfaces/common_interfaces";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import InfiniteScroll from "react-infinite-scroller";
import Loader from "./loader";
import "./all_product.css";
import { apiResponseMessages } from "../../apiResponseMessages";

const AllProduct = () => {
  const [data, setData] = useState<IallProduct[]>([]);
  const [dlt, setDlt] = useState<boolean>(false);
  const [isId, setIsId] = useState<string>("");
  const [undo, setUndo] = useState<boolean>(false);
  const [addProduct, setAddProduct] = useState<boolean>(false);
  const [isstartLoading, setIsstartLoading] = useState(true);
  const [nextPage, setNextPage] = useState(1);

   const isLoggedin = useSelector(
    (state: RootStateOrAny) => state.AuthReducer.isLoggedIn
  );

  
  const location = window.location;
  const history = window.history;

  if (isLoggedin) {
    history.pushState(null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }
 
    const fetchData = async () => {
      try {
        console.log("fetchdata");
        const dataList = await getAllProduct();
        console.log("datalist, response from getAllProducts", dataList);
        setData([...data, ...dataList.productData]);
      } catch (error) {
        console.log("Error in fetching product data: ", error);
      }
    };
   
  const addProductToUser = async (item: IallProduct) => {
    setAddProduct(true);
    setIsId(item._id);
    try {
      const res = await findandUpdateProduct(item._id);
      if (res.status === 200) {
        alert(res.message);
      } else if (res.status === 400) {
        alert(res.message);
      } else if (res.status === 404) {
        alert(res.message);
      } else {
        alert(apiResponseMessages.error_in_finding_productt);
      }
      setAddProduct(false);
    } catch (error) {
      console.log(apiResponseMessages.error_in_adding_productt, error);
    }
  };

  const removeProduct = async (id: string) => {
    setUndo(true);
    setIsId(id);
    try {
      const res = await undoProduct(id);
      console.log(res);
    } catch (error) {
      console.log(apiResponseMessages.error_in_deleting_product, error);
    }
    setUndo(false);
  };

  const deleteProduct = async (id: string) => {
    setDlt(true);
    setIsId(id);
    try {
      const res = await findandDeleteProduct(id);
    } catch (error) {
      console.log(apiResponseMessages.error_in_deleting_product, error);
    }
    setDlt(false);
  };

  useEffect(() => {
    fetchData().then(() => setIsstartLoading(false));
  }, [dlt, undo, addProduct, nextPage]);


  const handleLoadMore = async () => {
    if (!isstartLoading) {
      setNextPage(nextPage + 1);

      setTimeout(() => {
        fetchData();
      }, 0);
    }
  };

  return (
    <div>
      {isstartLoading ? (
        <Loader />
      ) : (
        // <InfiniteScroll+
        //   loadMore={handleLoadMore}
        //   hasMore={true}
        //   loader={<div>Loading...</div>}
        // >
          <Row>
            {data && data.length
              ? data.map((item: IallProduct, index) => (
                <Col key={index} md={3}>
                  <Card className="product-card">
                  <LazyLoadImage
                    // variant="top" 
                    src={item.image} 
                    alt="Product"
                    effect="blur"
              threshold={2000}
              visibleByDefault={false}
            />
                 
                    <Card.Body>
                      <Card.Title>{item.productname}</Card.Title>
                      <Card.Text className="all-card-description">
                        {item.description}
                      </Card.Text>
                      <Card.Text>Price: {item.price}</Card.Text>
                      {item.enum === "INACTIVE" ? (
                        <Button
                          variant="success"
                          onClick={() => addProductToUser(item)}
                          disabled={isId === item._id && addProduct}
                        >
                          Add
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() => removeProduct(item._id)}
                          disabled={isId === item._id && undo}
                        >
                          Undo
                        </Button>
                      )}
                      &nbsp;&nbsp;
                      <Button
                        variant="primary"
                        onClick={() => deleteProduct(item._id)}
                        disabled={isId === item._id && dlt}
                      >
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
              : null}
          </Row>
        // </InfiniteScroll>
      )}
    </div>
  );
};

export default AllProduct;




function fetchData() {
  throw new Error("Function not implemented.");

}
 
 