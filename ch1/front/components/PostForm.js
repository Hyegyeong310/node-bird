import React, { useCallback, useState, useEffect, useRef } from "react";
import { Form, Button, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE
} from "../reducers/post";

const PostForm = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { imagePaths, isAddingPost, postAdded } = useSelector(
    state => state.post
  );
  const imageInput = useRef();

  useEffect(() => {
    setText("");
  }, [postAdded === true]);

  const onChangeText = useCallback(e => {
    setText(e.target.value);
  }, []);
  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      if (!text || !text.trim()) {
        return alert("게시글을 작성하세요.");
      }
      const formData = new FormData();
      imagePaths.forEach(i => {
        formData.append("image", i);
      });
      formData.append("content", text.trim());
      dispatch({
        type: ADD_POST_REQUEST,
        data: formData
      });
    },
    [text, imagePaths]
  );

  // image upload
  const onChangeImages = useCallback(e => {
    const { files } = e.target;
    console.log(files);
    const imageFormData = new FormData();
    [].forEach.call(files, f => {
      // multer name과 일치해야 한다.
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData
    });
  }, []);
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback(
    index => () => {
      dispatch({
        type: REMOVE_IMAGE,
        index
      });
    },
    []
  );

  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onSubmit={onSubmitForm}
    >
      <Input.TextArea
        maxLength={140}
        value={text}
        onChange={onChangeText}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type="primary"
          style={{ float: "right" }}
          htmlType="submit"
          loading={isAddingPost}
        >
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.length > 0 &&
          imagePaths.map((v, i) => (
            <div key={i} style={{ display: "inline-block" }}>
              <img
                src={`http://localhost:3065/${v}`}
                style={{ width: "200px" }}
                alt={v}
              />
              <div>
                <Button onClick={onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          ))}
      </div>
    </Form>
  );
};

export default PostForm;
