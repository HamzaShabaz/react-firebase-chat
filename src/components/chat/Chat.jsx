import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
// import {
//   arrayUnion,
//   doc,
//   getDoc,
//   onSnapshot,
//   updateDoc,
// } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";
import { onValue, ref, serverTimestamp, set } from "firebase/database";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  useEffect(() => {
    const unSub = () => {
      onValue(ref(db, `messages/${currentUser.id}/${chatId}`), (snapshot) => {
        if (snapshot.exists()) {
          console.log("aaaaaaaaaaaaaaaaaaaaaa", snapshot.val());
          setChat(Object.values(snapshot.val()));
        }
      });
    };

    unSub()

    // onValue(ref(db, "chats/", chatId), (snapshot) => {
    //   if (snapshot.exists()) {
    //     console.log("here from the chat.jsx", snapshot.val());
    //     setChat(snapshot.val());
    //   }
    // });

    return () => {
      // unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    // setText((prev) => prev + e.emoji);
    // setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "" && !img.file) {
      console.log("dead");
      return;
    }

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      // await updateDoc(ref(db, "chats/"+ chatId), {
      //   messages: arrayUnion({
      //     senderId: currentUser.id,
      //     text,
      //     createdAt: new Date(),
      //     ...(imgUrl && { img: imgUrl }),
      //   }),
      // });

      console.log(chat?.length + 1 || 0)

      await set(ref(db, `messages/${currentUser.id}/${chatId}/${chat?.length + 1 || 0}`), {
        message : text,
        timestamp : serverTimestamp(),
        isSent : true,
        image : imgUrl
      })

      await set(ref(db, `messages/${chatId}/${currentUser.id}/${chat?.length + 1 || 0}`), {
        message: text,
        timestamp: serverTimestamp(),
        isSent : false,
        image : imgUrl
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        console.log("here", userIDs);
        // const userChatsRef = doc(db, "userchats", id);
        // const userChatsSnapshot = await getDoc(userChatsRef);

        // console.log(userChatsSnapshot);

        // if (userChatsSnapshot.exists()) {
        //   const userChatsData = userChatsSnapshot.data();

        //   const chatIndex = userChatsData.chats.findIndex(
        //     (c) => c.chatId === chatId
        //   );

        //   userChatsData.chats[chatIndex].lastMessage = text;
        //   userChatsData.chats[chatIndex].isSeen =
        //     id === currentUser.id ? true : false;
        //   userChatsData.chats[chatIndex].updatedAt = Date.now();

        //   await updateDoc(userChatsRef, {
        //     chats: userChatsData.chats,
        //   });
        // }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: "",
      });

      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.map((message) => (
          <div
            className={
              message.isSent ? "message own" : "message"
            }
            key={message?.timestamp}
          >
            <div className="texts">
              {message.image && <img src={message.image} alt="" />}
              {message.message && <p>{message.message}</p>}
              <span>{format(message.timestamp)}</span>
            </div>
          </div>
        ))}
        {/* {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )} */}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
