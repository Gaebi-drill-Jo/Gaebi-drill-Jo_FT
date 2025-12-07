import React, { useState } from "react";
import "./Join.css";
import cloud from '../images/cloud.png'
import { useNavigate } from "react-router-dom";
import {API_URL} from "../api/client"

const socialLoginImageUrl =
  "https://www.figma.com/api/mcp/asset/beceb4fd-fec7-4a82-8ce0-681f7357c2d2";

export default function Join() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setErrorMessage("");

    const payload = {
      username: name,
      useremail: email,
      password: password,
    };

    try {
      const res = await fetch(`${API_URL}/users`, {
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

        if (res.status === 409 && errBody && errBody.detail) {
          // "Username already exists" / "Useremail already exists"
          setErrorMessage(errBody.detail);
        } else {
          setErrorMessage("회원가입 중 오류가 발생했습니다.");
        }
        setStatus("error");
        return;
      }

      const data = await res.json();
      console.log("SIGNUP OK:", data);
      setStatus("success");
      // ✅ 회원가입 후 로그인 페이지로 이동
      navigate("/login");
    } catch (err) {
      console.error("SIGNUP NETWORK ERROR:", err);
      setErrorMessage("네트워크 오류로 회원가입에 실패했습니다.");
      setStatus("error");
    }
  };

  return (
    <div className="login-page">
      {/* 배경 */}
      <div className="login-background"></div>
      <div className="login-background-gradient" />
      <img
        src={cloud}
        alt=""
        className="login-background-cloud"
      />

      {/* 카드 */}
      <div className="login-card">
        <header className="login-header">
          <h1 className="login-title">Get Started</h1>
          <p className="login-subtitle">
            Create your account to analyze the air.
          </p>
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
              required
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

          <button type="submit" className="login-submit-button">
            Sign up
          </button>

          <button
            type="button"
            className="join-submit-button"
            onClick={() => navigate("/login")}
          >
            이미 계정이 있나요? 로그인
          </button>

          {status === "error" && (
            <p style={{ color: "red", marginTop: "8px" }}>
              {errorMessage || "회원가입에 실패했습니다."}
            </p>
          )}
        </form>

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
