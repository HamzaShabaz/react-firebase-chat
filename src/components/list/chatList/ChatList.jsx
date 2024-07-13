import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { onValue, ref } from "firebase/database";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    // const unSub = onSnapshot(
    //   doc(db, "userchats", currentUser.id),
    //   async (res) => {
    //     const items = res.data().chats;

    //     const promises = items.map(async (item) => {
    //       const userDocRef = doc(db, "users", item.receiverId);
    //       const userDocSnap = await getDoc(userDocRef);

    //       const user = userDocSnap.data();

    //       return { ...item, user };
    //     });

    //     const chatData = await Promise.all(promises);

    //     setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    //   }
    // );

    const unSub = () => {
      onValue(ref(db, `interactions/${currentUser.id}/`), async (snapshot) => {
        console.log(snapshot)
        if (snapshot.exists()) {
          let interactions = snapshot.val()
          setChats(Object.values(interactions))
          // const chatData = await Promise.all(promises);

          // setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
          // setChats(snapshot.val());
        }
      });
    };

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {

    changeChat(chat.id, chat.username);

    // try {
    //   await updateDoc(userChatsRef, {
    //     chats: userChats,
    //   });
    //   changeChat(chat.chatId, chat.user);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const filteredChats = chats.filter((c) =>
    c.username.toLowerCase().includes(input.toLowerCase())
  );

  console.log(filteredChats)

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.id}
          onClick={() => handleSelect(chat)}
        >
          <div className="texts">
            <span>
              {chat.username}
            </span>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
