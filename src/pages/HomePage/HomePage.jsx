import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {WrapperTypeProduct, WrapperButtonMore, WrapperProducts} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from '../../assets/img/blackpink.jpg';
import slider2 from '../../assets/img/sd.jpg';
import slider3 from '../../assets/img/p.jpg';
import CardComponent from "../../components/CardComponent/CardComponent";
import {
    useQuery,
  } from '@tanstack/react-query'
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [limit, setLimit] = useState(6) 
    const [loading, setLoading] = useState(false)
    //const arr = ['Giay', 'Dep', 'Tu lanh', 'May giac']
    const [typeProducts, setTypeProducts] = useState([])
    
    const fetchProductAll = async (context) => {
        //console.log('context', context);
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
            return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if(res?.status === 'OK') {
          setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
      }, [])

    const {isPending, data: products, isPreviousData } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchProductAll,
        retry: 3, retryDelay: 1000,
        keepPreviousData: true        
    })
    //isPreviousData: giữ lại data cũ và mất đi và load thêm data mới

    //console.log('isPreviousData', products);

    return (
        <Loading isPending={isPending || loading}>
            <div style={{width: '1270px', margin: '0 auto'}}>
            <WrapperTypeProduct>
            {typeProducts.map((item) =>{
                return (
                    <TypeProduct key={item} name={item}/>
                )
            })}
            </WrapperTypeProduct>
            </div>
            <div className="body" style={{width: '100%', backgroundColor: '#efefefe'}}>
                <div id="container" style={{height: '1000px', width: '1270px', margin: '0 auto'}}>
                    <SliderComponent arrImages = {[slider1, slider2, slider3]} />
                    <WrapperProducts>
                        {products?.data?.map((product) => {
                        return (
                            <CardComponent 
                                key={product._id}
                                countInStock={product.countInStock}
                                description={product.description}
                                imgae={product.imgae}
                                name={product.name}
                                price={product.price}
                                rating={product.rating}
                                type={product.type}
                                sale={product.sale}
                                id = {product._id}
                            />
                        )
                    })}
                    </WrapperProducts>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                    <WrapperButtonMore 
                       textButton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline" styleButton={{
                        border: '1px solid rgb(37, 129, 128)', 
                        color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(37, 129, 128)'}`,
                        width: '240px', height: '38px', borderRadius: '4px'
                    }}
                    disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                    styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
                    onClick={() => setLimit((prev) => prev + 6)}
                    />
                    </div>
                </div>
            </div>
            
        </Loading>
    )
}

export default HomePage