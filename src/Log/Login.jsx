// Login.jsx
import React from "react";
import "./Login.css";
import cloude222 from '../images/cloud.png'
// 배경 구름 이미지
const cloudBackgroundUrl =
  "https://www.figma.com/api/mcp/asset/e43512d3-24d6-4941-a6b5-a09f913da012";

// 소셜 로그인 아이콘 이미지
const socialLoginImageUrl =
  "https://www.figma.com/api/mcp/asset/beceb4fd-fec7-4a82-8ce0-681f7357c2d2";

export default function Login() {
  // 로그인 폼 제출
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: 실제 회원가입/로그인 로직 연결
  };

  return (
    <div className="login-page">
      {/* 전체 파란 배경 + 구름 이미지 */}
      <div className="login-background">
        
      </div>
      <div className="login-background-gradient" />
      {/* <img
          src={cloudBackgroundUrl}
          alt="Cloud background"
          className="login-background-cloud"
        /> */}
        <img src="cloude222" alt="" />
        

      {/* 유리 카드 */}
      <div className="login-card">
        
        
        {/* 타이틀 영역 */}
        <header className="login-header">
          <h1 className="login-title">Get Started</h1>
          <p className="login-subtitle">
            Create your account to analyze the air.
          </p>
        </header>

        {/* 입력 폼 */}
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
            />
          </div>

          <button type="submit" className="login-submit-button">
            Sign up
          </button>
        </form>

        {/* 구분선 + 텍스트 */}
        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-text">Or Sign up with</span>
          <span className="login-divider-line" />
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="login-social-row">
          <button
            type="button"
            className="login-social-button"
            // TODO: 소셜 로그인 핸들러 연결
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
