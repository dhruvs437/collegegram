import React, { useState ,useContext} from "react";
import logo from "../images/logo.png";
import "../css/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginContext } from "../constext/loginContest";

function SignIn() {
  const {setUserLogin}=useContext(LoginContext)
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  //Toast function to get the pop of msg
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () => {
    //checking email,password pattern using regex
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    }
    //sending data to server
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //will check the if any error from backend and then pop it to display using notifyA
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Signed in successfully");
          // console.log(data)
          localStorage.setItem("jwt",data.token)
          // console.log(data.user._id);
          localStorage.setItem("user",JSON.stringify(data.user));
          let z = JSON.parse(localStorage.getItem("user"))._id;
          console.log(z);
          setUserLogin(true)
          navigate("/");
        }

        // console.log(data);
      });
  };

  return (
    <div className="signIn">
      <div>
        <div className="loginForm">
          <img className="signUpLogo" src={logo} alt="" />
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
          </div>
          <input
            type="submit"
            id="login-btn"
            onClick={() => {
              postData();
            }}
            value="Sign In"
          />
        </div>

        <div className="loginForm2">
          Don't have an account?
          <Link to="/SignUp">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
