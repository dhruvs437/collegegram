import React, { useEffect, useState } from "react";
import logo from "../images/logo.png";
import "../css/SignUp.css";
import {toast} from 'react-toastify';

import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {

  const navigate=useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setpassword] = useState("");

    //Toast function to get the pop of msg
    const notifyA=(msg)=>toast.error(msg)
    const notifyB=(msg)=>toast.success(msg)

    //checking email validation using regex
    const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passRegex=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const postData = () => {

    if(!emailRegex.test(email))
    {
      notifyA("Invalid email");
      return
    }
    else if(!passRegex.test(password))
    {
      notifyA("Password must contain at least eight character,including at least one number and includes one alphabet of upper case and lower case and one special character")
      return 
    }
    fetch("/signup",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name:name,
        userName:userName,
        email:email,
        password:password
      })
    })
    .then(res=>res.json())
    .then(data=>{
      //will check the if any error from backend and then pop it to display using notifyA
      if(data.error)
      {
        notifyA(data.error)
      }
      else
      {
        notifyB(data.message)
        navigate("/SignIn")

      }
      
      console.log(data)}) 
  };

  return (
    <div className="signup">
      <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={logo} alt="" />
          <p className="loginPara">
            Sign up to see photos and vedios <br />
            from your friends.
          </p>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              placeholder="Full Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              value={userName}
              placeholder="Username"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              placeholder="password"
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By Signin up ,you agree to out terms,
            <br /> privacy policy and cookies pilicy.
          </p>
          <input
            type="submit"
            id="submit-btn"
            value="Submit"
            onClick={() => {
              postData();
            }}
          />
        </div>
        <div className="form2">
          Already have an account?
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
