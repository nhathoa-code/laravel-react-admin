import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "../Axios";

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
            .post(`${process.env.REACT_APP_API_ENDPOINT}/upload`, formData)
            .then((res) => {
              console.log(res.data);
              if (localStorage.getItem("description_images")) {
                let description_images = JSON.parse(
                  localStorage.getItem("description_images")
                );
                description_images.push(res.data.image_path);
                localStorage.setItem(
                  "description_images",
                  JSON.stringify(description_images)
                );
              } else {
                localStorage.setItem(
                  "description_images",
                  JSON.stringify([res.data.image_path])
                );
              }

              resolve({
                default: res.data.image_url,
              });
            })
            .catch((err) => {
              console.log(err);
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

const Editor = ({ setDescription, description }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={config}
      data={description}
      onReady={(editor) => {
        setDescription(editor.getData());
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        setDescription(data);
      }}
    />
  );
};

export default Editor;
