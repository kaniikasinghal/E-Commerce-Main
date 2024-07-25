import React, { useEffect, useState } from "react";
import { findandDeleteUser, getUsersData } from "../../../Service/admin_service";
import { Button } from "react-bootstrap";
import "./user_list.css"; 
import { apiResponseMessages } from "../../../apiResponseMessages";
const Userlist = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [data, setData] = useState([]);
  const [dlt, setDlt] = useState<boolean>(false);
  const [isId, setIsId] = useState<String>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    setDlt(true);
    setIsId(id);
    try {
      const res = await findandDeleteUser(id);
      console.log(res);
    } catch (error) {
      console.log(apiResponseMessages.error_in_deleting_product, error);
    }
    setDlt(false);
  };

  const fetchData = async () => {
    try {
      const dataList = await getUsersData();
      console.log(dataList.data);
      setData(dataList.data);
      setIsLoading(true);
    } catch (error) {
      console.log(apiResponseMessages.error_in_fetching_product, error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data && data.length ? (
            data.map((item: any) => {
              return (
                <tr key={item._id}>
                  <td>{item?.name}</td>
                  <td>{item?.email}</td>
                  <td>
                    <Button
                      className="delete-button"
                      onClick={() => handleDelete(item._id)}
                      disabled={isId === item._id && dlt}
                    >
                      Remove this USER
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Userlist;



