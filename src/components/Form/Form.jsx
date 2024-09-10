import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { postItem, editItem } from "../../store/todoListSlice";

import "./form.css";

const Form = (item) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ mode: "onblur" });

  const dispatch = useDispatch();

  if (item.id) {
    setValue("title", item.title);
  }

  const onSubmit = (title) => {
    if (item.id) {
      dispatch(editItem({ id: item.id, title: title.title }));
    } else dispatch(postItem(title.title));

    reset();
  };

  return (
    <div className="form-content">
      <h3>{item.id ? "Edit task" : "Add new task"}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Task title:
          <input type="text" {...register("title", { required: true })} />
        </label>
        <div>
          {errors?.title && (
            <p>{errors?.title?.message || "Title cannot be empty empty"}</p>
          )}
        </div>
        <input type="submit" value={item.id ? "Update" : "Add new task"} />
      </form>
    </div>
  );
};

export default Form;
