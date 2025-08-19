import React from 'react';
import Wall from "@/pages/AuthFormWrapper/Wall";
import VerifyUserCodeForm from "@/pages/AuthFormWrapper/VerifyUserCode/VerifyUserCodeForm";
import {useLocation} from "react-router-dom";
import Navigate from "@/pages/Navigate";
import ForgetPasswordForm from "@/pages/AuthFormWrapper/ForgetPassword/ForgetPasswordForm";
import {Footer} from "antd/lib/layout/layout";
import MyFooter from "@/pages/AuthFormWrapper/Footer";


const ForgetPasswordPage: React.FC = () => {

    const location = useLocation();
    const {username, verificationCode, verificationCodeType} = location.state || {};

    return (
        <>
            <Navigate/>
            <Wall>
                <VerifyUserCodeForm
                    username={username}
                    verificationCodeType={verificationCodeType}
                />
            </Wall>
            <MyFooter/>
        </>

    );
};

export default ForgetPasswordPage;
