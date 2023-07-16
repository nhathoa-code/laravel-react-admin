import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [data, setData] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [type_of_time, setTypeOfTime] = useState(null);
  const [dataset, setDataSet] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/statistics`)
      .then((res) => {
        console.log(res.data);
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
        console.log(res.data);
        const data = res.data;
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
    document.querySelector("input.rs-picker-toggle-textbox").value = null;
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
        console.log(res.data);
        const data = res.data;
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
        console.log(res.data);
        const data = res.data;
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
      {data && (
        <div id="statistics">
          {/* <ul id="nav-info" class="clearfix">
            <li>
              <Link href="index.html">
                <i class="fa fa-home"></i>
              </Link>
            </li>
            <li class="active">
              <Link to="/">Dashboard</Link>
            </li>
          </ul> */}

          <div class="dash-tiles row">
            <div class="col-sm-3">
              <div class="dash-tile dash-tile-ocean clearfix animation-pullDown">
                <div class="dash-tile-header">
                  <div class="dash-tile-options">
                    <div class="btn-group">
                      <a
                        href="javascript:void(0)"
                        class="btn btn-default"
                        data-toggle="tooltip"
                        title=""
                        data-original-title="Statistics"
                      >
                        <i class="fa fa-bar-chart-o"></i>
                      </a>
                    </div>
                  </div>
                  Người dùng
                </div>
                <div class="dash-tile-icon">
                  <i class="fa fa-users"></i>
                </div>
                <div class="dash-tile-text">{data.total_users}</div>
              </div>

              <div class="dash-tile dash-tile-leaf clearfix animation-pullDown">
                <div class="dash-tile-header">
                  <span class="dash-tile-options">
                    <a
                      href="javascript:void(0)"
                      class="btn btn-default"
                      data-toggle="popover"
                      data-placement="top"
                      data-content="$500 (230 Sales)"
                      title=""
                      data-original-title="Today's profit"
                    >
                      <i class="fa fa-bar-chart-o"></i>
                      {/* <i class="fa fa-money"></i> */}
                    </a>
                  </span>
                  Người mua
                </div>
                <div class="dash-tile-icon">
                  <i class="fa fa-users"></i>
                </div>
                <div class="dash-tile-text">{data.total_bought_users}</div>
              </div>
            </div>

            <div class="col-sm-3">
              <div class="dash-tile dash-tile-flower clearfix animation-pullDown">
                <div class="dash-tile-header">
                  <div class="dash-tile-options">
                    <div class="btn-group">
                      <a
                        href="javascript:void(0)"
                        class="btn btn-default"
                        data-toggle="tooltip"
                        title=""
                        data-original-title="Statistics"
                      >
                        <i class="fa fa-bar-chart-o"></i>
                      </a>
                    </div>
                  </div>
                  Đơn hàng
                </div>
                <div class="dash-tile-icon">
                  <i class="fa fa-shopping-cart"></i>
                </div>
                <div class="dash-tile-text">{data.total_orders}</div>
              </div>

              <div class="dash-tile dash-tile-fruit clearfix animation-pullDown">
                <div class="dash-tile-header">
                  <div class="dash-tile-options">
                    <a
                      href="javascript:void(0)"
                      class="btn btn-default"
                      data-toggle="tooltip"
                      title=""
                      data-original-title="View popular downloads"
                    >
                      <i class="fa fa-bar-chart-o"></i>
                    </a>
                  </div>
                  Đơn hàng hoàn thành
                </div>
                <div class="dash-tile-icon">
                  <i class="fa fa-shopping-cart"></i>
                </div>
                <div class="dash-tile-text">
                  {data.total_completed_orders.length}
                </div>
              </div>
            </div>

            <div class="col-sm-3">
              <div class="dash-tile dash-tile-oil clearfix animation-pullDown">
                <div class="dash-tile-header">
                  <div class="dash-tile-options">
                    <div class="btn-group">
                      <a
                        href="javascript:void(0)"
                        class="btn btn-default"
                        data-toggle="tooltip"
                        title=""
                        data-original-title="Statistics"
                      >
                        <i class="fa fa-bar-chart-o"></i>
                      </a>
                    </div>
                  </div>
                  Sản phẩm
                </div>
                <div class="dash-tile-icon">
                  <i class="fa fa-check-square"></i>
                </div>
                <div class="dash-tile-text">{data.total_products}</div>
              </div>

              <div class="dash-tile dash-tile-dark clearfix animation-pullDown">
                <div class="dash-tile-header">
                  <div class="dash-tile-options">
                    <a
                      href="javascript:void(0)"
                      class="btn btn-default"
                      data-toggle="tooltip"
                      title=""
                      data-original-title="Monthly report"
                    >
                      <i class="fa fa-bar-chart-o"></i>
                    </a>
                  </div>
                  Doanh số
                </div>
                <div class="dash-tile-text">
                  {new Intl.NumberFormat({ style: "currency" }).format(revenue)}
                </div>
              </div>
            </div>

            <div class="col-sm-3">
              <div class="dash-tile dash-tile-balloon clearfix animation-pullDown">
                <div class="dash-tile-header">
                  <div class="dash-tile-options">
                    <a
                      href="javascript:void(0)"
                      class="btn btn-default"
                      data-toggle="tooltip"
                      title=""
                      data-original-title="Statistics"
                    >
                      <i class="fa fa-bar-chart-o"></i>
                    </a>
                  </div>
                  Danh mục
                </div>
                <div class="dash-tile-icon">
                  <i class="fa fa-pencil-square"></i>
                </div>
                <div class="dash-tile-text">{data.total_categories}</div>
              </div>

              <div class="dash-tile dash-tile-doll clearfix animation-pullDown">
                <div class="dash-tile-header">
                  <div class="dash-tile-options">
                    <a
                      href="javascript:void(0)"
                      class="btn btn-default"
                      data-toggle="tooltip"
                      title=""
                      data-original-title="Open tickets"
                    >
                      <i class="fa fa-bar-chart-o"></i>
                    </a>
                  </div>
                  Lượt truy cập
                </div>
                <div class="dash-tile-icon">
                  <i class="fa fa-globe"></i>
                </div>
                <div class="dash-tile-text">
                  {data.data_statistics.access_times}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 statistics-chart">
              <div class="dash-tile dash-tile-2x">
                <div class="dash-tile-header">
                  <div>
                    <i class="fa fa-bar-chart-o"></i> Thống kê theo:{" "}
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
                        />
                      ) : type_of_time === "week" ? (
                        <DatePicker
                          className="week"
                          placeholder="Chọn tuần"
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
                      height: "330px",
                    }}
                  >
                    <div
                      class="dash-tile-content-inner scrollable-tile-2x"
                      style={{
                        overflow: "hidden",
                        width: "auto",
                        height: "330px",
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
                      height: "330px",
                    }}
                  >
                    <div
                      class="dash-tile-content-inner scrollable-tile-2x"
                      style={{
                        overflow: "hidden",
                        width: "auto",
                        height: "330px",
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
