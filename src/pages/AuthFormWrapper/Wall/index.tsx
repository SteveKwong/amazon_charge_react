import React, {useEffect, useState} from 'react';
import './index.scss'
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import JobDisplay from "@/pages/AuthFormWrapper/JobDisplay/index";
import wallpaper from "../../../components/Law Firm Website in Gold Blue Sleek Corporate Style (3).png";


interface BackgroundProps {
    children?: React.ReactNode;
}

const Wall: React.FC<BackgroundProps> = ({children}) => {
    const navigate = useNavigate()

    return (
        <div>
            {/*壁纸*/}
            <div className="background-container">
            <img
                    src={wallpaper}
                    // alt="wallpaper"
                    className="bg"
                />
                <div className="wall-button">
                    <Button
                        className="order-btn"
                        onClick={() => {
                            window.scrollTo({top: 0, behavior: "smooth"}); // 平滑回到顶部
                            navigate("/register")
                        }} // 点击导航
                    >
                        我要接单
                    </Button>
                </div>
                {children}
            </div>
            {/*job展示*/}

            <JobDisplay/>
        </div>
    );
};

export default Wall;
