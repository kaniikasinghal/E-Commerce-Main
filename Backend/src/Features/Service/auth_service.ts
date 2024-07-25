import bcrypt from "bcrypt";
import User from "../Models/user";
import { IPostSignup, IPostLogin } from "../Interfaces/auth_interface";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { apiResponseMessages } from "../../Utils/constants";
require("dotenv").config();

const admin = {
  name: "Vritiks",
  email: "vritika1234@gmail.com",
  password: "vritika1234",
  isAdmin: true,
};

export class AuthServices {
  static postSignup = async (body: IPostSignup) => {
    const { name,image, email,password, password_confirmation } = body;
    const user = await User.findOne({ email: email });
    if (user) {
      return {
        code: 409,
        status: apiResponseMessages.failed,
        message: apiResponseMessages.email_already_exist,
      };
    } else {
      if (!name || !email || !password || !password_confirmation) {
        return {
          code: 400,
          status: apiResponseMessages.failed,
          message: apiResponseMessages.all_field_are_required,
        };
      } else {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const document = new User({
              name: name,
              image:image,
              email: email,
              password: hashPassword,
            });
            await document.save();
            return {
              code: 200,
              status: apiResponseMessages.success,
              message: apiResponseMessages.user_registered_success,
            };
          } catch (error) {
            return {
              code: 400,
              status: apiResponseMessages.failed,
              message: apiResponseMessages.unable_to_register,
            };
          }
        } else {
          return {
            code: 400,
            status: apiResponseMessages.failed,
            message: apiResponseMessages.password_confirmpassword_mismatch,
          };
        }
      }
    }
  };

  static postLogin = async (body: IPostLogin) => {
    try {
      const { email, password } = body;
      if (email && password) {
        const user = await User.findOne({ email: email });
        const id = user?._id.toString();

        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            const payload = { user_id: id, email: user.email };

            const token = jwt.sign(
              payload,
              process.env.JWT_SECRET_KEY as string,
              { expiresIn: "5d" }
            );

            const data = {
              user_id:id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              token: token,
            };
            
            return {
              code: 200,
              status: apiResponseMessages.success,
              message: apiResponseMessages.user_login_success,
              data: data,
            };
          } else {
            return {
              code: 400,
              status: apiResponseMessages.failed,
              message: apiResponseMessages.something_went_wrong
            };
          }
        } else if (email === admin.email && password === admin.password) {
          const payload = { email: admin.email };

          const token = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "5d" }
          );

          return {
            code: 200,
            status: apiResponseMessages.success,
            message: apiResponseMessages.admin_login_success,
            data: { ...admin, token },
          };
        } else {
          return {
            code: 409,
            status: apiResponseMessages.failed,
            message: apiResponseMessages.not_registered,
          };
        }
      } else {
        return {
          code: 400,
          status: apiResponseMessages.failed,
          message: apiResponseMessages.all_field_are_required,
        };
      }
    } catch (error) {
      return {
        code: 400,
        status: apiResponseMessages.failed,
        message: apiResponseMessages.unable_to_login,
      };
    }
  };
}
