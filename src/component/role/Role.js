import React, { useEffect, useState } from "react";
import axios from "../Axios";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";

const Role = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [roleId, setRoleId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("form#form"));
    if (isEditMode) {
      formData.append("_method", "put");
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/roles/` + roleId, formData)
        .then((res) => {
          setIsProcessing(false);
          setIsEditMode(false);
          setRoles((prev) => {
            const edited_role = prev.find((item) => item.id === roleId);
            edited_role.name = res.data.edited_role.name;
            edited_role.description = res.data.edited_role.description;
            return [...prev];
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
        .post(`${process.env.REACT_APP_API_ENDPOINT}/roles`, formData)
        .then((res) => {
          setIsProcessing(false);
          console.log(res);
          setRoles((prev) => {
            return [...prev, res.data];
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
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/roles/` + id)
      .then((res) => {
        setIsProcessing(false);
        console.log(res);
        setRoles((prev) => {
          return prev.filter((item) => item.id !== id);
        });
      })
      .catch((err) => {
        setIsProcessing(false);
        alert(err.response.data.message);
      });
  };

  const handleEdit = (id) => {
    const role = roles.find((item) => item.id === id);
    setRoleId(id);
    setIsEditMode(true);
    document.querySelector("input[name=role_name]").value = role.name;
    document.querySelector("textarea[name=role_description]").value =
      role.description;
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/roles`).then((res) => {
      setRoles(res.data);
      setIsLoading(false);
    });
  }, []);
  return (
    <>
      {isProcessing && <Processing />}
      {!isLoading ? (
        roles.length !== 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th
                    className="cell-small text-center"
                    data-toggle="tooltip"
                    title=""
                    data-original-title="Toggle all!"
                  >
                    <input type="checkbox" id="check1-all" name="check1-all" />
                  </th>
                  <th className="text-center">#</th>
                  <th className="hidden-xs hidden-sm">Tên vai trò</th>

                  <th style={{ width: "40%" }} className="hidden-xs hidden-sm">
                    Mô tả vai trò
                  </th>

                  <th className="text-center">
                    <i className="fa fa-bolt"></i> Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => {
                  return (
                    <tr key={role.id}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          id="check1-td1"
                          name="check1-td1"
                        />
                      </td>
                      <td className="text-center">{index + 1}</td>
                      <td>{role.name}</td>

                      <td>{role.description}</td>

                      <td className="text-center">
                        <div className="btn-group">
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-success"
                            onClick={() => {
                              handleEdit(role.id);
                            }}
                          >
                            <i className="fa fa-pencil"></i> Sửa
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              if (window.confirm("Bạn thực sự muốn xóa ?")) {
                                handleDelete(role.id);
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
                <label className="form-label">Tên vai trò</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="role_name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả vai trò</label>
                <textarea
                  spellCheck="false"
                  className="form-control"
                  name="role_description"
                ></textarea>
              </div>
              <button
                type="submit"
                className={!isEditMode ? "btn btn-primary" : "btn btn-success"}
              >
                {!isEditMode ? "Thêm vai trò" : "Sữa vai trò"}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    setIsEditMode(false);
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
            <h3>Không có vai trò nào !</h3>
            <form id="form" classNameName="col-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên vai trò</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="role_name"
                />
              </div>
              <div className="mb-3">
                <label class="form-label">Mô tả vai trò</label>
                <textarea
                  spellCheck="false"
                  className="form-control"
                  name="role_description"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Thêm vai trò
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

export default Role;
