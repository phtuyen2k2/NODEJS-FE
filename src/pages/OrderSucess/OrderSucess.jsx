import React from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import Loading from '../../components/LoadingComponent/Loading';
import { orderContant } from '../../contant';
import { convertPrice } from '../../until';
import { useLocation } from 'react-router-dom';


const OrderSucess = () => {
  const location = useLocation()
  const {state} = location
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <Loading isPending={false}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h2 style={{margin: '0', padding: '10px'}}>Đặt thành công</h2>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức giao hàng</Lable>
                    <WrapperValue>
                      <span style={{color: '#ea8500', fontWeight: 'bold'}}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                    </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức thanh toán</Lable>

                  <WrapperValue>
                    {orderContant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder>
                      <div style={{width: '500px', display: 'flex', alignItems: 'center', gap: 4}}> 
                        <img src={order.imgae} style={{width: '80px', height: '90px', objectFit: 'cover'}}/>
                        <div style={{
                          width: 260,
                          overflow: 'hidden',
                          textOverflow:'ellipsis',
                          whiteSpace:'nowrap',
                        }}><b>{order?.name}</b></div>
                      </div>
                      <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span>
                          <span style={{ fontSize: '18px', color: '#242424' }}>Giá tiền: <b>{convertPrice(order?.price)}</b></span>
                        </span>
                        <span>
                          <span style={{ fontSize: '18px', color: '#242424' }}>Số lượng: <b>{order?.amount}</b></span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  )
                })}
              </WrapperItemOrderInfo>
              <div>
                <span style={{ fontSize: '20px', color: 'red', fontWeight: 'bold' }}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span>
              </div>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSucess