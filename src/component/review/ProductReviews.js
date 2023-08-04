import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../Axios";
import Loader from "../loader/Loader";
import "./ProductReviews.css";
import ProcessingIcon from "../process_icon/ProcessingIcon";

const ProductReviews = () => {
  const { product_id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect((prev) => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/reviews_to_prove/product`, {
        params: {
          product_id: product_id,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setProduct(res.data.product);
        setReviews(res.data.reviews);
      });
  }, []);

  const handleDelete = (id) => {
    setProcessing(true);
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/reviews_to_prove/${id}`)
      .then((res) => {
        setProcessing(false);
        if (reviews.length > 1) {
          setReviews((prev) => {
            return prev.filter((item) => item.id !== id);
          });
        } else {
          navigate(`/reviews`);
        }
      });
  };

  const handleProve = (id) => {
    setProcessing(true);
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/reviews_to_prove/prove/${id}`
      )
      .then((res) => {
        setProcessing(false);
        if (reviews.length > 1) {
          setReviews((prev) => {
            return prev.filter((item) => item.id !== id);
          });
        } else {
          navigate(`/reviews`);
        }
      });
  };

  return (
    <>
      {processing && <ProcessingIcon />}
      {!isLoading ? (
        <div style={{ margin: "0 100px" }}>
          <div id="product">
            <img
              style={{ width: "100px" }}
              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${product.image}`}
            />
            <h4>{product.name}</h4>
          </div>
          <div className="boxReview p-2 mt-3">
            <div className="boxReview-comment my-2">
              {reviews.map((review) => {
                return (
                  <>
                    <div class="boxReview-comment-item mb-4">
                      <div class="boxReview-comment-item-title is-flex is-justify-content-space-between is-align-items-center">
                        <div class="is-flex is-align-items-center">
                          <p
                            style={{ margin: "0" }}
                            class="mr-2 is-flex is-align-items-center is-justify-content-center name-letter"
                          >
                            {review.reviewer.name.charAt(0)}
                          </p>
                          <span class="name">{review.reviewer.name}</span>
                        </div>
                        <p class="date-time">{review.created_at}</p>
                      </div>
                      <div class="boxReview-comment-item-review my-2 p-2">
                        <div class="item-review-rating is-flex is-align-items-center">
                          <strong>Đánh giá: </strong>
                          <div>
                            {[1, 2, 3, 4, 5].map((item) => {
                              return (
                                <div class="icon is-active">
                                  <div class="icon is-active">
                                    <svg
                                      enable-background="new 0 0 15 15"
                                      viewBox="0 0 15 15"
                                      x="0"
                                      y="0"
                                      class="shopee-svg-icon shopee-rating-stars__hollow-star icon-rating"
                                    >
                                      <polygon
                                        fill={
                                          review.star >= item
                                            ? "#f59e0b"
                                            : "none"
                                        }
                                        points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="10"
                                      ></polygon>
                                    </svg>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div
                          style={{ height: "fit-content" }}
                          class="item-review-comment my-1 is-flex is-justify-content-space-between is-flex-direction-column"
                        >
                          <div class="comment-content">
                            <p style={{ margin: "0" }}>
                              <strong>Nhận xét : </strong>
                              {review.content}
                            </p>
                          </div>
                          <div class="comment-image is-flex">
                            {review.hasOwnProperty("review_images") && (
                              <>
                                {review.review_images.map((item) => {
                                  return (
                                    <img
                                      className="image"
                                      style={{ width: "30px" }}
                                      src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item}`}
                                    />
                                  );
                                })}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                      class="btn-group"
                    >
                      <a
                        style={{
                          backgroundColor: "#5cb85c",
                          marginRight: "10px",
                          padding: "0 2px",
                        }}
                        href="javascript:void(0)"
                        class="btn btn-xs btn-success"
                        onClick={() => handleProve(review.id)}
                      >
                        <i class="fa fa-pencil"></i> Duyệt
                      </a>
                      <a
                        style={{ backgroundColor: "#d9534f", padding: "0 2px" }}
                        href="javascript:void(0)"
                        class="btn btn-xs btn-danger"
                        onClick={() => {
                          handleDelete(review.id);
                        }}
                      >
                        <i class="fa fa-times"></i> Xóa
                      </a>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ProductReviews;
