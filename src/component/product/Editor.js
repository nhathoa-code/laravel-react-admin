import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

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
              console.log(res);
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
