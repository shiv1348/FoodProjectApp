import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  loadUser,
  clearErrors,
} from "../../redux/actions/userActions";
import { updateProfileReset } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/images.png");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isUpdated, error, loading } = useSelector(
    (state) => state.auth || {}
  );

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhonenumber(user.phonenumber || "");
      setAvatarPreview(user.avatar?.url || "/images/images.png");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile updated successfully!");
      dispatch(loadUser());
      dispatch(updateProfileReset());
      navigate("/users/me");
    }
  }, [dispatch, error, navigate, isUpdated, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      phonenumber,
    };

    if (avatar) {
      userData.avatar = avatar;
    }

    dispatch(updateProfile(userData));
  };

  const onChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow-lg bg-white rounded p-4"
          onSubmit={submitHandler}
          encType="multipart/form-data"
        >
          <h1 className="mt-2 mb-4 font-weight-bold text-center">
            Update Profile
          </h1>

          <div className="form-group mb-3">
            <label htmlFor="name_field">Name</label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="phone_field">Phone Number</label>
            <input
              type="text"
              id="phone_field"
              className="form-control"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="avatar_upload">Avatar</label>
            <div className="d-flex align-items-center">
              <div>
                <figure className="avatar mr-3 item-rtl">
                  <img
                    src={avatarPreview}
                    className="rounded-circle"
                    alt="Avatar Preview"
                    height="48"
                    width="48"
                    style={{ objectFit: "cover" }}
                  />
                </figure>
              </div>
              <div className="custom-file ml-2">
                <input
                  type="file"
                  name="avatar"
                  className="form-control"
                  id="customFile"
                  accept="image/*"
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-block btn-success py-2 font-weight-bold text-white w-100"
            disabled={loading}
          >
            {loading ? "Updating..." : "UPDATE PROFILE"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
