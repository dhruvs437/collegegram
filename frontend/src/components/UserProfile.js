import React, { useState, useEffect } from "react";
import "../css/Profile.css";
import PostDetail from "./PostDetail";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  var picLink="https://cdn-icons-png.flaticon.com/128/1144/1144760.png"

  const { userid } = useParams();
  const [isFollow,setIsFollow]=useState(false);
  const [user, setUser] = useState("");

  const [posts, setPosts] = useState([]);

  const followUser = async (userId) => {
    const res = await fetch("/follow", {
      method: "put",
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    });
    if(res.status==200){
      // console.log(setIsFollow);
        setIsFollow(true)
        // console.log(setIsFollow);
    }

      // .then((res) => res.json())
      // .then((data) => {
      //   console.log(setIsFollow);
      //   setIsFollow(true)
      //   console.log(setIsFollow);
      // });
  };
  const unfollowUser = (userId) => {
    console.log("unfollow");
    fetch("/unfollow", {
      method: "put",
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(setIsFollow);
        setIsFollow(false)
        // console.log(setIsFollow);
      });
  };
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        setUser(result.user);
        setPosts(result.post);
        if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id))
        {
          setIsFollow(true)
        }
        // console.log(pic);
      });
  },[isFollow]);
  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* profile pic */}
        <div className="profile-pic">
          <img
            src={user.Photo?user.Photo:picLink}
            alt=""
          />
        </div>
        {/* profile-data */}
        <div className="profile-data">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>{user.name}</h1>
            <button
              className="followBtn"
              onClick={() => {
                if(isFollow)
                {
                  unfollowUser(user._id)
                }
                else
                {
                  followUser(user._id);
                }
              }}
            >
              {isFollow?"Unfollow":"Follow"}
            </button>
          </div>

          <div className="profile-info" style={{ display: "flex" }}>
            <p>{posts.length} posts </p>
            <p>{user.followers?user.followers.length:"0"} follower </p>
            <p>{user.following?user.following.length:"0"} following </p>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "90%",
          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        {posts.map((pics) => {
          return (
            <img
              key={pics._id}
              src={pics.photo}
              alt=""
              //   onClick={() => {
              //     toggleDetails(pics);
              //   }}
              className="item"
            ></img>
          );
          {
            /* })} */
          }
        })}
      </div>

      {/* {show && <PostDetail item={posts} toggleDetails={toggleDetails} />} */}
    </div>
  );
}
