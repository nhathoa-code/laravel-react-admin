import React, { useEffect, useState } from "react";
import axios from "../Axios";
import uuid from "react-uuid";
import slugify from "react-slugify";
import Editor from "./Editor";
import Specification from "./Specification";
import { NumericFormat } from "react-number-format";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";
import { useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productInit, setProductInit] = useState({});
  /**
   * manage old product colors
   */
  const [old_product_colors, setOldProductColors] = useState([]);

  const [product_colors_modified, setProductColorsModified] = useState([]);

  const handleNewColorUpload = (id_color, e) => {
    setProductColorsModified((prev) => {
      return [...prev].map((item) => {
        if (item.color === id_color) {
          item.new_color = e.target.files[0];
          return item;
        } else {
          return item;
        }
      });
    });

    setOldProductColors((prev) => {
      return [...prev].map((item) => {
        if (item.id_color === id_color) {
          item.color.color = URL.createObjectURL(e.target.files[0]);
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleNewGalleryUpload = (id_color, e) => {
    let new_gallery = [];
    setOldProductColors((prev) => {
      return [...prev].map((item) => {
        if (item.id_color === id_color) {
          let new_gallery_preview = [];
          for (let i = 0; i < e.target.files.length; i++) {
            let image = URL.createObjectURL(e.target.files[i]);
            new_gallery_preview.push({
              image_preview: image,
              image_path: image,
              status: "new",
            });
            new_gallery.push({ id: image, image: e.target.files[i] });
          }
          item.gallery = [...item.gallery, ...new_gallery_preview];
          return item;
        } else {
          return item;
        }
      });
    });

    setProductColorsModified((prev) => {
      return [...prev].map((item) => {
        if (item.color === id_color) {
          item.gallery = [...item.gallery, ...new_gallery];
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleDeleteProductColor = (id_color, e) => {
    e.preventDefault();
    setOldProductColors((prev) => {
      return [...prev].filter((item) => item.id_color !== id_color);
    });
    setProductColorsModified((prev) => {
      return [...prev].filter((item) => item.color !== id_color);
    });
  };

  const handleDeleteColorGalleryImage = (id_color, image_path, e) => {
    e.preventDefault();
    setOldProductColors((prev) => {
      return [...prev].map((item) => {
        if (item.id_color === id_color) {
          item.gallery = [...item.gallery].filter(
            (item) => item.image_path !== image_path
          );
          return item;
        } else {
          return item;
        }
      });
    });

    setProductColorsModified((prev) => {
      return [...prev].map((item) => {
        if (item.color === id_color) {
          item.gallery = [...item.gallery].filter(
            (item) => item.id !== image_path
          );
          return item;
        } else {
          return item;
        }
      });
    });
  };

  /**
   * manage gallery
   */
  const [gallery, setGallery] = useState([]);

  const handleGalleryUpload = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      setGallery((prev) => {
        return [...prev, { image: e.target.files[i], status: "new" }];
      });
    }
  };

  const handleDeleteGallery = (e, Index) => {
    e.preventDefault();
    setGallery((prev) => {
      return [...prev].filter((item, index) => index !== Index);
    });
  };

  /**
   * manage categories - attributes
   */
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [product_categories, setProductCategories] = useState([]);
  const [categories_attributes, setCategoriesAttributes] = useState([]);
  const [category_attributes_values, setCategoryAttributesValues] = useState(
    []
  );

  /**
   * manage description - specification
   */
  const [description, setDescription] = useState("");
  const [specification, setSpecification] = useState([]);
  /**
   * manage product colors - images
   */
  const [product_image, setProductImage] = useState(null);
  const [product_image_preview, setProductImagePreview] = useState(null);
  const [isGalleryUpload, setIsGalleryUpload] = useState(false);
  const [isProductColorImageUpload, setIsProductColorImageUpload] = useState(
    []
  );
  const [product_colors_images, setProductColorsImages] = useState([]);
  const [product_colors_images_preview, setProductColorsImagesPreview] =
    useState([]);
  /**
   * manage product group
   */
  const [products_groups, setProductsGroups] = useState([]);
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  const [product_group, setProductGroup] = useState(null);

  /**
   * fetch product from server
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .all([
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/products/${id}`),
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/all_categories`),
      ])
      .then(
        axios.spread((res, res1) => {
          // data of product
          if (res.data.hasOwnProperty("product_group")) {
            setProductGroup({
              group_id: res.data.product_group.group_id,
              version_name: res.data.product_group.version_name,
            });
            setProductsGroups(res.data.groups);
            setIsGroupSelected(true);
            setIsLoadingGroup(false);
          }

          if (res.data.hasOwnProperty("colors")) {
            setProductColorsModified(
              res.data.colors.map((item) => {
                console.log(item.color.color);
                return {
                  color: item.color.color,
                  new_color: null,
                  gallery: [],
                };
              })
            );
            setOldProductColors(
              res.data.colors.map((item) => {
                console.log(item.color.color);
                item.id_color = item.color.color;
                item.color.color = "http://localhost:8000/" + item.color.color;
                item.gallery = [...item.gallery].map((item) => {
                  return {
                    image_preview: "http://localhost:8000/" + item,
                    image_path: item,
                    status: "old",
                  };
                });
                return item;
              })
            );
          }

          if (res.data.hasOwnProperty("gallery")) {
            setGallery(() => {
              return res.data.gallery.map((item) => {
                return { image: item, status: "old" };
              });
            });
            setIsGalleryUpload(true);
          }
          console.log(res.data);
          setProductInit(res.data);
          setProductImagePreview("http://localhost:8000/" + res.data.image);
          setDescription(res.data.description);
          setProductCategories(res.data.cats);
          setBrands(res.data.brands);
          setCategoriesAttributes(res.data.categories_attributes);
          setCategoryAttributesValues(res.data.category_attributes_values);
          setSpecification(JSON.parse(res.data.specification));
          setSuggestedProducts(res.data.suggestion);
          setIsLoading(false);
          // data of categories
          setCategories(loopCategories(res1.data, res.data.cats));
        })
      );
  }, [id]);

  const renderCategories = (categories, product_categories) => {
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
                defaultChecked={
                  product_categories.includes(item.id) ? true : false
                }
                onChange={(e) => {
                  handleCategoryChecked(e, item);
                }}
              />
              {item.name}
            </label>
          </div>
          {item.hasOwnProperty("children") && item.showChildren && (
            <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
              {renderCategories(item.children, product_categories)}
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

  const showIncludedChildren = (children) => {
    children.forEach((item) => {
      if (
        product_categories.includes(item.id) &&
        item.hasOwnProperty("children")
      ) {
        item.showChildren = true;
        showIncludedChildren(item.children);
      }
    });
  };

  const handleCategoryChecked = (e, item) => {
    if (item.hasOwnProperty("children")) {
      if (item.showChildren) {
        clearShowChildren(item);
      } else {
        item.showChildren = true;
        showIncludedChildren(item.children);
      }
    }
    setCategories((prev) => {
      return [...prev];
    });
    let isChecked = e.target.checked;
    if (isChecked) {
      axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/category/attributes/${item.id}`
        )
        .then((res) => {
          console.log(res.data);
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

  const handleProductImageUpload = (e) => {
    let file = e.target.files[0];
    setProductImage(file);
    if (file) {
      setProductImagePreview(URL.createObjectURL(file));
    }
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

  /*------------- process product group -------------*/
  const [isLoadingGroup, setIsLoadingGroup] = useState(true);
  const [groupCategory, setGroupCategory] = useState(null);
  const [groupBrand, setGroupBrand] = useState(null);
  const [groups_categories, setGroupsCategories] = useState([]);
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

  const loopCategories = (categories, product_categories) => {
    return categories.map((item) => {
      if (item.hasOwnProperty("children")) {
        if (product_categories.includes(item.id)) {
          item.showChildren = true;
        } else {
          item.showChildren = false;
        }
        item.children = loopCategories(item.children, product_categories);
        return item;
      } else {
        return item;
      }
    });
  };

  const renderGroupsCategories = (groups_categories) => {
    return groups_categories.map((item) => {
      return (
        <li>
          <div class="checkbox">
            <label
              style={{ paddingLeft: "0" }}
              class="form-check-label"
              htmlFor={"group_category" + item.id}
            >
              <input
                style={{ marginRight: "5px" }}
                class="form-check-input"
                type="checkbox"
                name="group_category"
                value={item.id}
                id={"group_category" + item.id}
                checked={item.checked}
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
                        style={{ marginRight: "5px" }}
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

  // const handleGroupCategoryChecked = (e, item) => {
  //   setGroupCategory(item.id);
  //   setGroupBrand(null);
  //   setGroupsCategories((prev) => {
  //     loopGroupsCategoryChecked(prev, item);
  //     return [...prev];
  //   });
  // };

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

  // const loopGroupsCategoryChecked = (categories, checked_item) => {
  //   categories.forEach((item) => {
  //     if (item.id === checked_item.id) {
  //       item.checked = true;
  //       if (item.hasOwnProperty("brands")) {
  //         item.showBrands = true;
  //       }
  //     } else {
  //       item.checked = false;
  //       if (item.hasOwnProperty("brands")) {
  //         item.showBrands = false;
  //       }
  //       if (item.hasOwnProperty("children")) {
  //         loopGroupsCategoryChecked(item.children, checked_item);
  //       }
  //     }
  //   });
  // };

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

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_ENDPOINT}/all_categories`)
  //     .then((res) => {
  //       setCategories(loopCategories(res.data));
  //     });
  // }, []);

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
        console.log(res.data);
        setProductsGroups(res.data);
        setIsLoadingGroup(false);
      });
  };

  /*-------------End process product group -------------*/

  /*--------------- suggestion products ---------------*/
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestionProducts, setSuggestionProducts] = useState([]);
  const handleFindSuggestionProducts = () => {
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

  /**
   ********************* edit product process ********************
   */

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let formData = new FormData(document.getElementById("form"));
    // ------------ handle modified color images ------------ //
    for (let i = 0; i < product_colors_modified.length; i++) {
      if (product_colors_modified[i].new_color) {
        formData.append(
          product_colors_modified[i].color
            .replaceAll("/", "-")
            .replace(".", "--"),
          product_colors_modified[i].new_color
        );
      }
      if (product_colors_modified[i].gallery.length > 0) {
        for (let y = 0; y < product_colors_modified[i].gallery.length; y++) {
          formData.append(
            "gallery_of_" +
              product_colors_modified[i].color
                .replaceAll("/", "-")
                .replace(".", "--") +
              "[]",
            product_colors_modified[i].gallery[y].image
          );
        }
      }
    }
    formData.append("_method", "put");
    formData.append("old_product_colors", JSON.stringify(old_product_colors));
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
    formData.append(
      "suggestion_products",
      JSON.stringify(suggestedProducts.map((item) => item.id))
    );

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
      let old_gallery = [];
      for (let i = 0; i < gallery.length; i++) {
        if (gallery[i].status === "new") {
          formData.append("gallery[]", gallery[i].image);
        } else if (gallery[i].status === "old") {
          old_gallery.push(gallery[i].image);
        }
      }
      if (old_gallery.length > 0) {
        formData.append("old_gallery", JSON.stringify(old_gallery));
      }
    }

    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/products/${id}`,
        formData,
        config
      )
      .then((res) => {
        console.log(res.data);
        setIsProcessing(false);
        if (localStorage.getItem("description_images")) {
          localStorage.removeItem("description_images");
        }
        setTimeout(() => {
          alert("Sửa sản phẩm thành công");
        }, 10);
      })
      .catch(() => {
        setIsProcessing(false);
        alert("co loi...");
      });
  };

  return (
    <>
      {isProcessing && <Processing />}

      {!isLoading ? (
        <form
          id="form"
          onSubmit={handleUpdateProduct}
          className="form-horizontal form-box remove-margin"
        >
          <h4 class="form-box-header">Sửa sản phẩm</h4>
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
                      defaultValue={productInit.name}
                    />
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-md-12">
                    <h4>Slug</h4>
                    <input
                      defaultValue={productInit.slug}
                      type="text"
                      class="form-control"
                      name="slug"
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
                      defaultValue={new Intl.NumberFormat({
                        style: "currency",
                      }).format(productInit.price)}
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
                      defaultValue={new Intl.NumberFormat({
                        style: "currency",
                      }).format(productInit.discounted_price)}
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
                      id="p_image"
                    />
                    {product_image_preview && (
                      <img
                        style={{ width: "100px", height: "auto" }}
                        src={product_image_preview}
                        className="thumbnail"
                        alt=""
                      />
                    )}
                  </div>
                </div>
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
                              {gallery.map((item, index) => {
                                return (
                                  <li>
                                    <div class="thumbnails-options">
                                      <div class="btn-group">
                                        <button
                                          onClick={(e) => {
                                            handleDeleteGallery(e, index);
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
                                          width: "70px",
                                          height: "auto",
                                        }}
                                        src={
                                          item.status === "new"
                                            ? URL.createObjectURL(item.image)
                                            : `${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`
                                        }
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
                {old_product_colors.map((item) => {
                  return (
                    <>
                      <div className="form-group">
                        <div className="col-md-2">
                          <h4>Ảnh màu</h4>
                          <div>
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => {
                                handleNewColorUpload(item.id_color, e);
                              }}
                            />
                            <>
                              <img
                                style={{ width: "100%", height: "auto" }}
                                src={item.color.color}
                                className="thumbnail"
                                alt=""
                              />
                              <input
                                style={{ width: "100px", textAlign: "center" }}
                                type="text"
                                className="form-control"
                                placeholder="Tên màu"
                                defaultValue={item.color.color_name}
                                name={
                                  "color_name_of_" +
                                  item.id_color
                                    .replaceAll("/", "-")
                                    .replace(".", "--")
                                }
                              />
                            </>
                          </div>
                        </div>
                        <div class="col-md-8">
                          <h4>Tải bộ sưu tập ảnh màu</h4>
                          <div>
                            <input
                              type="file"
                              multiple
                              className="form-control"
                              onChange={(e) => {
                                handleNewGalleryUpload(item.id_color, e);
                              }}
                            />
                          </div>
                          <ul
                            className="thumbnails clearfix color-gallery"
                            data-toggle="gallery-options"
                          >
                            {item.gallery.map((gallery_item) => {
                              return (
                                <li>
                                  <div class="thumbnails-options">
                                    <div class="btn-group">
                                      <button
                                        onClick={(e) => {
                                          handleDeleteColorGalleryImage(
                                            item.id_color,
                                            gallery_item.image_path,
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
                                      src={gallery_item.image_preview}
                                      alt="fakeimg"
                                    />
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="col-md-2" style={{ marginTop: "40px" }}>
                          <input
                            type="button"
                            className="btn btn-danger"
                            value="Bỏ"
                            style={{ width: "100%" }}
                            onClick={(e) =>
                              handleDeleteProductColor(item.id_color, e)
                            }
                          />
                        </div>
                      </div>
                    </>
                  );
                })}
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
                                name="p_image"
                                className="form-control"
                              />
                              {product_colors_images_preview.find(
                                (item) => item.key === key
                              ).product_color && (
                                <>
                                  <img
                                    style={{ width: "100px", height: "auto" }}
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
                                      width: "100px",
                                      textAlign: "center",
                                    }}
                                    type="text"
                                    className="form-control"
                                    placeholder="Tên màu"
                                    name={"p_color_image_name_" + index}
                                  />
                                </>
                              )}
                            </div>
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
                          <div
                            className="col-md-2"
                            style={{ marginTop: "40px" }}
                          >
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
                                  return [...prev].filter(
                                    (item) => item !== key
                                  );
                                });
                              }}
                            />
                          </div>
                        </div>
                      </>
                    );
                  })}

                <div class="form-group">
                  <div class="col-md-12">
                    <h4>Bài viết mô tả sản phẩm</h4>
                    <Editor
                      setDescription={setDescription}
                      description={description}
                    />
                  </div>
                </div>

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
                                  }).format(
                                    item.price - item.discounted_price
                                  ) + "đ"}
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
                          <div style={{ padding: "0" }} className="col-md-2">
                            <img
                              style={{ width: "100%", height: "auto" }}
                              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                            />
                          </div>
                          <div className="col-md-8">{item.name}</div>
                          <div style={{ padding: "0" }} className="col-md-2">
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
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-md-12">
                    <div class="checkbox">
                      <label class="form-check-label" for="home_display">
                        <input
                          defaultChecked={
                            productInit.home_display === 1 ? true : false
                          }
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
                        style={{ marginTop: "10px" }}
                        className="btn btn-success"
                      >
                        Sửa sản phẩm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="mb-3">
                  <h3>Danh mục</h3>
                  <ul style={{ listStyleType: "none" }}>
                    {renderCategories(categories, product_categories)}
                  </ul>
                  {categories_attributes.map((Item) => {
                    return (
                      <>
                        {Item.hasOwnProperty("brands") && (
                          <>
                            <h4>
                              Các hãng sản xuất thuộc danh mục{" "}
                              {Item.category_name}
                            </h4>
                            {Item.brands.map((item) => {
                              return (
                                <div class="checkbox">
                                  <label for={item.id}>
                                    <input
                                      type="checkbox"
                                      id={item.id}
                                      name="brands[]"
                                      value={`${Item.id}/${item.id}`}
                                      defaultChecked={
                                        brands.includes(item.id) ? true : false
                                      }
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
                          <h4 className="form-label">
                            Các tiêu chí thuộc danh mục {Item.category_name}
                          </h4>
                        )}
                        {Item.attributes_values.map((item) => {
                          return (
                            <>
                              <h4>{item.name}</h4>
                              <div>
                                {item.values.map((item) => {
                                  return (
                                    <div class="checkbox">
                                      <label for={item.id}>
                                        <input
                                          type="checkbox"
                                          id={item.id}
                                          name="categories_attributes_values[]"
                                          value={`${Item.id}/${item.id}`}
                                          defaultChecked={
                                            category_attributes_values.includes(
                                              item.id
                                            )
                                              ? true
                                              : false
                                          }
                                        />
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
                      <ul
                        style={{ listStyleType: "none", paddingLeft: "20px" }}
                      >
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
                {isGroupSelected && !isLoadingGroup && (
                  <>
                    {products_groups.length > 0 ? (
                      <select
                        name="products_group"
                        class="form-control"
                        style={{ marginTop: "10px" }}
                        onChange={() => {
                          setIsGroupSelected(true);
                        }}
                      >
                        {products_groups.map((item) => {
                          if (
                            item.id ===
                            (product_group ? product_group.group_id : 0)
                          ) {
                            return (
                              <option selected value={item.id}>
                                {item.name}
                              </option>
                            );
                          } else {
                            return <option value={item.id}>{item.name}</option>;
                          }
                        })}
                      </select>
                    ) : (
                      <p>Không có nhóm nào!</p>
                    )}
                  </>
                )}

                {isGroupSelected &&
                  !isLoadingGroup &&
                  products_groups.length > 0 && (
                    <input
                      type="text"
                      class="form-control"
                      name="version_name"
                      defaultValue={
                        product_group ? product_group.version_name : null
                      }
                      placeholder="Tên phiên bản"
                    ></input>
                  )}
              </div>
            </div>
          </div>
        </form>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Edit;
