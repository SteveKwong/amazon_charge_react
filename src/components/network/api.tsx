import axios from "axios";

// 创建 axios 实例
const api = axios.create({
  baseURL: "http://localhost:8000/jinx/", // 你的 API 地址
  // baseURL: "http://127.0.0.1:8000/jinx/", // 你的 API 地址
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

// 响应拦截器 - 统一处理401等错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // 如果当前不在登录页，则跳转
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
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
