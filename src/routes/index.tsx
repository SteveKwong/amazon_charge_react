import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Wall from "@/pages/AuthFormWrapper/Wall";
import LoginPage from "@/pages/AuthFormWrapper/Login/LoginPage";
import ForgetPasswordPage from "@/pages/AuthFormWrapper/ForgetPassword/ForgetPasswordPage";
import VerifyUserCodePage from "@/pages/AuthFormWrapper/VerifyUserCode/VerifyUserCodePage";
import ResetPasswordPage from "@/pages/AuthFormWrapper/ResetPassword/ResetPasswordPage";
import NotExist from "@/pages/NotExist";
import RegisterPage from "@/pages/AuthFormWrapper/Register/RegisterPage";
import ResetSuccessPage from "@/pages/AuthFormWrapper/ResetSuccess/ResetSuccessPage";
import LoginByPhone from "@/pages/AuthFormWrapper/LoginByPhone/LoginByPhonePage";
import HomeLayout from "@/pages/Home";
import LobbyPage from "@/pages/Home/Lobby";
import OrderDetailPage from "@/pages/Home/Lobby/OrderDetail";
import SettingsPage from "@/pages/Home/Settings";
import NoticePage from "@/pages/Home/Notice";
import SalesPage from "@/pages/Home/Sales";
import MyOrdersPage from "@/pages/Home/Mine/Orders";
import MyOrderDetailPage from "@/pages/Home/Mine/Orders/OrderDetail";
import MyProfilePage from "@/pages/Home/Mine/Profile";
import MyBillingPage from "@/pages/Home/Mine/Billing";
import DegradedPage from "@/pages/Degraded";
import AuthGuard from "@/components/AuthGuard";


const AppRouter = () => (
    <Router>
        <Routes>
            {/* 根路径始终指向登录页面 */}
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            
            {/* 需要认证的路由 */}
            <Route path="/home" element={<AuthGuard><HomeLayout/></AuthGuard>}>
                <Route index element={<Navigate to="order-hall/notice" replace />} />
                <Route path="lobby" element={<Navigate to="order-hall/notice" replace />} />
                <Route path="order-hall">
                    <Route index element={<Navigate to="notice" replace />} />
                    <Route path="notice" element={<NoticePage/>} />
                    <Route path="lobby" element={<LobbyPage/>} />
                    <Route path="sales" element={<SalesPage/>} />
                </Route>
                <Route path="order-detail/:jobId" element={<OrderDetailPage/>} />
                <Route path="my-order-detail/:jobId" element={<MyOrderDetailPage/>} />
                <Route path="mine">
                    <Route index element={<Navigate to="orders" replace />} />
                    <Route path="orders" element={<MyOrdersPage/>} />
                    <Route path="profile" element={<MyProfilePage/>} />
                    <Route path="billing" element={<MyBillingPage/>} />
                </Route>
                <Route path="settings" element={<SettingsPage/>} />
            </Route>
            
            {/* 其他公共路由 */}
            <Route path="/wall" element={<Wall/>}/>
            <Route path="/forget-password" element={<ForgetPasswordPage/>}/>
            <Route path="/verify-user-code" element={<VerifyUserCodePage/>}/>
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/reset-success" element={<ResetSuccessPage/>}/>
            <Route path="/loginbyphone" element={<LoginByPhone/>}/>
            <Route path="/degraded" element={<DegradedPage/>}/>
            
            {/* 捕获所有其他路径 */}
            <Route path="*" element={<NotExist/>}/>
        </Routes>
    </Router>
);

export default AppRouter;
