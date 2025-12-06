import React from 'react';
import './Head.css';
import logo from '../images/logo1.png';
import { useNavigate } from "react-router-dom";


function Header() {
  const Navigate = useNavigate();
  return (
    <header className="head">
      <div className="logo111">
        <img src={logo} alt="AIRZY 로고" />
      </div>
      <nav className="head_menu" role="navigation" aria-label="주요 메뉴">
        <button className="menu_le" type="button" onClick={() =>  (Navigate('/alarm'))}>
          알림 설정하기
        </button>
        <button className="menu_le" type="button" onClick={() => (Navigate('/graph'))}>
          그래프
        </button>
        <button className="menu_le" type="button" onClick={() =>  (Navigate('/data'))}>
          데이터 값 조회하기
        </button>
        <button className="menu_le" type="button" onClick={() =>  (Navigate('/feedback'))}>
          AI피드백
        </button>
      </nav>


      <button style={{color : 'black'}}className="logi" type="button" onClick={()=>(Navigate('/Join'))}>
        Sign up
      </button>
    </header>
  );
}

export default Header;
