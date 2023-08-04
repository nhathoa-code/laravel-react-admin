import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../Axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";

const Brand = () => {
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brand_id, setBrandId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const category_id = searchParams.get("category_id");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/brands`, {
        params: {
          category_id: category_id,
        },
      })
      .then((res) => {
        setBrands(res.data);
        setIsLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    setBrandId(id);
    let edited_brand = brands.find((item) => item.id === id);
    document.querySelector("input[name=brand_name]").value = edited_brand.name;
    setImagePreview(
      `${process.env.REACT_APP_SERVER_ROOT_URL}/${edited_brand.image}`
    );
    setIsEditMode(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/brands/${id}`)
      .then((res) => {
        setBrands((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("#form"));
    if (isEditMode) {
      formData.append("_method", "put");
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/brands/${brand_id}`,
          formData
        )
        .then((res) => {
          setIsProcessing(false);
          setBrands((prev) => {
            return [...prev].map((item) => {
              if (item.id === brand_id) {
                return res.data.updated_brand;
              } else {
                return item;
              }
            });
          });
          document.querySelector("#form").reset();
          setImagePreview(null);
          setIsEditMode(false);
        })
        .catch(() => {
          setIsProcessing(false);
        });
    } else {
      formData.append("category_id", category_id);
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/brands`, formData)
        .then((res) => {
          setIsProcessing(false);
          setBrands((prev) => {
            return [...prev, res.data.new_brand];
          });
          document.querySelector("#form").reset();
          setImagePreview(null);
        })
        .catch(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleImageUpload = (e) => {
    if (!e.target.files[0]) {
      setImagePreview(null);
    } else {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        brands.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th class="hidden-xs hidden-sm">Nhà sản xuất</th>
                  <th class="text-center hidden-xs hidden-sm">Ảnh đại diện</th>
                  <th className="text-center">
                    <i className="fa fa-bolt"></i> Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => {
                  return (
                    <tr key={brand.id}>
                      <td class="hidden-xs hidden-sm">{brand.name}</td>
                      <td class="text-center hidden-xs hidden-sm">
                        <img
                          style={{ width: "150px", height: "30px" }}
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${brand.image}`}
                        />
                      </td>

                      <td className="text-center">
                        <div className="btn-group">
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-success"
                            onClick={() => {
                              handleEdit(brand.id);
                            }}
                          >
                            <i className="fa fa-pencil"></i> Sửa
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(brand.id);
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
                <label className="form-label">Tên nhà sản xuất</label>
                <input type="text" className="form-control" name="brand_name" />
              </div>
              <div class="mb-3">
                <label className="form-label">Ảnh đại diện</label>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  className="form-control"
                  name="brand_image"
                />
                {imagePreview && <img src={imagePreview} />}
              </div>
              <button
                style={{ marginTop: "10px" }}
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm nhà sản xuất" : "Sửa nhà sản xuất"}
              </button>
              {isEditMode && (
                <button
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    setIsEditMode(false);
                    setImagePreview(null);
                    document.querySelector("input[name=brand_name]").value = "";
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
            <h3>Không có nhà sản xuất nào !</h3>
            <form id="form" className="col-4" onSubmit={handleSubmit}>
              <div class="mb-3">
                <label for="category_name" className="form-label">
                  Tên nhà sản xuất
                </label>
                <input type="text" className="form-control" name="brand_name" />
              </div>
              <div class="mb-3">
                <label for="category_name" className="form-label">
                  Ảnh đại diện
                </label>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  name="brand_image"
                  class="form-control"
                />
                {imagePreview && (
                  <img
                    style={{ width: "auto", height: "auto" }}
                    src={imagePreview}
                  />
                )}
              </div>
              <button
                style={{ marginTop: "10px" }}
                type="submit"
                className="btn btn-primary"
              >
                Thêm nhà sản xuất
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

export default Brand;
