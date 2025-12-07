import React from "react";
import "./Head.css";
import logo from "../images/logo1.png";
import { useNavigate } from "react-router-dom";
import {API_URL} from "../api/client"
function Header() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!(username && token);

  // 이름 클릭 (또는 데이터 페이지)
  const handleRightButtonClick = () => {
    if (isLoggedIn) {
      navigate("/data");
    } else {
      navigate("/Join");
    }
  };

  // ✅ 로그아웃
  const handleLogout = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const ok = window.confirm("로그아웃하시겠습니까?");
    if (!ok) return;

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  // ✅ 계정 삭제하기
  const handleDeleteAccount = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    const ok = window.confirm(
      "정말 계정을 삭제하시겠습니까? (되돌릴 수 없습니다)"
    );
    if (!ok) return;

    try {
      // 1) 내 정보에서 id 먼저 얻기
      const infoRes = await fetch("http://localhost:8000/user/info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!infoRes.ok) {
        const body = await infoRes.json().catch(() => null);
        const msg =
          (body && typeof body.detail === "string" && body.detail) ||
          "내 정보를 가져오지 못했습니다.";
        console.error("GET /user/info ERROR:", infoRes.status, body);
        alert(msg);
        return;
      }

      const info = await infoRes.json();

      // 🔴 핵심 수정: id 또는 User_ID 둘 다 대응
      const userId = info.id ?? info.User_ID;

      if (!userId) {
        console.error("USER ID NOT FOUND IN /user/info RESPONSE:", info);
        alert("계정 정보를 찾지 못했습니다.");
        return;
      }

      // 2) DELETE /users/{user_id}
      const delRes = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!delRes.ok) {
        const body = await delRes.json().catch(() => null);
        const msg =
          (body && typeof body.detail === "string" && body.detail) ||
          "계정 삭제에 실패했습니다.";
        console.error("DELETE /users ERROR:", delRes.status, body);
        alert(msg);
        return;
      }

      // 3) 성공: 로컬 스토리지 정리 + 메인으로
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      alert("계정이 삭제되었습니다.");
      navigate("/");
    } catch (e) {
      console.error("DELETE NETWORK ERROR:", e);
      alert("네트워크 오류로 계정 삭제에 실패했습니다.");
    }
  };

  return (
    <header className="head">
      <div className="logo111">
        <img src={logo} alt="AIRZY 로고" />
      </div>

      <nav className="head_menu" role="navigation" aria-label="주요 메뉴">
        <button
          className="menu_le"
          type="button"
          onClick={() => navigate("/alarm")}
        >
          알림 설정하기
        </button>
        <button
          className="menu_le"
          type="button"
          onClick={() => navigate("/graph")}
        >
          그래프
        </button>
        <button
          className="menu_le"
          type="button"
          onClick={() => alert("아직 구현중인 기능입니다.")}//navigate("/data")}
        >
          데이터 값 조회하기
        </button>
        <button
          className="menu_le"
          type="button"
          onClick={() => alert("아직 구현중인 기능입니다.")} //navigate("/feedback")}
        >
          AI피드백
        </button>
      </nav>

      {/* 오른쪽 유저 영역 */}
      <div className="head-auth">
        {isLoggedIn ? (
          <>
            {/* 이름 표시 : 이재준 → 그대로 한 번 */}
            <div className="head-user-pill">
              <span className="head-user-name-text">{username}</span>
            </div>

            {/* 로그아웃 버튼 */}
            <button
              className="head-btn head-btn-logout"
              type="button"
              onClick={handleLogout}
            >
              로그아웃
            </button>

            {/* 계정 삭제 버튼 */}
            <button
              className="head-btn head-btn-danger"
              type="button"
              onClick={handleDeleteAccount}
            >
              계정 삭제
            </button>
          </>
        ) : (
          // 로그인 안 된 상태: Sign up만 표시
          <button
            style={{ color: "black" }}
            className="logi"
            type="button"
            onClick={handleRightButtonClick}
          >
            Sign up
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
