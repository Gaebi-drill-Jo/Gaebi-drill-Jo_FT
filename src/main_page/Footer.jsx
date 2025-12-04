import "./Foot.css";
import logo from '../images/logo1.png'
import insta from '../images/instagram.png'
import git from '../images/github.png'

function Footer() {
  return (
    <>
    <footer className="foot">
      <div className="fheader">
        <img className = "logo2" src={logo} alt="로고"></img>
        <span className="cus">고객센터 : 010 - 3943 - 9431</span>
      </div>

      <div className="line" />

      <div className="instline">
        <img className ="insta" src={insta} alt="instagram" />
        <div className="instaname">
          <span>@y_ehddjs</span> 
          <span>@jeaju_ne</span>
        </div>
      </div>

      <div className="instline">
        <img className = "git " src={git} alt="깃허브" />
        <a
          className="flink"
          href="https://github.com/orgs/Gaebi-drill-Jo"
          target="_blank"
          rel="noreferrer noopener"
        >
          https://github.com/orgs/Gaebi-drill-Jo
        </a>
      </div>

      <span className="fcompany">(주)깨비드릴조</span>
    </footer>
    </>
  );
}

export default Footer;
