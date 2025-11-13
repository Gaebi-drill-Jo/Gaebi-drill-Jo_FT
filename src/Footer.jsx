import "./Foot.css";
import logo from "./images/logo.svg";
import instaticon from "./images/instaicon.png";
import giticon from "./images/giticon.png";

function Footer() {
  return (
    <div className="foot container">
      <img id="logo2" src={logo} alt="로고" />
      <span id="center">고객센터 : 010 - 3943 - 9431</span>
      <hr id="line1" />
      <img id="icon1" src={instaticon} alt="인스타아이콘" />
      <span id="y_ehddjs">@y_ehddjs</span>
      <span id="jeaju_ne">@jeaju_ne</span>
      <div className="github">
        <img id="icon2" src={giticon} alt="깃허브아이콘" />
        <a
          id="gitli"
          href="https://github.com/orgs/Gaebi-drill-Jo"
          target="_blank"
          rel="noreferrer noopener"
        >
          https://github.com/orgs/Gaebi-drill-Jo
        </a>
      </div>
    </div>
  );
}

export default Footer;
