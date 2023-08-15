import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../Axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";

const AttributeValue = () => {
  const [searchParams] = useSearchParams();
  const category_attribute_id = searchParams.get("category_attribute_id");
  const [isEditMode, setIsEditMode] = useState(false);
  const [category_attribute_values, setCategoryAttributeValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attribute_value, setAttributeValue] = useState({});

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAttributeValue((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    if (isEditMode) {
      axios
        .put(
          `${process.env.REACT_APP_API_ENDPOINT}/category_attribute_values/${attribute_value.id}`,
          {
            value: attribute_value.value,
          }
        )
        .then((res) => {
          setIsProcessing(false);
          setIsEditMode(false);
          setCategoryAttributeValues((prev) => {
            return [...prev].map((item) =>
              item.id === attribute_value.id
                ? { ...item, value: attribute_value.value }
                : item
            );
          });
          setAttributeValue({});
          alert(res.data.message);
        })
        .catch((err) => {
          setIsEditMode(false);
          setIsProcessing(false);
          alert(err.response.data.message);
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/category_attribute_values`,
          {
            value: attribute_value.value,
            category_attribute_id: category_attribute_id,
          }
        )
        .then((res) => {
          setIsProcessing(false);
          let createdAttributeValue = res.data;
          setCategoryAttributeValues((prev) => {
            return [...prev, createdAttributeValue];
          });
          setAttributeValue({});
        })
        .catch((err) => {
          setIsProcessing(false);
          alert(err.response.data.message);
        });
    }
  };

  const handleDelete = (id) => {
    setIsProcessing(true);
    axios
      .delete(
        `${process.env.REACT_APP_API_ENDPOINT}/category_attribute_values/${id}`
      )
      .then((res) => {
        setIsProcessing(false);
        setCategoryAttributeValues((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      })
      .catch((err) => {
        setIsProcessing(false);
        alert(err.response.data.message);
      });
  };

  const handleEdit = (id) => {
    setIsEditMode(true);
    let attribute_value = category_attribute_values.find(
      (item) => item.id === id
    );
    setAttributeValue({ value: attribute_value.value, id: attribute_value.id });
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/category_attribute_values/` +
          category_attribute_id
      )
      .then((res) => {
        setCategoryAttributeValues(res.data.category_attribute_values);
        setIsLoading(false);
      });
  }, [category_attribute_id]);
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        category_attribute_values.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th className="hidden-xs hidden-sm">Giá trị</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {category_attribute_values.map((attribute_value) => {
                  return (
                    <tr key={attribute_value.id}>
                      <td className="hidden-xs hidden-sm">
                        {attribute_value.value}
                      </td>
                      <td class="text-center">
                        <div class="btn-group">
                          <a
                            onClick={() => {
                              handleEdit(attribute_value.id);
                            }}
                            href="javascript:void(0)"
                            class="btn btn-xs btn-success"
                          >
                            <i class="fa fa-pencil"></i> Sửa
                          </a>
                          <a
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(attribute_value.id);
                              }
                            }}
                            href="javascript:void(0)"
                            class="btn btn-xs btn-danger"
                          >
                            <i class="fa fa-times"></i> Xóa
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <form className="col-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="attribute_name" className="form-label">
                  Giá trị
                </label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  id="attribute_name"
                  name="value"
                  value={attribute_value.value || ""}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm giá trị" : "Sữa giá trị"}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setAttributeValue({});
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
            <h3>Không có giá trị nào !</h3>
            <form className="col-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="attribute_name" className="form-label">
                  Giá trị
                </label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  id="attribute_name"
                  name="value"
                  value={attribute_value.value || ""}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm giá trị" : "Sữa giá trị"}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setAttributeValue({});
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

export default AttributeValue;
