import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import { NumericFormat } from "react-number-format";
import Processing from "../process_icon/ProcessingIcon";
const OrderDetail = () => {
  let subtotal = 0;
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [coupons, setCoupons] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [order_details, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcesing, setIsProcessing] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const status_list = ["Đã xác nhận", "Đang giao", "Hoàn thành"];

  const handleUpdateQuantity = (id, sign) => {
    setOrderDetails((prev) => {
      return [...prev].map((item) => {
        if (item.id === id) {
          if (sign === "+") {
            item.quantity++;
          } else {
            item.quantity--;
          }
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleUpdateDiscount = (id, values) => {
    setOrderDetails((prev) => {
      return [...prev].map((item) => {
        if (item.id === id) {
          let discounted_price;
          if (!values.floatValue) {
            discounted_price = 0;
          } else {
            discounted_price = values.floatValue;
          }
          item.discounted_price = discounted_price;
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleUpdateStatus = () => {
    setIsProcessing(true);
    axios
      .put(`${process.env.REACT_APP_API_ENDPOINT}/orders/${order.id}`, {
        status: document.getElementById("status").value,
      })
      .then((res) => {
        setIsProcessing(false);
        setOrder((prev) => {
          if (res.data.status === "Hoàn thành") {
            let data = {
              status: res.data.status,
            };
            if (res.data.pttt === "cod") {
              data.paid_status = "Đã thanh toán";
            }
            return {
              ...prev,
              ...data,
            };
          } else {
            return { ...prev, status: res.data.status };
          }
        });
        setStatusIndex(
          status_list.findIndex((item) => item === res.data.status)
        );
      });
  };

  const handleUpdateOrder = () => {
    axios
      .put(`${process.env.REACT_APP_API_ENDPOINT}/orders/${order.id}`, {
        order_details: JSON.stringify(order_details),
        user_id: order.user_id,
      })
      .then((res) => {
        alert(res.data.message);
        setIsUpdateMode(false);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/orders/${order_id}`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data.order);
        if (res.data.order.coupons) {
          setCoupons(JSON.parse(res.data.order.coupons));
        }
        setStatusIndex(
          status_list.findIndex((item) => item === res.data.order.status)
        );
        setBuyerInfo(JSON.parse(res.data.order.buyer_info));
        setOrderDetails(res.data.order_details);
        setIsLoading(false);
        localStorage.setItem(
          "order_details",
          JSON.stringify(res.data.order_details)
        );
      });
    return () => {
      localStorage.removeItem("order_details");
    };
  }, []);

  const handleDelete = (order_detail_id) => {
    setOrderDetails((prev) => {
      return [...prev].filter((item) => item.id !== order_detail_id);
    });
  };

  return (
    <>
      {isProcesing && <Processing />}
      {isLoading ? (
        <Loader />
      ) : (
        <div class="col-md-10 col-md-offset-1 order_detail">
          <div class="dash-tile dash-tile-dark no-opacity remove-margin">
            <div class="dash-tile-content">
              <div class="dash-tile-content-inner-fluid dash-tile-content-light">
                <div class="row">
                  <div class="col-md-5">
                    <address>
                      <strong>
                        <i class="fa fa-home"></i> Địa chỉ giao hàng
                      </strong>
                      <br />
                      {buyerInfo.address}, {buyerInfo.village},{" "}
                      {buyerInfo.district}, {buyerInfo.city}
                      <div style={{ margin: "10px 0" }}>
                        <abbr title="Phone">
                          <i class="fa fa-phone"></i>
                        </abbr>
                        {" " + buyerInfo.phone_number}
                      </div>
                      <div style={{ margin: "10px 0" }}>
                        <abbr title="email">
                          <i class="fa fa-envelope"></i>
                        </abbr>
                        {buyerInfo.email || " test@gmail.com"}
                      </div>
                      <strong>
                        <i class="fa fa-pencil-square-o"></i> Ghi chú
                      </strong>
                      <br />
                      {buyerInfo.note || "abc"}
                    </address>
                  </div>
                  <div class="col-md-6 col-md-offset-1">
                    <table class="table table-borderless table-condensed">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Tên khách hàng:</strong>
                          </td>
                          <td>
                            <address>{buyerInfo.full_name}</address>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Mã đơn hàng</strong>
                          </td>
                          <td>
                            <span class="label label-danger">#{order.id}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Ngày Đặt</strong>
                          </td>
                          <td>
                            <span class="label label-warning">
                              {order.created_at}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Trạng thái</strong>
                          </td>
                          <td>
                            <span class="label label-success status">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Phương Thức Thanh Toán</strong>
                          </td>
                          <td>
                            <span class="label label-primary">
                              {order.pttt}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Trạng Thái Thanh toán</strong>
                          </td>
                          <td>
                            <span class="label label-primary">
                              {order.paid_status}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <table class="table table-borderless table-hover">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Ảnh</th>
                        <th
                          style={{ width: "30%" }}
                          class="hidden-xs hidden-sm"
                        >
                          Tên sản phẩm
                        </th>
                        <th class="hidden-xs hidden-sm text-center">Đơn giá</th>
                        <th class="hidden-xs hidden-sm text-center">
                          Số lượng
                        </th>
                        <th class="text-center">Giảm giá</th>
                        <th class="text-right">Tổng tiền</th>
                        {isUpdateMode && <th></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {order_details.map((item, index) => {
                        subtotal +=
                          item.quantity * (item.price - item.discounted_price);
                        return (
                          <tr class="success">
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                              />
                            </td>
                            <td class="hidden-xs hidden-sm">
                              <em>
                                {item.name} - {item.color}
                              </em>
                            </td>
                            <td class="hidden-xs hidden-sm text-center">
                              {new Intl.NumberFormat({
                                style: "currency",
                              }).format(item.price) + " đ"}
                            </td>
                            <td class="hidden-xs hidden-sm text-center">
                              {isUpdateMode && (
                                <i
                                  onClick={() => {
                                    handleUpdateQuantity(item.id, "-");
                                  }}
                                  style={
                                    item.quantity === 1
                                      ? {
                                          cursor: "pointer",
                                          marginRight: "5px",
                                          opacity: "0.5",
                                          pointerEvents: "none",
                                        }
                                      : {
                                          cursor: "pointer",
                                          marginRight: "5px",
                                        }
                                  }
                                  class="gi gi-minus"
                                ></i>
                              )}
                              {item.quantity}
                              {isUpdateMode && (
                                <i
                                  onClick={() => {
                                    handleUpdateQuantity(item.id, "+");
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                  }}
                                  class="gi gi-plus"
                                ></i>
                              )}
                            </td>
                            <td class="text-center ">
                              {isUpdateMode ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <NumericFormat
                                    style={{ width: "100px" }}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    allowNegative={false}
                                    name="p_discounted_price"
                                    className="form-control"
                                    defaultValue={item.discounted_price}
                                    onValueChange={(values) => {
                                      handleUpdateDiscount(item.id, values);
                                    }}
                                  />
                                  đ
                                </div>
                              ) : (
                                new Intl.NumberFormat({
                                  style: "currency",
                                }).format(item.discounted_price) + " đ"
                              )}
                            </td>
                            <td class="text-right">
                              {new Intl.NumberFormat({
                                style: "currency",
                              }).format(
                                item.quantity *
                                  (item.price - item.discounted_price)
                              ) + " đ"}
                            </td>
                            {isUpdateMode && (
                              <td>
                                <button
                                  onClick={() => {
                                    handleDelete(item.id);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#d43f3a",
                                  }}
                                >
                                  Xóa
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}

                      <tr class="warning">
                        <td></td>
                        <td></td>
                        <td class="hidden-xs hidden-sm"></td>
                        <td class="hidden-xs hidden-sm"></td>
                        <td class="hidden-xs hidden-sm"></td>

                        <td class="text-right">
                          <strong>Tổng tiền đơn hàng: </strong>
                        </td>
                        <td class="text-right">
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(subtotal) + " đ"}
                        </td>
                        {isUpdateMode && <td></td>}
                      </tr>
                      <tr class="warning">
                        <td></td>
                        <td></td>
                        <td class="hidden-xs hidden-sm"></td>
                        <td class="hidden-xs hidden-sm"></td>
                        <td class="hidden-xs hidden-sm"></td>

                        <td class="text-right">
                          <strong>Phí vận chuyển: </strong>
                        </td>
                        <td class="text-right">
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(order.shipping_fee) + " đ"}
                        </td>
                        {isUpdateMode && <td></td>}
                      </tr>
                      {coupons && (
                        <>
                          {coupons.hasOwnProperty("free_ship") && (
                            <>
                              <tr class="warning">
                                <td></td>
                                <td></td>
                                <td class="hidden-xs hidden-sm"></td>
                                <td class="hidden-xs hidden-sm"></td>
                                <td class="hidden-xs hidden-sm"></td>

                                <td class="text-right">
                                  <strong>Giảm giá phí vận chuyển: </strong>
                                </td>
                                <td class="text-right">
                                  -
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(
                                    coupons.free_ship.type === "fixed"
                                      ? coupons.free_ship.amount
                                      : coupons.free_ship.type === "percent"
                                      ? order.order.shipping_fee *
                                          (coupons.free_ship.amount / 100) >
                                        coupons.free_ship.maximum_discount
                                        ? coupons.free_ship.maximum_discount
                                        : order.order.shipping_fee *
                                          (coupons.free_ship.amount / 100)
                                      : order.order.shipping_fee
                                  ) + " đ"}
                                </td>
                                {isUpdateMode && <td></td>}
                              </tr>
                            </>
                          )}
                          {coupons && coupons.hasOwnProperty("coupon") && (
                            <>
                              <tr class="warning">
                                <td></td>
                                <td></td>
                                <td class="hidden-xs hidden-sm"></td>
                                <td class="hidden-xs hidden-sm"></td>
                                <td class="hidden-xs hidden-sm"></td>

                                <td class="text-right">
                                  <strong>Mã giảm giá: </strong>
                                </td>
                                <td class="text-right">
                                  -
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(
                                    coupons.coupon.type === "fixed"
                                      ? coupons.coupon.amount
                                      : subtotal *
                                          (coupons.coupon.amount / 100) >
                                        coupons.coupon.maximum_discount
                                      ? coupons.coupon.maximum_discount
                                      : subtotal * (coupons.coupon.amount / 100)
                                  ) + " đ"}
                                </td>
                                {isUpdateMode && <td></td>}
                              </tr>
                            </>
                          )}
                        </>
                      )}
                      <tr class="warning">
                        <td></td>
                        <td></td>
                        <td class="hidden-xs hidden-sm"></td>
                        <td class="hidden-xs hidden-sm"></td>
                        <td class="hidden-xs hidden-sm"></td>

                        <td class="text-right">
                          <strong>Thành tiền: </strong>
                        </td>
                        <td class="text-right">
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(order.amount_pay) + " đ"}
                        </td>
                        {isUpdateMode && <td></td>}
                      </tr>
                    </tbody>
                  </table>
                  {order.status !== "Hoàn thành" &&
                    order.status !== "Đã hủy" && (
                      <>
                        {" "}
                        <div
                          class="clearfix"
                          style={{ width: "98%", marginBottom: "20px" }}
                        >
                          {isUpdateMode ? (
                            <>
                              <button
                                style={{ float: "right" }}
                                className="btn btn-danger"
                                onClick={() => {
                                  setIsUpdateMode(false);
                                  setOrderDetails(
                                    JSON.parse(
                                      localStorage.getItem("order_details")
                                    )
                                  );
                                }}
                              >
                                Hủy
                              </button>
                              <button
                                onClick={handleUpdateOrder}
                                style={{ float: "right" }}
                                className="btn btn-success"
                              >
                                Xác nhận
                              </button>
                            </>
                          ) : (
                            <a
                              onClick={() => {
                                setIsUpdateMode(true);
                              }}
                              style={{ float: "right" }}
                              href="javascript:void(0)"
                            >
                              Sửa đơn
                            </a>
                          )}
                        </div>
                        <div class="clearfix" style={{ width: "98%" }}>
                          <a
                            href="javascript:void(0)"
                            onClick={handleUpdateStatus}
                            class="update btn btn-success pull-right push"
                          >
                            Cập nhật trạng thái
                          </a>
                          <div class="form-group">
                            <div class="col-md-4">
                              <select id="status" class="form-control">
                                {status_list.map((item, index) => {
                                  if (index > statusIndex) {
                                    return <option>{item}</option>;
                                  }
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetail;
