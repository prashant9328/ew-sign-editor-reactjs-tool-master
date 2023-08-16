import React, { useState } from 'react';
import Select from 'react-select';

const CustomSelect = ({value, defaultValue, options, name, onChange, useFor = "SIGNATORY"}) => {
  const [isClearable, setIsClearable] = useState(false);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [valueColor, setValueColor] = useState('black');

  const customStyles = useFor === "SIGNATORY" ? {
      singleValue: (provided, state) => ({
        ...provided,
        color: `${valueColor}`,           
      }),      
      control: (provided) => ({
        ...provided,            
        backgroundColor: `${value.toolColor}`,
        fontSize: '14px', 
        cursor: 'pointer',
        fontFamily: 'Arial'                    
      }),          
      option: (provided, state) => ({
        ...provided,             
        backgroundColor: `${options[state.data.index].toolColor}`,
        marginTop: state.data.index === 0 ? '-3px' : '0px',
        marginBottom:  state.data.index === options.length - 1 ? '-3px' : '0px',             
        border: '0.1px solid black',
        borderRadius: '3px',
        padding: '8px',     
        boxShadow: state.isSelected ? '0 2px 4px #2684ff' :'0 2px 4px rgba(0, 0, 0, 0.1)',    
        color: "black",
        cursor: 'pointer',                                       
      }),
      dropdownIndicator: (provided) => ({
        ...provided,            
        color: `${valueColor}`,
        cursor: 'pointer'                     
      })                
    
  } : {};

  return (
    <>
      <Select
        styles={customStyles}
        defaultValue={options[0]}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name={name}
        onFocus={()=> {setValueColor('#919191');}}
        onBlur={() => {setValueColor('black');}}
        options={options}
        onChange={(e) => {
          onChange(e);
        }}
        value={value}
      />
    </>
  );
};

export default CustomSelect;