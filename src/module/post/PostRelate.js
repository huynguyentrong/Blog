import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import PostItem from "./PostItem";

const PostRelate = ({ categoryId = "" }) => {
  const [post, setPost] = React.useState([]);
  useEffect(() => {
    const docData = query(
      collection(db, "posts"),
      where("categoryId", "==", categoryId)
    );
    onSnapshot(docData, (snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPost(data);
    });
  }, [categoryId]);
  if (!categoryId) return null;
  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="flex gap-4 overflow-x-auto md:flex-wrap md:overflow-x-visible">
        {post.length > 0 &&
          post.map((data) => (
            <div
              key={data.id}
              className="flex-shrink-0 w-[280px] md:flex-1 md:w-auto md:min-w-[300px]"
            >
              <PostItem data={data}></PostItem>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostRelate;
