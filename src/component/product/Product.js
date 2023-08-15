import React, { useEffect, useState } from "react";
import axios from "../Axios";
import { useNavigate } from "react-router-dom";
import slugify from "react-slugify";
import uuid from "react-uuid";
import Editor from "./Editor";
import Specification from "./Specification";
import { NumericFormat } from "react-number-format";
import Processing from "../process_icon/ProcessingIcon";

const Product = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [groups_categories, setGroupsCategories] = useState([]);
  const [categories_attributes, setCategoriesAttributes] = useState([]);
  const [product_image, setProductImage] = useState(null);
  const [description, setDescription] = useState("");
  const [specification, setSpecification] = useState([]);
  const [product_image_preview, setProductImagePreview] = useState(null);
  const [isGalleryUpload, setIsGalleryUpload] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [isProductColorImageUpload, setIsProductColorImageUpload] = useState(
    []
  );
  const [product_colors_images, setProductColorsImages] = useState([]);
  const [product_colors_images_preview, setProductColorsImagesPreview] =
    useState([]);
  const [products_groups, setProductsGroups] = useState([]);
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const renderCategories = (categories) => {
    return categories.map((item) => {
      return (
        <li>
          <div class="checkbox">
            <label class="form-check-label" htmlFor={"category" + item.id}>
              <input
                class="form-check-input"
                type="checkbox"
                value={item.id}
                id={"category" + item.id}
                category_name={item.name}
                name="categories[]"
                onChange={(e) => {
                  handleCategoryChecked(e, item);
                }}
              />
              {item.name}
            </label>
          </div>
          {item.hasOwnProperty("children") && item.showChildren && (
            <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
              {renderCategories(item.children)}
            </ul>
          )}
        </li>
      );
    });
  };

  const clearShowChildren = (cat) => {
    cat.showChildren = false;
    cat.children.forEach((item) => {
      if (categories_attributes.find((Item) => Item.id === item.id)) {
        setCategoriesAttributes((prev) => {
          return [...prev].filter((Item) => Item.id !== item.id);
        });
      }
      if (item.hasOwnProperty("showChildren") && item.showChildren) {
        clearShowChildren(item);
      }
    });
  };

  const handleCategoryChecked = (e, item) => {
    if (item.hasOwnProperty("children")) {
      if (item.showChildren) {
        clearShowChildren(item);
      } else {
        item.showChildren = true;
      }
    }
    setCategories((prev) => {
      return [...prev];
    });

    let isChecked = e.target.checked;
    if (isChecked) {
      setIsProcessing(true);
      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/category/attributes/${item.id}`
        )
        .then((res) => {
          setIsProcessing(false);
          let cat = {
            category_name: e.target.getAttribute("category_name"),
            id: item.id,
            attributes_values: res.data.hasOwnProperty("attributes")
              ? res.data.attributes
              : [],
          };
          if (res.data.hasOwnProperty("brands")) {
            cat.brands = res.data.brands;
          }
          setCategoriesAttributes((prev) => {
            return [...prev, cat];
          });
        });
    } else {
      setCategoriesAttributes((prev) => {
        return [...prev].filter((Item) => Item.id !== item.id);
      });
    }
  };

  const loopCategories = (categories) => {
    return categories.map((item) => {
      if (item.hasOwnProperty("children")) {
        item.showChildren = false;
        item.children = loopCategories(item.children);
        return item;
      } else {
        return item;
      }
    });
  };

  const handleProductImageUpload = (e) => {
    let file = e.target.files[0];
    setProductImage(file);
    if (file) {
      setProductImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryUpload = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      setGallery((prev) => {
        return [...prev, { id: uuid(), image: e.target.files[i] }];
      });
      // setGalleryPreview((prev) => {
      //   return [...prev, URL.createObjectURL(e.target.files[i])];
      // });
    }
  };

  const handleDeleteGallery = (e, id) => {
    e.preventDefault();
    setGallery((prev) => {
      return [...prev].filter((item) => item.id !== id);
    });
  };

  // product color
  const handleProductColorUploaded = (e, key) => {
    if (e.target.files[0]) {
      setProductColorsImagesPreview((prev) => {
        return [...prev].map((item) => {
          if (item.key === key) {
            item.product_color = URL.createObjectURL(e.target.files[0]);
            return item;
          } else {
            return item;
          }
        });
      });
      setProductColorsImages((prev) => {
        return [...prev].map((item) => {
          if (item.key === key) {
            item.product_color = e.target.files[0];
            return item;
          } else {
            return item;
          }
        });
      });
    }
  };

  const handleDeleteGalleryImage = (key, id, e) => {
    e.preventDefault();
    let product_color_gallery_preview = [...product_colors_images_preview].find(
      (item) => item.key === key
    ).product_color_gallery;
    let product_color_gallery = [...product_colors_images].find(
      (item) => item.key === key
    ).product_color_gallery;

    setProductColorsImagesPreview((prev) => {
      return [...prev].map((item) => {
        if (item.key === key) {
          item.product_color_gallery = [
            ...product_color_gallery_preview,
          ].filter((item) => item.id !== id);
          return item;
        } else {
          return item;
        }
      });
    });

    setProductColorsImages((prev) => {
      return [...prev].map((item) => {
        if (item.key === key) {
          item.product_color_gallery = [...product_color_gallery].filter(
            (item) => item.id !== id
          );
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleProductColorGalleryUploaded = (e, key) => {
    let product_color_gallery_preview = [...product_colors_images_preview].find(
      (item) => item.key === key
    ).product_color_gallery;
    let product_color_gallery = [...product_colors_images].find(
      (item) => item.key === key
    ).product_color_gallery;
    for (let i = 0; i < e.target.files.length; i++) {
      let id = uuid();
      product_color_gallery_preview.push({
        id: id,
        image: URL.createObjectURL(e.target.files[i]),
      });
      product_color_gallery.push({ id: id, image: e.target.files[i] });
    }

    setProductColorsImagesPreview((prev) => {
      return [...prev].map((item) => {
        if (item.key === key) {
          item.product_color_gallery = [...product_color_gallery_preview];
          return item;
        } else {
          return item;
        }
      });
    });

    setProductColorsImages((prev) => {
      return [...prev].map((item) => {
        if (item.key === key) {
          item.product_color_gallery = [...product_color_gallery];
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("form"));
    if (description.length === "" || formData.get("categories[]") === null) {
      return alert("Vui lòng nhập mô tả sản phẩm!");
    }
    let price = parseInt(formData.get("p_price").replace(".", ""));
    let discounted_price = parseInt(
      formData.get("p_discounted_price").replace(".", "")
    );
    if (price < 10000) {
      return alert("Giá sản phẩm không được nhỏ hơn 10.000 đ !");
    }
    if (discounted_price > price) {
      return alert("Giảm giá không được lớn hơn giá gốc !");
    }
    setIsProcessing(true);
    formData.append(
      "specification",
      JSON.stringify(
        specification.map((item) => {
          item.title = item.title.trim();
          item.technical_infos = item.technical_infos.map((item) => {
            item.technical_info = item.technical_info.trim();
            return item;
          });
          return item;
        })
      )
    );
    formData.append("description", description);
    if (localStorage.getItem("description_images")) {
      formData.append(
        "description_images",
        localStorage.getItem("description_images")
      );
    }
    if (suggestedProducts.length > 0) {
      formData.append(
        "suggestion_products",
        JSON.stringify(suggestedProducts.map((item) => item.id))
      );
    }

    if (product_colors_images.length > 0) {
      formData.append("how_many_colors", product_colors_images.length);
      for (let i = 0; i < product_colors_images.length; i++) {
        formData.append(
          `product_color_${i}`,
          product_colors_images[i].product_color
        );
        for (
          let x = 0;
          x < product_colors_images[i].product_color_gallery.length;
          x++
        ) {
          formData.append(
            `product_color_gallery_${i}[]`,
            product_colors_images[i].product_color_gallery[x].image
          );
        }
      }
    }
    if (gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        formData.append("gallery[]", gallery[i].image);
      }
    }
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/products`, formData)
      .then((res) => {
        localStorage.removeItem("description_images");
        setIsProcessing(false);
        setTimeout(() => {
          alert(res.data.message);
          navigate("/products");
        }, 10);
      })
      .catch((err) => {
        setIsProcessing(false);
        alert(err.response.data.message);
      });
  };

  /*------------- process product group -------------*/
  const [isLoadingGroup, setIsLoadingGroup] = useState(true);
  const [groupCategory, setGroupCategory] = useState(null);
  const [groupBrand, setGroupBrand] = useState(null);
  const handleProductGroups = () => {
    setIsGroupSelected(true);
    if (groups_categories.length === 0) {
      setIsProcessing(true);
      axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/all_categories`)
        .then((res) => {
          setIsProcessing(false);
          setGroupsCategories(loopGroupsCategories(res.data));
        });
    }
  };

  const loopGroupsCategories = (categories) => {
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

  const renderGroupsCategories = (categories) => {
    return categories.map((item) => {
      return (
        <li>
          <div class="checkbox">
            <label
              class="form-check-label"
              htmlFor={"group_category" + item.id}
            >
              <input
                class="form-check-input"
                type="checkbox"
                name="group_category"
                value={item.id}
                id={"group_category" + item.id}
                category_name={item.name}
                onChange={() => {
                  handleGroupCategoryChecked(item);
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
                    <label
                      class="form-check-label"
                      htmlFor={"group_brand" + b.id}
                    >
                      <input
                        name="group_brand"
                        value={b.id}
                        class="form-check-input"
                        type="checkbox"
                        data-image={b.image}
                        id={"group_brand" + b.id}
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
              {renderGroupsCategories(item.children)}
            </ul>
          )}
        </li>
      );
    });
  };

  const clearGroupShowChildren = (cat) => {
    cat.showChildren = false;
    cat.children.forEach((item) => {
      if (item.hasOwnProperty("brands")) {
        clearShowBrands(item);
      }
      if (item.hasOwnProperty("showChildren") && item.showChildren) {
        clearGroupShowChildren(item);
      }
    });
  };

  const clearShowBrands = (cat) => {
    cat.showBrands = false;
  };

  const handleGroupCategoryChecked = (item) => {
    if (item.hasOwnProperty("children")) {
      if (item.showChildren) {
        clearGroupShowChildren(item);
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

  const handleSelectGroups = () => {
    let params = {};
    let category;
    let brand;
    if (document.querySelector("input[name=group_category]:checked")) {
      category = document.querySelectorAll(
        "input[name=group_category]:checked"
      )[
        document.querySelectorAll("input[name=group_category]:checked").length -
          1
      ];
      params.category_id = category.value;
    } else {
      return alert("Vui lòng chọn danh mục nhóm!");
    }

    if (document.querySelector("input[name=group_brand]:checked")) {
      brand = document.querySelectorAll("input[name=group_brand]:checked")[
        document.querySelectorAll("input[name=group_brand]:checked").length - 1
      ];
      params.brand_id = brand.value;
    }
    setIsProcessing(true);
    setIsLoadingGroup(true);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/products_groups/group`, {
        params: params,
      })
      .then((res) => {
        setIsProcessing(false);
        setProductsGroups(res.data);
        setIsLoadingGroup(false);
      });
  };

  /*-------------End process product group -------------*/

  /*--------------- suggestion products ---------------*/
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestionProducts, setSuggestionProducts] = useState(null);
  const handleFindSuggestionProducts = () => {
    if (
      document.querySelector("input[name=suggestion_product_name]").value
        .length < 10
    ) {
      return alert("Tên bạn nhập quá ngắn!");
    }
    setIsProcessing(true);
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/products/find/suggestion_products`,
        {
          params: {
            product_name: document.querySelector(
              "input[name=suggestion_product_name]"
            ).value,
          },
        }
      )
      .then((res) => {
        setIsProcessing(false);
        setSuggestionProducts(res.data);
      });
  };

  const handleAddSuggestedProduct = (suggestedProduct) => {
    if (!suggestedProducts.find((item) => item.id === suggestedProduct.id)) {
      setSuggestedProducts((prev) => {
        return [...prev, suggestedProduct];
      });
    } else {
      alert("Đã thêm sản phẩm này vào gợi ý");
    }
  };

  /*-------------End suggestion products --------------*/
  useEffect(() => {
    const inputs = document.querySelectorAll(
      "input[type=text].form-control,input[type=number].form-control"
    );
    inputs.forEach((item) => {
      item.addEventListener("keydown", function (event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          return false;
        }
      });
    });
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/all_categories`)
      .then((res) => {
        setCategories(loopCategories(res.data));
      });
  }, []);

  return (
    <>
      {isProcessing && <Processing />}
      <form
        id="form"
        onSubmit={handleAddProduct}
        className="form-horizontal form-box remove-margin"
      >
        <h4 class="form-box-header">Thêm sản phẩm</h4>
        <div className="form-box-content">
          <div className="form-group">
            <div className="col-md-9">
              <div class="form-group">
                <div class="col-md-12">
                  <h4>Tên sản phẩm</h4>
                  <input
                    onChange={(e) => {
                      document.querySelector("input[name=slug]").value =
                        slugify(e.target.value);
                    }}
                    type="text"
                    class="form-control"
                    name="p_name"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12">
                  <h4>Slug</h4>
                  <input
                    type="text"
                    class="form-control"
                    name="slug"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-6">
                  <h4>Giá (đ)</h4>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    name="p_price"
                    className="form-control"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <h4>Giảm giá (đ)</h4>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    name="p_discounted_price"
                    className="form-control"
                    defaultValue={0}
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12">
                  <h4>Ảnh sản phẩm</h4>
                  <input
                    onChange={handleProductImageUpload}
                    type="file"
                    name="p_image"
                    className="form-control"
                    required
                  />
                  {product_image && (
                    <img
                      style={{ width: "100px", height: "auto" }}
                      src={product_image_preview}
                      className="thumbnail"
                      alt=""
                    />
                  )}
                </div>
              </div>
              {isProductColorImageUpload.length === 0 && (
                <div class="form-group">
                  <div class="col-md-3">
                    <h4>Kho</h4>
                    <input
                      type="number"
                      class="form-control"
                      name="p_inventory"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="col-md-12">
                  <input
                    onClick={() => {
                      let key = uuid();
                      setProductColorsImages((prev) => {
                        return [
                          ...prev,
                          {
                            key: key,
                            product_color: null,
                            product_color_gallery: [],
                          },
                        ];
                      });
                      setProductColorsImagesPreview((prev) => {
                        return [
                          ...prev,
                          {
                            key: key,
                            product_color: null,
                            product_color_gallery: [],
                          },
                        ];
                      });
                      setIsProductColorImageUpload((prev) => {
                        return [...prev, key];
                      });
                    }}
                    type="button"
                    value="Thêm ảnh màu"
                    className="btn btn-primary"
                  />
                  <span style={{ margin: "0 10px" }}>Hoặc</span>
                  <input
                    onClick={() => {
                      setIsGalleryUpload(true);
                    }}
                    type="button"
                    value="Thêm bộ sưu tập"
                    className="btn btn-primary"
                  />
                </div>
              </div>

              {isGalleryUpload && (
                <>
                  <div class="form-group">
                    <div class="col-md-12">
                      <h4>Tải bộ sưu tập ảnh</h4>
                      <div className="row">
                        <div className="col-md-10">
                          <input
                            onChange={handleGalleryUpload}
                            type="file"
                            name="gallery"
                            multiple
                            className="form-control"
                          />
                          <ul
                            className="thumbnails clearfix gallery-thumbnails"
                            data-toggle="gallery-options"
                          >
                            {gallery.map((item) => {
                              return (
                                <li>
                                  <div class="thumbnails-options">
                                    <div class="btn-group">
                                      <button
                                        onClick={(e) => {
                                          handleDeleteGallery(e, item.id);
                                        }}
                                        class="btn btn-sm btn-danger"
                                      >
                                        <i class="fa fa-times"></i>
                                      </button>
                                    </div>
                                  </div>
                                  <a
                                    href="javascript:void(0)"
                                    className="thumbnail"
                                  >
                                    <img
                                      style={{ width: "100px", height: "auto" }}
                                      src={URL.createObjectURL(item.image)}
                                      alt="fakeimg"
                                    />
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="col-md-2">
                          <input
                            type="button"
                            onClick={() => {
                              setIsGalleryUpload(false);
                              setGallery([]);
                            }}
                            className="btn btn-danger"
                            style={{ width: "100%" }}
                            value="Bỏ"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {isProductColorImageUpload.length > 0 &&
                isProductColorImageUpload.map((key, index) => {
                  return (
                    <>
                      <div className="form-group">
                        <div className="col-md-2">
                          <h4>Ảnh màu</h4>
                          <div>
                            <input
                              onChange={(e) =>
                                handleProductColorUploaded(e, key)
                              }
                              type="file"
                              required
                              className="form-control"
                            />
                            {product_colors_images_preview.find(
                              (item) => item.key === key
                            ).product_color && (
                              <>
                                <img
                                  style={{ width: "100%", height: "auto" }}
                                  src={
                                    product_colors_images_preview.find(
                                      (item) => item.key === key
                                    ).product_color
                                  }
                                  className="thumbnail"
                                  alt=""
                                />
                                <input
                                  style={{
                                    width: "100%",
                                    textAlign: "center",
                                  }}
                                  type="text"
                                  className="form-control"
                                  placeholder="Tên màu"
                                  name={"p_color_image_name_" + index}
                                  required
                                />
                              </>
                            )}
                          </div>
                          <input
                            type="button"
                            className="btn btn-danger"
                            value="Bỏ"
                            style={{ width: "100%" }}
                            onClick={() => {
                              setProductColorsImagesPreview((prev) => {
                                return [...prev].filter(
                                  (item) => item.key !== key
                                );
                              });
                              setProductColorsImages((prev) => {
                                return [...prev].filter(
                                  (item) => item.key !== key
                                );
                              });
                              setIsProductColorImageUpload((prev) => {
                                return [...prev].filter((item) => item !== key);
                              });
                            }}
                          />
                        </div>
                        <div class="col-md-8">
                          <h4>Tải bộ sưu tập ảnh màu</h4>
                          <div>
                            <input
                              onChange={(e) =>
                                handleProductColorGalleryUploaded(e, key)
                              }
                              type="file"
                              multiple
                              className="form-control"
                            />
                          </div>
                          <ul
                            className="thumbnails clearfix color-gallery"
                            data-toggle="gallery-options"
                          >
                            {product_colors_images_preview
                              .find((item) => item.key === key)
                              .product_color_gallery.map((item) => {
                                return (
                                  <li>
                                    <div class="thumbnails-options">
                                      <div class="btn-group">
                                        <button
                                          onClick={(e) => {
                                            handleDeleteGalleryImage(
                                              key,
                                              item.id,
                                              e
                                            );
                                          }}
                                          class="btn btn-sm btn-danger"
                                        >
                                          <i class="fa fa-times"></i>
                                        </button>
                                      </div>
                                    </div>
                                    <a
                                      href="javascript:void(0)"
                                      className="thumbnail"
                                    >
                                      <img
                                        style={{
                                          width: "100px",
                                          height: "auto",
                                        }}
                                        src={item.image}
                                        alt="fakeimg"
                                      />
                                    </a>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                        <div className="col-md-2">
                          <h4>Kho</h4>
                          <input
                            type="number"
                            class="form-control"
                            name={`p_inventory_of_color_${index}`}
                            required
                          />
                        </div>
                      </div>
                    </>
                  );
                })}

              <div class="form-group">
                <div class="col-md-12">
                  <h4>Thông số kỹ thuật</h4>
                  <Specification
                    specification={specification}
                    setSpecification={setSpecification}
                  />
                </div>
              </div>

              <div class="form-group">
                <div className="col-md-10">
                  <h4>Thêm gợi ý phụ kiện</h4>
                </div>

                <div className="col-md-10">
                  {suggestedProducts.map((item) => {
                    return (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          margin: "10px 0",
                        }}
                      >
                        <div style={{ padding: "0" }} className="col-md-2">
                          <img
                            style={{ width: "100%", height: "auto" }}
                            src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{item.name}</p>
                          {item.discounted_price > 0 ? (
                            <>
                              <p>
                                {new Intl.NumberFormat({
                                  style: "currency",
                                }).format(item.price - item.discounted_price) +
                                  "đ"}
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(item.price) + "đ"}
                                </span>
                              </p>
                            </>
                          ) : (
                            <p>
                              {new Intl.NumberFormat({
                                style: "currency",
                              }).format(item.price) + " đ"}
                            </p>
                          )}
                        </div>
                        <div style={{ padding: "0" }} className="col-md-2">
                          <button
                            style={{ width: "100%" }}
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              setSuggestedProducts((prev) => {
                                return [...prev].filter(
                                  (Item) => Item.id !== item.id
                                );
                              });
                            }}
                          >
                            Bỏ gợi ý
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div class="col-md-10">
                  <input
                    name="suggestion_product_name"
                    type="text"
                    placeholder="Nhập tên phụ kiện muốn gợi ý mua cùng"
                    className="form-control"
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    onClick={handleFindSuggestionProducts}
                    style={{ width: "100%", marginTop: "" }}
                    className="btn btn-primary"
                  >
                    Tìm
                  </button>
                </div>
                <div className="col-md-10">
                  {suggestionProducts && (
                    <>
                      {suggestionProducts.length > 0 ? (
                        <>
                          {suggestionProducts.map((item) => {
                            return (
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  margin: "10px 0",
                                }}
                              >
                                <div
                                  style={{ padding: "0" }}
                                  className="col-md-2"
                                >
                                  <img
                                    style={{ width: "100%", height: "auto" }}
                                    src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                  />
                                </div>
                                <div className="col-md-8">{item.name}</div>
                                <div
                                  style={{ padding: "0" }}
                                  className="col-md-2"
                                >
                                  <button
                                    style={{ width: "100%" }}
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      handleAddSuggestedProduct(item);
                                    }}
                                  >
                                    Thêm
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <p>Không tìm thấy sản phẩm nào!</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div class="form-group">
                <div class="col-md-12">
                  <h4>Bài viết mô tả sản phẩm</h4>
                  <Editor setDescription={setDescription} />
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12">
                  <div class="checkbox">
                    <label class="form-check-label" for="home_display">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="home_display"
                        id="home_display"
                      />
                      Hiển thị trang chủ
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="col-md-12">
                  <div>
                    <button
                      id="btn-add-product"
                      style={{ marginTop: "10px" }}
                      className="btn btn-success"
                    >
                      Thêm sản phẩm
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="mb-3">
                <h3>Danh mục</h3>
                <ul style={{ listStyleType: "none" }}>
                  {renderCategories(categories)}
                </ul>
                {categories_attributes.map((Item) => {
                  return (
                    <>
                      {Item.hasOwnProperty("brands") && (
                        <>
                          <h4 style={{ marginTop: "20px" }}>
                            Các hãng sản xuất thuộc danh mục{" "}
                            {Item.category_name}
                          </h4>
                          {Item.brands.map((item) => {
                            return (
                              <div class="checkbox">
                                <label for={`brand_${item.id}`}>
                                  <input
                                    type="checkbox"
                                    id={`brand_${item.id}`}
                                    name="brands[]"
                                    value={`${Item.id}/${item.id}`}
                                  />
                                  <img
                                    style={{ width: "70px", height: "auto" }}
                                    src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                  />
                                </label>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {Item.attributes_values.length > 0 && (
                        <h4
                          style={{ marginTop: "20px" }}
                          className="form-label"
                        >
                          Các tiêu chí thuộc danh mục {Item.category_name}
                        </h4>
                      )}
                      {Item.attributes_values.map((item) => {
                        return (
                          <>
                            <h5 style={{ marginBottom: "0" }}>{item.name}</h5>
                            <div>
                              {item.values.map((item) => {
                                return (
                                  <div class="checkbox">
                                    <label for={`cat_attr_${item.id}`}>
                                      <input
                                        type="checkbox"
                                        id={`cat_attr_${item.id}`}
                                        name="categories_attributes[]"
                                        value={`${Item.id}/${item.id}`}
                                      />{" "}
                                      {item.value}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        );
                      })}
                    </>
                  );
                })}
              </div>
              <div>
                <input
                  type="button"
                  style={{ marginTop: "20px" }}
                  className="btn btn-primary"
                  onClick={handleProductGroups}
                  value="Nhóm sản phẩm"
                />
                {isGroupSelected && (
                  <input
                    type="button"
                    style={{ marginTop: "20px", marginLeft: "10px" }}
                    className="btn btn-danger"
                    onClick={() => {
                      setIsGroupSelected(false);
                      setGroupsCategories((prev) => {
                        prev.forEach((item) => {
                          if (item.hasOwnProperty("brands")) {
                            item.showBrands = false;
                          }
                          if (item.hasOwnProperty("children")) {
                            clearGroupShowChildren(item);
                          }
                        });
                        return [...prev];
                      });
                    }}
                    value="Bỏ"
                  />
                )}
                {isGroupSelected && groups_categories.length > 0 && (
                  <>
                    <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
                      {renderGroupsCategories(groups_categories)}
                    </ul>
                    <button
                      onClick={handleSelectGroups}
                      type="button"
                      className="btn btn-primary"
                    >
                      Chọn nhóm
                    </button>
                  </>
                )}
              </div>
              {isGroupSelected &&
                !isLoadingGroup &&
                (products_groups.length > 0 ? (
                  <select
                    name="products_group"
                    class="form-control"
                    style={{ marginTop: "10px" }}
                    onChange={() => {
                      setIsGroupSelected(true);
                    }}
                  >
                    {products_groups.map((item) => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                  </select>
                ) : (
                  <p>Không có nhóm nào!</p>
                ))}
              {isGroupSelected &&
                !isLoadingGroup &&
                products_groups.length > 0 && (
                  <input
                    type="text"
                    class="form-control"
                    name="version_name"
                    placeholder="Tên phiên bản"
                    required
                  ></input>
                )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Product;
