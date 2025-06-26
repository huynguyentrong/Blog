import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import PostItem from "module/post/PostItem";
import PostNewestItem from "module/post/PostNewestItem";
import PostNewestLarge from "module/post/PostNewestLarge";
import React, { useEffect, useState } from "react";

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef,
      where("hot", "==", false),
      where("status", "==", "approved"),
      limit(4)
    );
    onSnapshot(queries, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({ ...doc.data(), id: doc.id });
      });
      setPosts(result);
    });
  }, []);

  const [first, ...other] = posts;
  if (posts.length <= 0) return null;

  return (
    <div className="py-8 mb-8 md:py-12 lg:py-16 md:mb-12 lg:mb-16">
      <div className="container px-4 mx-auto">
        <div className="mb-6 md:mb-8 lg:mb-10">
          <Heading>Mới nhất</Heading>
        </div>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 md:gap-8 lg:gap-10 xl:gap-12 lg:items-start">
          {/* Main Post */}
          <div className="order-1 w-full">
            <PostNewestLarge data={first}></PostNewestLarge>
          </div>

          {/* Sidebar Posts - Mobile: Horizontal Scroll, Desktop: Vertical Stack */}
          <div className="order-2 w-full">
            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden">
              <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {other.length > 0 &&
                  other.map((item) => (
                    <div
                      key={item.id}
                      className="flex-none w-full min-w-[280px] sm:min-w-[320px] snap-start"
                    >
                      <div className="h-full p-4 bg-purple-50 rounded-2xl">
                        <PostNewestItem data={item}></PostNewestItem>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Desktop: Vertical stack */}
            <div className="hidden lg:block p-7 bg-purple-50 rounded-2xl">
              <div className="space-y-6">
                {other.length > 0 &&
                  other.map((item) => (
                    <PostNewestItem key={item.id} data={item}></PostNewestItem>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNewest;
