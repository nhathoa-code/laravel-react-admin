import React, { useEffect, useState } from "react";
import { Link, json } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";
import { Parser } from "html-to-react";
axios.defaults.withCredentials = true;
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [links, setLinks] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filtered_categories, setFilteredCategories] = useState([]);
  const [filtered_brands, setFilteredBrands] = useState([]);
  const [filterBy, setFilterBy] = useState(null);
  const [name_keyword, setNameKeyword] = useState("");
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/products?admin`)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data.data);
        setLinks(res.data.links);
        setTotal(res.data.total);
        setIsLoading(false);
      });
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/all_categories`)
      .then((res) => {
        console.log(res.data);
        setCategories(loopCategories(res.data));
      });
  }, []);

  const loopCategories = (categories, parent_id = 0) => {
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

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/products/${id}`)
      .then((res) => {
        setProducts((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

  const renderCategories = (categories, parent_id = null) => {
    return categories.map((item) => {
      return (
        <li>
          <div class="checkbox">
            <label class="form-check-label" htmlFor={"category" + item.id}>
              <input
                class="form-check-input"
                type="checkbox"
                value={parent_id ? `${parent_id}-${item.id}` : item.id}
                id={"category" + item.id}
                category_name={item.name}
                name="categories[]"
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
                        name={`brands[]`}
                        value={`${item.id}-${b.id}`}
                        class="form-check-input"
                        type="checkbox"
                        id={"brand" + b.id}
                      />
                      <img
                        style={{ width: "50px", height: "auto" }}
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
              {renderCategories(item.children, item.id)}
            </ul>
          )}
        </li>
      );
    });
  };

  const clearShowChildren = (cat) => {
    cat.showChildren = false;
    cat.children.forEach((item) => {
      if (item.hasOwnProperty("brands")) {
        item.showBrands = false;
      }
      if (item.hasOwnProperty("showChildren") && item.showChildren) {
        clearShowChildren(item);
      }
    });
  };

  const clearShowBrands = (cat) => {
    cat.showBrands = false;
    if (cat.hasOwnProperty("children")) {
      cat.children.forEach((item) => {
        if (item.hasOwnProperty("showBrands") && item.showBrands) {
          clearShowBrands(item);
        }
      });
    }
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

  const handleLoadPage = (url) => {
    if (!url) {
      return;
    }
    setIsProcessing(true);
    switch (filterBy) {
      case "categories":
        axios
          .get(url, {
            params: {
              categories: JSON.stringify(filtered_categories),
              brands: JSON.stringify(filtered_brands),
            },
          })
          .then((res) => {
            setIsProcessing(false);
            console.log(res.data);
            setProducts(Object.values(res.data.data));
            setLinks(res.data.links);
            setTotal(res.data.total);
          });
        break;
      case "name":
        axios
          .get(url, {
            params: {
              product_name: name_keyword,
            },
          })
          .then((res) => {
            setIsProcessing(false);
            setProducts(res.data.data);
            setLinks(res.data.links);
            setTotal(res.data.total);
            console.log(res.data);
          });
        break;
      default:
        axios
          .get(url, {
            params: { admin: "" },
          })
          .then((res) => {
            setIsProcessing(false);
            console.log(res.data);
            setProducts(res.data.data);
            setLinks(res.data.links);
            setTotal(res.data.total);
          });
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setFilterBy("categories");
    setIsLoading(true);
    let categories = [];
    let brands = [];
    const formData = new FormData(document.querySelector("#categories_form"));
    let current_category = null;
    for (const [name, value] of formData) {
      if (name === "categories[]") {
        if (value.split("-").length > 1) {
          current_category = value.split("-")[1];
          categories = categories.filter(
            (item) => item !== value.split("-")[0]
          );
          categories.push(value.split("-")[1]);
        } else {
          current_category = value.split("-")[0];
          categories.push(value);
        }
      } else {
        let category = value.split("-")[0];
        let brand = value.split("-")[1];
        if (category === current_category) {
          brands.push(brand);
          categories = categories.filter((item) => item !== category);
        } else {
          categories.push(current_category);
          current_category = category;
        }
      }
    }
    setFilteredCategories(categories);
    setFilteredBrands(brands);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/products/filter/categories`, {
        params: {
          categories: JSON.stringify(categories),
          brands: JSON.stringify(brands),
        },
      })
      .then((res) => {
        console.log(res.data);
        setIsLoading(false);
        setProducts(res.data.data);
        setLinks(res.data.links);
        setTotal(res.data.total);
      });
  };

  const handleFilterByName = (e) => {
    e.preventDefault();
    let product_name = e.target.querySelector("input").value;
    if (product_name.trim() === "") {
      return alert("vui lòng nhập tên sản phẩm muốn tìm");
    }
    setFilterBy("name");
    setNameKeyword(product_name);
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/products/filter/name`, {
        params: {
          product_name: product_name,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setProducts(res.data.data);
        setLinks(res.data.links);
        setTotal(res.data.total);
        console.log(res.data);
      });
  };

  return (
    <>
      {isProcessing && <Processing />}
      <div className="col-md-9">
        <form style={{ height: "36px" }} onSubmit={handleFilterByName}>
          <div style={{ paddingLeft: "0" }} className="col-md-10">
            <input
              type="text"
              placeholder="Nhập tên sản phẩm cần tìm"
              name="product_name"
              class="form-control"
            />
          </div>
          <div style={{ paddingRight: "0" }} className="col-md-2">
            <button
              type="submit"
              style={{ width: "100%" }}
              class="btn btn-primary"
            >
              Tìm
            </button>
          </div>
        </form>
        {!isLoading ? (
          products.length === 0 ? (
            <div>
              <h3>Không có sản phẩm nào !</h3>
            </div>
          ) : (
            <>
              <h4>Tìm thấy: {total} sản phẩm</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th
                      style={{ width: "15%" }}
                      className="hidden-xs hidden-sm"
                    >
                      Ảnh
                    </th>
                    <th
                      style={{ width: "20%" }}
                      className="hidden-xs hidden-sm"
                    >
                      Tên
                    </th>
                    <th className="hidden-xs hidden-sm">Giá</th>
                    <th className="hidden-xs hidden-sm">Giảm giá</th>
                    <th className="text-center">Bài viết</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    return (
                      <tr key={product.id}>
                        <td className="hidden-xs hidden-sm">
                          <img
                            style={{ width: "100px", height: "auto" }}
                            src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${product.image}`}
                            alt=""
                          />
                        </td>
                        <td className="hidden-xs hidden-sm">{product.name}</td>
                        <td className="hidden-xs hidden-sm">
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(product.price) + " đ"}
                        </td>
                        <td className="hidden-xs hidden-sm">
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(product.discounted_price) + " đ"}
                        </td>
                        <td className="text-center">
                          <div class="btn-group">
                            <Link
                              className="btn btn-xs btn-success"
                              to={`/posts/add?product_id=${product.id}`}
                              target="_blank"
                            >
                              <i className="fa fa-pencil"></i> Viết bài
                            </Link>
                            <Link
                              to={`/product/posts?product_id=${product.id}`}
                              className="btn btn-xs btn-success"
                              target="_blank"
                            >
                              Danh sách
                            </Link>
                          </div>
                        </td>
                        <td className="text-center">
                          <div class="btn-group">
                            <Link
                              target="_blank"
                              className="btn btn-xs btn-success"
                              to={`edit/${product.id}`}
                            >
                              <i className="fa fa-pencil"></i> Sửa
                            </Link>
                            <a
                              href="javascript:void(0)"
                              className="btn btn-xs btn-danger"
                              onClick={() => {
                                if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                  handleDelete(product.id);
                                }
                              }}
                            >
                              <i class="fa fa-pencil"></i> Xóa
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
          )
        ) : (
          <Loader />
        )}
      </div>
      <div className="col-md-3">
        <div className="mb-3">
          <form onSubmit={handleFilter} id="categories_form">
            <h4>Lọc sản phẩm theo danh mục</h4>
            <ul style={{ listStyleType: "none" }}>
              {renderCategories(categories)}
            </ul>
            <button
              // onClick={handleFilter}
              type="submit"
              style={{ width: "100%", marginTop: "10px" }}
              class="btn btn-primary"
            >
              Lọc
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductList;
