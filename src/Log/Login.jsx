// Login.jsx
import React, { useState } from "react";
import "./Login.css";
import cloude222 from "../images/cloud.png";
import { useNavigate } from "react-router-dom";
import {API_URL} from "../api/client"

const socialLoginImageUrl =
  "https://www.figma.com/api/mcp/asset/beceb4fd-fec7-4a82-8ce0-681f7357c2d2";



export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");      // UI용 이름
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState(null);       // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      setStatus("error");
      return;
    }

    const payload = {
      useremail: email,
      password: password,
    };

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errBody = null;
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          errBody = await res.json();
        }

        if (res.status === 401 && errBody && errBody.detail) {
          setErrorMessage(errBody.detail); // "Invalid email or password"
        } else {
          setErrorMessage("로그인에 실패했습니다.");
        }
        setStatus("error");
        return;
      }

      const data = await res.json();
      // { access_token, token_type, expires_in } (백엔드 명세 기준)

      // ✅ 토큰 + 이름 저장 → 헤더에서 쓸 수 있게
      localStorage.setItem("token", data.access_token);
      if (name) {
        localStorage.setItem("username", name);
      }

      setStatus("success");
      navigate("/"); // 메인 페이지로 이동
    } catch (err) {
      console.error("LOGIN NETWORK ERROR:", err);
      setErrorMessage("네트워크 오류로 로그인에 실패했습니다.");
      setStatus("error");
    }
  };

  return (
    <div className="login-page">
      {/* 배경 */}
      <div className="login-background"></div>
      <div className="login-background-gradient" />
      <img
        src={cloude222}
        alt=""
        className="login-background-cloud"
      />

      {/* 카드 */}
      <div className="login-card">
        <header className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Log in to see your air data.</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="name" className="login-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="login-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ 여기서는 진짜 Login 버튼 */}
          <button type="submit" className="login-submit-button">
            Log in
          </button>

          {status === "error" && (
            <p style={{ color: "red", marginTop: "8px" }}>
              {errorMessage || "로그인에 실패했습니다."}
            </p>
          )}
        </form>

        {/* 구분선 + 소셜 */}
        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-text">Or Sign up with</span>
          <span className="login-divider-line" />
        </div>

        <div className="login-social-row">
          <button
            type="button"
            className="login-social-button"
          >
            <img
              src={socialLoginImageUrl}
              alt="Social sign up"
              className="login-social-image"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
