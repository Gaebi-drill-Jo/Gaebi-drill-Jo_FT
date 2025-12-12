// src/Graph/graph.jsx
import { useEffect, useState } from "react";
import "./graph.css";
import { API_URL } from "../api/client";

// SVG 사이즈 & 패딩
const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 400;
const PADDING_X = 40;
const PADDING_Y = 40;

/** 한 개 시리즈를 선으로 그릴 path 생성 (글로벌 min/max 기준) */
function buildLinePath(values, minVal, maxVal) {
  if (!values || values.length === 0) return "";

  const innerWidth = GRAPH_WIDTH - PADDING_X * 2;
  const innerHeight = GRAPH_HEIGHT - PADDING_Y * 2;
  const bottomY = GRAPH_HEIGHT - PADDING_Y;
  const range = maxVal - minVal || 1;

  const stepX = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  let d = "";
  values.forEach((v, i) => {
    let n = (v - minVal) / range;
    if (n < 0) n = 0;
    if (n > 1) n = 1;

    const x = PADDING_X + stepX * i;
    const y = bottomY - n * innerHeight;

    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  return d;
}

/** 그래프 SVG */
function GraphArea({ dust, temp, humidity }) {
  const safeDust = Array.isArray(dust) ? dust : [];
  const safeTemp = Array.isArray(temp) ? temp : [];
  const safeHumidity = Array.isArray(humidity) ? humidity : [];

  const allValues = [...safeDust, ...safeTemp, ...safeHumidity].filter(
    (v) => typeof v === "number" && !Number.isNaN(v)
  );

  let minVal = 0;
  let maxVal = 1;

  if (allValues.length > 0) {
    minVal = Math.min(...allValues);
    maxVal = Math.max(...allValues);
    if (minVal === maxVal) {
      minVal -= 1;
      maxVal += 1;
    }
  }

  const dustPath = buildLinePath(safeDust, minVal, maxVal);
  const tempPath = buildLinePath(safeTemp, minVal, maxVal);
  const humidityPath = buildLinePath(safeHumidity, minVal, maxVal);

  return (
    <svg
      width={GRAPH_WIDTH}
      height={GRAPH_HEIGHT}
      className="graph-svg"
      viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
    >
      <defs>
        <linearGradient id="cardGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </linearGradient>
      </defs>

      {/* 카드 배경 */}
      <rect
        x="0"
        y="0"
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        rx="32"
        ry="32"
        fill="url(#cardGradient)"
        className="graph-card-bg"
      />

      {/* 세로 그리드 */}
      {Array.from({ length: 9 }).map((_, i) => {
        const innerWidth = GRAPH_WIDTH - PADDING_X * 2;
        const x = PADDING_X + (innerWidth / 8) * i;
        return (
          <line
            key={i}
            x1={x}
            y1={PADDING_Y}
            x2={x}
            y2={GRAPH_HEIGHT - PADDING_Y}
            className="graph-grid-line"
          />
        );
      })}

      {/* 선 그래프 */}
      <path d={humidityPath} className="graph-line graph-line-humidity" />
      <path d={dustPath} className="graph-line graph-line-dust" />
      <path d={tempPath} className="graph-line graph-line-temp" />
    </svg>
  );
}

export default function Graph() {
  const [dustValues, setDustValues] = useState([]);
  const [tempValues, setTempValues] = useState([]);
  const [humidityValues, setHumidityValues] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;

    const fetchGraph = async () => {
      try {
        setStatus("loading");

        const res = await fetch(`${API_URL}/graph`);
        if (!res.ok) {
          console.error("GET /graph ERROR:", res.status);
          if (alive) setStatus("error");
          return;
        }

        const data = await res.json();
        const pointsArray = Array.isArray(data.points) ? [...data.points].reverse() : [];

        const dustRaw = pointsArray.map((p) => (typeof p.pm25 === "number" ? p.pm25 : 0));
        const tempRaw = pointsArray.map((p) =>
          typeof p.temperature === "number" ? p.temperature : 0
        );
        const humRaw = pointsArray.map((p) =>
          typeof p.humidity === "number" ? p.humidity : 0
        );

        if (!alive) return;

        setDustValues(dustRaw);
        setTempValues(tempRaw);
        setHumidityValues(humRaw);
        setStatus("ok");
      } catch (e) {
        console.error("GRAPH NETWORK ERROR:", e);
        if (alive) setStatus("error");
      }
    };

    fetchGraph();

    // (선택) 자동 갱신 원하면 주석 해제
    // const t = setInterval(fetchGraph, 3000);

    return () => {
      alive = false;
      // clearInterval(t);
    };
  }, []);

  const xLabels = ["1시", "3시", "6시", "9시", "12시", "15시", "18시", "21시", "24시"];
  const yLabels = [0, 20, 40, 60, 80, 100]; // ✅ flex로 배치할 거라 순서는 상관없음

  return (
    <div className="graph-root">
      <div className="graph-inner">
        {/* 구름 배경(외부 이미지 안 씀: CSS로 처리) */}
        <div className="graph-cloud-bg">
          <div className="graph-bottom-glow" />
        </div>

        {/* 범례: Figma 이미지 대신 CSS 동그라미 */}
        <div className="graph-legend">
          <div className="graph-legend-item">
            <span className="graph-legend-dot dot-dust" />
            <span className="graph-legend-text">미세먼지</span>
          </div>

          <div className="graph-legend-item">
            <span className="graph-legend-dot dot-temp" />
            <span className="graph-legend-text">온도</span>
          </div>

          <div className="graph-legend-item">
            <span className="graph-legend-dot dot-humi" />
            <span className="graph-legend-text">습도</span>
          </div>
        </div>

        {/* 메인 그래프 */}
        <div className="graph-main">
          <GraphArea dust={dustValues} temp={tempValues} humidity={humidityValues} />

          {status === "loading" && (
            <div className="graph-status-label">데이터 불러오는 중...</div>
          )}
          {status === "error" && (
            <div className="graph-status-label graph-status-error">
              데이터를 불러오지 못했습니다.
            </div>
          )}
        </div>

        {/* ✅ Y축 숫자: flex로 위아래 벌려서 “절대 안 뭉침” */}
        <div className="graph-y-labels">
          {yLabels.map((v) => (
            <p key={v} className="graph-y-label">
              {v}
            </p>
          ))}
        </div>

        {/* X축 라벨 */}
        <div className="graph-x-labels">
          {xLabels.map((label, index) => (
            <p key={index} className="graph-x-label">
              {label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
