import React, {useEffect, useState} from "react";
import {Card, Row, Col, Button} from "antd";
import {getRequest} from "@/components/network/api";


const JobCard: React.FC<{ job: Job }> = ({job}) => {

    const [hover, setHover] = useState(false);

    /**
     * 注册页面的url
     */
    const url = "register";

    return (
        <Card
            className="job-card"
            title={`${job.job_type} - ${job.title}`}
            bordered={false} // 开启边框
            style={{
                border: hover ? "2px solid #1890ff" : "2px solid transparent", // hover显示蓝框
                transition: "all 0.3s", // 平滑过渡
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >

            <p style={{color: "#666"}}>{job.city}</p>

            <div style={{fontSize: "15px", lineHeight: "22px"}}>
                <div>
                    入职结算：
                    {job.short_term_settlement_work_day && job.long_term_settlement_work_day ? "有" : "无"}
                </div>

                <div style={{marginTop: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                    {/* 标题行 */}
                    {job.short_term_settlement_work_day && job.long_term_settlement_work_day &&
                        <div style={{color: "gray", fontSize: "13px"}}>质保期</div>}
                    {job.short_term_settlement_work_day && job.long_term_settlement_work_day &&
                        <div style={{color: "gray", fontSize: "13px"}}>交付结算</div>}

                    {/* 质保期数据 */}
                    {job.short_term_settlement_work_day && job.short_term_settlement_amount !== null && (
                        <>
                            <div style={{color: "black", fontWeight: "bold"}}>
                                {job.short_term_settlement_work_day}天 -{" "}
                                <span style={{color: "orange", fontWeight: "bold"}}>
                        {job.short_term_settlement_amount} 元
                    </span>
                            </div>
                        </>
                    )}

                    {/* 交付结算数据 */}
                    {job.long_term_settlement_work_day && job.long_term_settlement_amount !== null && (
                        <>
                            <div style={{color: "black", fontWeight: "bold"}}>
                                {job.long_term_settlement_work_day}天 -{" "}
                                <span style={{color: "orange", fontWeight: "bold"}}>
                        {job.long_term_settlement_amount} 元
                    </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Hover按钮 */}
            {hover && (
                <Button
                    type="primary"
                    className="job-card-button"
                    style={{
                        position: "absolute",
                        bottom: "90px",
                        right: "20px",
                    }}
                    onClick={() => {
                        window.open(url, "_blank"); // 打开新页面
                    }}
                >
                    我要接单
                </Button>
            )}
        </Card>

    );
};


const JobDisplay = () => {
    const jobdisplaytitle = "高薪职位实时共享";
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getRequest("/portal/portalJobList", undefined, false);
                // 假设接口返回的数据结构是 { jobs: [...] }
                setJobs(response.jobs || []);
            } catch (err) {
                setJobs([]);
                console.error("获取职位数据失败:", err);
            }
        };
        fetchJobs();
    }, []);


    return (
        <div style={{
            padding: "40px",
            backgroundImage: "url('../../../components/Law Firm Website in Gold Blue Sleek Corporate Style (5).png')"
        }}>
            <h2
                style={{
                    marginBottom: "60px",
                    color: "#2a2d58",
                    fontSize: "40px",
                    textAlign: "center"
                }}
            >
                {jobdisplaytitle}
            </h2>

            {
                jobs.length > 0 &&
                <div
                    style={{
                        justifyContent: "center", // 水平居中
                        alignItems: "center",     // 垂直居中
                        minHeight: "10vh",       // 高度撑满整个屏幕
                    }}>
                    {/*拿不到数据会报错*/}
                    <Row gutter={[0, 10]}> {/* 间距设为0 */}
                        {jobs.map((job, index) => (
                            <Col key={index} span={8}>
                                <JobCard job={job}/>
                            </Col>
                        ))}
                    </Row>
                </div>
            }


        </div>
    );
};

export default JobDisplay;
