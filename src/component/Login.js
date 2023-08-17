import React, { useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./Axios";
import Loader from "./loader/Loader";

const Login = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [unauthorized, setUnauthorized] = useState(null);
  const { setAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("form#login-form"));
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/admin/login`, formData)
      .then((res) => {
        setIsProcessing(false);
        localStorage.setItem("auth_token", res.data.auth_token);
        setAdmin(res.data.admin);
        navigate("/");
      })
      .catch((err) => {
        setUnauthorized({ message: err.response.data.message });
        setIsProcessing(false);
      });
  };
  return (
    <>
      <div style={{ marginTop: "130px", position: "re" }} id="login-container">
        {isProcessing && (
          <Loader
            style={{
              position: "fixed",
              top: "35%",
              left: "0",
              zIndex: "10",
              height: "100%",
              width: "100%",
            }}
          />
        )}
        <div>guest - guest123</div>
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
          }}
          id="login-logo"
        >
          <div
            style={{
              backgroundColor: "#db4a39",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              width: "75px",
              height: "75px",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "5rem",
                fontFamily: "tahoma",
              }}
            >
              V
            </span>
          </div>
        </div> */}
        <form
          id="login-form"
          action="index.html"
          method="post"
          class="form-horizontal"
          style={{ display: "block" }}
          onSubmit={handleSubmit}
        >
          <div class="form-group">
            <div class="col-xs-12">
              <div class="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username..."
                  class="form-control"
                />
                <span class="input-group-addon">
                  <i class="fa fa-user fa-fw"></i>
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: "0" }} class="form-group">
            <div class="col-xs-12">
              <div class="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password.."
                  class="form-control"
                />
                <span class="input-group-addon">
                  <i class="fa fa-asterisk fa-fw"></i>
                </span>
              </div>
            </div>
          </div>
          {unauthorized && (
            <div style={{ marginTop: "5px" }}>
              <span class="text-warning">{unauthorized.message}</span>
            </div>
          )}

          <div style={{ marginTop: "15px" }} class="clearfix">
            <div class="btn-group btn-group-sm pull-right">
              <button type="submit" class="btn btn-success">
                <i class="fa fa-arrow-right"></i> Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
