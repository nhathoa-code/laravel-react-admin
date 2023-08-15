import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../component/loader/Loader";

const Header = () => {
  const { setAdmin, admin } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsProcessing(true);
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      )
      .then(() => {
        setIsProcessing(false);
        setAdmin(null);
        localStorage.removeItem("auth_token");
        navigate("/login");
      });
  };
  return (
    <>
      {isProcessing && (
        <Loader
          style={{
            position: "fixed",
            zIndex: "100",
            height: "100%",
            marginTop: "250px",
          }}
        />
      )}
      <header class="navbar navbar-inverse">
        <ul class="navbar-nav-custom pull-right hidden-md hidden-lg">
          <li class="divider-vertical"></li>
          <li>
            <a
              href="javascript:void(0)"
              data-toggle="collapse"
              data-target=".navbar-main-collapse"
            >
              <i class="fa fa-bars"></i>
            </a>
          </li>
        </ul>
        <a href="javascript:void(0)" className="navbar-brand">
          {admin.roles.map((item, index) => {
            return item.name + (index === admin.roles.length - 1 ? "" : ", ");
          })}
        </a>

        <div id="loading" class="pull-left">
          <i class="fa fa-certificate fa-spin"></i>
        </div>

        <ul id="widgets" class="navbar-nav-custom pull-right">
          <li class="dropdown pull-right dropdown-user">
            <a
              href="javascript:void(0)"
              class="dropdown-toggle"
              data-toggle="dropdown"
            >
              {admin.picture ? (
                <img
                  src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${admin.picture}`}
                  alt="avatar"
                  style={{ width: "30px", height: "30px" }}
                />
              ) : (
                <img
                  style={{ width: "30px", height: "30px" }}
                  src="/img/template/avatar.png"
                  alt="avatar"
                />
              )}

              {admin.name}
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
              {/* <li>
                <a href="javascript:void(0)" class="loading-on">
                  <i class="fa fa-refresh"></i> Refresh
                </a>
              </li>
              <li class="divider"></li>
              <li>
                <a
                  href="#modal-user-settings"
                  role="button"
                  data-toggle="modal"
                >
                  <i class="fa fa-user"></i> User Profile
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <i class="fa fa-wrench"></i> App Settings
                </a>
              </li>
              <li class="divider"></li> */}
              <li>
                <a onClick={handleLogout} href="javascript:void(0)">
                  <i class="fa fa-lock"></i> Log out
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </header>
    </>
  );
};

export default Header;
