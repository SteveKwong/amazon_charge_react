import React, {useEffect, useState} from 'react';
import Wall from "@/pages/AuthFormWrapper/Wall";
import Navigate from "@/pages/Navigate";
import MyFooter from "@/pages/AuthFormWrapper/Footer";
import RegisterForm from "@/pages/AuthFormWrapper/Register/RegisterForm";
import {Spin} from "antd";
import LoginForm from "@/pages/AuthFormWrapper/Login/LoginForm";
import ResetSuccessForm from "@/pages/AuthFormWrapper/ResetSuccess/ResetSuccessForm";


const ResetSuccessPage: React.FC = () => {


    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 1000);
        return () => clearTimeout(timer); // 清理定时器以避免内存泄漏
    }, []);


    return (
        <>
            {/*加载页面*/}
            {pageLoading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <Spin size="large"/>
                </div>
            ) : (
                // 主页
                <>
                    <Navigate/>
                    <Wall>
                        <ResetSuccessForm/>
                    </Wall>
                    <MyFooter/>
                </>
            )}
        </>
    );
};

export default ResetSuccessPage;
