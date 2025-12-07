// alarm.jsx
import { useState } from "react";
import "./alarm.css";

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
  // Time (분 단위 예시)
  const [timeStart, setTimeStart] = useState("");
  const [timeInterval, setTimeInterval] = useState("");

  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      pm25_upper: pmUpper === "" ? null : Number(pmUpper),
      pm25_lower: pmLower === "" ? null : Number(pmLower),
      temp_upper: tempUpper === "" ? null : Number(tempUpper),
      temp_lower: tempLower === "" ? null : Number(tempLower),
      humidity_upper: humUpper === "" ? null : Number(humUpper),
      humidity_lower: humLower === "" ? null : Number(humLower),
      time_start: timeStart === "" ? null : Number(timeStart),
      time_interval: timeInterval === "" ? null : Number(timeInterval),
    };

    try {
      const res = await fetch("/api/notification-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="alarm-root">
      <form className="alarm-card" onSubmit={handleSubmit}>
        <div className="alarm-card-content">
          {/* 제목 */}
          <h2 className="alarm-title">Notification Setting</h2>

          {/* 상단 컬럼 라벨 */}
          <div className="alarm-columns-header">
            <div className="alarm-column-header">미세먼지</div>
            <div className="alarm-column-header">온도</div>
            <div className="alarm-column-header">습도</div>
          </div>

          {/* 상단 칩들 */}
          <div className="alarm-columns">
            {/* 미세먼지 */}
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
                    />
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 온도 */}
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
                    />
                    <span className="alarm-chip-unit">℃</span>
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 습도 */}
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
                    />
                    <span className="alarm-chip-unit">%</span>
                    <span className="alarm-chip-arrow">︿</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time 영역 */}
          <div className="alarm-time-section">
            <div className="alarm-time-label">Time</div>
            <div className="alarm-time-input-row">
              <input
                className="alarm-time-input"
                type="number"
                placeholder="Start (min)"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
              />
              <input
                className="alarm-time-input"
                type="number"
                placeholder="Interval (min)"
                value={timeInterval}
                onChange={(e) => setTimeInterval(e.target.value)}
              />
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
