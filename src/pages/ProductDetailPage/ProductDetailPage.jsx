import React from 'react';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    return (
        <div style={{ padding: '0 120px', background: '#efefef',height: '1000px'}}>
            <div style={{ width: '1270px', height: '100%', margin: '0 auto' }}>
            <h2 style={{margin: '0', padding: '10px'}}><span style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() => {navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm</h2>
            <ProductDetailsComponent idProduct={id} />
            </div>
        </div>
    );
}

export default ProductDetailPage