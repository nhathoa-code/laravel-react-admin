import React from "react";
import uuid from "react-uuid";

const Specification = ({ specification, setSpecification }) => {
  const handleAddTitle = () => {
    setSpecification((prev) => {
      return [...prev, { id: uuid(), title: "", technical_infos: [] }];
    });
  };

  const handleDeleteTitle = (id) => {
    setSpecification((prev) => {
      return [...prev].filter((item) => item.id !== id);
    });
  };

  const handleAddTechnicalInfo = (id) => {
    setSpecification((prev) => {
      return [...prev].map((item) => {
        if (item.id === id) {
          item.technical_infos = [
            ...item.technical_infos,
            { id: uuid(), technical_info: "", technical_content: "" },
          ];
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleDeleteTechnicalInfo = (parent_id, id) => {
    setSpecification((prev) => {
      return [...prev].map((item) => {
        if (item.id === parent_id) {
          item.technical_infos = [...item.technical_infos].filter(
            (item) => item.id !== id
          );
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleInputChange = (parent_id, id, e) => {
    const name = e.target.getAttribute("data-name");
    const value = e.target.value;
    if (id) {
      setSpecification((prev) => {
        return [...prev].map((item) => {
          if (item.id === parent_id) {
            item.technical_infos = [...item.technical_infos].map((item) => {
              if (item.id === id) {
                return { ...item, [name]: value };
              } else {
                return item;
              }
            });
            return item;
          } else {
            return item;
          }
        });
      });
    } else {
      setSpecification((prev) => {
        return [...prev].map((item) => {
          if (item.id === parent_id) {
            return { ...item, [name]: value };
          } else {
            return item;
          }
        });
      });
    }
  };

  return (
    <div>
      {specification.map((Item) => {
        return (
          <div key={Item.id}>
            <div class="row">
              <div class="col-md-10">
                <input
                  type="text"
                  placeholder="Tiêu đề"
                  value={Item.title && Item.title}
                  className="form-control"
                  data-name="title"
                  onChange={(e) => {
                    handleInputChange(Item.id, null, e);
                  }}
                  style={{ fontWeight: "500", fontSize: "18px" }}
                />
              </div>
              <div class="col-md-2">
                <input
                  type="button"
                  value="Bỏ"
                  style={{ width: "100%" }}
                  className="btn btn-danger"
                  onClick={() => {
                    handleDeleteTitle(Item.id);
                  }}
                />
              </div>
            </div>
            <div>
              <input
                type="button"
                value="Thêm thông tin kỹ thuật"
                className="btn btn-info"
                onClick={() => {
                  handleAddTechnicalInfo(Item.id);
                }}
              />
            </div>

            {Item.technical_infos.map((item) => {
              return (
                <div key={item.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    class="form-group"
                  >
                    <div class="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="thông tin kỹ thuật"
                        data-name="technical_info"
                        value={item.technical_info && item.technical_info}
                        onChange={(e) => {
                          handleInputChange(Item.id, item.id, e);
                        }}
                      />
                    </div>
                    <div class="col-md-7">
                      <textarea
                        style={{
                          width: "100%",
                        }}
                        data-name="technical_content"
                        placeholder="nội dung kỹ thuật"
                        className="form-control"
                        value={item.technical_content && item.technical_content}
                        onChange={(e) => {
                          handleInputChange(Item.id, item.id, e);
                        }}
                      ></textarea>
                    </div>
                    <div class="col-md-1">
                      <input
                        type="button"
                        value="Bỏ"
                        className="btn btn-danger"
                        onClick={() => {
                          handleDeleteTechnicalInfo(Item.id, item.id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <input
        type="button"
        onClick={handleAddTitle}
        value="Thêm tiêu đề"
        style={{ marginTop: "10px" }}
        className="btn btn-primary"
      />
    </div>
  );
};

export default Specification;
