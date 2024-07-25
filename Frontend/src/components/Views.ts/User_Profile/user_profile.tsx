import React, { useState, useEffect } from "react";
import { updateUser } from "../../../Service/user_service";
import { RootStateOrAny, useSelector } from "react-redux";
import { IUpdateUser } from "../../../Interfaces/common_interfaces";
import { apiResponseMessages } from "../../../apiResponseMessages";
import { Button } from "react-bootstrap";
import "./user_profile.css";  

const Profile = () => {
  const [data, setData] = useState<IUpdateUser>({
    name: "",
    email: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const userData = useSelector(
    (state: RootStateOrAny) => state.AuthReducer.authData
  );

  const fetchData = async () => {
    try {
      setData(userData);
    } catch (error) {
      console.log(apiResponseMessages.error_in_fetching_product, error);
    }
  };

  const handleSaveClick = async () => {
    console.log('Updated User Data:', data);
    const resp = await updateUser(data);
    setIsEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={`profile-card ${isEditMode ? "edit-mode" : ""}`}>
      {isEditMode ? (
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={data.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleInputChange}
          />
          <Button onClick={handleSaveClick} variant="success">
            Save
          </Button>
        </div>
      ) : (
        <div>
          <p className="profile-name">Name: <span>{data.name}</span></p>
          <p className="profile-email">Email: <span>{data.email}</span></p>
          <Button variant="success" onClick={handleEditClick}>Edit</Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
