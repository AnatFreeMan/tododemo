import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./todoList.css";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";
import { ReactComponent as RemoveIcon } from "../../assets/remove.svg";

import { CONFIRM_MSG } from "../../constants";
import {
  getTodoList,
  deleteItem,
  patchItem,
  setModalStatus,
} from "../../store/todoListSlice";

const TodoList = () => {
  const todoList = useSelector((state) => state.todoList.todoList);
  const { status, error } = useSelector((state) => state.todoList);

  const dispatch = useDispatch();

  const [modalContent, setModalContent] = useState(<></>);

  useEffect(() => {
    dispatch(getTodoList());
  }, [dispatch]);

  const handleRemoveItem = (itemId) => {
    if (itemId) {
      dispatch(deleteItem(itemId));
      dispatch(setModalStatus(false));
    }
  };

  /* const confirmContent = useMemo(() => (getConfirmContent()), []); */

  const getConfirmContent = (itemId) => {
    return (
      <>
        <p
          dangerouslySetInnerHTML={{
            __html: CONFIRM_MSG.replace("{itemId}", itemId),
          }}
        />
        <button onClick={() => handleRemoveItem(itemId)}>Remove</button>
        <button onClick={() => dispatch(setModalStatus(false))}>Cancel</button>
      </>
    );
  };

  const confirmRemove = (itemId) => {
    if (itemId) {
      setModalContent(getConfirmContent(itemId));
      dispatch(setModalStatus(true));
    }
  };

  const showModal = (id, title) => {
    dispatch(setModalStatus(true));
    setModalContent(<Form id={id ? id : null} title={title ? title : null} />);
  };

  if (error)
    return (
      <>
        <h1>{error}</h1>
      </>
    );

  if (status === "loading")
    return (
      <>
        <h1>Data is loading...</h1>
      </>
    );

  return (
    <>
      {todoList && (
        <>
          <div className="container">
            <button onClick={() => showModal(null, null)}>Add new task</button>
            <div className="header item">
              <div className="cell">Id</div>
              <div className="cell title">Title</div>
              <div className="cell">Completed</div>
              <div className="cell">Remove</div>
            </div>
            {todoList.map((item) => (
              <div className="item" key={item.id}>
                <div className="cell">{item.id}</div>
                <div
                  className="cell title"
                  onClick={() => showModal(item.id, item.title)}
                >
                  {item.title}
                </div>
                <div className="cell">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => dispatch(patchItem(item.id))}
                  />
                </div>
                <div className="cell" onClick={() => confirmRemove(item.id)}>
                  <RemoveIcon></RemoveIcon>
                </div>
              </div>
            ))}
          </div>
          <Modal children={modalContent}></Modal>
        </>
      )}
    </>
  );
};

export default TodoList;
