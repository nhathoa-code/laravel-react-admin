import React, { useState, useEffect } from "react";
import axios from "../Axios";
import Loader from "../loader/Loader";
import slugify from "react-slugify";
import Processing from "../process_icon/ProcessingIcon";
const PostCategory = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [postCategories, setPostCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [id, setId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("form#form"));
    if (isEditMode) {
      formData.append("_method", "put");
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/post/categories/${id}`,
          formData
        )
        .then((res) => {
          setIsProcessing(false);
          setIsEditMode(false);
          setPostCategories((prev) => {
            const edited_post_category = prev.find((item) => item.id === id);
            edited_post_category.name = res.data.edited_post_category.name;
            return [...prev];
          });
          document.querySelector("form#form").reset();
          alert(res.data.message);
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/post/categories`, formData)
        .then((res) => {
          setIsProcessing(false);
          setPostCategories((prev) => {
            return [...prev, res.data.new_post_category];
          });
          alert(res.data.message);
          document.querySelector("form#form").reset();
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/post/categories/` + id)
      .then((res) => {
        setPostCategories((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

  const handleEdit = (id) => {
    setIsEditMode(true);
    setId(id);
    const post_category = postCategories.find((item) => item.id === id);
    document.querySelector("input[name=name]").value = post_category.name;
    document.querySelector("input[name=slug]").value = post_category.slug;
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/post/categories`)
      .then((res) => {
        setPostCategories(res.data);
        setIsLoading(false);
      });
  }, []);
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        postCategories.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th
                    className="cell-small text-center"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Toggle all!"
                  >
                    <input type="checkbox" id="check1-all" name="check1-all" />
                  </th>
                  <th className="text-center">#</th>
                  <th className="hidden-xs hidden-sm">Tên danh mục</th>
                  <th className="text-center">
                    <i className="fa fa-bolt"></i> Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {postCategories.map((category, index) => {
                  return (
                    <tr key={category.id}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          id="check1-td1"
                          name="check1-td1"
                        />
                      </td>
                      <td className="text-center">{index + 1}</td>
                      <td>{category.name}</td>

                      <td className="text-center">
                        <div className="btn-group">
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-success"
                            onClick={() => {
                              handleEdit(category.id);
                            }}
                          >
                            <i className="fa fa-pencil"></i> Sửa
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(category.id);
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
            <form id="form" className="col-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label for="category_name" className="form-label">
                  Tên danh mục
                </label>
                <input
                  onChange={(e) => {
                    document.querySelector("input[name=slug]").value = slugify(
                      e.target.value
                    );
                  }}
                  type="text"
                  className="form-control shadow-none"
                  name="name"
                />
              </div>
              <div className="mb-3">
                <label for="category_name" className="form-label">
                  Slug
                </label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="slug"
                />
              </div>

              <button
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm danh mục" : "Sữa danh mục"}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    document.querySelector("form#form").reset();
                  }}
                  className="btn btn-danger ml-2"
                >
                  Hủy bỏ
                </button>
              )}
            </form>
          </>
        ) : (
          <>
            <h3>Không có danh mục nào !</h3>
            <form id="form" classNameName="col-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label for="category_name" className="form-label">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="name"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Thêm danh mục
              </button>
            </form>
          </>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default PostCategory;
