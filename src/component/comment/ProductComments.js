import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";
import "./ProductComments.css";

const CommentForm = ({
  name,
  product_id,
  comment_id,
  id,
  comments,
  setComments,
}) => {
  const navigate = useNavigate();
  const style = {
    width: "calc(100% - 25px)",
    marginLeft: "auto",
  };

  useEffect(() => {
    const reply_form = document.querySelector("#comment-reply");
    reply_form.focus();
    reply_form.setSelectionRange(
      reply_form.value.length,
      reply_form.value.length
    );
  });

  const handleReply = () => {
    const data = {
      product_id: product_id,
      commenter: { QTV: true, Name: "Quản trị viên" },
      content: document.querySelector("#comment-reply").value,
      reply_to: comment_id,
      comment_id: comment_id,
      comment_to_reply_id: id,
    };
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/comments_to_reply`, data)
      .then((res) => {
        alert("Đã trả lời bình luận");
        // return console.log(res.data);
        if (comments.length > 1) {
          if (comment_id === null) {
            setComments((prev) => {
              return [...prev].filter((item) => item.id !== id);
            });
          } else {
            const replies = comments
              .find((item) => item.comment_id === comment_id)
              .replies.filter((item) => item.comment_id === null);
            if (replies.length > 1) {
              setComments((prev) => {
                const root_comment = prev.find(
                  (item) => item.comment_id === comment_id
                );
                root_comment.replies = root_comment.replies.filter(
                  (item) => item.id !== id
                );
                let position_to_insert;
                for (let i = 0; i < root_comment.replies.length; i++) {
                  if (root_comment.replies[i].comment_id === null) {
                    position_to_insert = i;
                    break;
                  }
                }

                root_comment.replies.splice(
                  position_to_insert,
                  root_comment.replies.length,
                  {
                    ...res.data.response.comment_answered[0],
                    comment_id: res.data.response.comment_answered[0].id,
                  },
                  {
                    ...res.data.response.comment_answered[1],
                    comment_id: res.data.response.comment_answered[1].id,
                  }
                );

                root_comment.replies = [
                  ...root_comment.replies,
                  ...res.data.response.comments_not_answered,
                ];

                return [...prev];
              });
            } else {
              setComments((prev) => {
                return [...prev].filter(
                  (item) => item.comment_id !== comment_id
                );
              });
            }
          }
        } else {
          if (comment_id === null) {
            navigate(`/comments`);
          } else {
            const replies = comments
              .find((item) => item.comment_id === comment_id)
              .replies.filter((item) => item.comment_id === null);
            if (replies.length > 1) {
              setComments((prev) => {
                const root_comment = prev.find(
                  (item) => item.comment_id === comment_id
                );
                root_comment.replies = root_comment.replies.filter(
                  (item) => item.id !== id
                );
                let position_to_insert;
                for (let i = 0; i < root_comment.replies.length; i++) {
                  if (root_comment.replies[i].comment_id === null) {
                    position_to_insert = i;
                    break;
                  }
                }

                root_comment.replies.splice(
                  position_to_insert,
                  root_comment.replies.length,
                  {
                    ...res.data.response.comment_answered[0],
                    comment_id: res.data.response.comment_answered[0].id,
                  },
                  {
                    ...res.data.response.comment_answered[1],
                    comment_id: res.data.response.comment_answered[1].id,
                  }
                );

                root_comment.replies = [
                  ...root_comment.replies,
                  ...res.data.response.comments_not_answered,
                ];
                return [...prev];
              });
            } else {
              navigate(`/comments`);
            }
          }
        }
      });
  };

  return (
    <div
      style={style}
      class="comment-form-content is-flex is-justify-content-space-between"
    >
      <div class="textarea-comment">
        <textarea
          spellcheck="false"
          class="textarea"
          id="comment-reply"
          defaultValue={`@${name} `}
        ></textarea>
        <button onClick={handleReply} class="button">
          <div class="icon-paper-plane">
            <svg
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path>
            </svg>
          </div>
          Gửi
        </button>
      </div>
    </div>
  );
};

const ProductComments = () => {
  const { product_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const commentReplied = (comment_id) => {
    setComments((prev) => {
      return [...prev].map((item) => {
        if (item.id === comment_id) {
          if (item.hasOwnProperty("replies")) {
            item.replies = item.replies.map((item) => {
              item.replied = false;
              return item;
            });
          }
          if (item.replied) {
            item.replied = false;
          } else {
            item.replied = true;
          }
          return item;
        } else {
          item.replied = false;
          if (item.hasOwnProperty("replies")) {
            item.replies = item.replies.map((item) => {
              item.replied = false;
              return item;
            });
          }
          return item;
        }
      });
    });
  };

  const replyReplied = (comment_id, reply_id) => {
    setComments((prev) => {
      return [...prev].map((item) => {
        if (item.id === comment_id) {
          item.replied = false;
          if (item.hasOwnProperty("replies")) {
            item.replies = item.replies.map((item) => {
              if (item.id === reply_id) {
                if (item.replied) {
                  item.replied = false;
                } else {
                  item.replied = true;
                }
                return item;
              } else {
                item.replied = false;
                return item;
              }
            });
          }

          return item;
        } else {
          item.replied = false;
          return item;
        }
      });
    });
  };

  const handleDelete = (root_comment_id, comment_id) => {
    setIsProcessing(true);
    axios
      .delete(
        `${process.env.REACT_APP_API_ENDPOINT}/comments_to_reply/${comment_id}`,
        {
          params: {
            root_comment_id: root_comment_id,
          },
        }
      )
      .then((res) => {
        setIsProcessing(false);
        alert("Đã xóa bình luận");
        if (!root_comment_id) {
          if (comments.length > 1) {
            setComments((prev) => {
              return [...prev].filter((item) => item.id !== comment_id);
            });
          } else {
            navigate(`/comments`);
          }
        } else {
          const replies = comments
            .find((item) => item.comment_id === root_comment_id)
            .replies.filter((item) => item.comment_id === null);
          if (replies.length > 1) {
            setComments((prev) => {
              const comment = prev.find(
                (item) => item.comment_id === root_comment_id
              );
              comment.replies = comment.replies.filter(
                (item) => item.id !== comment_id
              );
              return [...prev];
            });
          } else {
            if (comments.length > 1) {
              setComments((prev) => {
                return [...prev].filter(
                  (item) => item.comment_id !== root_comment_id
                );
              });
            } else {
              navigate(`/comments`);
            }
          }
        }
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/comments_to_reply/product`, {
        params: {
          product_id: product_id,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setComments(res.data.comments);
        setProduct(res.data.product);
      });
  }, []);
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        <div product-id="16520" class="comment-container">
          <div id="product">
            <img
              style={{ width: "100px" }}
              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${product.image}`}
            />
            <h4>{product.name}</h4>
          </div>
          <div class="block-comment__box-list-comment">
            <div id="page_comment_list" class="list-comment">
              {comments.map((item) => {
                const commenter = JSON.parse(item.commenter);
                return (
                  <div key={`c_${item.id}}`} class="item-comment">
                    <div class="item-comment__box-cmt">
                      <div class="box-cmt__box-info">
                        <div class="box-info">
                          <div class="box-info__avatar">
                            <span>{commenter.Name.charAt(0)}</span>
                          </div>
                          <p class="box-info__name">{commenter.Name}</p>
                        </div>
                        <div class="box-time-cmt">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                            >
                              <path
                                id="clock"
                                d="M7.72,8.78,5.25,6.31V3h1.5v2.69L8.78,7.72ZM6,0a6,6,0,1,0,6,6A6,6,0,0,0,6,0ZM6,10.5A4.5,4.5,0,1,1,10.5,6,4.5,4.5,0,0,1,6,10.5Z"
                                fill="#707070"
                              ></path>
                            </svg>
                          </div>
                          &nbsp;1 tuần trước
                        </div>
                      </div>
                      <div class="box-cmt__box-question">
                        <div class="content">
                          <p>{item.content}</p>
                        </div>
                        {!item.comment_id && (
                          <button class="btn-rep-cmt respondent">
                            <div
                              onClick={() => {
                                commentReplied(item.id);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="12"
                                viewBox="0 0 12 10.8"
                              >
                                <path
                                  id="chat"
                                  d="M3.48,8.32V4.6H1.2A1.2,1.2,0,0,0,0,5.8V9.4a1.2,1.2,0,0,0,1.2,1.2h.6v1.8l1.8-1.8h3A1.2,1.2,0,0,0,7.8,9.4V8.308a.574.574,0,0,1-.12.013H3.48ZM10.8,1.6H5.4A1.2,1.2,0,0,0,4.2,2.8V7.6H8.4l1.8,1.8V7.6h.6A1.2,1.2,0,0,0,12,6.4V2.8a1.2,1.2,0,0,0-1.2-1.2Z"
                                  transform="translate(0 -1.6)"
                                  fill="#707070"
                                ></path>
                              </svg>
                              &nbsp;Trả lời
                            </div>
                            <a
                              style={{ marginLeft: "10px" }}
                              href="javascript:void(0)"
                              onClick={() => handleDelete(null, item.id)}
                            >
                              Xóa
                            </a>
                          </button>
                        )}
                      </div>
                      {item.replied && (
                        <CommentForm
                          name={commenter.Name}
                          product_id={item.product_id}
                          comment_id={item.comment_id}
                          id={item.id}
                          comments={comments}
                          setComments={setComments}
                        />
                      )}
                      <div class="item-comment__box-rep-comment">
                        <div class="list-rep-comment">
                          {item.hasOwnProperty("replies") && (
                            <>
                              {item.replies.map((reply) => {
                                const commenter = JSON.parse(reply.commenter);
                                return (
                                  <div
                                    key={`rep_${reply.id}`}
                                    class="item-rep-comment"
                                  >
                                    <div class="box-cmt__box-info">
                                      <div class="box-info">
                                        <div class="box-info__avatar">
                                          <span>
                                            {commenter.Name.charAt(0)}
                                          </span>
                                        </div>
                                        <p class="box-info__name">
                                          {commenter.Name}
                                        </p>
                                        {commenter.QTV && (
                                          <span class="box-info__tag">QTV</span>
                                        )}
                                      </div>
                                      <div class="box-time-cmt">
                                        <div>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                          >
                                            <path
                                              id="clock"
                                              d="M7.72,8.78,5.25,6.31V3h1.5v2.69L8.78,7.72ZM6,0a6,6,0,1,0,6,6A6,6,0,0,0,6,0ZM6,10.5A4.5,4.5,0,1,1,10.5,6,4.5,4.5,0,0,1,6,10.5Z"
                                              fill="#707070"
                                            ></path>
                                          </svg>
                                        </div>
                                        &nbsp;2 tuần trước
                                      </div>
                                    </div>
                                    <div class="box-cmt__box-question">
                                      {reply.content}
                                      {!reply.comment_id && (
                                        <button class="btn-rep-cmt respondent">
                                          <div
                                            onClick={() => {
                                              replyReplied(item.id, reply.id);
                                            }}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="13"
                                              height="12"
                                              viewBox="0 0 12 10.8"
                                            >
                                              <path
                                                id="chat"
                                                d="M3.48,8.32V4.6H1.2A1.2,1.2,0,0,0,0,5.8V9.4a1.2,1.2,0,0,0,1.2,1.2h.6v1.8l1.8-1.8h3A1.2,1.2,0,0,0,7.8,9.4V8.308a.574.574,0,0,1-.12.013H3.48ZM10.8,1.6H5.4A1.2,1.2,0,0,0,4.2,2.8V7.6H8.4l1.8,1.8V7.6h.6A1.2,1.2,0,0,0,12,6.4V2.8a1.2,1.2,0,0,0-1.2-1.2Z"
                                                transform="translate(0 -1.6)"
                                                fill="#707070"
                                              ></path>
                                            </svg>
                                            &nbsp;Trả lời
                                          </div>
                                          <a
                                            style={{ marginLeft: "10px" }}
                                            href="javascript:void(0)"
                                            onClick={() =>
                                              handleDelete(
                                                item.comment_id,
                                                reply.id
                                              )
                                            }
                                          >
                                            Xóa
                                          </a>
                                        </button>
                                      )}
                                    </div>
                                    {reply.replied && (
                                      <CommentForm
                                        name={commenter.Name}
                                        product_id={reply.product_id}
                                        comment_id={item.comment_id}
                                        id={reply.id}
                                        comments={comments}
                                        setComments={setComments}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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

export default ProductComments;
