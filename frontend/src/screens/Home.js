import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Home() {
  var picLink="https://cdn-icons-png.flaticon.com/128/1144/1144760.png"

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  // const [liked, setLiked] = useState(false);

  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  //Toast function to get the pop of msg
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }

    //Fetch
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {setData(result);console.log(result)})
      .catch((err) => console.log(err));
  }, []);

  // to show and hide comment
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
      // console.log("hide")
    } else {
      setShow(true);
      setItem(posts);
      console.log(item);
    }
  };

  const likePost = async (id) => {
    let res = await fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    });
    let result = await res.json();
    const newData = data.map((posts) => {
      if (posts._id == result._id) {
        return result;
      } else {
        return posts;
      }
    });
    setData(newData);
    console.log("new data", newData);
    // .then((res) => res.json())
    // .then((result) => {
    //   const newData = data.map((posts) => {
    //     if (posts._id == result._id) {
    //       return result;
    //     } else {
    //       return posts;
    //     }
    //   });
    //   setData(newData);
    //   console.log(data);
    // });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(data);
      });
  };

  //function to make comment
  const makeComment = (text, id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("comment posted");
        console.log(result);
      });
  };

  return (
    <div className="home">
      {/*card*/}
      {data.map((posts) => {
        return (
          <div className="card">
            {/* card header*/}
            <div className="card-header">
              <div className="card-pic">
                <img 
                  src={posts.postedBy.Photo?posts.postedBy.Photo:picLink}
                  alt=""
                  style={{borderRadius:"50%",height:"40px",width:"40px"}}
                />
              </div>
              <h5>
                <Link to={`/profile/${posts.postedBy._id}`}>
                {posts.postedBy.name}
                </Link>
              </h5>
            </div>
            <div className="card-image">
              <img src={posts.photo} alt="" />
            </div>
            {/* card content */}
            <div className="card-content">
              {posts.likes.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}
              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all Comments
              </p>
            </div>
            {/* add comment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                className="comment"
                onClick={() => {
                  makeComment(comment, posts._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}
      {/* show comments */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
            </div>
            <div className="details">
              {/* card header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                  src={item.postedBy.Photo?item.postedBy.Photo:picLink}
                  alt=""
                  style={{borderRadius:"50%",height:"40px",width:"40px"}}

                  />
                </div>
                <h5>{item.postedBy.name}</h5>
              </div>
              {/* commentsection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {comment.postedBy.name}{" "}
                      </span>
                      <span className="commentText">{comment.comment}</span>
                    </p>
                  );
                })}
                {/* <p className="comm">
                <span className="commenter" style={{ fontWeight: "bolder" }}>
                  ramesh{" "}
                </span>
                <span className="commentText">Awesome pic</span>
              </p>
              <p className="comm">
                <span className="commenter" style={{ fontWeight: "bolder" }}>
                  ramesh{" "}
                </span>
                <span className="commentText">Awesome pic</span>
              </p>
              <p className="comm">
                <span className="commenter" style={{ fontWeight: "bolder" }}>
                  ramesh{" "}
                </span>
                <span className="commentText">Awesome pic</span>
              </p> */}
              </div>
              {/* card content */}
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>
              {/* add comment */}
              <div className="add-comment">
                {/* <span className="material-symbols-outlined material-symbols-outlined-comment">
                mood
              </span> */}
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0"
            />
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
