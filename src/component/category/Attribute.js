import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";

const Attribute = () => {
  const [searchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");
  const [isEditMode, setIsEditMode] = useState(false);
  const [category_attributes, setCategoryAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attribute, setAttribute] = useState({});

  const handleInputChange = (e) => {
    const name = e.target.name;
    let value;
    if (name === "show/hide") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    setAttribute((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    if (isEditMode) {
      axios
        .put(
          `${process.env.REACT_APP_API_ENDPOINT}/category_attributes/${attribute.id}`,
          {
            name: attribute.name,
            ["show/hide"]: attribute["show/hide"],
          }
        )
        .then((res) => {
          setIsProcessing(false);
          setIsEditMode(false);
          setCategoryAttributes((prev) => {
            return [...prev].map((item) =>
              item.id === attribute.id
                ? {
                    ...item,
                    name: attribute.name,
                    ["show/hide"]: attribute["show/hide"],
                  }
                : item
            );
          });
          setAttribute({});
          alert(res.data.message);
        })
        .catch(() => {
          setIsEditMode(false);
          setIsProcessing(false);
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/category_attributes`, {
          name: attribute.name,
          category_id: category_id,
          ["show/hide"]: attribute["show/hide"],
        })
        .then((res) => {
          setIsProcessing(false);
          console.log(res.data);
          let createdAttr = res.data;
          setCategoryAttributes((prev) => {
            return [...prev, createdAttr];
          });
          setAttribute({});
        })
        .catch(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/category_attributes/${id}`)
      .then((res) => {
        setCategoryAttributes((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

  const handleEdit = (id) => {
    setIsEditMode(true);
    let attribute = category_attributes.find((item) => item.id === id);
    setAttribute({
      name: attribute.name,
      id: attribute.id,
      ["show/hide"]: attribute["show/hide"] == "1" ? true : false,
    });
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/category_attributes/${category_id}`
      )
      .then((res) => {
        console.log(res.data);
        setCategoryAttributes(res.data.category_attributes);
        setIsLoading(false);
      });
  }, [category_id]);
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        category_attributes.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th class="hidden-xs hidden-sm">Tên tiêu chí</th>
                  <th class="hidden-xs hidden-sm">Giá trị</th>
                  <th class="hidden-xs hidden-sm">Ẩn/Hiện</th>
                  <th class="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {category_attributes.map((attribute) => {
                  return (
                    <tr key={attribute.id}>
                      <td class="hidden-xs hidden-sm">{attribute.name}</td>
                      <td class="hidden-xs hidden-sm">
                        <Link
                          to={`/category/attribute/values?category_attribute_id=${attribute.id}`}
                        >
                          link
                        </Link>
                      </td>
                      <td>{attribute["show/hide"] == "0" ? "Ẩn" : "Hiện"}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-success"
                            onClick={() => {
                              handleEdit(attribute.id);
                            }}
                          >
                            <i className="fa fa-pencil"></i> Sửa
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(attribute.id);
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
                <label htmlFor="attribute_name" className="form-label">
                  Tên tiêu chí
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="attribute_name"
                  name="name"
                  value={attribute.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <div class="checkbox">
                  <label for="example-checkbox1">
                    <input
                      type="checkbox"
                      id="example-checkbox1"
                      name="show/hide"
                      checked={
                        attribute.hasOwnProperty("show/hide")
                          ? attribute["show/hide"]
                            ? true
                            : false
                          : false
                      }
                      onChange={handleInputChange}
                    />
                    Ẩn/Hiện
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm tiêu chí" : "Sữa tiêu chí"}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setAttribute({});
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
            <h3>Không có tiêu chí nào !</h3>
            <form className="col-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="attribute_name" className="form-label">
                  Tên tiêu chí
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="attribute_name"
                  name="name"
                  value={attribute.name || ""}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm tiêu chí" : "Sữa tiêu chí"}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setAttribute({});
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

export default Attribute;
