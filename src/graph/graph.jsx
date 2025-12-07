// graph.jsx
import { useEffect, useState } from "react";
import "./graph.css";
import {API_URL} from "../api/client"

const imgCloud =
  "https://www.figma.com/api/mcp/asset/850ac4b5-1aae-4398-be1f-653f74eaa36c";
const imgEllipse33 =
  "https://www.figma.com/api/mcp/asset/1c225422-7f34-4736-9afe-382fe32dab62";
const imgEllipse34 =
  "https://www.figma.com/api/mcp/asset/e736d65a-2336-411a-b2e8-0ca3adce443b";
const imgEllipse35 =
  "https://www.figma.com/api/mcp/asset/df5dec31-a283-4f46-a5e2-58f52334f156";
const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 400;
const PADDING_X = 40;
const PADDING_Y = 40;

function buildAreaPath(values, maxValue) {
  if (!values || values.length === 0 || !maxValue) return "";

  const innerWidth = GRAPH_WIDTH - PADDING_X * 2;
  const innerHeight = GRAPH_HEIGHT - PADDING_Y * 2;
  const bottomY = GRAPH_HEIGHT - PADDING_Y;
  const stepX = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  let d = "";

  values.forEach((v, i) => {
    const x = PADDING_X + stepX * i;
    const y = bottomY - (v / maxValue) * innerHeight;

    if (i === 0) d += `M ${x} ${y}`;
    else d += ` L ${x} ${y}`;
  });

  const lastX = PADDING_X + stepX * (values.length - 1);
  const firstX = PADDING_X;

  d += ` L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  return d;
}

function GraphArea({ dust, temp, humidity }) {
  const safeDust = dust ?? [];
  const safeTemp = temp ?? [];
  const safeHumidity = humidity ?? [];

  const allValues = [...safeDust, ...safeTemp, ...safeHumidity];
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 1;

  const dustPath = buildAreaPath(safeDust, maxValue);
  const tempPath = buildAreaPath(safeTemp, maxValue);
  const humidityPath = buildAreaPath(safeHumidity, maxValue);

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

        {/* 미세먼지 영역 */}
        <linearGradient id="dustGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe08a" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffc94a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffb800" stopOpacity="0.15" />
        </linearGradient>

        {/* 온도 영역 */}
        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9f7b" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ff6b5a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff4b4b" stopOpacity="0.15" />
        </linearGradient>

        {/* 습도 영역 */}
        <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6cd5ff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#30b3ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0090ff" stopOpacity="0.15" />
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

      {/* 미세먼지 / 온도 / 습도 영역 */}
      <path
        d={dustPath}
        className="graph-area graph-area-dust"
        fill="url(#dustGradient)"
      />
      <path
        d={tempPath}
        className="graph-area graph-area-temp"
        fill="url(#tempGradient)"
      />
      <path
        d={humidityPath}
        className="graph-area graph-area-humidity"
        fill="url(#humidityGradient)"
      />
    </svg>
  );
}

export default function Graph() {
  const [dustValues, setDustValues] = useState([]);
  const [tempValues, setTempValues] = useState([]);
  const [humidityValues, setHumidityValues] = useState([]);
  const [labels, setLabels] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setStatus("loading");
        const res = await fetch("http://localhost:8000/graph");
        if (!res.ok) {
          console.error("GET /graph ERROR:", res.status);
          setStatus("error");
          return;
        }

        const data = await res.json();
        const pointsArray = Array.isArray(data.points)
          ? [...data.points].reverse()
          : [];

        const dust = pointsArray.map((p) =>
          typeof p.pm25 === "number" ? p.pm25 : 0
        );
        const temp = pointsArray.map((p) =>
          typeof p.temperature === "number" ? p.temperature : 0
        );
        const hum = pointsArray.map((p) =>
          typeof p.humidity === "number" ? p.humidity : 0
        );

        const labelList = pointsArray.map((p) => {
          if (!p.created_at) return "";
          const date = new Date(p.created_at);
          if (Number.isNaN(date.getTime())) return "";
          return date.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          });
        });

        setDustValues(dust);
        setTempValues(temp);
        setHumidityValues(hum);
        setLabels(labelList);
        setStatus("ok");
      } catch (e) {
        console.error("GRAPH NETWORK ERROR:", e);
        setStatus("error");
      }
    };

    fetchGraph();
  }, []);

  const xLabels =
    labels.length > 0
      ? labels
      : ["03시", "06시", "09시", "12시", "15시", "18시", "21시", "24시"];

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

        {/* Y축 수치 */}
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

        {/* X축 시각 */}
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
