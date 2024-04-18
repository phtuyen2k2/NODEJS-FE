import React from "react";
import { StyleNameProduct, WrapperReportText, WrapperPriceText, WrapperDiscountText, WrapperCardStyle, WrapperStyleTextSell } from "./style";
import { StarFilled} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../until";
 
const CardComponent = (props) => {
    const { countInStock, description, imgae, name, price, rating, type, discount, sale, id} = props
    const navigate = useNavigate()
    const handleDetailsProduct = () => {
        navigate(`/product-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            styles={{ header: { width: '200px', height: '200px' }, body: { padding: '10px' } }}
            style={{ width: 200 }}
            cover={<img alt="example" src={imgae}/>}
            onClick={() => handleDetailsProduct(id)}
        >
            {/* <img
                src={logo}
                style={{
                    width: '68px',
                    height: '14px',
                    position: 'absolute',
                    top: -1,
                    left: -1, 
                    borderTopLeftRadius: '3px'
                }}
            /> */}
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{marginRight: '4px'}}>
                     <span>{rating}</span><StarFilled  style={{ fontSize: '12px', color: 'rgb(253, 216, 54)'}}/>
                </span>
                <WrapperStyleTextSell> | Đã bán {sale || 1000}</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{marginRight: '8px'}}>{convertPrice(price)}</span>
                <WrapperDiscountText>
                - {discount || 5} %
                </WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent