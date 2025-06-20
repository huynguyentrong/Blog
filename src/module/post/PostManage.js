import { ActionDelete, ActionEdit, ActionView } from "components/action";
import { Button } from "components/button";
import LabelStatus from "components/label/LabelStatus";
import { Table } from "components/table";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const POST_PER_PAGE = 1;
const PostManage = () => {
  const [posts, setPosts] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const [lastDoc, setLastDoc] = React.useState();
  const [total, setTotal] = React.useState(0);
  const navigate = useNavigate();
  React.useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const newRef = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8")
          )
        : query(colRef, limit(POST_PER_PAGE));
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });
      onSnapshot(newRef, (snapshot) => {
        let result = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() });
        });
        setPosts(result);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter]);

  async function handlePostDelete(postId) {
    const colRef = doc(db, "posts", postId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  }
  const RenderStatus = (status) => {
    switch (status) {
      case "approved":
        return <LabelStatus type="success">Approved</LabelStatus>;
      case "pending":
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case "banned":
        return <LabelStatus type="danger">Reject</LabelStatus>;
      default:
        break;
    }
  };
  const handleSearchPost = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  const handleLoadMore = async () => {
    const nextRef = query(
      collection(db, "posts"),
      startAfter(lastDoc),
      limit(POST_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });
      setPosts([...posts, ...result]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };
  const { userInfo } = useAuth();
  if (userInfo?.role !== "admin") return null;
  return (
    <div>
      <h1 className="dashboard-heading">Manage post</h1>
      <div className="flex justify-end mb-10">
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 border-solid rounded-lg"
            placeholder="Search post..."
            onChange={handleSearchPost}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 &&
            posts.map((posts) => {
              const date = posts?.createdAt?.seconds
                ? new Date(posts?.createdAt?.seconds * 1000)
                : new Date();
              const formatDate = new Date(date).toLocaleDateString("vi-VN");
              return (
                <tr key={posts.id}>
                  <td></td>
                  <td>{posts.id?.slice(0, 5) + "..."}</td>
                  <td>
                    <div className="flex items-center gap-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
                        alt=""
                        className="w-[66px] h-[55px] rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold whitespace-pre-wrap max-w-80">
                          {posts.title}
                        </h3>
                        <time className="text-sm text-gray-500">
                          Date: {formatDate}
                        </time>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-gray-500">
                      {posts.category?.name}
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-500">
                      {posts.user?.username}
                    </span>
                  </td>
                  <td>{RenderStatus(posts.status)}</td>
                  <td>
                    <div className="flex items-center text-gray-500 gap-x-3">
                      <ActionView
                        onClick={() => navigate(`/${posts.slug}`)}
                      ></ActionView>
                      <ActionEdit
                        onClick={() =>
                          navigate(`/manage/update-post?id=${posts.id}`)
                        }
                      ></ActionEdit>
                      <ActionDelete
                        onClick={() => handlePostDelete(posts.id)}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      {total > posts.length && (
        <div className="mt-10">
          <Button
            kind="ghost"
            height="60px"
            onClick={handleLoadMore}
            className="mx-auto"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostManage;
