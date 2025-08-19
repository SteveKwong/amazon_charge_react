import React from 'react';
import Wall from "@/pages/AuthFormWrapper/Wall";
import {useLocation} from "react-router-dom";
import Navigate from "@/pages/Navigate";
import MyFooter from "@/pages/AuthFormWrapper/Footer";
import ResetPasswordForm from "@/pages/AuthFormWrapper/ResetPassword/ResetPasswordForm";


const ForgetPasswordPage: React.FC = () => {

    const location = useLocation();
    const {username} = location.state || {};


    return (
        <>
            <Navigate/>
            <Wall>
                <ResetPasswordForm
                    username={username}
                />
            </Wall>
            <MyFooter/>
        </>

    );
};

export default ForgetPasswordPage;
