import React, { useEffect, useState } from "react";
import axios from "../Axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat } from "react-number-format";
import Processing from "../process_icon/ProcessingIcon";

const FlashSale = () => {
  const [start_time, setStartTime] = useState(null);
  const [end_time, setEndTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flash_saled_products, setFlashSaledProducts] = useState([]);
  const [searched_products, setSearchProducts] = useState([]);

  const handleSearchingProducts = () => {
    if (document.querySelector("input[name=product_name]").value === "") {
      return alert("vui lòng nhập tên sản phẩm muốn tìm!");
    }
    setIsProcessing(true);
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/products/search_flash_saled_products`,
        {
          params: {
            product_name: document.querySelector("input[name=product_name]")
              .value,
          },
        }
      )
      .then((res) => {
        setIsProcessing(false);
        setSearchProducts(res.data);
      })
      .catch((err) => {
        setIsProcessing(false);
        alert(err.response.data.message);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let startTime = new Date(start_time);
    const start =
      startTime.getFullYear() +
      "-" +
      (startTime.getMonth() + 1) +
      "-" +
      startTime.getDate() +
      " " +
      startTime.getHours() +
      ":" +
      startTime.getMinutes() +
      ":" +
      startTime.getSeconds();
    let endTime = new Date(end_time);
    const end =
      endTime.getFullYear() +
      "-" +
      (endTime.getMonth() + 1) +
      "-" +
      endTime.getDate() +
      " " +
      endTime.getHours() +
      ":" +
      endTime.getMinutes() +
      ":" +
      endTime.getSeconds();
    const formData = new FormData(document.querySelector("form#form"));
    setIsProcessing(true);
    formData.append(
      "product_ids",
      JSON.stringify(flash_saled_products.map((item) => item.id))
    );
    formData.append("start_time", start);
    formData.append("end_time", end);
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/flash_sales`, formData)
      .then((res) => {
        setIsProcessing(false);
        alert(res.data.message);
      })
      .catch((err) => {
        setIsProcessing(false);
        alert(err.response.data.message);
      });
  };

  const handleChooseProduct = (product) => {
    if (flash_saled_products.find((item) => item.id === product.id)) {
      return alert("Đã thêm sản phẩm này rồi!");
    }
    setFlashSaledProducts((prev) => {
      return [...prev, product];
    });
  };

  const handleDelete = (product) => {
    setFlashSaledProducts((prev) => {
      return [...prev].filter((item) => item.id !== product.id);
    });
  };

  useEffect(() => {
    const input = document.querySelector(
      "input[name=product_name].form-control"
    );
    input.addEventListener("keydown", function (event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });

    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/flash_sales`)
      .then((res) => {
        if (res.data.length > 0) {
          setFlashSaledProducts(res.data);
          setStartTime(new Date(res.data[0].start_time));
          setEndTime(new Date(res.data[0].end_time));
        }
      });
  }, []);

  return (
    <>
      {isProcessing && <Processing />}
      <form
        id="form"
        onSubmit={handleSubmit}
        style={{ width: "800px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "10px" }} class="col-md-12">
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="mb-3"
          >
            <div style={{ width: "48%" }}>
              <h4>Ngày áp dụng</h4>
              <DatePicker
                className="form-control"
                selected={start_time}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                onChange={(date_time) => {
                  setStartTime(date_time);
                }}
                dateFormat="dd-MM-yyyy HH:mm"
              />
            </div>
            <div style={{ width: "48%" }}>
              <h4>Ngày kết thúc</h4>
              <DatePicker
                className="form-control"
                selected={end_time}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                onChange={(date_time) => setEndTime(date_time)}
                dateFormat="dd-MM-yyyy HH:mm"
              />
            </div>
          </div>
        </div>
        <div
          style={{ marginBottom: "10px", marginTop: "10px" }}
          class="col-md-12"
        >
          <div style={{ padding: "0" }} class="col-md-10">
            <input
              name="product_name"
              type="text"
              placeholder="Nhập tên và tìm sản phẩm áp dụng"
              className="form-control"
            />
          </div>
          <div style={{ padding: "0" }} className="col-md-2">
            <button
              type="button"
              onClick={handleSearchingProducts}
              style={{ width: "100%", marginTop: "" }}
              className="btn btn-primary"
            >
              Tìm
            </button>
          </div>
        </div>
        {searched_products.length > 0 && (
          <div class="col-md-12">
            <ul style={{ listStyleType: "none", paddingLeft: "5px" }}>
              {searched_products.map((item) => {
                return (
                  <>
                    <li style={{ marginBottom: "5px" }}>
                      {item.name}{" "}
                      <button
                        onClick={() => handleChooseProduct(item)}
                        type="button"
                        class="btn btn-xs btn-success"
                      >
                        Chọn
                      </button>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        )}

        <div style={{ marginTop: "10px" }} class="col-md-12">
          {flash_saled_products.length > 0 ? (
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th class="hidden-xs hidden-sm"></th>
                  <th class="hidden-xs hidden-sm">Giá gốc</th>
                  <th class="hidden-xs hidden-sm">Mức giảm</th>
                  <th class="cell-small text-center">Bỏ chọn</th>
                </tr>
              </thead>
              <tbody>
                {flash_saled_products.map((item) => {
                  return (
                    <tr>
                      <td style={{ width: "10%" }}>
                        <img
                          style={{ width: "100%", height: "auto" }}
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                        />
                      </td>
                      <td style={{ width: "40%" }} class="hidden-xs hidden-sm">
                        {item.name}
                      </td>
                      <td style={{ width: "20%" }} class="hidden-xs hidden-sm">
                        {new Intl.NumberFormat({
                          style: "currency",
                        }).format(item.price)}
                      </td>
                      <td style={{ width: "20%" }} class="hidden-xs hidden-sm">
                        <NumericFormat
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          name={`discounted_price_${item.id}`}
                          className="form-control"
                          defaultValue={new Intl.NumberFormat({
                            style: "currency",
                          }).format(item.discounted_price)}
                        />
                      </td>
                      <td style={{ width: "10%" }} class="text-center">
                        <div
                          onClick={() => handleDelete(item)}
                          class="btn-group"
                        >
                          <a
                            href="javascript:void(0)"
                            data-toggle="tooltip"
                            title=""
                            class="btn btn-xs btn-danger"
                            data-original-title="Delete"
                          >
                            <i class="fa fa-times"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>Chưa chọn sản phẩm nào!</p>
          )}
        </div>

        <div className="col-md-12" style={{ marginTop: "10px" }}>
          <button
            style={{ width: "100%" }}
            type="submit"
            class="btn btn-primary"
          >
            Tạo flash sale
          </button>
        </div>
      </form>
    </>
  );
};

export default FlashSale;
