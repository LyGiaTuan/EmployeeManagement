import { useContext, useEffect, useState } from "react";
import ChatGroupsContext from "../contexts/ChatGroupsContext";
import SocketContext from "../contexts/SocketContext";

const ChatGroupsProvider = ({ children }) => {
  const socketClient = useContext(SocketContext);

  const [chatGroups, setChatGroups] = useState([]);
  useEffect(() => {
    const handleServerSendGroups = (data) => {
      setChatGroups([...data]);
    };
    socketClient.on("server_send_groups", handleServerSendGroups);

    const handleServerSendGroup = (data) => {
      setChatGroups([{ ...data }, ...chatGroups]);
    };
    socketClient.on("server_send_group", handleServerSendGroup);

    const handleServerDeleteGroup = (employeeId) => {
      setChatGroups(
        chatGroups.filter((chatGroup) => chatGroup.employeeId !== employeeId),
      );
    };
    socketClient.on("server_delete_group", handleServerDeleteGroup);

    const handleServerSendMessage = (message) => {
      let foundChatGroup;
      if (message.employeeId !== chatGroups[0].employeeId) {
        foundChatGroup = chatGroups.find(
          (chatGroup) => chatGroup.employeeId === message.employeeId,
        );
      } else {
        foundChatGroup = chatGroups[0];
      }

      foundChatGroup.workTime = message.workTime;
      foundChatGroup.lastMessage = message.content;
      foundChatGroup.isEmployeeSender = message.isEmployeeSender;

      setChatGroups([
        ...chatGroups.sort(
          (chatGroup1, chatGroup2) => chatGroup2.workTime - chatGroup1.workTime,
        ),
      ]);
    };
    socketClient.on("server_send_message", handleServerSendMessage);

    return () => {
      socketClient.off("server_send_groups", handleServerSendGroups);
      socketClient.off("server_send_group", handleServerSendGroup);
      socketClient.off("server_delete_group", handleServerDeleteGroup);
      socketClient.off("server_send_message", handleServerSendMessage);
    };
  }, [chatGroups, socketClient]);

  return (
    <ChatGroupsContext.Provider value={chatGroups}>
      {children}
    </ChatGroupsContext.Provider>
  );
};

export default ChatGroupsProvider;
