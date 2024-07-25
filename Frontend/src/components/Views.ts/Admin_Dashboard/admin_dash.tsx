import React, { useEffect, useState } from "react";
import { select_database } from "../../../Service/admin_service";
import {
  getUsersData,
} from "../../../Service/admin_service";
 

const AdminDashboard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [data, setData] = useState([]);
  const [isId, setIsId] = useState<String>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
    try {
      const dbselect = await select_database(e.target.value);
      console.log(dbselect);
    } catch (error) {
      console.log(error);
    }
  }
 

  return (
    <div>
      <br />
      <br />
      <h2>Select Database</h2>
      <br />
      <input
        type="radio"
        id="option1"
        name="db_type"
        value="sql"
        onChange={handleChange}
        checked={selectedValue === "sql"} />
      <label htmlFor="option1">SQL</label>
      <br />
      <br />
      <input
        type="radio"
        id="option2"
        name="db_type"
        value="mongodb"
        onChange={handleChange}
        checked={selectedValue === "mongodb"} />
      <label htmlFor="option2">Mongodb</label>
      <br />
      <br />
      {selectedValue && (
        <p>You have selected {selectedValue} as your default browser.</p>
      )}
      <br />
      <br />
    </div> 
  )

  }


export default AdminDashboard;


 
