import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
const PostCategoryStyles = styled.div`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 10px;
  color: ${(props) => props.theme.gray6B};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  ${(props) =>
    props.type === "primary" &&
    css`
      background-color: ${(props) => props.theme.grayF3};
    `};
  ${(props) =>
    props.type === "secondary" &&
    css`
      background-color: white;
    `};
`;
const PostCategory = ({
  children,
  type = "primary",
  className = "",
  to = "",
}) => {
  return (
    <PostCategoryStyles type={type} className={`post-category ${className}`}>
      <Link to={`/category/${to}`}>{children}</Link>
    </PostCategoryStyles>
  );
};

export default PostCategory;
