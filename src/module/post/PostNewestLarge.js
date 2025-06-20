import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import slugify from "slugify";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 600;
      margin-left: auto;
    }
    &-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
    }
    &-title {
      margin-bottom: 12px;
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  if (!data.id) return null;
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VN");
  const { user } = data;
  return (
    <PostNewestLargeStyles>
      <PostImage
        url={data?.image}
        className="post-image"
        to={data?.slug}
      ></PostImage>
      <PostCategory to={data?.category?.slug} className={"post-category"}>
        {data?.category?.name}
      </PostCategory>
      <PostTitle to={data?.slug} size={"normal"} className={"post-title"}>
        {data?.title}
      </PostTitle>
      <PostMeta
        to={slugify(user?.username || "", { lower: true })}
        author={user?.fullname}
        date={formatDate}
      ></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
