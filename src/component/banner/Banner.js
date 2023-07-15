import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../loader/Loader";

const Banner = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [banner_id, setBannerId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/banners`).then((res) => {
      console.log(res.data);
      setBanners(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleEdit = (id) => {
    setBannerId(id);
    let banner = banners.find((item) => item.id === id);
    setImagePreview(`${process.env.REACT_APP_SERVER_ROOT_URL}/${banner.image}`);
    document.querySelector("textarea[name=short_description]").value =
      banner.short_description;
    document.querySelector("input[name=link_to]").value = banner.link_to;
    setIsEditMode(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/banners/${id}`)
      .then((res) => {
        setBanners((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector("#form"));
    if (isEditMode) {
      formData.append("_method", "put");
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/banners/${banner_id}`,
          formData
        )
        .then((res) => {
          setBanners((prev) => {
            let banner = prev.find((item) => item.id === banner_id);
            banner.image = res.data.image;
            banner.short_description = res.data.short_description;
            banner.link_to = res.data.link_to;
            return [...prev];
          });
          document.querySelector("#form").reset();
          setImagePreview(null);
          setIsEditMode(false);
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/banners`, formData)
        .then((res) => {
          console.log(res.data);

          setBanners((prev) => {
            return [...prev, res.data];
          });
          document.querySelector("#form").reset();
          setImagePreview(null);
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
      {!isLoading ? (
        banners.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th class="hidden-xs hidden-sm">Ảnh banner</th>
                  <th class="hidden-xs hidden-sm">Mô tả ngắn</th>
                  <th class="hidden-xs hidden-sm">Liên kết</th>
                  <th className="text-center">
                    <i className="fa fa-bolt"></i> Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => {
                  return (
                    <tr key={banner.id}>
                      <td style={{ width: "45%" }} class="hidden-xs hidden-sm">
                        <img
                          style={{ width: "95%", height: "auto" }}
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${banner.image}`}
                        />
                      </td>
                      <td class="hidden-xs hidden-sm">
                        {banner.short_description.split("\r\n").map((item) => (
                          <p>{item}</p>
                        ))}
                      </td>
                      <td class="hidden-xs hidden-sm">{banner.link_to}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-success"
                            onClick={() => {
                              handleEdit(banner.id);
                            }}
                          >
                            <i className="fa fa-pencil"></i> Sửa
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(banner.id);
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
                <label className="form-label">Ảnh banner</label>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  name="banner_image"
                  class="form-control"
                />
                {imagePreview && (
                  <img style={{ width: "100%" }} src={imagePreview} />
                )}
              </div>
              <div class="mb-3">
                <label className="form-label">Mô tả ngắn</label>
                <textarea
                  className="form-control"
                  name="short_description"
                ></textarea>
              </div>
              <div class="mb-3">
                <label className="form-label">Liên kết</label>
                <input className="form-control" type="text" name="link_to" />
              </div>
              <button
                style={{ marginTop: "10px" }}
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm banner" : "Sửa banner"}
              </button>
              {isEditMode && (
                <button
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    setIsEditMode(false);
                    setImagePreview(null);
                    document.querySelector(
                      "textarea[name=short_description]"
                    ).value = "";
                    document.querySelector("input[name=link_to]").value = "";
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
            <h3>Không có banner nào !</h3>
            <form id="form" className="col-4" onSubmit={handleSubmit}>
              <div class="mb-3">
                <label className="form-label">Ảnh banner</label>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  name="banner_image"
                  class="form-control"
                />
                {imagePreview && <img src={imagePreview} />}
              </div>
              <div class="mb-3">
                <label className="form-label">Mô tả ngắn</label>
                <textarea
                  spellCheck="false"
                  className="form-control"
                  name="short_description"
                ></textarea>
              </div>
              <div class="mb-3">
                <label className="form-label">Liên kết</label>
                <input className="form-control" type="text" name="link_to" />
              </div>

              <button
                style={{ marginTop: "10px" }}
                type="submit"
                className="btn btn-primary"
              >
                Thêm banner
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

export default Banner;
