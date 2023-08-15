import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { Link } from "react-router-dom";
import axios from "../Axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";
import "./CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [amountSpend, setAmountSpend] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/customers`).then((res) => {
      setIsLoading(false);
      console.log(res.data);
      setCustomers(res.data);
    });
  }, []);

  const getCustomerDetail = (id) => {
    setIsProcessing(true);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/customers/${id}`)
      .then((res) => {
        setIsProcessing(false);
        const customer = res.data;
        customer.profile = customers.find((item) => item.id === id).profile;
        console.log(customer);
        if (customer.user_addresses.length > 0) {
          if (customer.user_addresses.find((item) => item.is_defaulted == 1)) {
            setDefaultAddress(
              customer.user_addresses.find((item) => item.is_defaulted == 1)
            );
          } else {
            setDefaultAddress(customer.user_addresses[0]);
          }
        } else {
          setDefaultAddress(null);
        }
        let amount_spend = 0;
        customer.user_orders
          .filter((item) => item.admin_status === 6)
          .forEach((item) => {
            amount_spend += item.amount_pay;
          });
        setAmountSpend(amount_spend);
        setCustomer(res.data);
        setIsOpenPopup(true);
      })
      .catch((err) => {
        setIsProcessing(false);
      });
  };
  return (
    <>
      {isProcessing && <Processing />}
      <div id="customer-list-container">
        {isOpenPopup && (
          <div id="customer-popup">
            <h4 id="name">{customer.profile.name}</h4>
            <p class="customer-label">
              Email: <span class="value">{customer.profile.email}</span>
            </p>
            <p class="customer-label">
              Số điện thoại:{" "}
              <span class="value">{customer.profile.phone ?? "Chưa có"}</span>
            </p>
            <p class="customer-label">
              Địa chỉ mặc định:{" "}
              {defaultAddress ? (
                <>
                  <span class="value">
                    {defaultAddress.address}, {defaultAddress.village},{" "}
                    {defaultAddress.district}, {defaultAddress.city}
                  </span>
                </>
              ) : (
                <span class="value">Chưa có</span>
              )}
            </p>
            <p class="customer-label">
              Ngày khởi tạo: <span class="value">{customer.created_at}</span>
            </p>
            <p class="customer-label">
              Đơn hàng đã đặt:{" "}
              <span class="value">{customer.user_orders.length}</span>
            </p>
            <p class="customer-label">
              Đơn hàng đã mua:{" "}
              <span class="value">
                {
                  customer.user_orders.filter((item) => item.admin_status === 6)
                    .length
                }
              </span>
            </p>
            <p class="customer-label">
              Đơn hàng đã hủy:{" "}
              <span class="value">
                {
                  customer.user_orders.filter((item) => item.admin_status === 7)
                    .length
                }
              </span>
            </p>
            <p class="customer-label">
              Tổng tiền tiêu dùng:{" "}
              <span class="value">
                {new Intl.NumberFormat({ style: "currency" }).format(
                  amountSpend
                ) + " đ"}
              </span>
            </p>
            <button onClick={() => setIsOpenPopup(false)} class="close-popup">
              Đóng
            </button>
          </div>
        )}
        {!isLoading ? (
          customers.length !== 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th className="hidden-xs hidden-sm">Tên khách hàng</th>
                    <th className="hidden-xs hidden-sm">Email</th>
                    <th className="hidden-xs hidden-sm">Số điện thoại</th>
                    <th className="hidden-xs hidden-sm">Ngày tạo</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td className="hidden-xs hidden-sm">
                          {item.profile.name}
                        </td>
                        <td class="hidden-xs hidden-sm">
                          {item.profile.email}
                        </td>
                        <td class="hidden-xs hidden-sm">
                          {item.profile.phone ?? "Chưa có"}
                        </td>
                        <td class="hidden-xs hidden-sm">{item.created_at}</td>
                        <td class="text-center">
                          <div class="btn-group">
                            <a
                              href="javascript:void(0)"
                              onClick={() => getCustomerDetail(item.id)}
                              className="btn btn-xs btn-success"
                            >
                              <i class="fa fa-pencil"></i> Chi tiết
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
            <>
              <h3>Không có khách hàng nào !</h3>
            </>
          )
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default CustomerList;
