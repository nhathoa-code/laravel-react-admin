import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import axios from "../Axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";

const Admin = () => {
  const { admin } = useContext(AuthContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [editedAdmin, setEditedAdmin] = useState(null);
  const [roles, setRoles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("form#form"));
    if (isEditMode) {
      formData.append("_method", "put");
      axios
        .post(
          `${process.env.REACT_APP_API_ENDPOINT}/admins/${adminId}`,
          formData
        )
        .then((res) => {
          setIsProcessing(false);
          setIsEditMode(false);
          const edited_roles = [];
          const roles_checked = document.querySelectorAll(
            `input[type=checkbox]:checked`
          );

          for (let i = 0; i < roles_checked.length; i++) {
            edited_roles.push(roles_checked[i].dataset.name);
          }
          setAdmins((prev) => {
            const edited_admin = prev.find((item) => item.id === adminId);
            edited_admin.name = res.data.edited_admin.name;
            edited_admin.username = res.data.edited_admin.username;
            edited_admin.roles = edited_roles;
            return [...prev];
          });
          setRoles((prev) => {
            return prev.map((item) => {
              item.checked = false;
              return item;
            });
          });
          alert(res.data.message);
          document.querySelector("form#form").reset();
        })
        .catch((err) => {
          setIsProcessing(false);
          alert(err.response.data.message);
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/admins`, formData)
        .then((res) => {
          setIsProcessing(false);
          const chosen_roles = [];
          const roles_checked = document.querySelectorAll(
            `input[type=checkbox]:checked`
          );
          for (let i = 0; i < roles_checked.length; i++) {
            chosen_roles.push(roles_checked[i].dataset.name);
          }
          setAdmins((prev) => {
            return [...prev, { ...res.data.new_admin, roles: chosen_roles }];
          });
          document.querySelector("form#form").reset();
        })
        .catch((err) => {
          setIsProcessing(false);
          alert(err.response.data.message);
        });
    }
  };

  const handleDelete = (id) => {
    setIsProcessing(true);
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/admins/${id}`)
      .then((res) => {
        setIsProcessing(false);
        setAdmins((prev) => {
          return prev.filter((item) => item.id !== id);
        });
      })
      .catch((err) => {
        setIsProcessing(false);
        alert(err.response.data.message);
      });
  };

  const handleEdit = (id) => {
    const admin = admins.find((item) => item.id === id);
    setRoles((prev) => {
      return prev.map((item) => {
        if (admin.roles.includes(item.name)) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
    });
    setEditedAdmin(admin);
    setAdminId(id);
    setIsEditMode(true);
    document.querySelector("input[name=name]").value = admin.name;
    document.querySelector("input[name=username]").value = admin.username;
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/roles`).then((res) => {
      setRoles(res.data);
    });
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/admins`).then((res) => {
      console.log(res.data);
      setAdmins(
        res.data.map((item) => {
          item.checked = false;
          return item;
        })
      );
      setIsLoading(false);
    });
  }, []);
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        admins.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="hidden-xs hidden-sm">Ảnh đại diện</th>
                  <th className="hidden-xs hidden-sm">Tên thành viên</th>
                  <th className="hidden-xs hidden-sm">Vai trò</th>
                  <th className="text-center">
                    <i className="fa fa-bolt"></i> Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => {
                  return (
                    <tr key={admin.id}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        {admin.picture ? (
                          <img
                            className="avatar"
                            src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${admin.picture}`}
                          />
                        ) : (
                          <img
                            className="avatar"
                            src="/img/template/avatar.png"
                          />
                        )}
                      </td>
                      <td>{admin.name}</td>

                      <td>
                        {admin.roles.map((item) => {
                          return <p>{item}</p>;
                        })}
                      </td>

                      <td className="text-center">
                        <div className="btn-group">
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-success"
                            onClick={() => {
                              handleEdit(admin.id);
                            }}
                          >
                            <i className="fa fa-pencil"></i> Sửa
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(admin.id);
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
            <form id="form" className="col-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên thành viên</label>
                <input
                  readOnly={
                    isEditMode
                      ? admin.roles
                          .map((item) => item.name)
                          .includes("Administrator")
                        ? false
                        : true
                      : false
                  }
                  type="text"
                  className="form-control"
                  name="name"
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Username</label>
                <input
                  readOnly={
                    isEditMode
                      ? admin.roles
                          .map((item) => item.name)
                          .includes("Administrator")
                        ? false
                        : true
                      : false
                  }
                  type="text"
                  className="form-control"
                  name="username"
                />
              </div>
              <div className="mb-3">
                <label class="form-label">
                  {!isEditMode ? "Mật khẩu" : "Tạo mật khẩu mới"}
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ảnh đại diện</label>
                <input type="file" className="form-control" name="picture" />
                {isEditMode &&
                  (editedAdmin.picture ? (
                    <img
                      style={{ height: "50px" }}
                      src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${editedAdmin.picture}`}
                    />
                  ) : (
                    <img src={"/img/template/avatar@2x.png"} />
                  ))}
              </div>
              <div class="mb-3">
                <h4>Vai trò</h4>
                <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                  {roles.map((item) => {
                    return (
                      <li>
                        <div class="checkbox">
                          <label
                            class="form-check-label"
                            for={`role${item.id}`}
                          >
                            <input
                              disabled={
                                isEditMode
                                  ? admin.roles
                                      .map((item) => item.name)
                                      .includes("Administrator")
                                    ? false
                                    : true
                                  : false
                              }
                              checked={item.checked}
                              class="form-check-input"
                              type="checkbox"
                              id={`role${item.id}`}
                              name="roles[]"
                              data-name={item.name}
                              value={item.id}
                              onChange={() => {
                                item.checked = !item.checked;
                                setRoles((prev) => {
                                  return [...prev];
                                });
                              }}
                            />
                            {item.name}
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm thành viên" : "Sửa thành viên"}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setRoles((prev) => {
                      return prev.map((item) => {
                        item.checked = false;
                        return item;
                      });
                    });
                    document.querySelector("form#form").reset();
                  }}
                  className="btn btn-danger ml-2"
                >
                  Hủy bỏ
                </button>
              )}
            </form>
          </>
        ) : (
          <>
            <h3>Không có thành viên quản trị nào !</h3>
            <form id="form" classNameName="col-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên thành viên</label>
                <input type="text" className="form-control" name="name" />
              </div>
              <div className="mb-3">
                <label class="form-label">Email</label>
                <input type="text" className="form-control" name="email" />
              </div>
              <div className="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ảnh đại diện</label>
                <input type="file" className="form-control" name="picture" />
              </div>
              <div class="mb-3">
                <h4>Vai trò</h4>
                <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                  {roles.map((item) => {
                    return (
                      <li>
                        <div class="checkbox">
                          <label
                            class="form-check-label"
                            for={`role${item.id}`}
                          >
                            <input
                              checked={item.checked}
                              class="form-check-input"
                              type="checkbox"
                              id={`role${item.id}`}
                              name="roles[]"
                              data-name={item.name}
                              value={item.id}
                              onChange={() => {
                                item.checked = !item.checked;
                                setRoles((prev) => {
                                  return [...prev];
                                });
                              }}
                            />
                            {item.name}
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button type="submit" className="btn btn-primary">
                Thêm thành viên
              </button>
            </form>
          </>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Admin;
