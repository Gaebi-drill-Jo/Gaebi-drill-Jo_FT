// alarm.jsx
import { useState } from "react";
import "./alarm.css";
import { API_URL } from "../api/client";

export default function Alarm() {
  // 미세먼지
  const [pmUpper, setPmUpper] = useState("");
  const [pmLower, setPmLower] = useState("");
  // 온도
  const [tempUpper, setTempUpper] = useState("");
  const [tempLower, setTempLower] = useState("");
  // 습도
  const [humUpper, setHumUpper] = useState("");
  const [humLower, setHumLower] = useState("");
  // Time (분 단위)
  const [timeStart, setTimeStart] = useState("");   // 현재 API에서는 사용 X (UI만 유지)
  const [timeInterval, setTimeInterval] = useState("");

  const [status, setStatus] = useState(null); // null | "success" | "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    // 1) 어떤 센서를 기준으로 쓸지 결정 (pm > temp > humi 우선순위)
    const payload = {
      pm25_check: null,
      temperature_check: null,
      humidity_check: null,
      minutes: 5, // 기본값 5분
    };

    // minutes 값 설정 (1~60 사이만 허용) – Interval 입력을 나중에 다시 살리면 사용
    if (timeInterval !== "") {
      const m = Number(timeInterval);
      if (!Number.isNaN(m)) {
        const clamped = Math.min(Math.max(m, 1), 60);
        payload.minutes = clamped;
      }
    }

    // 센서 임계값 하나만 설정 (백엔드 설계에 맞춤)
    if (pmUpper !== "") {
      payload.pm25_check = Number(pmUpper);
    } else if (tempUpper !== "") {
      payload.temperature_check = Number(tempUpper);
    } else if (humUpper !== "") {
      payload.humidity_check = Number(humUpper);
    } else {
      alert("최소 한 개 이상의 Upper 값을 입력해 주세요.");
      setStatus("error");
      return;
    }

    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    if (!token) {
      alert("로그인이 필요합니다.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/user/info/alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("ALERT ERROR STATUS:", res.status);
        alert("저장에 실패했습니다.");
        setStatus("error");
        return;
      }

      setStatus("success");
      alert("알림 설정이 저장되었습니다.");
    } catch (e) {
      console.error("ALERT NETWORK ERROR:", e);
      alert("네트워크 오류로 저장에 실패했습니다.");
      setStatus("error");
    }
  };

  return (
    <div className="alarm-root">
      <form className="alarm-card" onSubmit={handleSubmit}>
        <div className="alarm-card-content">
          {/* 제목 */}
          <h2 className="alarm-title">Notification Setting</h2>
          <span>Lower는 아직 구현 중입니다.</span>

          {/* 상단 컬럼 라벨 */}
          <div className="alarm-columns-header">
            <div className="alarm-column-header">미세먼지</div>
            <div className="alarm-column-header">온도</div>
            <div className="alarm-column-header">습도</div>
          </div>

          {/* 컨트롤 영역 */}
          <div className="alarm-columns">
            {/* ---- 미세먼지 ---- */}
            <div className="alarm-column">
              <div className="alarm-chip-row">
                <div className="alarm-chip">
                  <span className="alarm-chip-label">Upper</span>
                  <div className="alarm-chip-control">
                    <input
                      className="alarm-chip-input"
                      type="number"
                      placeholder="50"
                      value={pmUpper}
                      onChange={(e) => setPmUpper(e.target.value)}
                    />
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
              <div className="alarm-chip-row">
                <div className="alarm-chip">
                  <span className="alarm-chip-label">Lower</span>
                  <div className="alarm-chip-control">
                    <input
                      className="alarm-chip-input"
                      type="number"
                      placeholder="20"
                      value={pmLower}
                      onChange={(e) => setPmLower(e.target.value)}
                      disabled // 아직 미구현
                    />
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- 온도 ---- */}
            <div className="alarm-column">
              <div className="alarm-chip-row">
                <div className="alarm-chip">
                  <span className="alarm-chip-label">Upper</span>
                  <div className="alarm-chip-control">
                    <input
                      className="alarm-chip-input"
                      type="number"
                      placeholder="28"
                      value={tempUpper}
                      onChange={(e) => setTempUpper(e.target.value)}
                    />
                    <span className="alarm-chip-unit">℃</span>
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
              <div className="alarm-chip-row">
                <div className="alarm-chip">
                  <span className="alarm-chip-label">Lower</span>
                  <div className="alarm-chip-control">
                    <input
                      className="alarm-chip-input"
                      type="number"
                      placeholder="20"
                      value={tempLower}
                      onChange={(e) => setTempLower(e.target.value)}
                      disabled
                    />
                    <span className="alarm-chip-unit">℃</span>
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- 습도 ---- */}
            <div className="alarm-column">
              <div className="alarm-chip-row">
                <div className="alarm-chip">
                  <span className="alarm-chip-label">Upper</span>
                  <div className="alarm-chip-control">
                    <input
                      className="alarm-chip-input"
                      type="number"
                      placeholder="70"
                      value={humUpper}
                      onChange={(e) => setHumUpper(e.target.value)}
                    />
                    <span className="alarm-chip-unit">%</span>
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
              <div className="alarm-chip-row">
                <div className="alarm-chip">
                  <span className="alarm-chip-label">Lower</span>
                  <div className="alarm-chip-control">
                    <input
                      className="alarm-chip-input"
                      type="number"
                      placeholder="40"
                      value={humLower}
                      onChange={(e) => setHumLower(e.target.value)}
                      disabled
                    />
                    <span className="alarm-chip-unit">%</span>
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time 영역 (현재는 UI만, minutes는 기본 5분) */}
          <div className="alarm-time-section">
            <div className="alarm-time-label">Time</div>
            <div className="alarm-time-input-row">
              <input
                className="alarm-time-input"
                type="number"
                placeholder="Start (미사용)"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                disabled
              />
              {/*
              <input
                className="alarm-time-input"
                type="number"
                placeholder="Interval (min)"
                value={timeInterval}
                onChange={(e) => setTimeInterval(e.target.value)}
              />
              */}
            </div>
          </div>

          {/* 하단 버튼 + 상태 */}
          <div className="alarm-footer">
            <div className="alarm-status-wrap">
              {status === "success" && (
                <span className="alarm-status alarm-status-success">
                  저장되었습니다
                </span>
              )}
              {status === "error" && (
                <span className="alarm-status alarm-status-error">
                  저장에 실패했습니다
                </span>
              )}
            </div>
            <button type="submit" className="alarm-submit-button">
              전송
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
