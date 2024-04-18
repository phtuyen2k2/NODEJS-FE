import React, { useEffect, useRef, useState } from 'react';
import { WrapperHeader, WrapperUploadFile } from './style';
import { Button, Form, Select, Space } from 'antd';
import { PlusOutlined, DeleteFilled, EditFilled, SearchOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableCoponent';
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../until';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ rowSelected, setRowSelected ] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [ isPendingUpdate, setIsPendingUpdate ] = useState(false)
    const [ typeSelect, setTypeSelect ] = useState('')
    const [ isModalDeleta, setIsModalDelete ] = useState(false)
    const searchInput = useRef(null);

    const user = useSelector((state) => state?.user)
    const [ stateProduct, setStateProduct] = useState({
        name: '', 
        imgae: '', 
        type: '', 
        price: '', 
        countInStock: '', 
        rating: '', 
        description: '',
        newType: '',

    })
    const [ stateProductDetails, setStateProductDetails] = useState({
        name: '', 
        imgae: '', 
        type: '', 
        price: '', 
        countInStock: '', 
        rating: '', 
        description: '',
    })

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
          const { name,
            price,
            description,
            rating,
            imgae,
            type,
            countInStock } = data
         const res =ProductService.createProduct({
            name,
            price,
            description,
            rating,
            imgae,
            type,
            countInStock,
          })
          return res
        }
    )

    const mutationUpdate = useMutationHooks(
      (data) => {
        const { id,
          token,
          ...rests } = data
       const res =ProductService.updateProduct(
        id,
        token,
        { ...rests },
        )
        return res
      },
  )

  const mutationDelete = useMutationHooks(
    (data) => {
      const { id,
        token,} = data
     const res =ProductService.deleteProduct(
      id,
      token,
      )
      return res
    },
  )

//   const mutationDeleteAll = useMutationHooks(
//     (data) => {
//       const { token, ...ids
//       } = data
//       const res = ProductService.deleteAllProduct(
//         ids,
//         token)
//       return res
//     },
// )
//console.log('mutationDeleteAll', mutationDeleteAll);

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
       if(res?.data){
        setStateProductDetails({
          name: res?.data?.name, 
          imgae: res?.data?.imgae, 
          type: res?.data?.type, 
          price: res?.data?.price, 
          countInStock: res?.data?.countInStock, 
          rating: res?.data?.rating, 
          description: res?.data?.description,  
        })
       }
       setIsPendingUpdate(false)
      }

      useEffect(() => {
          form.setFieldsValue(stateProductDetails);
      }, [form, stateProductDetails]);

      useEffect(() => {
        if(rowSelected){
          setIsPendingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
        }
      }, [rowSelected])
     
      const handleDetailsProduct = () => {
            setIsOpenDrawer(true)
      }
    
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
           return res
    }

    //     useEffect(() => {
    //   if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
    //     message.success()
    //   } else if (isErrorDeletedMany) {
    //     message.error()
    //   }
    // })

    // const handleDeleteAllProducts = (ids) => {
    //   mutationDeleteAll.mutate({ ids: ids, token: user?.access_token }, {
    //     onSettled: () => {
    //       queryProduct.refetch()
    //     }
    //   })
    // }
      
    const { data, isPending, isSuccess, isError } = mutation   
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate 
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete  
    //const { data: dataDeletedMany, isLoading: isPendingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeleteAll  
    
    
    const queryProduct = useQuery({
      queryKey: ['products'],
      queryFn: getAllProducts,
    })

    const fetchAllTypeProduct = async () => {
      const res = await ProductService.getAllTypeProduct()
      return res
    }

    const typeProduct = useQuery({
      queryKey: ['type-product'],
      queryFn: fetchAllTypeProduct,
    })
    console.log('typeProduct', typeProduct);

    const {  isPending: isPendingProducts, data: products } = queryProduct

    const renderAction = () => {
        return (
            <div>
                <EditFilled style={{color: 'rgb(37, 129, 128)', fontSize: '20px', cursor: 'pointer'}} onClick={handleDetailsProduct}/>
                <DeleteFilled style={{color: 'red', fontSize: '20px', cursor: 'pointer'}} onClick={() => setIsModalDelete(true)}/>
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      //setSearchText(selectedKeys[0]);
      //setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      //setSearchText('');
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
      // render: (text) =>
      //   searchedColumn === dataIndex ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: '#ffc069',
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ''}
      //     />
      //   ) : (
      //     text
      //   ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps("name")
        },
        {
            title: 'Type',
            dataIndex: 'type',
            //sorter: (a, b) => a.price - b.price,
            ...getColumnSearchProps("name")
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
              {
                text: '>=50',
                value: '>=',
              },
              {
                text: '<=50',
                value: '<=',
              },
            ],
            onFilter: (value, record) => {
              if(value === '>='){
                return record.price >= 50
              }
              return record.price <= 50
            },
          },
        {
            title: 'Count InStock',
            dataIndex: 'countInStock',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
              {
                text: '>= 2.5',
                value: '>=',
              },
              {
                text: '<= 2.5',
                value: '<=',
              },
            ],
            onFilter: (value, record) => {
              if(value === '>='){
                return Number(record.rating) >= 2.5
              }
              return Number(record.rating) <= 2.5
            },
        },
        // {
        //     title: 'Description',
        //     dataIndex: 'description',
        // },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id };
    });
    
    useEffect(() => {
      if (isSuccess && data?.status === 'OK') {
        message.success()
        handleCancel()
      } else if (isError) {
        message.error()
      }
    }, [isSuccess])

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

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '', 
            imgae: '', 
            type: '', 
            price: '', 
            countInStock: '', 
            rating: '', 
            description: '',
        })
        form.resetFields()
    };

    const handleDelete = () => {
      setIsModalDelete(false);
    }

    const handleDeleteProduct = () => {
      mutationDelete.mutate({id: rowSelected, token: user?.access_token}, {
        onSettled: () => {
          queryProduct.refetch();
        }
      })
    }

    const handleCloseDrawer = () => {
      setIsOpenDrawer(false);
      setStateProductDetails({
          name: '', 
          imgae: '', 
          type: '', 
          price: '', 
          countInStock: '', 
          rating: '', 
          description: '',
      })
      form.resetFields()
  };

    // const onFinish = () => {
    //     mutation.mutate(stateProduct, {
    //       onSettled: () => {
    //         queryProduct.refetch()
    //     }
    //     })
    // }
    const onFinish = () => {
      const params = {
        name: stateProduct.name,
        price: stateProduct.price,
        description: stateProduct.description,
        rating: stateProduct.rating,
        imgae: stateProduct.imgae,
        type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
        countInStock: stateProduct.countInStock,
      }
      mutation.mutate(params, {
        onSettled: () => {
          queryProduct.refetch()
        }
      })
    }

    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name] : e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
          ...stateProductDetails,
          [e.target.name]: e.target.value
        })
      }    
    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setStateProduct({
            ...stateProduct,
             imgae: file.preview
        })
    }
    const handleOnchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setStateProductDetails({
            ...stateProductDetails,
             imgae: file.preview
        })
    }

    const onUpdateProduct = () => {
      mutationUpdate.mutate({id: rowSelected, token: user.access_token, ...stateProductDetails}, {
        onSettled: () => {
          queryProduct.refetch()
      }
      })
    }

    // const handleChangeSelect = (value) => {
    //   setStateProduct({
    //     ...stateProduct,
    //     type: value
    //   })
    // }
    const handleChangeSelect = (value) => {
        setStateProduct({
          ...stateProduct,
          type: value
      })
    }
    //console.log('value = {stateProduct.type}', stateProduct);

    return (
        <div style={{ marginTop: '20px' }}>
            <WrapperHeader>QUẢN LÝ SẢN PHẨM</WrapperHeader>
            <div>
            <Button style={{height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{fontSize: '60px'}}/></Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns = {columns} isPending = {isPendingProducts} data = {dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event =>{
                            setRowSelected(record._id)
                        }
                    };
                }}/>
            </div>

            <ModalComponent forceRender title="Thêm sản phẩm mới" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isPending ={isPending}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form = {form}
                    >
                        <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                        <InputComponent value={stateProduct.name} onChange={handleOnChange} name= "name"/>
                        </Form.Item>

                         <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                          >
                            <Select
                              name="type"
                              // defaultValue="lucy"
                              // style={{ width: 120 }}
                              value={stateProduct.type}
                              onChange={handleChangeSelect}
                              options={renderOptions(typeProduct?.data?.data)}
                              />
                          </Form.Item>
                          {stateProduct.type === 'add_type' && (
                            <Form.Item
                              label='New type'
                              name="newType"
                              rules={[{ required: true, message: 'Please input your type!' }]}
                            >
                              <InputComponent value={stateProduct.newType} onChange={handleOnChange} name="newType" />
                            </Form.Item>
                          )}

                        <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                        <InputComponent value={stateProduct.price} onChange={handleOnChange} name= "price"/>
                        </Form.Item>

                        <Form.Item
                        label="Count In Stock"
                        name="countInStock"
                        rules={[{ required: true, message: 'Please input your countInStock!' }]}
                        >
                        <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name= "countInStock"/>
                        </Form.Item>

                        <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'Please input your rating!' }]}
                        >
                        <InputComponent value={stateProduct.rating} onChange={handleOnChange} name= "rating"/>
                        </Form.Item>

                        <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input your description!' }]}
                        >
                        <InputComponent value={stateProduct.description} onChange={handleOnChange} name= "description"/>
                        </Form.Item>

                        <Form.Item
                        label="Imgae"
                        name="imgae"
                        rules={[{ required: true, message: 'Please input your imgae!' }]}
                        >
                        {/* <InputComponent value={stateProduct.imgae} onChange={handleOnChange} name= "imgae"/> */}
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button>Upload File</Button>
                            {stateProduct?.imgae && (
                                <img src={stateProduct?.imgae} style={{
                                    height: '60px',
                                    width: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginLeft: '20px',
                                }} alt="imgae"/>
                            )}
                        </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>

            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="60%">
              <Loading isPending ={isPendingUpdate || isPendingUpdated}>

                <Form
                  name="basic"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  onFinish={onUpdateProduct}
                  autoComplete="on"
                  form={form}
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                    <InputComponent value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name" />
                  </Form.Item>

                  <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please input your type!' }]}
                  >
                    <InputComponent value={stateProductDetails['type']} onChange={handleOnchangeDetails} name="type" />
                  </Form.Item>

                  <Form.Item
                    label="Count inStock"
                    name="countInStock"
                    rules={[{ required: true, message: 'Please input your count inStock!' }]}
                  >
                    <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
                  </Form.Item>

                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input your count price!' }]}
                  >
                    <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
                  </Form.Item>

                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input your count description!' }]}
                  >
                    <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
                  </Form.Item>

                  <Form.Item
                    label="Rating"
                    name="rating"
                    rules={[{ required: true, message: 'Please input your count rating!' }]}
                  >
                    <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
                  </Form.Item>
              
                  <Form.Item
                    label="Imgae"
                    name="imgae"
                    rules={[{ required: true, message: 'Please input your count imgae!' }]}
                  >
                    <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                      <Button >Update File</Button>
                      {stateProductDetails?.imgae && (
                        <img src={stateProductDetails?.imgae} style={{
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

            <ModalComponent title="Xóa sản phẩm" open={isModalDeleta} onCancel={handleDelete} onOk={handleDeleteProduct}>
                <Loading isPending ={isPendingDeleted}>
                    <div>KHÔNG CÓ PHÉP THUẬT ĐỂ QUAY NGƯỢC THỜI GIAN NHA?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct