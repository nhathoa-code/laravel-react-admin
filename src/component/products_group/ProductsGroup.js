import React, { useEffect, useState } from "react";
import axios from "../Axios";
import Loader from "../loader/Loader";
import { Parser } from "html-to-react";
import Processing from "../process_icon/ProcessingIcon";

const ProductsGroup = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [products_groups, setProductsGroups] = useState([]);
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [id, setId] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/all_categories`)
      .then((res) => {
        console.log(res.data);
        setCategories(loopCategories(res.data));
      });
  }, []);

  const renderCategories = (categories) => {
    return categories.map((item) => {
      return (
        <li>
          <div class="checkbox">
            <label class="form-check-label" htmlFor={"category" + item.id}>
              <input
                class="form-check-input"
                type="checkbox"
                name="category"
                value={item.id}
                id={"category" + item.id}
                category_name={item.name}
                onChange={() => {
                  handleCategoryChecked(item);
                }}
              />
              {item.name}
            </label>
          </div>
          {item.hasOwnProperty("brands") && item.showBrands && (
            <div style={{ marginLeft: "10px" }}>
              {item.brands.map((b) => {
                return (
                  <div class="checkbox">
                    <label class="form-check-label" htmlFor={"brand" + b.id}>
                      <input
                        name="brand"
                        value={b.id}
                        class="form-check-input"
                        type="checkbox"
                        data-image={b.image}
                        id={"brand" + b.id}
                      />
                      <img
                        style={{
                          width: "50px",
                          height: "auto",
                          marginBottom: "5px",
                        }}
                        src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${b.image}`}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          )}
          {item.hasOwnProperty("children") && item.showChildren && (
            <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
              {renderCategories(item.children)}
            </ul>
          )}
        </li>
      );
    });
  };

  const loopCategories = (categories) => {
    return categories.map((item) => {
      if (item.hasOwnProperty("brands")) {
        item.showBrands = false;
      }
      if (item.hasOwnProperty("children")) {
        item.showChildren = false;
      }
      return item;
    });
  };

  const clearShowChildren = (cat) => {
    cat.showChildren = false;
    cat.children.forEach((item) => {
      if (item.hasOwnProperty("brands")) {
        clearShowBrands(item);
      }
      if (item.hasOwnProperty("showChildren") && item.showChildren) {
        clearShowChildren(item);
      }
    });
  };

  const clearShowBrands = (cat) => {
    cat.showBrands = false;
  };

  const handleCategoryChecked = (item) => {
    if (item.hasOwnProperty("children")) {
      if (item.showChildren) {
        clearShowChildren(item);
      } else {
        item.showChildren = true;
      }
    }
    if (item.hasOwnProperty("brands")) {
      if (item.showBrands) {
        clearShowBrands(item);
      } else {
        item.showBrands = true;
      }
    }
    setCategories((prev) => {
      return [...prev];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("form#form"));
    if (isEditMode) {
      formData.append("_method", "put");
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/products_groups/${id}`,
          formData
        )
        .then((res) => {
          setIsEditMode(false);
          setProductsGroups((prev) => {
            let edited_group = prev.find((item) => item.id === id);
            console.log(edited_group);
            console.log(res.data.edited_group);
            edited_group.name = res.data.edited_group.name;
            edited_group.category_id = Number(
              res.data.edited_group.category_id
            );
            edited_group.brand_id = Number(res.data.edited_group.brand_id);
            edited_group.category_name = document
              .querySelectorAll("input[name=category]:checked")
              [
                document.querySelectorAll("input[name=category]:checked")
                  .length - 1
              ].getAttribute("category_name");
            edited_group.brand_image = document.querySelector(
              "input[name=brand]:checked"
            )
              ? document.querySelectorAll("input[name=brand]:checked")[
                  document.querySelectorAll("input[name=brand]:checked")
                    .length - 1
                ].dataset.image
              : null;
            return [...prev];
          });
          alert(res.data.message);
          document.querySelector("input[name=name]").value = "";
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/products_groups`, formData)
        .then((res) => {
          setIsProcessing(false);
          let createdGroup = {
            ...res.data,
            category_name: document
              .querySelectorAll("input[name=category]:checked")
              [
                document.querySelectorAll("input[name=category]:checked")
                  .length - 1
              ].getAttribute("category_name"),
            brand_image: document.querySelector("input[name=brand]:checked")
              ? document.querySelectorAll("input[name=brand]:checked")[
                  document.querySelectorAll("input[name=brand]:checked")
                    .length - 1
                ].dataset.image
              : null,
          };
          setProductsGroups((prev) => {
            return [...prev, createdGroup];
          });
          document.querySelector("input[name=name]").value = "";
        })
        .catch(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleDelete = (id) => {
    setIsProcessing(true);
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/products_groups/${id}`)
      .then(() => {
        setIsProcessing(false);
        setProductsGroups((prev) => {
          return prev.filter((item) => item.id !== id);
        });
      });
  };

  const handleEdit = (id) => {
    setIsEditMode(true);
    setId(id);
    const group = products_groups.find((item) => item.id === id);
    document.querySelector("input[name=name]").value = group.name;
  };

  const handleLoadPage = (url) => {
    if (!url) {
      return;
    }
    setIsProcessing(true);
    axios.get(url).then((res) => {
      setIsProcessing(false);
      console.log(res.data);
      setProductsGroups(res.data.products_groups.data);
      setLinks(res.data.products_groups.links);
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/products_groups`)
      .then((res) => {
        console.log(res.data);
        setProductsGroups(res.data.products_groups.data);
        setLinks(res.data.products_groups.links);
        setIsLoading(false);
      });
  }, []);
  return (
    <>
      {isProcessing && <Processing />}
      <form id="form" className="col-4" onSubmit={handleSubmit}>
        {!isLoading ? (
          <>
            <div className="col-md-9">
              {products_groups.length !== 0 ? (
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
                          <input
                            type="checkbox"
                            id="check1-all"
                            name="check1-all"
                          />
                        </th>
                        <th className="text-center">#</th>
                        <th className="hidden-xs hidden-sm">Tên nhóm</th>
                        <th className="hidden-xs hidden-sm">Thuộc danh mục</th>
                        <th className="hidden-xs hidden-sm">
                          Thuộc hãng sản xuất
                        </th>
                        <th className="text-center">
                          <i className="fa fa-bolt"></i> Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products_groups.map((item, index) => {
                        return (
                          <tr key={item.id}>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                id="check1-td1"
                                name="check1-td1"
                              />
                            </td>
                            <td className="text-center">{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.category_name}</td>
                            <td>
                              {item.brand_image ? (
                                <>
                                  <img
                                    style={{ width: "100px", height: "auto" }}
                                    src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.brand_image}`}
                                  />
                                </>
                              ) : (
                                ""
                              )}
                            </td>
                            <td className="text-center">
                              <div className="btn-group">
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-xs btn-success"
                                  onClick={() => {
                                    handleEdit(item.id);
                                  }}
                                >
                                  <i className="fa fa-pencil"></i> Sửa
                                </a>
                                <a
                                  href="javascript:void(0)"
                                  className="btn btn-xs btn-danger"
                                  onClick={() => {
                                    if (
                                      window.confirm("Bạn thực sự muốn xóa ?")
                                    ) {
                                      handleDelete(item.id);
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

                  <div className="mb-3">
                    <label for="category_name" className="form-label">
                      Tên nhóm
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-none"
                      id="category_name"
                      name="name"
                    />
                  </div>
                  <button
                    type="submit"
                    className={
                      !isEditMode ? "btn btn-primary" : "btn btn-success"
                    }
                  >
                    {!isEditMode ? "Thêm nhóm" : "Sữa nhóm"}
                  </button>
                  {isEditMode && (
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        document.querySelector("input[name=name]").value = "";
                      }}
                      className="btn btn-danger ml-2"
                    >
                      Hủy bỏ
                    </button>
                  )}
                </>
              ) : (
                <>
                  <h3>Không có nhóm nào !</h3>

                  <div className="mb-3">
                    <label for="category_name" className="form-label">
                      Tên nhóm
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-none"
                      id="category_name"
                      name="name"
                    />
                  </div>
                  <button
                    type="submit"
                    className={
                      !isEditMode ? "btn btn-primary" : "btn btn-success"
                    }
                  >
                    {!isEditMode ? "Thêm nhóm" : "Sữa tên nhóm"}
                  </button>
                  {isEditMode && (
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                      }}
                      className="btn btn-danger ml-2"
                    >
                      Hủy bỏ
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="col-md-3">
              <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
                {renderCategories(categories)}
              </ul>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </form>
    </>
  );
};

export default ProductsGroup;
