import { axiosJWT } from "./UserService"

export const createOrder = async (data,access_token) => {
  const res = await axiosJWT.post(`http://localhost:3001/api/order/create`, data, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}