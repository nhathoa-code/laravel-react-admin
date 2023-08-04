import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Processing from "./process_icon/ProcessingIcon";
import Loader from "./loader/Loader";
import axios from "./Axios";
import DatePicker from "rsuite/DatePicker";
import moment from "moment";
import "rsuite/dist/rsuite.min.css";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  scales: {
    revenue: {
      type: "linear",
      display: true,
      position: "left",
    },
    orders: {
      type: "linear",
      display: true,
      position: "right",
      ticks: {
        stepSize: 1,
      },
    },
  },
};

var getDaysBetweenDates = function (startDate, endDate) {
  var now = startDate.clone(),
    dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format("DD/MM"));
    now.add(1, "days");
  }
  return dates;
};

var getDaysArray = function (year, month) {
  var monthIndex = month - 1;
  var date = new Date(year, monthIndex, 1);
  var result = [];
  while (date.getMonth() == monthIndex) {
    result.push(
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        "/" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1)
    );
    date.setDate(date.getDate() + 1);
  }
  return result;
};

const Dashboard = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [orders_by_time, setOrdersByTime] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [revenue_by_time, setRevenueByTime] = useState(null);
  const [type_of_time, setTypeOfTime] = useState("date");
  const [dataset, setDataSet] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    handlePickDate(new Date());
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/statistics`)
      .then((res) => {
        setIsLoading(false);
        setData(res.data);
        let completed_orders = res.data.total_completed_orders;
        let revenue = 0;
        completed_orders.forEach((item) => {
          revenue += item.amount_pay;
        });
        setRevenue(revenue);
      });
  }, []);

  const handlePickWeek = (date) => {
    let date_time_start_week = moment(date)
      .startOf("isoWeek")
      .format("YYYY/MM/DD HH:mm:ss");
    let date_time_end_week = moment(date)
      .endOf("isoWeek")
      .format("YYYY/MM/DD HH:mm:ss");
    const labels = getDaysBetweenDates(
      moment(date).startOf("isoWeek"),
      moment(date).endOf("isoWeek")
    );
    setIsProcessing(true);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/statistics/by_time`, {
        params: {
          type_of_time: type_of_time,
          start_week: date_time_start_week,
          end_week: date_time_end_week,
        },
      })
      .then((res) => {
        setIsProcessing(false);
        const data = res.data;
        setOrdersByTime(data.length);
        setRevenueByTime(() => {
          let revenue = 0;
          data.forEach((item) => {
            revenue += item.amount_pay;
          });
          return revenue;
        });
        setDataSet({
          labels: labels,
          datasets: [
            {
              label: "Đơn hàng",
              data: labels.map((Item) => {
                const data_time = data.find((item) => item.date === Item);
                if (data_time) {
                  return data_time.orders;
                } else {
                  return 0;
                }
              }),
              yAxisID: "orders",
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Doanh số",
              data: labels.map((Item) => {
                const data_time = data.find((item) => item.date === Item);
                if (data_time) {
                  return Number(data_time.revenue);
                } else {
                  return 0;
                }
              }),
              yAxisID: "revenue",
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        });
      });
  };

  const handlePickDate = (date) => {
    let Date = moment(date).format("YYYY-MM-DD");
    const labels = [
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
    ];
    setIsProcessing(true);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/statistics/by_time`, {
        params: {
          type_of_time: type_of_time,
          Date: Date,
        },
      })
      .then((res) => {
        setIsProcessing(false);
        const data = res.data;
        setOrdersByTime(data.length);
        setRevenueByTime(() => {
          let revenue = 0;
          data.forEach((item) => {
            revenue += item.amount_pay;
          });
          return revenue;
        });
        setDataSet({
          labels: labels,
          datasets: [
            {
              label: "Đơn hàng",
              data: labels.map((Item) => {
                const data_time = data.find(
                  (item) => item.hour + ":00" === Item
                );
                if (data_time) {
                  return data_time.orders;
                } else {
                  return 0;
                }
              }),
              yAxisID: "orders",
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Doanh số",
              data: labels.map((Item) => {
                const data_time = data.find(
                  (item) => item.hour + ":00" === Item
                );
                if (data_time) {
                  return Number(data_time.revenue);
                } else {
                  return 0;
                }
              }),
              yAxisID: "revenue",
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        });
      });
  };

  const handlePickMonth = (month) => {
    let Year = moment(month).format("YYYY/MM").split("/")[0];
    let Month = moment(month).format("YYYY/MM").split("/")[1];
    const labels = getDaysArray(Year, Month);
    setIsProcessing(true);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/statistics/by_time`, {
        params: {
          type_of_time: type_of_time,
          year: Year,
          month: Month,
        },
      })
      .then((res) => {
        setIsProcessing(false);
        const data = res.data;
        setOrdersByTime(data.length);
        setRevenueByTime(() => {
          let revenue = 0;
          data.forEach((item) => {
            revenue += item.amount_pay;
          });
          return revenue;
        });
        setDataSet({
          labels: labels,
          datasets: [
            {
              label: "Đơn hàng",
              data: labels.map((Item) => {
                const data_time = data.find((item) => item.date === Item);
                if (data_time) {
                  return data_time.orders;
                } else {
                  return 0;
                }
              }),
              yAxisID: "orders",
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Doanh số",
              data: labels.map((Item) => {
                const data_time = data.find((item) => item.date === Item);
                if (data_time) {
                  return Number(data_time.revenue);
                } else {
                  return 0;
                }
              }),
              yAxisID: "revenue",
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        });
      });
  };

  const handleSetTypeOfTime = (type_of_time) => {
    setTypeOfTime(type_of_time);
  };

  return (
    <>
      {isProcessing && <Processing />}
      {isLoading && <Loader />}
      {data && (
        <div id="statistics">
          <div class="dash-tiles row">
            <div class="col-sm-3">
              <div
                data-v-ca3d5102=""
                data-v-64252556=""
                class="key-metric-item track-click-key-metric-item key-metric km-selectable"
              >
                <div data-v-ca3d5102="" class="title">
                  <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                    Người dùng
                  </span>
                </div>
                <div data-v-ca3d5102="" class="value">
                  <label data-v-ca3d5102="" class="number">
                    <span class="number">
                      <span class="currency-value">{data.total_users}</span>
                    </span>
                  </label>
                </div>
              </div>
              <div
                data-v-ca3d5102=""
                data-v-64252556=""
                class="key-metric-item track-click-key-metric-item key-metric km-selectable"
              >
                <div data-v-ca3d5102="" class="title">
                  <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                    Người mua
                  </span>
                </div>
                <div data-v-ca3d5102="" class="value">
                  <label data-v-ca3d5102="" class="number">
                    <span class="number">
                      <span class="currency-value">
                        {data.total_bought_users}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="col-sm-3">
              <div
                data-v-ca3d5102=""
                data-v-64252556=""
                class="key-metric-item track-click-key-metric-item key-metric km-selectable"
                style={{ marginLeft: "16px" }}
              >
                <div data-v-ca3d5102="" class="title">
                  <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                    Đơn hàng
                  </span>
                </div>
                <div data-v-ca3d5102="" class="value">
                  <label data-v-ca3d5102="" class="number">
                    <span class="number">
                      <span class="currency-value">{data.total_orders}</span>
                    </span>
                  </label>
                </div>
              </div>

              <div
                data-v-ca3d5102=""
                data-v-64252556=""
                class="key-metric-item track-click-key-metric-item key-metric km-selectable"
                style={{ marginLeft: "16px" }}
              >
                <div data-v-ca3d5102="" class="title">
                  <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                    Đơn hàng hoàn thành
                  </span>
                </div>
                <div data-v-ca3d5102="" class="value">
                  <label data-v-ca3d5102="" class="number">
                    <span class="number">
                      <span class="currency-value">
                        {data.total_completed_orders.length}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="col-sm-3">
              <div
                data-v-ca3d5102=""
                data-v-64252556=""
                class="key-metric-item track-click-key-metric-item key-metric km-selectable"
                style={{ marginLeft: "16px" }}
              >
                <div data-v-ca3d5102="" class="title">
                  <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                    Sản phẩm
                  </span>
                </div>
                <div data-v-ca3d5102="" class="value">
                  <label data-v-ca3d5102="" class="number">
                    <span class="number">
                      <span class="currency-value">{data.total_products}</span>
                    </span>
                  </label>
                </div>
              </div>

              <div
                data-v-ca3d5102=""
                data-v-64252556=""
                class="key-metric-item track-click-key-metric-item key-metric km-selectable"
                style={{ marginLeft: "16px" }}
              >
                <div data-v-ca3d5102="" class="title">
                  <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                    Doanh số
                  </span>
                </div>
                <div data-v-ca3d5102="" class="value">
                  <label data-v-ca3d5102="" class="">
                    <span class="currency">
                      <span class="currency-symbol">₫</span>
                      <span class="currency-value">
                        {new Intl.NumberFormat({ style: "currency" }).format(
                          revenue
                        )}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="col-sm-3">
              <div
                data-v-ca3d5102=""
                data-v-64252556=""
                class="key-metric-item track-click-key-metric-item key-metric km-selectable"
                style={{ marginLeft: "16px" }}
              >
                <div data-v-ca3d5102="" class="title">
                  <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                    Doanh mục
                  </span>
                </div>
                <div data-v-ca3d5102="" class="value">
                  <label data-v-ca3d5102="" class="number">
                    <span class="number">
                      <span class="currency-value">
                        {data.total_categories}
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <div
                data-v-ca3d5102=""
                data-v-64252556=""
                class="key-metric-item track-click-key-metric-item key-metric km-selectable"
                style={{ marginLeft: "16px" }}
              >
                <div data-v-ca3d5102="" class="title">
                  <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                    Lượt truy cập
                  </span>
                </div>
                <div data-v-ca3d5102="" class="value">
                  <label data-v-ca3d5102="" class="number">
                    <span class="number">
                      <span class="currency-value">
                        {data.data_statistics.access_times}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 statistics-chart">
              <div class="dash-tile dash-tile-2x">
                <div class="dash-tile-header">
                  <div>
                    Thời gian:{" "}
                    <button
                      onClick={() => handleSetTypeOfTime("date")}
                      class={`btn-type-of-time${
                        type_of_time === "date" ? " selected" : ""
                      }`}
                    >
                      Ngày
                    </button>
                    <button
                      onClick={() => handleSetTypeOfTime("week")}
                      class={`btn-type-of-time${
                        type_of_time === "week" ? " selected" : ""
                      }`}
                    >
                      Tuần
                    </button>
                    <button
                      onClick={() => handleSetTypeOfTime("month")}
                      class={`btn-type-of-time${
                        type_of_time === "month" ? " selected" : ""
                      }`}
                    >
                      Tháng
                    </button>
                  </div>
                  {type_of_time && (
                    <>
                      {type_of_time === "date" ? (
                        <DatePicker
                          placeholder="Chọn ngày"
                          format="dd-MM-yyyy"
                          style={{ width: 450 }}
                          onChange={handlePickDate}
                          defaultValue={new Date()}
                        />
                      ) : type_of_time === "week" ? (
                        <DatePicker
                          className="week"
                          placeholder="Chọn tuần"
                          format="dd-MM-yyyy"
                          showWeekNumbers
                          isoWeek
                          style={{ width: 450 }}
                          onChange={handlePickWeek}
                        />
                      ) : (
                        <DatePicker
                          placeholder="Chọn tháng"
                          format="MM-yyyy"
                          style={{ width: 450 }}
                          onChange={handlePickMonth}
                        />
                      )}
                    </>
                  )}
                </div>
                <div class="dash-tile-content">
                  <div style={{ paddingLeft: "0" }} class="col-sm-2">
                    <div
                      data-v-ca3d5102=""
                      data-v-64252556=""
                      class="key-metric-item track-click-key-metric-item key-metric km-selectable"
                    >
                      <div data-v-ca3d5102="" class="title">
                        <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                          Đơn hàng
                        </span>
                      </div>
                      <div data-v-ca3d5102="" class="value">
                        <label data-v-ca3d5102="" class="number">
                          <span class="number">
                            <span class="currency-value">{orders_by_time}</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingLeft: "30px" }} class="col-sm-2">
                    <div
                      data-v-ca3d5102=""
                      data-v-64252556=""
                      class="key-metric-item track-click-key-metric-item key-metric km-selectable"
                    >
                      <div data-v-ca3d5102="" class="title">
                        <span data-v-ca3d5102="" style={{ marginRight: "4px" }}>
                          Doanh số
                        </span>
                      </div>
                      <div data-v-ca3d5102="" class="value">
                        <label data-v-ca3d5102="" class="">
                          <span class="currency">
                            <span class="currency-symbol">₫</span>
                            <span class="currency-value">
                              {new Intl.NumberFormat({
                                style: "currency",
                              }).format(revenue_by_time)}
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {dataset && <Line options={options} data={dataset} />}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="dash-tile dash-tile-2x">
                <div class="dash-tile-header">
                  Top 10 sản phẩm bán chạy nhất
                </div>
                <div class="dash-tile-content">
                  <div
                    class="slimScrollDiv"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      width: "auto",
                      height: "340px",
                    }}
                  >
                    <div
                      class="dash-tile-content-inner scrollable-tile-2x"
                      style={{
                        overflow: "hidden",
                        width: "auto",
                        height: "340px",
                      }}
                    >
                      {data.best_sold_products.map((item) => {
                        return (
                          <p style={{ marginBottom: "15px" }}>{item.name}</p>
                        );
                      })}
                    </div>
                    <div
                      class="slimScrollBar"
                      style={{
                        background: "rgb(0, 0, 0)",
                        width: "3px",
                        position: "absolute",
                        top: "115px",
                        opacity: "0.4",
                        display: "none",
                        borderRadius: "7px",
                        zIndex: "99",
                        right: "1px",
                        height: "214.793px",
                      }}
                    ></div>
                    <div
                      class="slimScrollRail"
                      style={{
                        width: "3px",
                        height: "100%",
                        position: "absolute",
                        top: "0px",
                        display: "none",
                        borderRadius: "7px",
                        background: "rgb(51, 51, 51)",
                        opacity: "0.2",
                        zIndex: "90",
                        right: "1px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6">
              <div class="dash-tile dash-tile-2x">
                <div class="dash-tile-header">
                  Top 10 sản phẩm được xem nhiều nhất
                </div>
                <div class="dash-tile-content">
                  <div
                    class="slimScrollDiv"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      width: "auto",
                      height: "340px",
                    }}
                  >
                    <div
                      class="dash-tile-content-inner scrollable-tile-2x"
                      style={{
                        overflow: "hidden",
                        width: "auto",
                        height: "340px",
                      }}
                    >
                      {data.most_viewed_products.map((item) => {
                        return (
                          <p style={{ marginBottom: "15px" }}>{item.name}</p>
                        );
                      })}
                    </div>
                    <div
                      class="slimScrollBar"
                      style={{
                        background: "rgb(0, 0, 0)",
                        width: "3px",
                        position: "absolute",
                        top: "173px",
                        opacity: "0.4",
                        display: "none",
                        borderRadius: "7px",
                        zIndex: "99",
                        right: "1px",
                        height: "157.143px",
                      }}
                    ></div>
                    <div
                      class="slimScrollRail"
                      style={{
                        width: "3px",
                        height: "100%",
                        position: "absolute",
                        top: "0px",
                        display: "none",
                        borderRadius: "7px",
                        background: "rgb(51, 51, 51)",
                        opacity: "0.2",
                        zIndex: "90",
                        right: "1px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
