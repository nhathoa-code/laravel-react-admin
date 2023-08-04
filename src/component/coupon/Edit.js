import React, { useState, useEffect } from "react";
import axios from "../Axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";
import DatePicker from "react-datepicker";
import { NumericFormat } from "react-number-format";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [appliedProducts, setAppliedProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coupon_type, setCouponType] = useState("coupon");
  const [type, setType] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/coupons/${id}`)
      .then((res) => {
        setIsLoading(false);
        setCoupon(res.data);
        setStartDate(new Date(res.data.start));
        setEndDate(new Date(res.data.end));
        setCouponType(res.data.coupon_type);
        setType(res.data.type);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const start_date = new Date(startDate.toDateString());
    const start =
      start_date.getFullYear() +
      "/" +
      (start_date.getMonth() + 1) +
      "/" +
      start_date.getDate();
    const end_date = new Date(endDate.toDateString());
    const end =
      end_date.getFullYear() +
      "/" +
      (end_date.getMonth() + 1) +
      "/" +
      end_date.getDate();

    const formData = new FormData(document.querySelector("form#form"));
    formData.append("start", start);
    formData.append("end", end);
    formData.append("_method", "put");
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/coupons/${id}`, formData)
      .then((res) => {
        setIsProcessing(false);
        alert(res.data.message);
      })
      .catch(() => {
        setIsProcessing(false);
      });
  };

  const handleSelectCouponType = (e) => {
    setCouponType(e.target.value);
  };

  const handleSelectType = (e) => {
    setType(e.target.value);
  };

  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        <div>
          <form
            style={{ padding: "0 10px 10px" }}
            id="form"
            onSubmit={handleSubmit}
            class="form-horizontal form-box remove-margin col-md-8"
          >
            <div className="mb-3">
              <h4>Mã giảm giá</h4>
              <input
                defaultValue={coupon.code}
                type="text"
                className="form-control"
                name="code"
              />
            </div>
            <div className="mb-3">
              <h4>Mô tả</h4>
              <textarea
                defaultValue={coupon.description}
                style={{ resize: "vertical" }}
                className="form-control"
                name="description"
              ></textarea>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="mb-3"
            >
              <div style={{ width: "48%" }}>
                <h4>Ngày áp dụng</h4>
                <DatePicker
                  className="form-control"
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                  dateFormat="dd-MM-yyyy"
                />
              </div>
              <div style={{ width: "48%" }}>
                <h4>Ngày kết thúc</h4>
                <DatePicker
                  className="form-control"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd-MM-yyyy"
                />
              </div>
            </div>

            <div className="mb-3">
              <h4>Loại mã giảm giá</h4>
              <select
                onChange={handleSelectCouponType}
                defaultValue={coupon_type}
                name="coupon_type"
                class="form-control"
              >
                <option value="coupon">Mã giảm giá</option>
                <option value="free_ship">Mã free ship</option>
              </select>
            </div>

            <div className="mb-3">
              <h4>Loại giảm giá</h4>
              <select
                onChange={handleSelectType}
                defaultValue={type}
                name="type"
                class="form-control"
              >
                <option value="fixed">Theo số tiền</option>
                <option value="percent">Theo phần trăm</option>
                {coupon_type === "free_ship" && (
                  <option value="free_ship">Free ship</option>
                )}
              </select>
            </div>

            {type !== "free_ship" && (
              <div className="mb-3">
                <h4>Mức giảm {type === "fixed" ? " (đ)" : " (%)"}</h4>
                {type === "fixed" ? (
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    name="amount"
                    className="form-control"
                    defaultValue={
                      coupon.type === "fixed"
                        ? new Intl.NumberFormat({
                            style: "currency",
                          }).format(coupon.amount)
                        : ""
                    }
                  />
                ) : (
                  <input
                    defaultValue={
                      coupon.type === "percent" ? coupon.amount : ""
                    }
                    type="number"
                    className="form-control"
                    name="amount"
                  />
                )}
              </div>
            )}

            {type === "percent" && (
              <div className="mb-3">
                <h4>
                  Mức giảm tối đa (đ){" "}
                  <span class="text-info">{`(nếu để trống sẽ không giới hạn)`}</span>
                </h4>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  name="maximum_discount"
                  className="form-control"
                  defaultValue={coupon.maximum_discount || ""}
                />
              </div>
            )}

            <div className="mb-3">
              <h4>Giá trị đơn hàng tối thiểu (đ)</h4>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                name="minimum_spend"
                className="form-control"
                defaultValue={new Intl.NumberFormat({
                  style: "currency",
                }).format(coupon.minimum_spend)}
              />
            </div>

            <div className="mb-3">
              <h4>Tổng lượt sử dụng tối đa</h4>
              <input
                type="number"
                className="form-control"
                name="limit_per_coupon"
                defaultValue={coupon.limit_per_coupon}
              />
            </div>

            <div className="mb-3">
              <h4>Lượt sử dụng tối đa/Người mua</h4>
              <input
                defaultValue={coupon.limit_per_user}
                type="number"
                className="form-control"
                name="limit_per_user"
              />
            </div>

            <button
              style={{ marginTop: "10px" }}
              type="submit"
              className="btn btn-primary"
            >
              Sửa mã giảm giá
            </button>
          </form>
          <div className="col-md-4">
            <h4>
              Sản phẩm áp dụng{" "}
              <span class="text-info">{`(nếu để trống sẽ áp dụng cho tất cả sản phẩm)`}</span>
            </h4>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <input
                style={{ width: "80%", marginBottom: "0" }}
                name="suggestion_product_name"
                type="text"
                placeholder="Nhập tên sản phẩm (ít nhất 5 ký tự)"
                class="form-control"
              />
              <button
                type="button"
                class="btn btn-primary"
                style={{ width: "20%", marginLeft: "10px" }}
              >
                Tìm
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Edit;
