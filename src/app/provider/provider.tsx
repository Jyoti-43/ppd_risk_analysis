"use client";  // ✅ Only this file needs "use client"

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ToastContainer } from "react-toastify";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <ToastContainer />
    </Provider>
  );
}