import React, { useContext } from "react";
import logo from "../images/logo.png";
import "../css/Navbar.css";
import { Link } from "react-router-dom";
import { LoginContext } from "../constext/loginContest";
import { useNavigate } from "react-router-dom";
export default function Navbar({ login }) {
  const navigate = useNavigate();
  const { setModalOpen } = useContext(LoginContext);
  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
          <Link to={"/Profile"}>
            <li>Profile</li>
          </Link>
          <Link to={"/createPost"}>
            <li>Create Post</li>
          </Link>
          <Link style={{ marginLeft: "20px" }} to={"/followingpost"}>
            My Following
          </Link>
          <Link to={""}>
            <button className="primaryBtn" onClick={() => setModalOpen(true)}>
              Log Out
            </button>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to={"/SignUp"}>
            <li>SignUp</li>
          </Link>
          <Link to={"/SignIn"}>
            <li>SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  return (
    <div className="navbar">
      <img style={{width:"10%",objectFit:"contain"}}
        src={logo}
        alt=""
        onClick={() => {
          navigate("/");
        }}
      />
      <ul className="nav-menu">{loginStatus()}</ul>
    </div>
  );
}
