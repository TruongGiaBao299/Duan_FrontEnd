import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "./utils/axiosCustomize";
import { useContext, useEffect, useState } from "react";
import Home from "./components/pages/Home/Home";
import Register from "./components/pages/Register/Register";
import Header from "./components/layout/Header/Header";
import User from "./components/pages/User/User";
import Contact from "./components/pages/Contact/Contact";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./components/pages/Login/Login";
import { AuthContext, AuthWarrper } from "./context/auth.context";
import Admin from "./components/pages/Admin/Admin";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);
  useEffect(() => {
    const fetchAccount = async () => {

      setAppLoading(true);

      const res = await axios.get(`/v1/api/account`);
      if (res) {
        setAuth({
          isAuthenthicate: true,
          user: {
            email: res.email,
            name: res.name,
            role: res.role,
          },
        });
      }
      setAppLoading(false);
      console.log("check res:", res);
    };
    fetchAccount();
  }, []);

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path="/user" element={<User></User>}></Route>
            <Route path="/contact" element={<Contact></Contact>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/admin" element={<Admin></Admin>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
