import React from "react";
import { Checkbox, Rate } from 'antd';
import { WrapperLableText, WrapperTextValue, WrapperContent, WrapperTextPrice } from "./style";

export const NavbarComponent = () => {
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                        return (
                            <WrapperTextValue>{option}</WrapperTextValue>
                        )
                })
            case 'checkbox':
            return (
                <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                    {options.map((option) => {
                        return (
                            <Checkbox style={{ marginLeft: 0}} value={option.value}>{option.lable}</Checkbox>
                        )
                    })}
                    <Checkbox value="B">B</Checkbox>
                </Checkbox.Group>
            )
            case 'star':
            return options.map((option) => {
                console.log("check", option)
                        return (
                            <div style={{display: 'flex', gap: '4px'}}>
                            <Rate style={{fontSize: '12px'}} disabled defaultValue={option} />
                            <span>{`từ ${option} sao`}</span>
                            </div>
                        )
                    })
                    case 'price':
                        return options.map((option) => {
                                    return (
                                        <WrapperTextPrice>{option}</WrapperTextPrice>
                                    )
                                })        
            default:
                return {}    
        }
    }

    return (
            <div>
                <WrapperLableText> DANH MỤC </WrapperLableText>
                <WrapperContent>
                    {renderContent( 'text', ['ACCESSORIES', 'APPAREL', 'MUSIC'])}
                </WrapperContent>
                {/* <WrapperContent>
                    {renderContent( 'checkbox', [
                            { value: 'a', lable: 'A',},
                            { value: 'b', lable: 'B',}
                        ])}
                </WrapperContent>
                <WrapperContent>
                    {renderContent( 'star', [3, 4, 5])}
                </WrapperContent>
                <WrapperContent>
                    {renderContent( 'price', ['dưới 500.000đ', 'trên 1.000.000đ'])}
                </WrapperContent> */}
        </div>
    )
}

export default NavbarComponent