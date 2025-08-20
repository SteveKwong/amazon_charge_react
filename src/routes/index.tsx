import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from '@/pages/Home';
import Wall from "@/pages/AuthFormWrapper/Wall";
import LoginPage from "@/pages/AuthFormWrapper/Login/LoginPage";
import ForgetPasswordPage from "@/pages/AuthFormWrapper/ForgetPassword/ForgetPasswordPage";
import VerifyUserCodePage from "@/pages/AuthFormWrapper/VerifyUserCode/VerifyUserCodePage";
import ResetPasswordPage from "@/pages/AuthFormWrapper/ResetPassword/ResetPasswordPage";
import NotExist from "@/pages/NotExist";
import RegisterPage from "@/pages/AuthFormWrapper/Register/RegisterPage";
import ResetSuccessPage from "@/pages/AuthFormWrapper/ResetSuccess/ResetSuccessPage";


const AppRouter = () => (
    <Router>
        <Routes>
            <Route path="*" element={<NotExist/>}/> {/* 捕获所有其他路径 */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/wall" element={<Wall/>}/>
            <Route path="/forget-password" element={<ForgetPasswordPage/>}/>
            <Route path="/verify-user-code" element={<VerifyUserCodePage/>}/>
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/reset-success" element={<ResetSuccessPage/>}/>
        </Routes>
    </Router>
);

export default AppRouter;
