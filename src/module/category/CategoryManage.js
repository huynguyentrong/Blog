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
import { debounce, set } from "lodash";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const CATEGORY_PER_PAGE = 1;
const CategoryManage = () => {
  const [categoryList, setCategoryList] = React.useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState("");
  const [lastDoc, setLastDoc] = React.useState();
  const [total, setTotal] = React.useState(0);
  const handleLoadMore = async () => {
    const nextRef = query(
      collection(db, "categories"),
      startAfter(lastDoc),
      limit(CATEGORY_PER_PAGE)
    );
    onSnapshot(nextRef, (snapshot) => {
      let result = [];
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
      });
      setCategoryList([...categoryList, ...result]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };
  React.useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const newRef = filter
        ? query(
            colRef,
            where("name", ">=", filter),
            where("name", "<=", filter + "\uf8ff")
          )
        : query(colRef, limit(CATEGORY_PER_PAGE));
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
        setCategoryList(result);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter]);
  const handleDeleteCategory = (id) => {
    const colRef = doc(db, "categories", id);
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
  const handleSearch = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  const { userInfo } = useAuth();
  if (userInfo?.role !== "admin") return null;
  return (
    <div>
      <DashboardHeading title="Categories">
        <Button kind="ghost" height="60px" to="/manage/add-category">
          Create Category
        </Button>
      </DashboardHeading>
      <div className="flex justify-end mb-10">
        <input
          type="text"
          className="px-3 py-4 border border-gray-200 rounded-lg"
          placeholder="Search..."
          onChange={handleSearch}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((items) => {
              return (
                <tr key={items.id}>
                  <td>{items.id}</td>
                  <td>{items.name}</td>
                  <td>
                    <span className="italic text-gray-400">{items.slug}</span>
                  </td>
                  <td>
                    {items.status === "approved" ? (
                      <LabelStatus type="success">Approved</LabelStatus>
                    ) : (
                      <LabelStatus type="warning">Unapproved</LabelStatus>
                    )}
                  </td>
                  <td>
                    <div className="flex item-center gap-x-3">
                      <ActionEdit
                        onClick={() =>
                          navigate(`/manage/update-category?id=${items.id}`)
                        }
                      ></ActionEdit>
                      <ActionView></ActionView>
                      <ActionDelete
                        onClick={() => handleDeleteCategory(items.id)}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      {total > categoryList.length && (
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

export default CategoryManage;
