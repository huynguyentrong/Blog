import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Field } from "components/field";
import FieldCheckboxes from "components/field/FieldCheckboxes";
import ImageUpload from "components/image/ImageUpload";
import { Input } from "components/input";
import { Label } from "components/label";
import { auth, db } from "firebase-app/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import useFirebaseImage from "hooks/useFirebaseImage";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";

const UserAddNew = () => {
  const {
    control,
    watch,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      username: "",
      password: "",
      role: "user",
      status: "active",
      createdAt: new Date(),
    },
  });

  const watchStatus = watch("status");
  const watchRole = watch("role");
  const {
    image,
    handleResetUpload,
    progress,
    handleSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);
  const handleAddUser = async (value) => {
    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(auth, value.email, value.password);
      await addDoc(collection(db, "users"), {
        fullname: value.fullname,
        email: value.email,
        password: value.password,
        username: slugify(value.username || value.fullname, {
          lower: true,
          replacement: "-",
          trim: true,
        }),
        role: value.role,
        status: value.status,
        avatar: image,
        createdAt: serverTimestamp(),
      });
      toast.success(`User has been added ${value.email} successfully`);
      reset({
        fullname: "",
        email: "",
        username: "",
        password: "",
        role: "user",
        status: "active",
        createdAt: new Date(),
      });
      handleResetUpload();
    } catch (error) {
      toast.error(`Failed to add user ${value.email}`);
    }
  };
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddUser)}>
        <div className="w-full h-full mb-10 text-center">
          <ImageUpload
            className="!rounded-full  h-[200px]"
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            progress={progress}
            image={image}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === "active"}
                value="active"
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === "pending"}
                value="pending"
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={watchStatus === "banned"}
                value="banned"
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={watchRole === "admin"}
                value="admin"
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={watchRole === "moderator"}
                value="moderator"
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={watchRole === "user"}
                value="user"
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          type="submit"
          isLoading={isSubmitting}
          disabled={!isValid}
        >
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;
