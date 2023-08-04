import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../Axios";
import slugify from "react-slugify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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

// axios.defaults.withCredentials = true;
const Post = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product_id");
  const [postCategories, setPostCategories] = useState([]);
  const [content, setContent] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/post/categories`)
      .then((res) => {
        setPostCategories(res.data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(document.querySelector("form#form"));
    formData.append("post_content", content);
    if (product_id) {
      formData.append("product_id", Number(product_id));
    }
    if (localStorage.getItem("post_images")) {
      formData.append("post_images", localStorage.getItem("post_images"));
    }
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/posts`, formData)
      .then((res) => {
        setIsProcessing(false);
        localStorage.removeItem("post_images");
        alert(res.data.message);
        navigate("/posts");
      })
      .catch((err) => {
        setIsProcessing(false);
        alert(err.response.data.message);
      });
  };

  const handleThumbnailUpload = (e) => {
    if (!e.target.files[0]) {
      setPreviewThumbnail(null);
    } else {
      setPreviewThumbnail(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      {isProcessing && <Processing />}
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
          />
        </div>
        <div style={{ marginBottom: "20px" }} class="col-md-12">
          <label>Slug</label>
          <input type="text" name="post_slug" class="form-control" />
        </div>
        <div style={{ marginBottom: "20px" }} class="col-md-12">
          <label>Thumbnail</label>
          <input
            onChange={handleThumbnailUpload}
            type="file"
            name="thumbnail"
            class="form-control"
          />
          {previewThumbnail && (
            <img style={{ width: "200px" }} src={previewThumbnail} />
          )}
        </div>
        <div style={{ marginBottom: "20px" }} class="col-md-12">
          <label>Danh mục bài viết</label>
          <select name="post_category" class="form-control">
            {postCategories.map((item) => {
              return <option value={item.id}>{item.name}</option>;
            })}
          </select>
        </div>
        <div style={{ marginBottom: "20px" }} class="col-md-12">
          <label>Mô tả bài viết</label>
          <textarea
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
            data={content}
            onReady={(editor) => {}}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        </div>
        <div className="col-md-12" style={{ marginTop: "10px" }}>
          <button
            style={{ width: "100%" }}
            type="submit"
            class="btn btn-primary"
          >
            Thêm bài viết
          </button>
        </div>
      </form>
    </>
  );
};

export default Post;
