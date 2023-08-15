import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../Axios";
import Loader from "../loader/Loader";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(
    searchParams.get("status") ? searchParams.get("status") : "1"
  );
  const status_list = [
    { status_code: 1, status: "Chờ xác nhận" },
    { status_code: 2, status: "Chờ lấy hàng" },
    { status_code: 3, status: "Đang giao" },
    { status_code: 4, status: "Đã giao" },
    { status_code: 5, status: "Chờ đối soát" },
    { status_code: 6, status: "Hoàn thành" },
    { status_code: 7, status: "Đã hủy" },
  ];

  useEffect(() => {
    switch (status) {
      case "0":
        if (!orders[0]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?admin&status=0`)
            .then((res) => {
              console.log(res.data);
              setOrders((prev) => {
                return { ...prev, 0: res.data };
              });
            });
        }
        break;
      case "1":
        if (!orders[1]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?admin&status=1`)
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 1: res.data };
              });
            });
        }
        break;
      case "2":
        if (!orders[2]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?admin&status=2`)
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 2: res.data };
              });
            });
        }
        break;
      case "3":
        if (!orders[3]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?admin&status=3`)
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 3: res.data };
              });
            });
        }
        break;
      case "4":
        if (!orders[4]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?admin&status=4`)
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 4: res.data };
              });
            });
        }
        break;
      case "5":
        if (!orders[5]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?admin&status=5`)
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 5: res.data };
              });
            });
        }
        break;
      case "6":
        if (!orders[6]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?admin&status=6`)
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 6: res.data };
              });
            });
        }
        break;
      case "7":
        if (!orders[7]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?admin&status=7`)
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 7: res.data };
              });
            });
        }
        break;
      default:
        setStatus("1");
    }
  }, [status]);

  return (
    <>
      <ul class="nav nav-pills order-status">
        <li
          style={{ cursor: "pointer" }}
          className={`${status === "0" ? "active" : ""}`}
          onClick={() => setStatus("0")}
        >
          <Link to={`?status=0`}>Tất cả</Link>
        </li>
        <li
          style={{ cursor: "pointer" }}
          className={`${status === "1" ? "active" : ""}`}
          onClick={() => setStatus("1")}
        >
          <Link to={`?status=1`}>Chờ xác nhận</Link>
        </li>
        <li
          style={{ cursor: "pointer" }}
          className={`${status === "2" ? "active" : ""}`}
          onClick={() => setStatus("2")}
        >
          <Link to={`?status=2`}>Chờ lấy hàng</Link>
        </li>
        <li
          style={{ cursor: "pointer" }}
          className={`${status === "3" ? "active" : ""}`}
          onClick={() => setStatus("3")}
        >
          <Link to={`?status=3`}>Đang giao</Link>
        </li>
        <li
          style={{ cursor: "pointer" }}
          className={`${status === "4" ? "active" : ""}`}
          onClick={() => setStatus("4")}
        >
          <Link to={`?status=4`}>Đã giao</Link>
        </li>
        <li
          style={{ cursor: "pointer" }}
          className={`${status === "5" ? "active" : ""}`}
          onClick={() => setStatus("5")}
        >
          <Link to={`?status=5`}>Chờ đối soát</Link>
        </li>
        <li
          style={{ cursor: "pointer" }}
          className={`${status === "6" ? "active" : ""}`}
          onClick={() => setStatus("6")}
        >
          <Link to={`?status=6`}>Hoàn thành</Link>
        </li>
        <li
          style={{ cursor: "pointer" }}
          className={`${status === "7" ? "active" : ""}`}
          onClick={() => setStatus("7")}
        >
          <Link to={`?status=7`}>Đã hủy</Link>
        </li>
      </ul>
      {orders[status] ? (
        orders[status].length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th className="hidden-xs hidden-sm">Mã đơn hàng</th>
                <th className="hidden-xs hidden-sm">Ngày tạo</th>
                <th className="hidden-xs hidden-sm">Trạng thái</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders[status].map((item) => {
                return (
                  <tr key={item.order.id}>
                    <td className="hidden-xs hidden-sm">{item.order.id}</td>
                    <td class="hidden-xs hidden-sm">{item.order.created_at}</td>
                    <td class="hidden-xs hidden-sm">
                      {
                        status_list.find(
                          (Item) => Item.status_code == item.order.admin_status
                        ).status
                      }
                    </td>
                    <td class="text-center">
                      <div class="btn-group">
                        <Link
                          to={`/orders/${item.order.id}`}
                          className="btn btn-xs btn-success"
                        >
                          <i class="fa fa-pencil"></i> Chi tiết
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ marginTop: "50px", marginLeft: "15px" }}>
            Chưa có đơn hàng nào!
          </p>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default OrderList;
