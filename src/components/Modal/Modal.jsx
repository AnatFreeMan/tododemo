import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { setModalStatus } from "../../store/todoListSlice";
import "./modal.css";

const modalRootElement = document.querySelector("#modal");

const Modal = ({ children }) => {
  const dispatch = useDispatch();

  const isModalActive = useSelector((state) => state.todoList.isModalActive);

  const element = useMemo(() => document.createElement("div"), []);
  
  useEffect(() => {
    if (isModalActive) {
      modalRootElement.appendChild(element);

      return () => {
        modalRootElement.removeChild(element);
      };
    }
  });

   if (isModalActive)
    return createPortal(
      <div
         className={isModalActive ? "modal active" : "modal"}
        onClick={() => dispatch(setModalStatus(false))}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>,element
    );

    return null;

};

export default Modal;
