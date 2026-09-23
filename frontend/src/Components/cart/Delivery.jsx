import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { countries } from "countries-list";
import CheckoutSteps from "./CheckoutSteps";
import { saveDeliveryAddress } from "../../redux/actions/cartActions";

const Delivery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deliveryInfo } = useSelector((state) => state.cart || {});

  const [address, setAddress] = useState(deliveryInfo?.address || "");
  const [city, setCity] = useState(deliveryInfo?.city || "");
  const [postalCode, setPostalCode] = useState(deliveryInfo?.postalCode || "");
  const [phoneNo, setPhoneNo] = useState(deliveryInfo?.phoneNo || "");
  const [country, setCountry] = useState(deliveryInfo?.country || "IN");

  const countriesList = Object.values(countries);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveDeliveryAddress({
        address,
        city,
        phoneNo,
        postalCode,
        country,
      })
    );
    navigate("/confirm");
  };

  return (
    <>
      <CheckoutSteps delivery />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg bg-white rounded p-4" onSubmit={submitHandler}>
            <h1 className="mb-4 font-weight-bold text-center">Delivery Address</h1>

            <div className="form-group mb-3">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Flat / House No., Street, Landmark"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="city_field">City</label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Enter City"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="phone_field">Phone No</label>
              <input
                type="phone"
                id="phone_field"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="postal_code_field">Postal Code</label>
              <input
                type="text"
                id="postal_code_field"
                className="form-control"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                placeholder="Pincode"
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="country_field">Country</label>
              <select
                id="country_field"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                {countriesList.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn btn-block btn-success py-2 font-weight-bold w-100"
            >
              Continue to Confirm Order ➔
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Delivery;
