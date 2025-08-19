import React from 'react';
import './index.scss'
import Navigate from "@/pages/Navigate";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import JobDisplay from "@/pages/AuthFormWrapper/JobDisplay/index";

interface BackgroundProps {
    children?: React.ReactNode;
}

const Wall: React.FC<BackgroundProps> = ({children}) => {
    const navigate = useNavigate()
    return (
        <div>

            {/*壁纸*/}
            <div className="background-container">

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
