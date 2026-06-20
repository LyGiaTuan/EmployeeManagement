const ROLE = require("../enums/role");
const db = require("../config/firebaseConfig");

const getChatGroups = async (userId, role) => {
  isEmployee = role == ROLE.EMPLOYEE;
  let chatGroups = [];
  await db.runTransaction(async (tx) => {
    if (isEmployee) {
      const chatGroupRef = await db.collection("chatGroups").doc(userId);
      const chatGroupSnapshot = await tx.get(chatGroupRef);
      if (chatGroupSnapshot.exists) {
        chatGroups.push(chatGroupSnapshot.data());
      }
    } else {
      const chatGroupsQuery = await db
        .collection("chatGroups")
        .orderBy("workTime", "desc");
      const chatGroupsSnapshot = await tx.get(chatGroupsQuery);
      chatGroupsSnapshot.forEach((chatGroupSnapshot) => {
        chatGroups.push(chatGroupSnapshot.data());
      });
    }
  });
  return chatGroups;
};

const getMessages = async (employeeId) => {
  let messages = [];
  await db.runTransaction(async (tx) => {
    const messagesQuery = db
      .collection("messages")
      .where("employeeId", "==", employeeId)
      .orderBy("workTime");

    const messagesSnapshot = await tx.get(messagesQuery);
    messagesSnapshot.forEach((messageSnapshot) => {
      messages.push(messageSnapshot.data());
    });
  });
  return messages;
};

const createMessage = async (message) => {
  await db.runTransaction(async (tx) => {
    const chatGroupSnapshot = await tx.get(
      db.collection("chatGroups").doc(message.employeeId),
    );

    if (chatGroupSnapshot.exists) {
      const chatGroup = chatGroupSnapshot.data();

      await tx.set(db.collection("messages").doc(), message);
      await tx.set(db.collection("chatGroups").doc(message.employeeId), {
        ...chatGroup,
        workTime: message.workTime,
        lastMessage: message.content,
        isEmployeeSender: message.isEmployeeSender,
      });
    }
  });
};

module.exports = { getChatGroups, getMessages, createMessage };
