import Heading from "components/layout/Heading";
import Layout from "components/layout/Layout";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import PostItem from "module/post/PostItem";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const [posts, setPosts] = React.useState([]);
  const param = useParams();
  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("category.slug", "==", param.slug)
      );
      onSnapshot(docRef, (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(results);
      });
    }
    fetchData();
  }, [param.slug]);
  if (posts.length <= 0) return null;
  return (
    <Layout>
      <div className="container">
        <div className="pt-10"></div>
        <Heading>Danh mục {param.slug}</Heading>
        <div className="flex gap-4 overflow-x-auto md:flex-wrap md:overflow-x-visible">
          {posts.length > 0 &&
            posts.map((data) => (
              <div
                key={data.id}
                className="flex-shrink-0 w-[280px] md:flex-1 md:w-auto md:min-w-[300px]"
              >
                <PostItem data={data}></PostItem>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
