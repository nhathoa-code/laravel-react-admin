import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
const Reviews = () => {
  const [reviewsToProve, setReviewsToProve] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/reviews_to_prove`)
      .then((res) => {
        console.log(res.data);
        setReviewsToProve(res.data);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {!isLoading ? (
        reviewsToProve.length !== 0 ? (
          <>
            <table className="table">
              <tbody>
                {reviewsToProve.map((review, index) => {
                  return (
                    <tr key={review.id}>
                      <td className="text-center">{index + 1}</td>
                      <td style={{ width: "20%" }} className="text-center">
                        <img
                          style={{ width: "80px" }}
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${review.image}`}
                        />
                      </td>
                      <td>{review.name}</td>
                      <td>
                        Có{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {review.reviews}
                        </span>{" "}
                        đánh giá đang chờ duyệt
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/reviews/product/${review.product_id}`}
                            className="btn btn-xs btn-success"
                          >
                            <i className="fa fa-pencil"></i> Chi tiết
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3>Không có đánh giá nào chờ duyệt!</h3>
          </>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Reviews;
