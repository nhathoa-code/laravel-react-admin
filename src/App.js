import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./provider/AuthProvider";
import NotIfAlreadyAuth from "./component/NotIfAlreadyAuth";
import RequireAuth from "./component/RequireAuth";
import Loader from "./component/loader/Loader";
import Dashboard from "./component/Dashboard";
import Product from "./component/product/Product";
import ProductPosts from "./component/product/Posts";
import ProductList from "./component/product/ProductList";
import Category from "./component/category/Category";
import Brand from "./component/category/Brand";
import MainLayout from "./layout/MainLayout";
import Children from "./component/category/Children";
import Attribute from "./component/category/Attribute";
import AttributeValue from "./component/category/AttributeValue";
import ProductsGroup from "./component/products_group/ProductsGroup";
import Edit from "./component/product/Edit";
import OrderList from "./component/order/OrderList";
import OrderDetail from "./component/order/OrderDetail";
import Banner from "./component/banner/Banner";
import Role from "./component/role/Role";
import Admin from "./component/admin/Admin";
import PostCategory from "./component/post_categories/PostCategory";
import Post from "./component/post/Post";
import Posts from "./component/post/Posts";
import PostEdit from "./component/post/Edit";
import Comments from "./component/comment/Comments";
import ProductComments from "./component/comment/ProductComments";
import Reviews from "./component/review/Reviews";
import ProductReviews from "./component/review/ProductReviews";
import Coupon from "./component/coupon/Coupon";
import Coupons from "./component/coupon/Coupons";
import CouponEdit from "./component/coupon/Edit";
import Login from "./component/Login";
import FlashSale from "./component/flash_sale/FlashSale";

function App() {
  const { isLogginChecked } = useContext(AuthContext);
  return (
    <>
      {isLogginChecked ? (
        <BrowserRouter>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="category" element={<Category />} />
                <Route path="category/brand" element={<Brand />} />
                <Route path="category/children" element={<Children />} />
                <Route path="category/attributes" element={<Attribute />} />
                <Route
                  path="category/attribute/values"
                  element={<AttributeValue />}
                />
                <Route path="product/add" element={<Product />} />
                <Route path="product/posts" element={<ProductPosts />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/edit/:id" element={<Edit />} />
                <Route path="products_groups" element={<ProductsGroup />} />

                <Route path="orders" element={<OrderList />} />
                <Route path="orders/:order_id" element={<OrderDetail />} />

                <Route path="banners" element={<Banner />} />

                <Route path="roles" element={<Role />} />

                <Route path="admins" element={<Admin />} />

                <Route path="post/categories" element={<PostCategory />} />
                <Route path="posts" element={<Posts />} />
                <Route path="posts/add" element={<Post />} />
                <Route path="posts/:post_id" element={<PostEdit />} />

                <Route path="comments" element={<Comments />} />
                <Route
                  path="comments/product/:product_id"
                  element={<ProductComments />}
                />

                <Route path="reviews" element={<Reviews />} />
                <Route path="flashsale" element={<FlashSale />} />
                <Route
                  path="reviews/product/:product_id"
                  element={<ProductReviews />}
                />

                <Route path="coupon/add" element={<Coupon />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="coupons/edit/:id" element={<CouponEdit />} />
              </Route>
            </Route>
            <Route element={<NotIfAlreadyAuth />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      ) : (
        <Loader
          style={{
            height: "100vh",
            marginTop: "0",
            paddingBottom: "70px",
            alignItems: "center",
          }}
        />
      )}
    </>
  );
}

export default App;
