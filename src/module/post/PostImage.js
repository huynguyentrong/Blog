import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
const PostImageStyles = styled.div`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
`;
const PostImage = ({ url = "", alt = "", className = "", to = "" }) => {
  if (to)
    return (
      <Link to={`/${to}`}>
        <PostImageStyles className={className}>
          <img src={url} alt={alt} loading="lazy" />
        </PostImageStyles>
      </Link>
    );
  return (
    <PostImageStyles className={className}>
      <img src={url} alt={alt} loading="lazy" />
    </PostImageStyles>
  );
};

export default PostImage;
