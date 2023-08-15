import React from "react";
import { Link, useLocation } from "react-router-dom";

const Aside = () => {
  const location = useLocation();
  return (
    <aside
      id="page-sidebar"
      class="collapse navbar-collapse navbar-main-collapse"
    >
      <nav id="primary-nav">
        <ul>
          <li>
            <Link
              style={
                location.pathname === "/"
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                      ? { backgroundColor: "#fff", color: "#041e3a" }
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
                      ? { backgroundColor: "#fff", color: "#041e3a" }
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
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                location.pathname === "/customers"
                  ? { backgroundColor: "#fff", color: "#041e3a" }
                  : {}
              }
              to={"customers"}
            >
              KHÁCH HÀNG
            </Link>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/banners"
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                      ? { backgroundColor: "#fff", color: "#041e3a" }
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
                      ? { backgroundColor: "#fff", color: "#041e3a" }
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
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                  ? { backgroundColor: "#fff", color: "#041e3a" }
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
                      ? { backgroundColor: "#fff", color: "#041e3a" }
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
                      ? { backgroundColor: "#fff", color: "#041e3a" }
                      : {}
                  }
                  to={"coupon/add"}
                >
                  Thêm mã giảm giá
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              style={
                location.pathname === "/flashsale"
                  ? { backgroundColor: "#fff", color: "#041e3a" }
                  : {}
              }
              to={"flashsale"}
            >
              FLASH SALE
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Aside;
