import React from "react";
import "./Head.css"
import logo from "./images/logo.svg";
function Header(){

    return (
        <div className = "head container">
            <img id = "logo1" src={logo} alt="로고" />
            <button id = "alertt">알림설정하기</button>
            <button id = "peo">만든 사람들</button>
            <button id = "grap">그래프</button>
            <button id = "chdata">데이터값 조회하기</button>
            <button id ="log,logbtn">Sign up</button>
        </div>
    )
}




export default Header