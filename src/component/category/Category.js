import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../Axios";
import { Parser } from "html-to-react";
import Loader from "../loader/Loader";
import slugify from "react-slugify";
import Processing from "../process_icon/ProcessingIcon";
const Category = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputs, setInputs] = useState({});

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "name") {
      document.querySelector("input[name=slug]").value = slugify(value);
    }
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    if (isEditMode) {
      axios
        .put(`${process.env.REACT_APP_API_ENDPOINT}/categories/` + inputs.id, {
          name: inputs.name,
          slug: document.querySelector("input[name=slug]").value,
          icon: inputs.icon,
        })
        .then((res) => {
          setIsProcessing(false);
          setIsEditMode(false);
          setCategories((prev) => {
            return [...prev].map((item) =>
              item.id === inputs.id
                ? { ...item, name: inputs.name, icon: inputs.icon }
                : item
            );
          });
          setInputs({});
          document.querySelector("input[name=slug]").value = "";
          alert(res.data.message);
        })
        .catch(() => {
          setIsProcessing(false);
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/categories`, {
          name: inputs.name,
          slug: document.querySelector("input[name=slug]").value,
          icon: inputs.icon,
        })
        .then((res) => {
          setIsProcessing(false);
          console.log(res);
          let createdCat = res.data;
          setCategories((prev) => {
            return [...prev, createdCat];
          });
          setInputs({});
          document.querySelector("input[name=slug]").value = "";
        })
        .catch(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/categories/${id}`)
      .then((res) => {
        console.log(res);
        setCategories((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

  const handleEdit = (id) => {
    setIsEditMode(true);
    let category = categories.find((item) => item.id === id);
    setInputs({ name: category.name, icon: category.icon, id: category.id });
    document.querySelector("input[name=slug]").value = category.slug;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then((res) => {
        setCategories(res.data.categories);
        setIsLoading(false);
      });
  }, []);
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        categories.length !== 0 ? (
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
                  <th className="hidden-xs hidden-sm text-center">Icon</th>
                  <th className="hidden-xs hidden-sm">Danh mục con</th>
                  <th className="hidden-xs hidden-sm">Tiêu chí</th>
                  <th className="hidden-xs hidden-sm">Hãng sản xuất</th>
                  <th className="text-center">
                    <i className="fa fa-bolt"></i> Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => {
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
                      <td className="hidden-xs hidden-sm text-center">
                        {Parser().parse(category.icon)}
                      </td>
                      <td className="hidden-xs hidden-sm">
                        <Link to={`children?parent_id=${category.id}`}>
                          link
                        </Link>
                      </td>
                      <td className="hidden-xs hidden-sm">
                        <Link to={`attributes?category_id=${category.id}`}>
                          link
                        </Link>
                      </td>
                      <td className="hidden-xs hidden-sm">
                        <Link to={`brand?category_id=${category.id}`}>
                          link
                        </Link>
                      </td>
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
                  type="text"
                  className="form-control shadow-none"
                  id="category_name"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div class="mb-3">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-control"
                  name="slug"
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Icon</label>
                <textarea
                  className="form-control shadow-none"
                  name="icon"
                  value={inputs.icon || ""}
                  onChange={handleInputChange}
                ></textarea>
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
                    setInputs({});
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
                  id="category_name"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div class="mb-3">
                <label for="category_name" className="form-label">
                  Slug
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="category_name"
                  name="slug"
                  defaultValue={
                    isEditMode
                      ? slugify(inputs.name)
                      : inputs.slug
                      ? inputs.slug
                      : slugify(inputs.name) || ""
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Icon</label>
                <textarea
                  className="form-control shadow-none"
                  name="icon"
                  value={inputs.icon || ""}
                  onChange={handleInputChange}
                ></textarea>
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

export default Category;
