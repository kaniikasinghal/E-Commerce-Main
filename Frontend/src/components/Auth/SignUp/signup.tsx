import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ISignup } from "../../../Interfaces/common_interfaces";
import InputWrapper from "../../../Utilities/FormElements/InputWrapper";
import { Link, useNavigate } from "react-router-dom";
import { postSignupService } from "../../../Service/user_service";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSignupSchema } from "../../../Utilities/Validation/user_auth";
import "./signup.css";
import { apiResponseMessages } from "../../../apiResponseMessages"

const SignupPage = () => {
  const [productData, setProductData] = useState<ISignup>({
    image: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [url, setUrl] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSignupSchema),
  });

  const navigate = useNavigate();

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target && (e.target.files as FileList);
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = function () {
      const result = reader.result;

      if (result && typeof result === "string") {
        setProductData({ ...productData, image: result });
        setUrl(result);
      }
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    };
  };

  const onSubmit = async (data: ISignup) => {
    try {
      const res = await postSignupService({
        ...data,
        image: productData.image,
      });

      if (res.status) {
        if (res.code === 200) {
          alert(res.message);
        }
        if (res.code === 409) {
          alert(res.message);
        }
      } else {
        alert(apiResponseMessages.failed_to_register);
      }
    } catch (error) {
      alert(apiResponseMessages.signin_failed);
    }
  };

  return (
    <div className="signup-modal-container">
      <div className="signup-form-container">
        {url ? <img src={url} width={50} alt="preview" /> : ""}
        <form
          onSubmit={handleSubmit((data) => onSubmit(data as ISignup))}
          className="mt-5"
        >
          <h2 className="signup-title">Sign Up</h2>
          <div className="form-group">
            <InputWrapper
              type="file"
              control={control}
              name="image"
              onChange={handleClick}
              className="form-control beautiful-input"
            />
            <div className="message error">
              {errors && errors?.name && (
                <p>
                  <>{errors?.name?.message}</>
                </p>
              )}
            </div>
          </div>
          <div className="form-group">
            <InputWrapper
              type="text"
              control={control}
              placeholder="Enter your Good Name"
              name="name"
              className="form-control beautiful-input"
            />
            <div className="message error">
              {errors && errors?.name && (
                <p>
                  <>{errors?.name?.message}</>
                </p>
              )}
            </div>
          </div>
          <div className="form-group">
            <InputWrapper
              control={control}
              type="text"
              placeholder="Enter your Email"
              name="email"
              className="form-control beautiful-input"
            />
            <div className="message error">
              {errors && errors?.email && (
                <p>
                  <>{errors?.email?.message}</>
                </p>
              )}
            </div>
          </div>
          <div className="form-group">
            <InputWrapper
              control={control}
              type="password" // Change the input type to "password"
              placeholder="Enter Password"
              name="password"
              className="form-control beautiful-input"
            />
            <div className="message error">
              {errors && errors?.password && (
                <p>
                  <>{errors?.password?.message}</>
                </p>
              )}
            </div>
          </div>
          <div className="form-group">
            <InputWrapper
              control={control}
              type="password" // Change the input type to "password"
              placeholder="Re-enter your Password"
              name="password_confirmation"
              className="form-control beautiful-input"
            />
            <div className="message error">
              {errors && errors?.password && (
                <p>
                  <>{errors?.password?.message}</>
                </p>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <p className="text-center mt-3">
            <Link to="/login">Already Registered !! Get yourself Login-</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
