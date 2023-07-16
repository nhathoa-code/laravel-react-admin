import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../Axios";
import { Parser } from "html-to-react";
import slugify from "react-slugify";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";

const Children = () => {
  const [searchParams] = useSearchParams();
  const parent_id = searchParams.get("parent_id");
  const [isEditMode, setIsEditMode] = useState(false);
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputs, setInputs] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("form#form"));
    formData.append("parent_id", parent_id);
    if (imagePreview) {
      formData.append(
        "category_image",
        document.querySelector("input[type=file]").files[0]
      );
    }
    if (isEditMode) {
      formData.append("_method", "put");
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/categories/${inputs.id}`,
          formData
        )
        .then((res) => {
          setIsProcessing(false);
          setIsEditMode(false);
          setChildren((prev) => {
            return [...prev].map((item) =>
              item.id === inputs.id
                ? {
                    ...res.data.updated_cat,
                  }
                : item
            );
          });
          setInputs({});
          setImagePreview(null);
          document.querySelector("form#form").reset();
          alert(res.data.message);
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/categories", formData)
        .then((res) => {
          setIsProcessing(false);

          let createdCat = res.data;
          setChildren((prev) => {
            return [...prev, createdCat];
          });
          setInputs({});
          document.querySelector("form#form").reset();
          setImagePreview(null);
        })
        .catch(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleDelete = (id) => {
    setIsProcessing(true);
    axios.delete("http://127.0.0.1:8000/api/categories/" + id).then((res) => {
      setIsProcessing(false);

      setChildren((prev) => {
        return [...prev].filter((item) => item.id !== id);
      });
    });
  };

  const handleEdit = (id) => {
    setIsEditMode(true);
    let category = children.find((item) => item.id === id);
    console.log(category);
    setInputs({
      name: category.name,
      icon: category.icon,
      id: category.id,
      slug: category.slug,
    });
  };

  const handleImageUpload = (e) => {
    if (!e.target.files[0]) {
      setImagePreview(null);
    } else {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get("http://127.0.0.1:8000/api/categories/children/" + parent_id)
      .then((res) => {
        setChildren(res.data.children);
        setIsLoading(false);
      });
  }, [parent_id]);
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        children.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th class="hidden-xs hidden-sm">Tên danh mục</th>
                  <th class="hidden-xs hidden-sm">Icon</th>
                  <th
                    style={{ width: "20%" }}
                    class="text-center hidden-xs hidden-sm"
                  >
                    Ảnh
                  </th>
                  <th class="hidden-xs hidden-sm">Danh mục con</th>
                  <th class="hidden-xs hidden-sm">Tiêu chí</th>
                  <th class="hidden-xs hidden-sm">Hãng sản xuất</th>
                  <th className="text-center">
                    <i className="fa fa-bolt"></i> Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {children.map((category) => {
                  return (
                    <tr key={category.id}>
                      <td class="hidden-xs hidden-sm">{category.name}</td>
                      <td class="hidden-xs hidden-sm">
                        {Parser().parse(category.icon)}
                      </td>
                      <td class="text-center hidden-xs hidden-sm">
                        {category.image && (
                          <img
                            style={{ width: "50%" }}
                            src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${category.image}`}
                          />
                        )}
                      </td>
                      <td class="hidden-xs hidden-sm">
                        <Link
                          to={`/category/children?parent_id=${category.id}`}
                        >
                          link
                        </Link>
                      </td>
                      <td class="hidden-xs hidden-sm">
                        <Link
                          to={`/category/attributes?category_id=${category.id}`}
                        >
                          link
                        </Link>
                      </td>
                      <td class="hidden-xs hidden-sm">
                        <Link to={`/category/brand?category_id=${category.id}`}>
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
              <div class="mb-3">
                <label className="form-label">Tên danh mục</label>
                <input
                  type="text"
                  className="form-control"
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
                  value={
                    isEditMode
                      ? slugify(inputs.name)
                      : inputs.slug
                      ? inputs.slug
                      : slugify(inputs.name) || ""
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div class="mb-3">
                <label className="form-label">Icon</label>
                <textarea
                  className="form-control"
                  name="icon"
                  value={inputs.icon || ""}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div class="mb-3">
                <label className="form-label"> Hoặc ảnh</label>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  name="category_image"
                  class="form-control"
                />
                {imagePreview && <img src={imagePreview} />}
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
            <form id="form" className="col-4" onSubmit={handleSubmit}>
              <div class="mb-3">
                <label for="category_name" className="form-label">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  className="form-control"
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
                  value={
                    isEditMode
                      ? slugify(inputs.name)
                      : inputs.slug
                      ? inputs.slug
                      : slugify(inputs.name) || ""
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div class="mb-3">
                <label className="form-label">Icon</label>
                <textarea
                  className="form-control"
                  name="icon"
                  value={inputs.icon || ""}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div class="mb-3">
                <label className="form-label">Hoặc ảnh</label>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  name="category_image"
                  class="form-control"
                />
                {imagePreview && <img src={imagePreview} />}
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
                  }}
                  className="btn btn-danger ml-2"
                >
                  Hủy bỏ
                </button>
              )}
            </form>
          </>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Children;
