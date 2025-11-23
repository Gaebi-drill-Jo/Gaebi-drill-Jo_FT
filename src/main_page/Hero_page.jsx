import './He.css';
import cloud from '../images/cloud.png'
import Footer from './Footer';
import Header from './Header';

function HeroPage() {
  return (
    <div className='Hero'>`
      <Header />
      <div className='middle'>
        <span className = "middle_Title">SMART AIR<br/>ANALYZE</span>
        <span className = "middle_text">We spent three months researching and<br/> developing an atmospheric analysis system,<br/> combining hardware and the web.</span>
      </div>
      
        <div className='Hero_content'>

        </div>
      <Footer />
      </div>
  );
}

export default HeroPage;
