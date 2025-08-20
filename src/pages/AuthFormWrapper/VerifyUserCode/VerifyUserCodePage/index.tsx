import React, {useEffect, useState} from 'react';
import Wall from "@/pages/AuthFormWrapper/Wall";
import VerifyUserCodeForm from "@/pages/AuthFormWrapper/VerifyUserCode/VerifyUserCodeForm";
import {useLocation} from "react-router-dom";
import Navigate from "@/pages/Navigate";
import ForgetPasswordForm from "@/pages/AuthFormWrapper/ForgetPassword/ForgetPasswordForm";
import {Footer} from "antd/lib/layout/layout";
import MyFooter from "@/pages/AuthFormWrapper/Footer";
import {Spin} from "antd";


const ForgetPasswordPage: React.FC = () => {

    const location = useLocation();
    const {username, verificationCode, verificationCodeType} = location.state || {};
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer); // 清理定时器以避免内存泄漏
    }, []);
    const footerStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#4096ff',
    };
    return (

        <>
            {/*加载页面*/}
            {loading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <Spin size="large"/>
                </div>
            ) : (
                // 主页
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
            )}
        </>


    );
};

export default ForgetPasswordPage;
