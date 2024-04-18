import React from 'react';
import { Row, Col, Image, Rate} from 'antd';
//import ImageProduct from '../../assets/img/imgPro1.png';
import { WrapperStyleImageSmall, 
    WrapperStyleColImage, 
    WrapperStyleNameProduct, 
    WrapperStyleTextSell, 
    WrapperPriceProduct, 
    WrapperPriceTextProduct,
    WrapperAddressProduct,
    WrapperQualityProduct,
    WrapperInputNumber, } from './style';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct } from '../../redux/slices/orderSilce';
import { useDispatch } from 'react-redux'
import { convertPrice } from '../../until';

const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const order = useSelector((state) => state.order)
    const [errorLimitOrder,setErrorLimitOrder] = useState(false)

    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if(id) {
            const res = await ProductService.getDetailsProduct(id)
                return res.data
        }
    }
    
    const { isPending, data: productDetail } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled: !!idProduct
    });
    console.log('productDetail', productDetail, user);
    const handleAddOrderProduct = () => {
        if(!user?.id) {
            navigate('/sign-in', {state: location?.pathname})
        }
        else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetail?._id)
            if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetail?.countInStock > 0)) {
             dispatch(addOrderProduct({
                orderItem: {
                     name: productDetail?.name,
                     amount: numProduct,
                     imgae: productDetail?.imgae,
                     price: productDetail?.price,
                     product: productDetail?._id
                }
            }))
         } 
        // else {
        //     setErrorLimitOrder(true)
        // }
    }
    }

    const handleChangeCount = (type) => {
        if(type === 'increase') {
            setNumProduct(numProduct + 1)
        }else {
            setNumProduct(numProduct - 1)
        }
    }

    return (
        <Loading isPending={isPending}>
        <Row style={{ padding: '16px', background: '#fff', borserRadius: '4px'}}>
            <Col span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight: '8px'}}>
                <Image src={ productDetail?.imgae} alt="Imgae Product" preview ={false}/>
            </Col>
            <Col span={14} style={{paddingLeft: '10px'}}>
                <WrapperStyleNameProduct> { productDetail?.name} </WrapperStyleNameProduct>
                <div style={{padding: '5px'}}>
                <Rate allowHalf defaultValue={productDetail?.rating} value={productDetail?.rating} />
                    <WrapperStyleTextSell> | Đã bán 50+</WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>{convertPrice(productDetail?.price)}</WrapperPriceTextProduct>
                </WrapperPriceProduct>
                <WrapperAddressProduct>
                    <span style={{padding: '5px'}}>Giao đến: </span>
                    <span className='address'> { `${user?.address}`} </span> - 
                </WrapperAddressProduct>
                <div style={{margin: '10px 0 20px', padding: '10px 5px', borderTop: '1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5'}}>
                    <div style={{marginBottom: '10px', padding: '5px'}}>Số lượng</div>
                    <WrapperQualityProduct>
                        <button style={{border: 'none', background: 'transparent', cursor:'pointer'}} onClick={() => handleChangeCount('decrease')}>
                            <MinusOutlined style={{color: '#000', fontSize: '20px'}}/>
                        </button>
                        <WrapperInputNumber onChange={onChange} defaultValue={1} value={numProduct} size="small" />
                        <button style={{border: 'none', background: 'transparent', cursor:'pointer'}} onClick={() => handleChangeCount('increase')}>
                            <PlusOutlined style={{color: '#000', fontSize: '20px'}} />
                        </button>
                    </WrapperQualityProduct>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '5px'}}>
                    <ButtonComponent
                        size= {40} 
                        styleButton={{
                            background: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '220px',
                            border: 'none',
                            borderRadius: '4px',
                            }}
                        onClick={handleAddOrderProduct}
                        textButton = {"Chọn mua"} 
                        styleTextButton = {{color: '#fff', fontSize: '15px', fontWeight: '600'}}
                    ></ButtonComponent>
                    {/* <ButtonComponent
                        border={false}
                        size= {40} 
                        styleButton={{
                            background: '#fff',
                            height: '48px',
                            width: '220px',
                            border: '1px solid rbg(13, 92, 182)',
                            borderRadius: '4px',
                            }} 
                        textButton = {"Mua trả sau"} 
                        styleTextButton = {{color: 'rbg(13, 92, 182)', fontSize: '15px'}}
                    ></ButtonComponent> */}
                </div>
            </Col>
        </Row>
        </Loading>
    )
}

export default ProductDetailsComponent