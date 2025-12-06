import './He.css';
import cloud from '../images/Cloud.png'
import Footer from './Footer';
import Header from './Header';
import temperature from '../images/temperature.png';
import faceMask from '../images/face-mask.png';
import humidityIcon from '../images/humidityicon.png';
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useNavigate } from "react-router-dom";



function HeroPage() {
  const Navigate = useNavigate();
  const [Temp,setTemp] = useState(25);
  const [Pm25,setPm25] = useState(25);
  const [Humi,setHumi] = useState(25);
  useEffect(()=>{
  const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt")
  client.on("connect", () => {
  client.subscribe("slide/D~HT")
});
client.on("message", (topic, message) => {

  if (topic === "slide/D~HT") {
    const data = JSON.parse(message.toString());
    setTemp(data.temperature);
    setHumi(data.humidity);
    setPm25(data.pm25);
  }
});
return () => client.end();
},[]);

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

          <button className='get_start' onClick={()=> Navigate('/Join')}>get_started</button>
          <button className='view_demo ' onClick={()=> Navigate('/graph')}>view_demo</button>
        </div>
      </div>

      <div className='Hero_con'>
        <div className='Hero_block'>
          <div className='Hero_div'>
            <div className='metrics-container'>


              <div className="metric-card">
                <img src={temperature} alt="온도" className='metric-icon' />
                <p className='metric-title'>온도</p>

                <div className='metric-main'>
                  <span className='metric-value'>{Temp}</span>
                  <span className='metric-unit'>°C</span>
                </div>
                {Temp > 28 ? (<p className="metric-status hot">더움</p>) : 
                Temp >= 10 ? (<p className="metric-status normal">보통</p>) : 
                (<p className="metric-status cold">추움</p>)}
                
                <span className='metric-diff'>-1°C</span>
              </div>


              <div className="metric-card metric-divider">
                <img src={faceMask} alt="미세먼지" className='metric-icon' />
                <p className='metric-title'>미세먼지</p>

                <div className='metric-main'>
                  <span className='metric-value'>{Pm25}</span>
                  <span className='metric-unit'>μg/m<sup>3</sup></span>
                </div>
                {Pm25 < 15 ? (
                <p className="metric-status good">좋음</p>) : Pm25 < 50 ? 
                (<p className="metric-status normal">보통</p>) : 
                (<p className="metric-status bad">나쁨</p>)}
                <span className='metric-diff'>+25</span>
              </div>
              


              <div className="metric-card metric-divider">
                <img src={humidityIcon} alt="습도" className='metric-icon' />
                <p className='metric-title'>습도</p>

                <div className='metric-main'>
                  <span className='metric-value'>{Humi}</span>
                  <span className='metric-unit'>%</span>
                </div>

                {Humi >= 60 ? (<p className='metric-status'>습함</p>) : 
              Humi >= 40 ? (<p className='metric-status'>보통</p>) : 
              (<p className='metric-status'>건조</p>)}
                <span className='metric-diff'>-2%</span>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className = "footer_shadow"></div>
      <Footer />
    </div>
  );
}

export default HeroPage;
