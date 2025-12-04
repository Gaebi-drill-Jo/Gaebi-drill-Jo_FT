// graph.jsx
import "./graph.css";

const imgCloud =
  "https://www.figma.com/api/mcp/asset/850ac4b5-1aae-4398-be1f-653f74eaa36c";
const imgEllipse33 =
  "https://www.figma.com/api/mcp/asset/1c225422-7f34-4736-9afe-382fe32dab62";
const imgEllipse34 =
  "https://www.figma.com/api/mcp/asset/e736d65a-2336-411a-b2e8-0ca3adce443b";
const imgEllipse35 =
  "https://www.figma.com/api/mcp/asset/df5dec31-a283-4f46-a5e2-58f52334f156";

/* ===========================
   1. 그래프 영역: 숫자 배열만 사용
   =========================== */

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

/**
 * props
 * - dust:     number[]
 * - temp:     number[]
 * - humidity: number[]
 */
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

        {/* 미세먼지 영역(노랑 → 투명) */}
        <linearGradient id="dustGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe08a" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffc94a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffb800" stopOpacity="0.15" />
        </linearGradient>

        {/* 온도 영역(주황/빨강 → 투명) */}
        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9f7b" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ff6b5a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff4b4b" stopOpacity="0.15" />
        </linearGradient>

        {/* 습도 영역(하늘색/파랑 → 투명) */}
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

/* ===========================
   2. 메인 컴포넌트
   =========================== */

/**
 * Graph 컴포넌트가 외부에서 받는 props (전부 숫자 기반):
 *
 * - dustValues:     number[]          // 미세먼지 시계열
 * - tempValues:     number[]          // 온도 시계열
 * - humidityValues: number[]          // 습도 시계열
 * - xLabels:        (number|string)[] // X축 라벨 (예: [3,6,9,...] or "03시" 등)
 *
 * MQTT에서 받은 값을 가공해서 이 props로 넘겨주시면 됩니다.
 */
export default function Graph({
  dustValues,
  tempValues,
  humidityValues,
  xLabels,
}) {
  // X축 라벨이 안 들어오면 기본 8개 (3~24)를 임시로 사용
  const labels =
    xLabels && xLabels.length > 0
      ? xLabels
      : [3, 6, 9, 12, 15, 18, 21, 24];

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

        {/* 동적 그래프 영역 (값은 전부 숫자 배열에서 옴) */}
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
        </div>

        {/* Y축 수치(0~100 텍스트) */}
        <div
          className="graph-y-labels"
          data-name="수치"
          data-node-id="441:6"
        >
          <p className="graph-y-label graph-y-label-100" data-node-id="414:926">
            100
          </p>
          <p className="graph-y-label graph-y-label-80" data-node-id="414:927">
            80
          </p>
          <p className="graph-y-label graph-y-label-60" data-node-id="414:929">
            60
          </p>
          <p className="graph-y-label graph-y-label-40" data-node-id="414:931">
            40
          </p>
          <p className="graph-y-label graph-y-label-20" data-node-id="414:933">
            20
          </p>
          <p className="graph-y-label graph-y-label-0" data-node-id="414:935">
            0
          </p>
        </div>

        {/* X축 시각: 숫자/문자 배열로 외부에서 받음 */}
        <div
          className="graph-x-labels"
          data-name="시"
          data-node-id="441:7"
        >
          {labels.map((label, idx) => (
            <p key={idx} className="graph-x-label">
              {label}
            </p>
          ))}
        </div>

        {/* 범례 (텍스트/색 이름은 그대로 유지) */}
        <div
          className="graph-legend"
          data-name="그래프색상가이드"
          data-node-id="441:5"
        >
          <div className="graph-legend-item" data-node-id="441:4">
            <span className="graph-legend-dot">
              <img alt="" src={imgEllipse33} />
            </span>
            <span className="graph-legend-text" data-node-id="418:993">
              미세먼지
            </span>
          </div>

          <div className="graph-legend-item" data-node-id="441:3">
            <span className="graph-legend-dot">
              <img alt="" src={imgEllipse34} />
            </span>
            <span className="graph-legend-text" data-node-id="418:994">
              온도
            </span>
          </div>

          <div className="graph-legend-item" data-node-id="441:2">
            <span className="graph-legend-dot">
              <img alt="" src={imgEllipse35} />
            </span>
            <span className="graph-legend-text" data-node-id="418:995">
              습도
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
