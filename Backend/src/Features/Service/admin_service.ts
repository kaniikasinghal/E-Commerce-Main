import Product from "../Models/product"
import Category from "../Models/category";
import DatabaseType from "../Models/database_type";
import { ProductStatus } from "../Models/product";
import mongoose, { Schema } from "mongoose";
import { mysqlConnection } from "../../Datbase_Conn/sql_db"
import { OkPacket, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import User from "../Models/user";
import Payment from "../Models/payment";
import { apiResponseMessages } from "../../Utils/constants";

export class AuthServices {
  static addProduct = async (body: any, prev_db: string) => {
    const { productname, price, description, image, category_id } = body;
    const _id = uuidv4();

    try {
      if (prev_db === "mongodb") {
        const productExist_mongo = await Product.findOne({
          productname: productname,
        });

        if (productExist_mongo) {
          return {
            status: 400,
            message: apiResponseMessages.product_exist
          };
        } else {
          if (productname && price && description && image && category_id) {
            const new_id = new mongoose.Types.ObjectId(category_id);
            const data = new Product({
              ...body,
              category_id: new_id,
            });
            const check = await data.save();
          }
          return {
            status: 200,
            message: apiResponseMessages.product_success
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
          "SELECT COUNT(*) as count FROM Product WHERE productname = ?";
        const countResult: RowDataPacket[] = await queryAsync(
          mysqlConnection,
          countQuery,
          [productname]
        );
        const productExist_sql = countResult[0].count > 0;
        if (productExist_sql) {
          return {
            status: 400,
            message: apiResponseMessages.product_exist,
          };
        } else {
          if (productname && price && description && image && category_id) {
            const insertQuery =
              "INSERT INTO Product (_id, productname, price, description, image, category_id) VALUES (?, ?, ?, ?, ?, ?)";
            const insertResult: any = await queryAsync(
              mysqlConnection,
              insertQuery,
              [_id, productname, price, description, image, category_id]
            );
            return {
              status: 200,
              message: apiResponseMessages.product_success,
            };
          }
        }
      }
    } catch (error: any) {
      return {
        status: 500,
        message: error.message,
      };
    }
  };

  static getAllProduct = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const products = await Product.find({});
        if (products.length !== 0) {
          return {
            productData: products,
            success: true,
            message: apiResponseMessages.product_fetch_success,
          };
        } else {
          return {
            success: false,
            message: apiResponseMessages.product_not_added,
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

        const insertQuery = "SELECT * FROM Product";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery
        );

        if (insertQuery.length === 0) {
          return { status: 404, message: "No products found" };
        } else {
          return {
            productData: insertResult,
            status: 200,
            message:  apiResponseMessages.product_fetch_success,
          };
        }
      }
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  };

  static ProductaddToUser = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);

        const product = await Product.findByIdAndUpdate(
          { _id: new_id },
          { enum: ProductStatus.ACTIVE }
        );

        if (product?.enum === "ACTIVE") {
          return {
            status: 400,
            message:  apiResponseMessages.product_exist,
          };
        } else {
          return {
            status: 200,
            message:  apiResponseMessages.product_success,
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
        const updateQuery = "UPDATE Product SET enum = ? WHERE _id = ?";
        const productStatus = "ACTIVE";
        const updateResult: any = await queryAsync(
          mysqlConnection,
          updateQuery,
          [productStatus, id]
        );
        if (updateResult.affectedRows !== 1) {
          return {
            status: 400,
            message: apiResponseMessages.product_not_added
          };
        } else {
          return {
            status: 200,
            message: apiResponseMessages.product_success,
          };
        }
      }
    } catch (error: any) {
      console.log("Error while findind the product", error);
      return {
        status: 500,
        message: "Error while findind the product",
      };
    }
  };

  static deleteProduct = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const product = await User.deleteOne({ _id: new_id });
        console.log(product);
        if (product) {
          return {
            data: product,
            status: 200,
            message: apiResponseMessages.product_delete_success,
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

        const countQuery =
          "SELECT COUNT(*) as count FROM Product WHERE _id = ?";
        const countResult: any = await queryAsync(mysqlConnection, countQuery, [
          id,
        ]);

        const productExists = countResult[0].count > 0;

        if (!productExists) {
          return { status: 404, message: apiResponseMessages.product_not_found };
        }

        const deleteQuery = "DELETE FROM Product WHERE _id = ?";
        const deleteResult: any = await queryAsync(
          mysqlConnection,
          deleteQuery,
          [id]
        );

        if (deleteResult.affectedRows === 1) {
          return { status: 200, message: apiResponseMessages.product_delete_success};
        } else {
          return { status: 500, message: apiResponseMessages.product_error_delete };
        }
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: apiResponseMessages.product_error_delete };
    }
  };

  static undoProductService = async (id: string, prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const product = await Product.findByIdAndUpdate(
          { _id: new_id },
          { enum: ProductStatus.INACTIVE }
        );
        if (product) {
          return {
            status: 200,
            message: apiResponseMessages.product_remove_success,
          };
        } else {
          return {
            status: 404,
            message:apiResponseMessages.product_not_found,
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

        const updateQuery = "UPDATE Product SET enum = ? WHERE _id = ?";
        const statusToUpdate = "INACTIVE";
        const updatedProducts: any = await queryAsync(
          mysqlConnection,
          updateQuery,
          [statusToUpdate, id]
        );

        if (updatedProducts.affectedRows === 1) {
          return {
            status: 200,
            message:  apiResponseMessages.product_remove_success,
          };
        } else {
          return {
            status: 404,
            message: apiResponseMessages.product_status_active_not_found,
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

  static addCategory = async (body: any) => {
    const _id = uuidv4();
    const { category_name } = body;
    try {
      const categoryExist_mongo = await Category.findOne({
        category_name: category_name,
      });

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
        "SELECT COUNT(*) as count FROM categories WHERE category_name = ?";
      const countResult: RowDataPacket[] = await queryAsync(
        mysqlConnection,
        countQuery,
        [category_name]
      );
      const categoryExists_sql = countResult[0].count > 0;

      if (!categoryExist_mongo && !categoryExists_sql) {
        const data = new Category({
          ...body,
        });
        await data.save();

        const insertQuery =
          "INSERT INTO categories ( _id , category_name ) VALUES (?,?)";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery,
          [_id, category_name]
        );

        return {
          status: 200,
          message: apiResponseMessages.category_add_success,
        };
      } else {
        return {
          status: 400,
          message: apiResponseMessages.category_exist,
        };
      }
    } catch (error: any) {
      console.log(error);
      return {
        status: error.status || 500,
        message: error.message || apiResponseMessages.internal_server_error,
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
            message:  apiResponseMessages.category_retrived_successfully,
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

        const insertQuery = "SELECT * FROM categories";
        const insertResult: any = await queryAsync(
          mysqlConnection,
          insertQuery
        );

        if (insertQuery.length === 0) {
          return { status: 404, message: "No category found" };
        } else {
          return {
            data: insertResult,
            status: 200,
            message:
               apiResponseMessages.product_fetch_success,
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

  static db_Select = async (data: string) => {
    try {
      if (data !== "mongodb" && data !== "sql") {
        return {
          status: 400,
          message: "bad request",
        };
      }
      const update = { db_Type: data };
      const db_selected = await DatabaseType.findOneAndUpdate(
        {},
        { $set: update },
        { new: true, upsert: true }
      );
      return {
        status: 200,
        message: apiResponseMessages.db_select_success,
      };
    } catch (error) {
      console.error(apiResponseMessages.Error_db_select, error);
      throw new Error(apiResponseMessages.Error_database_select);
    }
  };

  static getAllUser = async (prev_db: string) => {
    try {
      if (prev_db === "mongodb") {
        const resp = await User.find();
        if (resp && resp.length > 0) {
          return {
            status: 200,
            data: resp,
            message: apiResponseMessages.Userdata_fetch_success,
          };
        } else {
          return {
            status: 500,
            message: apiResponseMessages.Userdata_fetch_failure,
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

  static deleteUser = async (prev_db: string, id: string) => {
    try {
      if (prev_db === "mongodb") {
        const new_id = new mongoose.Types.ObjectId(id);
        const deletedUser = await User.deleteOne();
        if (deletedUser) {
          return {
            data: deletedUser,
            status: 200,
            message: apiResponseMessages.user_delete_success,
          };
        } else {
          return {
            status: 404,
            message: apiResponseMessages.user_not_found,
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


static getPaymentDetails = async (prev_db: string) => {
  try {
    if (prev_db === "mongodb") {
      const product: any = await Payment.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "product_ids",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "_id",
            as: "paymentDetails",
          },
        },
        {
          $project: {
            productDetails: 1,
            userDetails: 1,
            paymentDetails: 1,
          },
        },
      ]);

      if (product) {
        return {
          status: 200,
          data: product,
          message: apiResponseMessages.payment_details_retrieve_seccess,
        };
      } else {
        return {
          status: 400,
          message: apiResponseMessages.payment_details_retrieve_failure,
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

      const selectQuery =
        "SELECT p.user_id as user_id, JSON_ARRAYAGG(JSON_OBJECT('transactionId',p.transactionId,'amount',p.amount,'products',JSON_OBJECT('price',prdct.price,'productname',prdct.productname))) AS Payment_Details FROM payments p JOIN payment_products pp ON p._id = pp.payment_id JOIN product prdct ON pp.product_id = prdct._id GROUP BY p.user_id ";
      const selectResult: any = await queryAsync(
        mysqlConnection,
        selectQuery
      );
      console.log("ggg==", selectResult);
      const rows: any = selectResult;
     
      const data=selectResult.forEach((item: any) => {
        console.log("User ID:", item.user_id);

        item.Payment_Details.forEach(
          (transactionId: string, index: any) => {
            console.log("Transaction ID:", transactionId);
            // console.log("Amount:", item.Payment_Details.amount[0]);
          }
        );
      });
      console.log("reading",data)
    }
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

}