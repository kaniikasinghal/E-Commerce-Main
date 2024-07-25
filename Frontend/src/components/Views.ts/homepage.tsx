import Header from "../../Utilities/NavBar/navbar";
import { useForm } from "react-hook-form";
import InputWrapper from "../../Utilities/FormElements/InputWrapper";
import { useState } from "react";
import { select_database } from "../../Service/admin_service";

const HomePage = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
    try {
      const dbselect = await select_database(e.target.value);
      setSelectedDatabase(e.target.value);
      console.log(e.target.value);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <h3> <br/> Well :) <br/><br/> See there are two options. Either you can Login and get Signup to move into the project. For, 
        furtehr query....contact <br/> <br/>"Kanika" :)) </h3>
    </div>
  );
};

export default HomePage;


 