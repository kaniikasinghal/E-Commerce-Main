import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInAction } from "../../../State_Management.ts/Actions/auth_actions";
import InputWrapper from "../../../Utilities/FormElements/InputWrapper";
import { postLoginService } from "../../../Service/user_service";
import { userSignInSchema } from "../../../Utilities/Validation/user_auth";
import { yupResolver } from "@hookform/resolvers/yup";
import "./login.css";
import { ILogin } from "../../../Interfaces/common_interfaces";
import { apiResponseMessages } from "../../../apiResponseMessages"

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSignInSchema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: ILogin) => {
    try {
      const response = await postLoginService(data);
      const { status, code, data: userData } = response;

      if (status) {
        if (code === 200) {
          localStorage.setItem("verifyToken", userData.token);
          const { user_id, image,name, email, isAdmin } = userData;
          dispatch(signInAction({ user_id,image,name, email, isAdmin }));
          navigate("/");
        } else if (code === 400) {
          alert(userData.message);
        } else if (code === 409) {
          alert(userData.message);
          navigate("/signup");
        }
      }
    } catch (error) {
      alert(apiResponseMessages.login_failed);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <h2 className="login-title">Sign In</h2>
          <br />
          <InputWrapper
            control={control}
            type="text"
            placeholder="Enter Email"
            name="email"
            className="form-control beautiful-input"
          />
          <div className="message error">
            {errors.email && <p>{errors.email.message}</p>}
          </div>
        </div>
        <br />
        <div className="form-group">
          <InputWrapper
            control={control}
            type="password"
            placeholder="Enter Password"
            name="password"
            className="form-control beautiful-input"
          />
          <div className="message error">
            {errors.password && <p>{errors.password.message}</p>}
          </div>
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          SIGNIN
        </button>
        <p className="text-center mt-3">
          <Link to="/signup">Want to get registered first :)</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
