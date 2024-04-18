import React from 'react';
import { Button } from 'antd';

const ButtonComponent = ({ size, styleButton, styleTextButton, textButton, disabled, ...rest}) => {
    return (
        <Button 
                style={{
                    ...styleButton,
                    background: disabled ? '#ccc' : styleButton.background
                }}
                size= {size} 
                {...rest}
                //icon={<SearchOutlined color = {colorButton} style={{color: colorButton}}/>}
            >
                <span style={styleTextButton}>{textButton}</span>
        </Button>
    )
}

export default ButtonComponent