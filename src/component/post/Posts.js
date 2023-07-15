import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";
import { Parser } from "html-to-react";

axios.defaults.withCredentials = true;
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [links, setLinks] = useState([]);
  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/posts/${id}`)
      .then((res) => {
        console.log(res.data.message);
        setPosts((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/posts`).then((res) => {
      console.log(res.data.data);
      setPosts(res.data.data);
      setLinks(res.data.links);
      setIsLoading(false);
    });
  }, []);

  const handleLoadPage = (url) => {
    if (!url) {
      return;
    }
    setIsProcessing(true);
    axios.get(url).then((res) => {
      console.log(res.data.data);
      setIsProcessing(false);
      setPosts(res.data.data);
      setLinks(res.data.links);
    });
  };

  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        posts.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th style={{ width: "30%" }} className="hidden-xs hidden-sm">
                    Tiêu đề
                  </th>
                  <th className="hidden-xs hidden-sm text-center">Thumbnail</th>
                  <th className="hidden-xs hidden-sm">Author</th>
                  <th className="hidden-xs hidden-sm">Danh mục</th>
                  <th className="hidden-xs hidden-sm">Ngày tạo</th>
                  <th className="text-center">
                    <i className="fa fa-bolt"></i> Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => {
                  return (
                    <tr key={post.id}>
                      <td className="text-center">{index + 1}</td>
                      <td>{post.title}</td>
                      <td className="text-center">
                        <img
                          style={{ width: "120px" }}
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${post.post_thumbnail}`}
                        />
                      </td>
                      <td>{post.author.name}</td>
                      <td>{post.post_category.name}</td>
                      <td>{post.created_at}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/posts/${post.id}`}
                            className="btn btn-xs btn-success"
                          >
                            <i className="fa fa-pencil"></i> Sửa
                          </Link>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(post.id);
                              }
                            }}
                          >
                            <i className="fa fa-times"></i> Xóa
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <ul class="pagination">
              {links.map((item) => {
                return (
                  <li className={`${item.active ? "active" : ""}`}>
                    <a
                      onClick={() => handleLoadPage(item.url)}
                      href="javascript:void(0)"
                    >
                      {Parser().parse(item.label)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <>
            <h3>Không có bài viết nào !</h3>
          </>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Posts;
