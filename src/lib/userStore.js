import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { onValue, ref } from "firebase/database";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = ref(db, "users/"+ uid);
      onValue(docRef, (snapshot) => {
        if(snapshot.exists()) {
          set({ currentUser: snapshot.val(), isLoading: false });
        }
        else {
          set({ currentUser: null, isLoading: false });
        }
      })
      // const docSnap = await getDoc(docRef);

      // if (docSnap.exists()) {
      //   set({ currentUser: docSnap.data(), isLoading: false });
      // } else {
      //   set({ currentUser: null, isLoading: false });
      // }
    } catch (err) {
      console.log(err);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));
