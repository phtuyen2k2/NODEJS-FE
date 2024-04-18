import React, { useState } from 'react';
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ImageLogo from '../../assets/img/login.jpg';
import { Image } from 'antd'; 
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useEffect } from 'react';

const SignUpPage = () => {
const navigate = useNavigate()

const [isShowPassword, setIsShowPassword] = useState(false)
const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')

const handleOnchangeEmail = (value) => {
    setEmail(value)
}

const mutation = useMutationHooks(
    data => UserService.signupUser(data)
)

const { data, isPending, isSuccess, isError } = mutation

useEffect(() => {
    if (isSuccess) {
      message.success()
      handleNavigateSignIn()
    } else if (isError) {
      message.error()
    }
  })
  

const handleOnchangePassword = (value) => {
    setPassword(value)
}

const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
}

const handleNavigateSignIn = () => {
        navigate('/sign-in')
}

const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword })
    console.log('sign-up', email, password, confirmPassword);
}

return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh'}}>
        <div style={{width: '800px', height: '445px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex'}}>
            <WrapperContainerLeft>
                <p>Đăng ký tài khoản</p>
                <InputForm style={{marginBottom: '10px'}} placeholder = "abc@gmail.com" 
                    value={email} onChange = {handleOnchangeEmail}/>
                <div style={{position: 'relative'}}>
                        <span
                        onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px',
                        
                            }}
                        >{
                            isShowPassword ? (
                                <EyeOutlined />
                            ) : (
                            <EyeInvisibleOutlined />
                            )
                        }
                        </span>
                        <InputForm placeholder = "Password" style={{marginBottom: '10px'}} type={isShowPassword ? "text" : "Password"} 
                            value={password} onChange = {handleOnchangePassword}/>
                    </div>
                    <div style={{position: 'relative'}}>
                        <span
                         onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px',
                        
                            }}
                        >{
                            isShowConfirmPassword ? (
                                <EyeOutlined />
                            ) : (
                            <EyeInvisibleOutlined />
                            )
                        }
                        </span>
                        <InputForm placeholder = "Confirm Password" type={isShowConfirmPassword ? "text" : "Password"} 
                            value={confirmPassword} onChange = {handleOnchangeConfirmPassword}/>
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isPending={isPending}>
                        <ButtonComponent
                            onClick={handleSignUp}
                            disabled={!email.length || !password.length || !confirmPassword.length}
                                size= {40} 
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '100%',
                                    border: 'none',
                                    borderRadius: '4px',
                                    margin: '26px 0 10px',
                                    }} 
                                textButton = {"Đăng ký"} 
                                styleTextButton = {{color: '#fff', fontSize: '15px', fontWeight: '600'}}
                        ></ButtonComponent>
                    </Loading>
                    <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight></p>
            </WrapperContainerLeft>
            <WrapperContainerRight>
                <Image src = {ImageLogo} preview = {false} alt = "img-logo" height= '200px' width= '213px'/>          
            </WrapperContainerRight>
        </div>
    </div>
    );
}

export default SignUpPage