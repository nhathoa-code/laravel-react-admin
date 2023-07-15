import React from "react";
import { Link, useLocation } from "react-router-dom";

const Aside = () => {
  const location = useLocation();
  return (
    <aside
      id="page-sidebar"
      class="collapse navbar-collapse navbar-main-collapse"
    >
      {/* <form id="sidebar-search" action="page_search_results.html" method="post">
        <div class="input-group">
          <input
            type="text"
            id="sidebar-search-term"
            name="sidebar-search-term"
            placeholder="Search.."
          />
          <button>
            <i class="fa fa-search"></i>
          </button>
        </div>
      </form> */}

      <nav id="primary-nav">
        <ul>
          <li>
            <Link
              style={
                location.pathname === "/"
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={""}
            >
              DASHBOARD
            </Link>
          </li>
          <li>
            <Link
              style={
                location.pathname.includes("/category")
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"category"}
            >
              DANH MỤC
            </Link>
          </li>
          <li>
            <Link
              style={
                location.pathname.includes("/products_groups")
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"products_groups"}
            >
              NHÓM SẢN PHẨM
            </Link>
          </li>
          <li>
            <a href="category">SẢN PHẨM</a>
            <ul>
              <li>
                <Link
                  style={
                    location.pathname === "/products"
                      ? { backgroundColor: "#f6f6f6", color: "#777" }
                      : {}
                  }
                  to={"products"}
                >
                  Danh sách sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  style={
                    location.pathname === "/product/add"
                      ? { backgroundColor: "#f6f6f6", color: "#777" }
                      : {}
                  }
                  to={"product/add"}
                >
                  Thêm sản phẩm
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/orders"
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"orders"}
            >
              ĐƠN HÀNG
            </Link>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/banners"
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"banners"}
            >
              BANNER
            </Link>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/roles"
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"roles"}
            >
              VAI TRÒ QUẢN TRỊ
            </Link>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/admins"
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"admins"}
            >
              THÀNH VIÊN QUẢN TRỊ
            </Link>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/post/categories"
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"/post/categories"}
            >
              DANH MỤC BÀI VIẾT
            </Link>
          </li>
          <li>
            <a href="#">BÀI VIẾT</a>
            <ul>
              <li>
                <Link
                  style={
                    location.pathname === "/posts"
                      ? { backgroundColor: "#f6f6f6", color: "#777" }
                      : {}
                  }
                  to={"posts"}
                >
                  Danh sách bài viết
                </Link>
              </li>
              <li>
                <Link
                  style={
                    location.pathname === "/post/add"
                      ? { backgroundColor: "#f6f6f6", color: "#777" }
                      : {}
                  }
                  to={"posts/add"}
                >
                  Thêm bài viết
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/comments"
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"comments"}
            >
              HỎI - ĐÁP
            </Link>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/reviews"
                  ? { backgroundColor: "#f6f6f6", color: "#777" }
                  : {}
              }
              to={"reviews"}
            >
              ĐÁNH GIÁ
            </Link>
          </li>
          <li>
            <a href="">MÃ GIẢM GIÁ</a>
            <ul>
              <li>
                <Link
                  style={
                    location.pathname === "/coupons"
                      ? { backgroundColor: "#f6f6f6", color: "#777" }
                      : {}
                  }
                  to={"coupons"}
                >
                  Danh sách mã giảm giá
                </Link>
              </li>
              <li>
                <Link
                  style={
                    location.pathname === "/coupon/add"
                      ? { backgroundColor: "#f6f6f6", color: "#777" }
                      : {}
                  }
                  to={"coupon/add"}
                >
                  Thêm mã giảm giá
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Aside;
