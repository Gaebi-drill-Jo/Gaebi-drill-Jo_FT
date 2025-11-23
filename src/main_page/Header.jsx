// Original code preserved for reference:
// import React from "react";
// import "./Head.css"
// import logo from "../images/logo.svg";
// function Header(){
//
//     return (
//         <div className = "head container">
//             <img id = "logo1" src={logo} alt="로고" />
//             <button id = "alertt">알림설정하기</button>
//             <button id = "peo">만든 사람들</button>
//             <button id = "grap">그래프</button>
//             <button id = "chdata">데이터값 조회하기</button>
//             <button id ="log,logbtn">Sign up</button>
//         </div>
//     )
// }
//
//
//
//
// export default Header

import React from 'react';
import './Head.css';
import logo from '../images/logo1.png';

const navItems = ['알림 설정하기', '그래프', '데이터 값 조회하기', 'AI피드백'];

function Header() {
  return (
    <header className="head">
      <div className="head-logo">
        <img src={logo} alt="AIRZY 로고" />
      </div>

      <nav className="head-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <a href="#" key={item} className="nav-link">
            {item}
          </a>
        ))}
      </nav>

      <button className="head-signup" type="button">
        Sign up
      </button>
    </header>
  );
}

export default Header;
