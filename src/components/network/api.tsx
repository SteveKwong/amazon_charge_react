import axios from "axios";

// 创建 axios 实例
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/jinx/", // 你的 API 地址
  // baseURL: "http://124.222.225.192:8000/jinx/", // 你的 API 地址
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 检查 localStorage 是否有 token
    const token = localStorage.getItem("token");
    // 如果存在 token 且请求需要 token（非登录请求），则在请求头中添加 Authorization
    if (token && config.url !== "/login") {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 默认请求方法封装
export const postRequest = async (
  url: string,
  data: object,
  needsToken: boolean = false
) => {
  try {
    const response = await api.post(url, data, {
      headers: needsToken
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRequest = async (
  url: string,
  params: object = {},
  needsToken: boolean = false
) => {
  try {
    const response = await api.get(url, {
      params,
      headers: needsToken
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
