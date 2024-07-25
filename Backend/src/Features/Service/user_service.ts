import Product, { ProductStatus } from "../Models/product";
import Category from "../Models/category";
import { mysqlConnection } from "../../Datbase_Conn/sql_db";
import { OkPacket, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import User from "../Models/user";
import Cart from "../Models/cart";
import Favorite from "../Models/favourite";
import mongoose from "mongoose";
import Wishlist from "../Models/favourite";
import { apiResponseMessages } from "../../Utils/constants";



export const stripe = require("stripe")(process.env.key);

export class AuthServices {
  static getAllProducts = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const product = await Product.find({ enum: ProductStatus.ACTIVE });
        if (product) {
          return {
            productData: product,
            status: 200,
            message: apiResponseMessages.product_fetch_success,
          };
        } else {
          return {
            status: 404,
            message: apiResponseMessages.product_not_found,
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
        const insertQuery = "SELECT * FROM Product WHERE enum = ?";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          "ACTIVE"
        );

        if (insertResult.length === 0) {
          return { status: 404, message: apiResponseMessages.product_not_found };
        } else {
          return {
            productData: insertResult,
            status: 200,
            message: apiResponseMessages.product_fetch_success,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        success: 500,
        message: apiResponseMessages.internal_server_error,
      };
    }
  };

  static getAllCategoryService = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const category = await Category.find({});
        if (category.length !== 0) {
          return {
            data: category,
            status: 200,
            message: apiResponseMessages.category_retrived_successfully,
          };
        } else {
          return {
            status: 400,
            message: apiResponseMessages.add_category,
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const insertQuery = apiResponseMessages.select_from_category;
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery
        );
        if (insertResult.length === 0) {
          return { status: 404, message:  apiResponseMessages.category_not_found , };
        } else {
          return {
            data: insertResult,
            status: 200,
            message: apiResponseMessages.category_fetched_success,
          };
        }
      }
    } catch (error: any) {
      return {
        status: error.status || 500,
        message: error.message || apiResponseMessages.internal_server_error,
      };
    }
  };

  static productByCategory = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const product = await Product.find({ category_id: id });
        if (product) {
          return {
            productData: product,
            status: 200,
            message: apiResponseMessages.product_filter_success,
          };
        } else {
          return {
            status: 404,
            message: apiResponseMessages.product_not_found,
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const countQuery = "SELECT * FROM product WHERE category_id=?";
        const result: any = await queryAsync(mysqlConnection, countQuery, [id]);

        if (result.length == 0) {
          return { status: 404, message: apiResponseMessages.product_not_found };
        } else {
          return {
            productData: result,
            status: 200,
            message: apiResponseMessages.category_fetched_success,
          };
        }
      }
    } catch (error) {
      return {
        status: 500,
        message: apiResponseMessages.internal_server_error,
      };
    }
  };

  static addToCartService = async (body: any, prev_db: string) => {
    const id = uuidv4();
    const { user_id, _id } = body;
    try {
      if (prev_db === "mongodb") {
        const product_id = new mongoose.Types.ObjectId(_id);
        const cartData = new Cart({
          user_id: user_id,
          product_id: product_id,
        });
        const resp_data = await cartData.save();
        return {
          data: resp_data,
          status: 200,
          message: apiResponseMessages.product_added_to_cart_success,
        };
      } else if (prev_db === "sql") {
        const queryAsync = async (
          connection: any,
          sql: string,
          values: any
        ): Promise<RowDataPacket[]> => {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        };

        const insertQuery =
          "INSERT INTO cart (_id, user_id, product_id) VALUES (?, ?, ?)";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [id, user_id, _id]
        );

        if (insertResult.affectedRows === 1) {
          return {
            status: 200,
            message: apiResponseMessages.product_added_to_cart_success,
          };
        } else {
          return { status: 500, message: apiResponseMessages.product_added_to_cart_failure, };
        }
      }
    } catch (error) {
      return {
        status: 500,
        message: apiResponseMessages.internal_server_error,
      };
    }
  };

  static addToFavService = async (body: any, prev_db: string) => {
    const id = uuidv4();
    const { user_id, _id } = body;
    try {
      if (prev_db === "mongodb") {
        const product_id = new mongoose.Types.ObjectId(_id);
        const productExist = await Favorite.findOne({
          product_id: product_id,
        });

        if (productExist) {
          return {
            status: 400,
            message: apiResponseMessages.product_exist,
          };
        } else {
          const data = new Favorite({
            user_id: user_id,
            product_id: product_id,
          });

          const productData = await data.save();
          return {
            data: productData,
            status: 200,
            message: apiResponseMessages.product_added_to_cart_success,
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const countQuery =
          "SELECT COUNT(*) as count FROM favorite WHERE product_id = ?";
        const countResult: RowDataPacket[] = await queryAsync(
          mysqlConnection,
          countQuery,
          [_id]
        );
        const productExists = countResult[0].count > 0;

        if (productExists) {
          return { status: 400, message: apiResponseMessages.product_exist, };
        }

        const insertQuery =
          "INSERT INTO favorite (_id, user_id,product_id) VALUES (?, ?, ?)";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [id, user_id, _id]
        );

        if (insertResult.affectedRows === 1) {
          return {
            status: 200,
            message:  apiResponseMessages.product_inserted_to_wishlist_success
          };
        }
      }
    } catch (error: any) {
      return {
        status: 500,
        message: error.message,
      };
    }
  };

  static getCartDataService = async (user_id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const result = await Cart.aggregate([
          {
            $match: { user_id: user_id },
          },
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "cartList",
            },
          },
          {
            $project: {
              cartList: 1,
            },
          },
        ]);

        const resArray: any = [];
        result.map((item: any) => {
          resArray.push(item.cartList[0]);
        });

        return {
          status: 200,
          CartData: resArray,
        };
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const insertQuery =
          "SELECT product._id,productname,description,price,image FROM cart right join product on cart.product_id=product._id WHERE user_id=?";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [user_id]
        );

        if (insertQuery.length === 0) {
          return { status: 404, message: apiResponseMessages.product_not_found, };
        } else {
          return {
            CartData: insertResult,
            status: 200,
            message: apiResponseMessages.product_fetch_success,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: apiResponseMessages.internal_server_error };
    }
  };

  static getWishlistService = async (user_id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const result = await Wishlist.aggregate([
          {
            $match: { user_id: user_id },
          },
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "wishList",
            },
          },
          {
            $project: {
              wishList: 1,
            },
          },
        ]);

        const resArray: any = [];
        result.map((item: any) => {
          resArray.push(item.wishList[0]);
        });

        return {
          status: 200,
          data: resArray,
          message: apiResponseMessages.wishlist_fetch_success,
        };
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        const insertQuery =
          "SELECT product._id,productname,description,price,image FROM favorite right join product on favorite.product_id=product._id WHERE user_id=?";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [user_id]
        );
        console.log(insertResult)

        if (insertQuery.length === 0) {
          return { status: 404, message: apiResponseMessages.internal_server_error };
        } else {
          return {
            data: insertResult,
            status: 200,
            message: apiResponseMessages.product_fetch_success,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: apiResponseMessages.internal_server_error,
      };
    }
  };

  static deleteCartService = async (id: string, prev_db: string) => {
    try {
      console.log(id);
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const product = await Cart.deleteOne({ _id: new_id });
        if (product) {
          return {
            data: product,
            status: 200,
            message: apiResponseMessages.product_remove_success
          };
        } else {
          return {
            status: 404,
            message: apiResponseMessages.product_not_found,
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
        try {
          const countQuery = "SELECT COUNT(*) as count FROM cart WHERE product_id = ?";
          const countResult: any = await queryAsync(
            mysqlConnection,
            countQuery,
            [id]
          );

          const productExists = countResult[0].count > 0;

          if (!productExists) {
            return { status: 404, message: apiResponseMessages.product_not_found };
          }

          const deleteQuery = "DELETE FROM cart WHERE product_id = ? LIMIT 1";
          const deleteResult: any = await queryAsync(
            mysqlConnection,
            deleteQuery,
            [id]
          );

          if (deleteResult.affectedRows === 1) {
            return {
              status: 200,
              message: apiResponseMessages.product_remove_from_cart_success,
            };
          } else {
            return { status: 500, message: apiResponseMessages.product_error_delete };
          }
        } catch (error) {
          return { status: 500, message: apiResponseMessages.server_error };
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static clearCartService = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const resp = await Cart.deleteMany();
        return {
          status: 200,
          message: apiResponseMessages.cart_clear_success,
        };
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
        try {
          const insertQuery = apiResponseMessages.delete_from_cart_success;
          const insertResult: any = await queryAsync(
            mysqlConnection,
            insertQuery
          );
          return {
            status: 200,
            message: apiResponseMessages.product_remove_from_cart_success,
          };
        } catch (error) {
          return { status: 500, message: apiResponseMessages.product_error_delete };
        }
      }
    } catch (error) {
      return { status: 500, message: apiResponseMessages.internal_server_error };
    }
  };

  static deleteWishlistService = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const product = await Wishlist.deleteOne({ _id: new_id });
        if (product) {
          return {
            data: product,
            status: 200,
            message: apiResponseMessages.product_remove_success,
          };
        } else {
          return {
            status: 404,
            message: apiResponseMessages.product_not_found,
          };
        }
      } else if (prev_db === "sql") {
        function queryAsync(
          connection: any,
          sql: string,
          values?: any
        ): Promise<RowDataPacket[]> {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              values,
              (error: any, results: RowDataPacket[]) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }
        try {
          const countQuery =
            "SELECT COUNT(*) as count FROM favorite WHERE product_id = ?";
          const countResult: any = await queryAsync(
            mysqlConnection,
            countQuery,
            [id]
          );

          const productExists = countResult[0].count > 0;

          if (!productExists) {
            return { status: 404, message: apiResponseMessages.product_not_found };
          }

          const deleteQuery = "DELETE FROM favorite WHERE product_id = ?";
          const deleteResult: any = await queryAsync(
            mysqlConnection,
            deleteQuery,
            [id]
          );

          if (deleteResult.affectedRows === 1) {
            return {
              status: 200,
              message: apiResponseMessages.delete_from_wishlist_success,
            };
          } else {
            return { status: 500, message: apiResponseMessages.product_error_delete};
          }
        } catch (error) {
          return { status: 500, message: apiResponseMessages.product_error_delete };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: apiResponseMessages.internal_server_error,
      };
    }
  };

  static updateUserData=async(body:any,prev_db:string)=>{
    const {user_id,image,name,email,phone}=body;
    try{
      if(prev_db==='mongodb'){
        const new_id = new mongoose.Types.ObjectId(user_id);
        const update = { image:image,name:name,email:email,phone:phone };
        const resp=await User.findOneAndUpdate({_id:new_id},
          {$set:update })
      }else if(prev_db==='sql'){
        
      }

    }catch(error:any){
      return{
        status:500,
        message:error.message
      }
    }
  }
}