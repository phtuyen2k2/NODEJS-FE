import React from 'react'
import { WrapperInputStyle } from './style'

const InputForm = (props) => {
    const { placeholder = 'Nhập thông tin', ...rests } = props
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    return (
        <WrapperInputStyle placeholder={placeholder} value={props.value} {...rests} onChange={handleOnchangeInput} />
    )
}

export default InputForm