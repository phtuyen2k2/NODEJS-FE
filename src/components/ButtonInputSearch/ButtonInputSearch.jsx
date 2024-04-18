import React from "react";
import InputComponent from "../InputComponent/InputComponent";

const   ButtonInputSearch = (props) => {
    const { 
        size, placeholder, bordered, 
        backgroundColorInput = "#fff",   
    } = props
    return (
        <div style={{display: 'flex'}}>
            <InputComponent
                size= {size} 
                placeholder={placeholder} 
                bordered={bordered} 
                style={{backgroundColor: backgroundColorInput}}
                {...props}
            />
            
        </div>
    );
}

export default ButtonInputSearch