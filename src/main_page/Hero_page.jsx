import './He.css';
import cloud from '../images/cloud.png'
import Footer from './Footer';
import Header from './Header';
import temperature from '../images/temperature.png';
import faceMask from '../images/face-mask.png';
import humidityIcon from '../images/humidityicon.png';

function HeroPage() {
  return (
    <div className='Hero'>
      <Header />
      <div className='middle'>
        <span className="middle_Title">SMART AIR<br/>ANALYZE</span>
        <div>
          <span className="middle_text">
            We spent three months researching and<br/>
            developing an atmospheric analysis system,<br/>
            combining hardware and the web.
          </span>

          <button className='get_start'>get_started</button>
          <button className='view_demo'>view_demo</button>
        </div>
      </div>

      <div className='Hero_con'>
        <div className='Hero_block'>
          <div className='Hero_div'>
            <div className='metrics-container'>

              {/* 온도 */}
              <div className="metric-card">
                <img src={temperature} alt="온도" className='metric-icon' />
                <p className='metric-title'>온도</p>

                <div className='metric-main'>
                  <span className='metric-value'>25</span>
                  <span className='metric-unit'>°C</span>
                </div>

                <p className='metric-status'>더움</p>
                <span className='metric-diff'>-1°C</span>
              </div>

              {/* 미세먼지 */}
              <div className="metric-card metric-divider">
                <img src={faceMask} alt="미세먼지" className='metric-icon' />
                <p className='metric-title'>미세먼지</p>

                <div className='metric-main'>
                  <span className='metric-value'>25</span>
                  <span className='metric-unit'>μg/m<sup>3</sup></span>
                </div>

                <p className='metric-status'>좋음</p>
                <span className='metric-diff'>+25</span>
              </div>

              {/* 습도 */}
              <div className="metric-card metric-divider">
                <img src={humidityIcon} alt="습도" className='metric-icon' />
                <p className='metric-title'>습도</p>

                <div className='metric-main'>
                  <span className='metric-value'>25</span>
                  <span className='metric-unit'>%</span>
                </div>

                <p className='metric-status'>습함</p>
                <span className='metric-diff'>-2%</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HeroPage;
