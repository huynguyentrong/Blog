import { ActionDelete, ActionEdit } from "components/action";
import { Button } from "components/button";
import LabelStatus from "components/label/LabelStatus";
import { Table } from "components/table";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import { deleteUser } from "firebase/auth";
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
import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const USER_PER_PAGE = 1;
const UserManage = () => {
  const [userList, setUserList] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const [lastDoc, setLastDoc] = React.useState();
  const [total, setTotal] = React.useState(0);
  const navigate = useNavigate();
  const handleLoadMore = async () => {
    const nextRef = query(
      collection(db, "users"),
      startAfter(lastDoc),
      limit(USER_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });
      setUserList([...userList, ...result]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "users");
      const newRef = filter
        ? query(
            colRef,
            where("role", ">=", filter),
            where("role", "<=", filter + "\uf8ff")
          )
        : query(colRef, limit(USER_PER_PAGE));
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
        setUserList(result);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter]);

  const RenderUser = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "user":
        return "User";
      case "moderator":
        return "Moderator";
      default:
        break;
    }
  };
  const renderLabelStatus = (status) => {
    switch (status) {
      case "active":
        return <LabelStatus type="success">Active</LabelStatus>;
      case "pending":
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case "banned":
        return <LabelStatus type="danger">Reject</LabelStatus>;
      default:
        break;
    }
  };
  const handleDeleteUser = async (user) => {
    const colRef = doc(db, "users", user.id);
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
  };
  const handleSearchUser = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  const { userInfo } = useAuth();
  if (userInfo?.role !== "admin") return null;
  return (
    <div>
      <DashboardHeading title="Users" desc="Manage your user">
        <Button kind="ghost" height="60px" to="/manage/add-user">
          Create User
        </Button>
      </DashboardHeading>
      <div className="flex justify-end mb-10">
        <input
          type="text"
          className="px-3 py-4 border border-gray-200 rounded-lg"
          placeholder="Search user..."
          onChange={handleSearchUser}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Info</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user, index) => (
              <tr key={index}>
                <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
                <td className="whitespace-nowrap">
                  <div className="flex item-center gap-x-3">
                    <img
                      src={user.avatar}
                      alt=""
                      className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
                    />
                    <div className="flex-1">
                      <h3>{user.fullname}</h3>
                      <time className="text-sm text-gray-300">
                        {new Date(
                          user?.createdAt?.seconds * 1000
                        ).toLocaleDateString("vi-VN")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>{user?.username}</td>
                <td>{user?.email}</td>
                <td>{renderLabelStatus(user?.status)}</td>
                <td>{RenderUser(user?.role)}</td>
                <td>
                  <div className="flex item-center gap-x-3">
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-user?id=${user.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteUser(user)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > userList.length && (
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

export default UserManage;
