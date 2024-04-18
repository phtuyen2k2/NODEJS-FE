import React, { useEffect, useRef, useState } from 'react';
import { WrapperHeader, WrapperUploadFile } from './style';
import { Button, Form, Space } from 'antd';
import { DeleteFilled, EditFilled, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableCoponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import Loading from '../LoadingComponent/Loading';
import { getBase64 } from '../../until';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query';
import * as message from '../../components/Message/Message';
import * as UserService from '../../services/UserService';

const AdminUser = () => {
    const [ rowSelected, setRowSelected ] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [ isPendingUpdate, setIsPendingUpdate ] = useState(false)
    const [ isModalDeleta, setIsModalDelete ] = useState(false)
    const searchInput = useRef(null);

    const user = useSelector((state) => state?.user)

    const [ stateUserDetails, setStateUserDetails] = useState({
        name: '', 
        email: '', 
        isAdmin: false, 
        avatar: '', 
        address: '',  
    })

    const [form] = Form.useForm();

    const mutationUpdate = useMutationHooks(
      (data) => {
        const { id,
          token,
          ...rests } = data
       const res =UserService.updateUser(
        id,
        { ...rests },
        token,
        )
        return res
      },
  )

  const mutationDelete = useMutationHooks(
    (data) => {
      const { id,
        token,} = data
     const res =UserService.deleteUser(
      id,
      token,
      )
      return res
    },
)

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
       if(res?.data){
        setStateUserDetails({
          name: res?.data?.name, 
          email: res?.data?.email, 
          phone: res?.data?.phone, 
          address: res?.data?.address, 
          avatar: res?.data?.avatar, 
          isAdmin: res?.data?.isAdmin, 
        })
       }
       setIsPendingUpdate(false)
      }

      useEffect(() => {
          form.setFieldsValue(stateUserDetails);
      }, [form, stateUserDetails]);

      useEffect(() => {
        if(rowSelected){
          setIsPendingUpdate(true)
          fetchGetDetailsUser(rowSelected)
        }
      }, [rowSelected])
     
      const handleDetailsProduct = () => {
            setIsOpenDrawer(true)
      }
    
    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token)
        console.log('res', res);
        return res
    }

      
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate 
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete    
    
    const queryUser = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    })
    const {  isPending: isPendingUsers, data: users } = queryUser

    // const renderAction = () => {
    //     return (
    //         <div>
    //             <EditFilled style={{color: 'rgb(37, 129, 128)', fontSize: '20px', cursor: 'pointer'}} onClick={handleDetailsProduct}/>
    //             <DeleteFilled style={{color: 'red', fontSize: '20px', cursor: 'pointer'}} onClick={() => setIsModalDelete(true)}/>
    //         </div>
    //     )
    // }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
    };
    const handleReset = (clearFilters) => {
      clearFilters();
    }

    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <InputComponent
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                widows: 90,
              }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            //render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps("name")
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps("email")
        },
        {
          title: 'Address',
          dataIndex: 'address',
          sorter: (a, b) => a.address.length - b.address.length,
          ...getColumnSearchProps("address")
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                  text: 'True',
                  value: true,
                },
                {
                  text: 'False',
                  value: false,
                },
              ],
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps("phone")
        },
        // {
        //     title: 'Action',
        //     dataIndex: 'action',
        //     render: renderAction,
        // },
    ];

    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin? 'True' : 'False' };
    });

    useEffect(() => {
      if (isSuccessUpdated && dataUpdated?.status === 'OK') {
        message.success()
        handleCloseDrawer()
      } else if (isErrorUpdated) {
        message.error()
      }
    }, [isSuccessUpdated])

    useEffect(() => {
      if (isSuccessDeleted && dataDeleted?.status === 'OK') {
        message.success()
        handleDelete()
      } else if (isErrorDeleted) {
        message.error()
      }
    }, [isSuccessDeleted])

    const handleDelete = () => {
      setIsModalDelete(false);
    }

    const handleDeleteUser = () => {
      mutationDelete.mutate({id: rowSelected, token: user?.access_token}, {
        onSettled: () => {
          queryUser.refetch();
        }
      })
    }

    const handleCloseDrawer = () => {
      setIsOpenDrawer(false);
      setStateUserDetails({
        name: '', 
        email: '', 
        phone: '', 
        isAdmin: false, 
      })
      form.resetFields()
  };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
          ...stateUserDetails,
          [e.target.name]: e.target.value
        })
      }    

    const handleOnchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setStateUserDetails({
            ...stateUserDetails,
             avatar: file.preview
        })
    }

    const onUpdateUser = () => {
      mutationUpdate.mutate({id: rowSelected, token: user.access_token, ...stateUserDetails}, {
        onSettled: () => {
          queryUser.refetch()
      }
      })
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <WrapperHeader>QUẢN LÝ USER</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns = {columns} isPending = {isPendingUsers} data = {dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event =>{
                            setRowSelected(record._id)
                        }
                    };
                }}/>
            </div>


            <DrawerComponent title='Chi tiết user' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="60%">
              <Loading isPending ={isPendingUpdate || isPendingUpdated}>

                <Form
                  name="basic"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  onFinish={onUpdateUser}
                  autoComplete="on"
                  form={form}
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                    <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                  >
                    <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
                  </Form.Item>

                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone!' }]}
                  >
                    <InputComponent value={stateUserDetails.countInStock} onChange={handleOnchangeDetails} name="phone" />
                  </Form.Item>

                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                  >
                    <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                  </Form.Item>

                  {/* <Form.Item
                    label="Admin"
                    name="isAdmin"
                    rules={[{ required: true, message: 'Please input your count admin!' }]}
                  >
                    <InputComponent value={stateUserDetails.isAdmin} onChange={handleOnchangeDetails} name="isAdmin" />
                  </Form.Item> */}

                  <Form.Item
                    label="Avatar"
                    name="avatar"
                    rules={[{ required: true, message: 'Please input your count avatar!' }]}
                  >
                    <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                      <Button >Update File</Button>
                      {stateUserDetails?.avatar && (
                        <img src={stateUserDetails?.avatar} style={{
                          height: '60px',
                          width: '60px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginLeft: '10px'
                        }} alt="avatar" />
                      )}
                    </WrapperUploadFile>
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  </Form.Item>
                </Form>

              </Loading>
            </DrawerComponent>

            <ModalComponent forceRender title="Xóa User" open={isModalDeleta} onCancel={handleDelete} onOk={handleDeleteUser}>
                <Loading isPending ={isPendingDeleted}>
                    <div>KHÔNG CÓ PHÉP THUẬT ĐỂ QUAY NGƯỢC THỜI GIAN NHA?</div>
                </Loading>
            </ModalComponent>
        </div>
    );
}

export default AdminUser