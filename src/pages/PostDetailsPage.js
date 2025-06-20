import Heading from "components/layout/Heading";
import Layout from "components/layout/Layout";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import parse from "html-react-parser";
import PostCategory from "module/post/PostCategory";
import PostImage from "module/post/PostImage";
import PostItem from "module/post/PostItem";
import PostMeta from "module/post/PostMeta";
import PostRelate from "module/post/PostRelate";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PageNotFound from "./NotFoundPage";

const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams();
  const [postInfo, setPostInfo] = React.useState({});
  const { user } = postInfo;
  React.useEffect(() => {
    async function fetchData() {
      if (!slug) {
        return;
      }

      try {
        const colRef = collection(db, "posts");
        const q = query(colRef, where("slug", "==", slug));
        onSnapshot(q, (snapshot) => {
          snapshot.forEach((doc) => {
            const docData = doc.data();
            setPostInfo({
              id: doc.id,
              ...docData,
            });
          });
        });
      } catch (error) {
        console.error("🚨 Try-catch error:", error);
      }
    }
    fetchData();
  }, [slug]);
  React.useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug]);
  if (!slug) return <PageNotFound></PageNotFound>;
  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={postInfo?.image}
              className="post-feature"
            ></PostImage>
            <div className="post-info">
              <PostCategory className="mb-6" to={postInfo.category?.slug}>
                {postInfo?.category?.name}
              </PostCategory>
              <h1 className="post-heading">{postInfo?.title}</h1>
              <PostMeta></PostMeta>
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">
              {parse(postInfo?.content || "")}
            </div>
            <div className="author">
              <div className="author-image">
                <img src={user?.avatar} alt="" />
              </div>
              <div className="author-content">
                <h3 className="author-name">{user?.fullname}</h3>
                <p className="author-desc">
                  {user?.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
          <PostRelate categoryId={postInfo.category?.id}></PostRelate>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
