import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/Axios";
import { BASE_URL } from "../../utils/urls";

const OwnerVendorDetail = () => {
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    axiosInstance.get(BASE_URL + "/user/");
  }, []);
  return <div></div>;
};

export default OwnerVendorDetail;
