import { useContext, useEffect, useState } from "react";
import blankAvatarIcon from "../../../assets/blankAvatarIcon.svg";
import ChatGroupsContext from "../../../contexts/ChatGroupsContext";
import SocketContext from "../../../contexts/SocketContext";
import { ROLE } from "../../../utils/RoleEnum";
import Conversion from "../../common/MessageScreen/components/Conversation";
import ChatBox from "./components/ChatBox";
import styles from "./styles.module.css";

const MessageScreen = () => {
  const chatGroups = useContext(ChatGroupsContext);
  const socketClient = useContext(SocketContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isSelected, setIsSelected] = useState();
  const [messages, setMessages] = useState([]);
  const onClick = (userId) => {
    setIsSelected(userId);
    if (user?.role === ROLE.MANAGER) {
      socketClient.emit("client_send_messages_request", userId);
      return;
    }
    socketClient.emit("client_send_messages_request", user?.id);
  };

  const send = (value) => {
    if (isSelected) {
      const message = {
        employeeId: user.role === ROLE.MANAGER ? isSelected : user.id,
        isEmployeeSender: user.role === ROLE.EMPLOYEE,
        content: value,
        workTime: new Date().valueOf(),
        managerId: user.role !== ROLE.MANAGER ? isSelected : user.id,
      };
      socketClient.emit("client_send_message", message);
    }
  };

  useEffect(() => {
    const handleServerSendMessages = (messages) => {
      setMessages(messages);
    };
    socketClient.on("server_send_messages", handleServerSendMessages);

    const handleServerSendMessage = (message) => {
      if (
        (user?.role === ROLE.EMPLOYEE && message?.managerId === isSelected) ||
        (user?.role === ROLE.MANAGER && message?.employeeId === isSelected)
      ) {
        setMessages([...messages, message]);
      }
    };
    socketClient.on("server_send_message", handleServerSendMessage);
    return () => {
      socketClient.off("server_send_messages", handleServerSendMessages);
      socketClient.off("server_send_message", handleServerSendMessage);
    };
  }, [socketClient, messages, isSelected, user?.role]);

  return (
    <div className={styles.container}>
      <div className={styles.conversations}>
        {chatGroups?.map((chatGroup) => {
          return (
            <Conversion
              isSelected={
                user?.role === ROLE.EMPLOYEE
                  ? isSelected === chatGroup.managerId
                  : isSelected === chatGroup.employeeId
              }
              onClick={onClick}
              userId={
                user?.role === ROLE.EMPLOYEE
                  ? chatGroup.managerId
                  : chatGroup.employeeId
              }
              key={chatGroup.employeeId}
              src={blankAvatarIcon}
              name={
                user?.role === ROLE.EMPLOYEE
                  ? chatGroup.managerName
                  : chatGroup.employeeName
              }
              message={chatGroup.lastMessage}
              isSender={
                (chatGroup.isEmployeeSender && user?.role === ROLE.EMPLOYEE) ||
                (!chatGroup.isEmployeeSender && user?.role === ROLE.MANAGER)
              }
            />
          );
        })}
      </div>
      <div className={styles.chatBoxContainer}>
        <ChatBox role={user?.role} messages={messages} send={send} />
      </div>
    </div>
  );
};

export default MessageScreen;
