// src/Graph/graph.jsx
import { useEffect, useState } from "react";
import "./graph.css";
import { API_URL } from "../api/client";

const imgCloud =
  "https://www.figma.com/api/mcp/asset/850ac4b5-1aae-4398-be1f-653f74eaa36c";
const imgEllipse33 =
  "https://www.figma.com/api/mcp/asset/1c225422-7f34-4736-9afe-382fe32dab62";
const imgEllipse34 =
  "https://www.figma.com/api/mcp/asset/e736d65a-2336-411a-b2e8-0ca3adce443b";
const imgEllipse35 =
  "https://www.figma.com/api/mcp/asset/df5dec31-a283-4f46-a5e2-58f52334f156";

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

  const stepX =
    values.length > 1 ? innerWidth / (values.length - 1) : 0;

  let d = "";

  values.forEach((v, i) => {
    let n = (v - minVal) / range; // 0~1
    if (n < 0) n = 0;
    if (n > 1) n = 1;

    const x = PADDING_X + stepX * i;
    const y = bottomY - n * innerHeight;

    if (i === 0) d += `M ${x} ${y}`;
    else d += ` L ${x} ${y}`;
  });

  return d;
}

/**
 * 실제 그래프 영역
 * - 미세먼지/온도/습도 모두 같은 글로벌 min~max 기준으로 스케일
 * - 전부 "선"만 그림 (fill 없음) → 더 이상 위에서 덩어리로 안 보임
 */
function GraphArea({ dust, temp, humidity }) {
  const safeDust = Array.isArray(dust) ? dust : [];
  const safeTemp = Array.isArray(temp) ? temp : [];
  const safeHumidity = Array.isArray(humidity) ? humidity : [];

  const allValues = [
    ...safeDust,
    ...safeTemp,
    ...safeHumidity,
  ].filter((v) => typeof v === "number" && !Number.isNaN(v));

  let minVal = 0;
  let maxVal = 1;

  if (allValues.length > 0) {
    minVal = Math.min(...allValues);
    maxVal = Math.max(...allValues);
    if (minVal === maxVal) {
      // 전부 같은 값일 때는 약간 범위를 만들어 줌
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
        {/* 카드 배경 그라데이션 */}
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

      {/* 세로 그리드 (8구간) */}
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

      {/* 선 그래프들 */}
      <path
        d={humidityPath}
        className="graph-line graph-line-humidity"
        fill="none"
      />
      <path
        d={dustPath}
        className="graph-line graph-line-dust"
        fill="none"
      />
      <path
        d={tempPath}
        className="graph-line graph-line-temp"
        fill="none"
      />
    </svg>
  );
}

/**
 * 메인 그래프 페이지
 * - /graph API에서 DataPoint 리스트 그대로 가져옴
 * - X축 라벨은 1시~24시 고정 (디자인용)
 */
export default function Graph() {
  const [dustValues, setDustValues] = useState([]);
  const [tempValues, setTempValues] = useState([]);
  const [humidityValues, setHumidityValues] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setStatus("loading");

        const res = await fetch(`${API_URL}/graph`);
        if (!res.ok) {
          console.error("GET /graph ERROR:", res.status);
          setStatus("error");
          return;
        }

        const data = await res.json();

        // 최신 순(내림차순)으로 오니까 → 시간 순으로 보기 위해 뒤집기
        const pointsArray = Array.isArray(data.points)
          ? [...data.points].reverse()
          : [];

        const dustRaw = pointsArray.map((p) =>
          typeof p.pm25 === "number" ? p.pm25 : 0
        );
        const tempRaw = pointsArray.map((p) =>
          typeof p.temperature === "number" ? p.temperature : 0
        );
        const humRaw = pointsArray.map((p) =>
          typeof p.humidity === "number" ? p.humidity : 0
        );

        setDustValues(dustRaw);
        setTempValues(tempRaw);
        setHumidityValues(humRaw);
        setStatus("ok");
      } catch (e) {
        console.error("GRAPH NETWORK ERROR:", e);
        setStatus("error");
      }
    };

    fetchGraph();
  }, []);

  // X축: 하루 주기 고정 라벨 (디자인)
  const xLabels = [
    "1시",
    "3시",
    "6시",
    "9시",
    "12시",
    "15시",
    "18시",
    "21시",
    "24시",
  ];

  return (
    <div className="graph-root" data-node-id="414:149">
      <div className="graph-inner">
        {/* 구름 배경 */}
        <div
          className="graph-cloud-bg"
          data-name="구름 배경"
          data-node-id="431:114"
        >
          <div className="graph-cloud-inner">
            <div className="graph-cloud-rotated">
              <div
                className="graph-cloud-image-wrapper"
                data-name="Cloud"
                data-node-id="431:115"
              >
                <div className="graph-cloud-image-clip">
                  <img alt="" className="graph-cloud-image" src={imgCloud} />
                </div>
              </div>
            </div>
          </div>
          <div className="graph-bottom-glow" data-node-id="431:116" />
        </div>

        {/* 메인 그래프 영역 */}
        <div
          className="graph-main"
          data-name="그래프"
          data-node-id="414:916"
        >
          <GraphArea
            dust={dustValues}
            temp={tempValues}
            humidity={humidityValues}
          />

          {status === "loading" && (
            <div className="graph-status-label">데이터 불러오는 중...</div>
          )}
          {status === "error" && (
            <div className="graph-status-label graph-status-error">
              데이터를 불러오지 못했습니다.
            </div>
          )}
        </div>

        {/* Y축 수치 (디자인 고정) */}
        <div
          className="graph-y-labels"
          data-name="수치"
          data-node-id="441:6"
        >
          <p className="graph-y-label">100</p>
          <p className="graph-y-label">80</p>
          <p className="graph-y-label">60</p>
          <p className="graph-y-label">40</p>
          <p className="graph-y-label">20</p>
          <p className="graph-y-label">0</p>
        </div>

        {/* X축 시각: 1시~24시 고정 */}
        <div
          className="graph-x-labels"
          data-name="시"
          data-node-id="441:7"
        >
          {xLabels.map((label, index) => (
            <p key={index} className="graph-x-label">
              {label}
            </p>
          ))}
        </div>

        {/* 범례 */}
        <div
          className="graph-legend"
          data-name="그래프색상가이드"
          data-node-id="441:5"
        >
          <div className="graph-legend-item" data-node-id="441:4">
            <span className="graph-legend-dot">
              <img alt="" src={imgEllipse33} />
            </span>
            <span className="graph-legend-text">미세먼지</span>
          </div>

          <div className="graph-legend-item" data-node-id="441:3">
            <span className="graph-legend-dot">
              <img alt="" src={imgEllipse34} />
            </span>
            <span className="graph-legend-text">온도</span>
          </div>

          <div className="graph-legend-item" data-node-id="441:2">
            <span className="graph-legend-dot">
              <img alt="" src={imgEllipse35} />
            </span>
            <span className="graph-legend-text">습도</span>
          </div>
        </div>
      </div>
    </div>
  );
}
