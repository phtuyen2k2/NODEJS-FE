import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllProduct = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`http://localhost:3001/api/product/get-all-product?filter=name&filter=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`http://localhost:3001/api/product/get-all-product?limit=${limit}`)
    }
    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/product/create-product`, data)
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/product/get-details-product/${id}`)
    return res.data
}

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`http://localhost:3001/api/product/update-product/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`http://localhost:3001/api/product/delete-product/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteAllProduct = async (data, access_token,) => {
    const res = await axiosJWT.post(`http://localhost:3001/api/product/delete-all-product`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`http://localhost:3001/api/product/get-all-type`)
    return res.data
}

export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`http://localhost:3001/api/product/get-all-product?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    }
}