import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../Axios";
import Loader from "../loader/Loader";

const Comments = () => {
  const [commentsToReply, setCommentsToReply] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/comments_to_reply`)
      .then((res) => {
        setCommentsToReply(res.data);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {!isLoading ? (
        commentsToReply.length !== 0 ? (
          <>
            <table className="table">
              <tbody>
                {commentsToReply.map((comment, index) => {
                  return (
                    <tr key={comment.id}>
                      <td className="text-center">{index + 1}</td>
                      <td style={{ width: "20%" }} className="text-center">
                        <img
                          style={{ width: "80px" }}
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${comment.image}`}
                        />
                      </td>
                      <td>{comment.name}</td>
                      <td>
                        Có{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {comment.comments}
                        </span>{" "}
                        bình luận cần trả lời
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/comments/product/${comment.product_id}`}
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
            <h3>Không có bình luận nào cần trả lời!</h3>
          </>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Comments;
