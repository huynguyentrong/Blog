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
import PageNotFound from "./NotFoundPage";

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
    <div className="pb-20 lg:pb-25">
      <Layout>
        <div className="container px-4 mx-auto">
          {/* Post Header */}
          <div className="flex flex-col items-start justify-between gap-6 my-8 post-header lg:flex-row lg:items-center lg:gap-10 lg:my-10">
            {/* Featured Image */}
            <div className="w-full lg:max-w-2xl">
              <PostImage
                url={postInfo?.image}
                className="object-cover w-full h-64 sm:h-80 lg:h-96 rounded-2xl"
              />
            </div>

            {/* Post Info */}
            <div className="flex-1 w-full lg:w-auto">
              <PostCategory
                className="mb-4 lg:mb-6"
                to={postInfo.category?.slug}
              >
                {postInfo?.category?.name}
              </PostCategory>

              <h1 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl lg:mb-6">
                {postInfo?.title}
              </h1>

              <PostMeta />
            </div>
          </div>

          {/* Post Content */}
          <div className="max-w-4xl mx-auto mt-12 post-content lg:mt-20">
            {/* Entry Content */}
            <div className="mb-12 prose prose-lg entry-content max-w-none lg:mb-20">
              {parse(postInfo?.content || "")}
            </div>

            {/* Author Section */}
            <div className="flex flex-col p-6 mb-12 author sm:flex-row bg-gray-50 rounded-2xl lg:p-8 lg:mb-20">
              {/* Author Image */}
              <div className="flex-shrink-0 w-full h-48 mb-6 author-image sm:w-48 lg:w-52 lg:h-52 sm:mb-0 sm:mr-6 lg:mr-8">
                <img
                  src={user?.avatar}
                  alt={user?.fullname || "Author"}
                  className="object-cover w-full h-full rounded-2xl"
                />
              </div>

              {/* Author Content */}
              <div className="flex-1 author-content">
                <h3 className="mb-2 text-lg font-bold lg:text-xl lg:mb-4">
                  {user?.fullname}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 lg:text-base">
                  {user?.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <PostRelate categoryId={postInfo.category?.id} />
        </div>
      </Layout>
    </div>
  );
};

export default PostDetailsPage;
