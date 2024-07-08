import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";
import { get, onValue, ref, serverTimestamp, set } from "firebase/database";
import { toast } from "react-toastify";

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      onValue(ref(db, "users"), (snapshot) => {
        if (true) {
          console.log("here from the chat.jsx", currentUser);
          let allUsers = snapshot.val()
          let usersArray = Object.values(allUsers)
          let index = usersArray.findIndex((user) => user.username.toLowerCase() === username.toLowerCase())
          if(index != -1) {
            setUser(usersArray[index])
          }
        }
      });

      // const q = query(userRef, where("username", "==", username));

      // const querySnapShot = await getDocs(q);

      // if (!querySnapShot.empty) {
      //   setUser(querySnapShot.docs[0].data());
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const tryUpdate = true
    const interactionRef = ref(db,`interactions/${currentUser.id}/${user.id}`)
    try {
      const snapshot = await get(interactionRef);
  
      if (snapshot.exists()) {
        console.log("here from the chat.jsx", snapshot.val());
        toast.error("The user is already connected");
      } else {
        // Set the first interaction entry for the current user
        await set(ref(db, `interactions/${currentUser.id}/${user.id}`), {
          id: user.id,
          username: user.username,
          createdAt: serverTimestamp(),
        });
  
        // Set the second interaction entry for the other user
        await set(ref(db, `interactions/${user.id}/${currentUser.id}`), {
          id: currentUser.id,
          username: currentUser.username,
          createdAt: serverTimestamp(),
        });
  
        toast.success("The user is added successfully");
      }
    } catch (error) {
      console.error("Error checking interaction:", error);
      toast.error("An error occurred while checking the interaction");
    }
    // const chatRef = ref(db, "chats");
    // const userChatsRef = ref(db, "userchats/" + user.id);

    // try {
    //   const newChatRef = set(chatRef);

    //   await set(chatRef, {
    //     createdAt: serverTimestamp(),
    //     messages: {
    //       0 : "null"
    //     },
    //   });

    //   const snapshot = await get(userChatsRef)

    //   if(userChatsRef.chats) {
    //     const keys = Object.keys(userChatsRef.chats)
    //     let lastKey = keys[keys.length-1]
    //     console.log(lastKey)
    //   }

    //   await set(userChatsRef, {
    //     chats: arrayUnion({
    //       chatId: newChatRef.id,
    //       lastMessage: "",
    //       receiverId: currentUser.id,
    //       updatedAt: Date.now(),
    //     }),
    //   });

    //   await updateDoc(doc(userChatsRef, currentUser.id), {
    //     chats: arrayUnion({
    //       chatId: newChatRef.id,
    //       lastMessage: "",
    //       receiverId: user.id,
    //       updatedAt: Date.now(),
    //     }),
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
