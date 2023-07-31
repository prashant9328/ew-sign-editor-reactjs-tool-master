import React, { useState } from 'react';
import Select from 'react-select';

const CustomSelect = ({value, defaultValue, options, name, type, onChange, color}) => {
  const [isClearable, setIsClearable] = useState(false);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [valueColor, setValueColor] = useState('black');

  return (
    <>
      <Select
        styles={{          
          singleValue: (provided, state) => ({
            ...provided,
            color: `${valueColor}`,           
          }),      
          control: (provided) => ({
            ...provided,
            backgroundColor: `${color}`,
            fontSize: '14px', 
            cursor: 'pointer',
            fontFamily: 'Arial'                    
          }),          
          option: (provided, state) => ({
            ...provided,             
            backgroundColor: `${options[state.data.index].toolColor}`,
            marginTop: state.data.index === 0 ? '-3px' : '0px',
            marginBottom:  state.data.index === options.length - 1 ? '-3px' : '0px',             
            // border: state.isSelected ? '2.5px groove  #2684ff':'0.1px solid black',
            border: '0.1px solid black',
            borderRadius: '3px',
            padding: '8px',     
            // boxShadow: state.isSelected ? '0 2px 4px #2684ff' : '0 2px 4px rgba(0, 0, 0, 0.1)',    
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',    
            color: "black",
            cursor: 'pointer'                                
          }),
          dropdownIndicator: (provided) => ({
            ...provided,            
            color: `${valueColor}`,
            cursor: 'pointer'                     
          }),
          SelectContainer: (provided, state) => ({
            ...provided,
            color : 'red'
          })          
        }}
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
          onChange(type, e);
        }}
        value={value}
      />
    </>
  );
};

export default CustomSelect;