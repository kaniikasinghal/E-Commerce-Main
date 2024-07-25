import { useForm } from "react-hook-form";
import InputWrapper from "../../Utilities/FormElements/InputWrapper"
import { addCategory } from "../../Service/admin_service";
import { apiResponseMessages } from "../../apiResponseMessages"

function AddCategory() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const onSubmit = async (data: any) => {
    try {
      const response = await addCategory(data);

      if (response?.status === 200) {
        alert(response.message);
      }
      else if(response?.status === 400){
        alert(response.message);
      }
      console.log(response);
    } catch (error) {
      console.log(apiResponseMessages.error_adding_product, error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          padding: "20%",
          width: "100vw",
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Add Category</h2>
        <br/>
        <div className="form-group">
          <InputWrapper
            control={control}
            type="text"
            placeholder="Enter Category Name"
            name="category_name"
            className="form-control beautiful-input"
          />
          <div className="message error">
            {errors && errors?.category_name && (
              <p>
                <>{errors?.category_name?.message}</>
              </p>
            )}
          </div>
        </div>
        <br/>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}

export default AddCategory;

 