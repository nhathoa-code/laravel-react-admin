import React, { useEffect, useState } from "react";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";
import axios from "axios";

const Coupons = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/coupons`).then((res) => {
      console.log(res.data);
      setIsLoading(false);
      setCoupons(res.data);
    });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/coupons/${id}`)
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <>
      {!isLoading ? (
        coupons.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th class="hidden-xs hidden-sm">Mã giảm giá</th>
                  <th class="hidden-xs hidden-sm">Mô tả</th>
                  <th class="hidden-xs hidden-sm">Loại mã giảm giá</th>
                  <th class="hidden-xs hidden-sm">Loại giảm giá</th>
                  <th class="hidden-xs hidden-sm">Đơn hàng tối thiểu</th>
                  <th class="hidden-xs hidden-sm">Mức giảm</th>
                  <th class="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  return (
                    <tr key={c.id}>
                      <td class="hidden-xs hidden-sm">{c.code}</td>
                      <td class="hidden-xs hidden-sm">{c.description}</td>
                      <td class="hidden-xs hidden-sm">
                        {c.coupon_type === "free_ship"
                          ? "Mã free ship"
                          : "Mã giảm giá"}
                      </td>
                      <td class="hidden-xs hidden-sm">
                        {c.type === "fixed" ? "Theo số tiền" : "Theo phần trăm"}
                      </td>
                      <td class="hidden-xs hidden-sm">
                        {new Intl.NumberFormat({ style: "currency" }).format(
                          c.minimum_spend
                        ) + "đ"}
                      </td>
                      <td class="hidden-xs hidden-sm">
                        {c.type === "fixed"
                          ? new Intl.NumberFormat({ style: "currency" }).format(
                              c.amount
                            ) + "đ"
                          : c.amount + "%"}
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <Link
                            to={`/coupons/edit/${c.id}`}
                            className="btn btn-xs btn-success"
                          >
                            <i className="fa fa-pencil"></i> Sửa
                          </Link>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(c.id);
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
          </>
        ) : (
          <h3>Không có mã giảm giá nào!</h3>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Coupons;
