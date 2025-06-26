import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import PostFeatureItem from "module/post/PostFeatureItem";
import React, { useEffect, useState } from "react";

const HomeFeature = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef,
      where("hot", "==", true),
      where("status", "==", "approved"),
      limit(3)
    );
    onSnapshot(queries, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });
      setPosts(result);
    });
  }, []);

  if (posts.length <= 0) return null;

  return (
    <div className="mb-8 md:mb-12 lg:mb-16">
      <div className="container px-4 mx-auto">
        <div className="mb-6 md:mb-8 lg:mb-10">
          <Heading>Bài viết nổi bật</Heading>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8 xl:gap-10">
          {posts.map((post) => (
            <PostFeatureItem key={post.id} data={post}></PostFeatureItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFeature;
