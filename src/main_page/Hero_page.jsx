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
        <div>
          <span className = "middle_text">We spent three months researching and<br/> developing an atmospheric analysis system,<br/> combining hardware and the web.</span>
          <button className='get_start'>get_started</button>
          <button classNaem = 'view_demo'>view_demo</button>
        </div>
      </div>
        <div className='Hero_content'>
        </div>
      <Footer />
      </div>
  );
}

export default HeroPage;
