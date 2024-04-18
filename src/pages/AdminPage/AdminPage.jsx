import React, { useState } from 'react';
import { Menu } from 'antd';
import { getItem } from '../../until';
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const AdminPage = () => {
    const items = [
        getItem('USER', 'user', <UserOutlined />),
        getItem('PRODUCT', 'product', <AppstoreOutlined />)
    ]

const [keySelected, setKeySelected] = useState('');

const renderPage = (key) => {
    switch (key) {
      case 'user':
        return (
          <AdminUser />
        )
      case 'product':
        return (
          <AdminProduct />
        )
      default:
        return <></>
    }
  }

const handleOnCLick = ({ key }) => {
setKeySelected(key)
}
console.log('keySelected',keySelected);

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex', overflowX: 'hidden' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh'
                      }}
                    items={items}
                    onClick={handleOnCLick}
                    />
                <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    );
}

export default AdminPage