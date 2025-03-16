// import {create} from "zustand";
// import { createAuthSlice } from "./slices/auth-slice";
// import { createCheck} from "./slices/check";
// import { persist } from 'zustand/middleware';
// const sessionStorageMiddleware = {
//     getItem: (name) => sessionStorage.getItem(name), // Read from sessionStorage
//     setItem: (name, value) => sessionStorage.setItem(name, value), // Write to sessionStorage
//     removeItem: (name) => sessionStorage.removeItem(name), // Remove from sessionStorage
//   };

// export const useappstore=create(
//     persist((...a)=>({
//     ...createAuthSlice(...a),
//     ...createCheck(...a)
// }),{
//     name: "app-storage", 
//     storage: sessionStorageMiddleware,
//   }
// ));
import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createCheck } from "./slices/check";
import { persist } from "zustand/middleware";
import { createChatSlice } from "./slices/chat-slice";
import { createChannel } from "./slices/channel-slicse";

// Custom sessionStorage middleware for Zustand
const sessionStorageMiddleware = {
  getItem: (name) => {
    const storedValue = sessionStorage.getItem(name);
    return storedValue ? JSON.parse(storedValue) : null; // Parse JSON data
  },
  setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)), // Store as JSON
  removeItem: (name) => sessionStorage.removeItem(name),
};

// Zustand store with slices and sessionStorage persistence
export const useappstore = create(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createCheck(...a),
      ...createChatSlice(...a),
      ...createChannel(...a),
    }),
    {
      name: "app-storage",
      storage: sessionStorageMiddleware,
    }
  )
);
