import React, { useEffect, useState } from "react";
import axios from "../Axios";
import slugify from "react-slugify";
import { useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Loader from "../loader/Loader";
import Processing from "../process_icon/ProcessingIcon";

class MyUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);
          axios
            .post(`${process.env.REACT_APP_API_ENDPOINT}/post/images`, formData)
            .then((res) => {
              if (localStorage.getItem("post_images")) {
                let description_images = JSON.parse(
                  localStorage.getItem("post_images")
                );
                description_images.push(res.data.image_path);
                localStorage.setItem(
                  "post_images",
                  JSON.stringify(description_images)
                );
              } else {
                localStorage.setItem(
                  "post_images",
                  JSON.stringify([res.data.image_path])
                );
              }
              resolve({
                default: res.data.image_url,
              });
            })
            .catch((err) => {
              reject("not ok");
            });
        })
    );
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
const config = {
  extraPlugins: [MyCustomUploadAdapterPlugin],
};
const Edit = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/posts/${post_id}`)
      .then((res) => {
        setPost(res.data);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("form#form"));
    formData.append("post_content", post.content);
    formData.append("_method", "put");
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/posts/${post.id}`, formData)
      .then((res) => {
        setIsProcessing(false);
        localStorage.removeItem("post_images");
        alert(res.data.message);
      })
      .catch((err) => {
        setIsProcessing(false);
        alert(err.response.data.message);
      });
  };

  return (
    <>
      {isProcessing && <Processing />}
      {isLoading ? (
        <Loader />
      ) : (
        <form
          id="form"
          onSubmit={handleSubmit}
          style={{ width: "800px", margin: "0 auto" }}
        >
          <div style={{ marginBottom: "20px" }} class="col-md-12">
            <label>Tiêu đề bài viết</label>
            <input
              onChange={(e) => {
                document.querySelector("input[name=post_slug]").value = slugify(
                  e.target.value
                );
              }}
              type="text"
              name="post_title"
              class="form-control"
              value={post.title}
            />
          </div>
          <div style={{ marginBottom: "20px" }} class="col-md-12">
            <label>Slug</label>
            <input
              defaultValue={post.slug}
              type="text"
              name="post_slug"
              class="form-control"
            />
          </div>
          <div style={{ marginBottom: "20px" }} class="col-md-12">
            <label>Thumbnail</label>
            <input type="file" name="thumbnail" class="form-control" />
            <img
              style={{ width: "200px" }}
              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${post.post_thumbnail}`}
            />
          </div>
          <div style={{ marginBottom: "20px" }} class="col-md-12">
            <label>Danh mục bài viết</label>
            <select name="post_category" class="form-control">
              {post.post_categories.map((item) => {
                return (
                  <option
                    selected={item.id == post.post_category_id ? true : false}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div style={{ marginBottom: "20px" }} class="col-md-12">
            <label>Mô tả bài viết</label>
            <textarea
              defaultValue={post.description}
              style={{ resize: "vertical" }}
              className="form-control"
              name="post_description"
            ></textarea>
          </div>
          <div className="col-md-12">
            <label>Nội dung bài viết</label>
            <CKEditor
              editor={ClassicEditor}
              config={config}
              data={post.content}
              onReady={(editor) => {}}
              onChange={(event, editor) => {
                const data = editor.getData();
                setPost((prev) => {
                  return { ...prev, content: data };
                });
              }}
            />
          </div>
          <div className="col-md-12" style={{ marginTop: "10px" }}>
            <button
              style={{ width: "100%" }}
              type="submit"
              class="btn btn-primary"
            >
              Sửa bài viết
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default Edit;
