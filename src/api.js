// src/api.js
import axios from "axios";

// # 1. FastAPI 서버 주소
const api = axios.create({
  baseURL: "http://localhost:8000", // FastAPI 주소/포트에 맞게 수정
});

// # 2. 매 요청마다 Authorization 헤더 자동으로 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
