import styles from "./styles.module.css";
import rightArrow from "../../../../../assets/rightArrow.svg";
import { useEffect, useRef, useState } from "react";
import { ROLE } from "../../../../../utils/RoleEnum";

const ChatBox = ({ role, messages, send }) => {
  const [value, setValue] = useState("");
  const messagesRef = useRef();
  useEffect(() => {
    if (messages?.length) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
      });
    }
  }, [messages]);
  return (
    <div className={styles.container}>
      <div className={styles.messages} ref={messagesRef}>
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`${styles.messageContainer} ${
                ((message.isEmployeeSender && role === ROLE.EMPLOYEE) ||
                  (!message.isEmployeeSender && role === ROLE.MANAGER)) &&
                styles.leftMessageContainer
              }`}
            >
              <div className={styles.message}>{message.content}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.messageInputContainer}>
        <input
          className={styles.messageInput}
          placeholder={"Reply message"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <button
          className={styles.sendButton}
          onClick={() => {
            if (value) {
              setValue("");
              send(value);
            }
          }}
        >
          <img className={styles.sendIcon} src={rightArrow} alt={"send icon"} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
