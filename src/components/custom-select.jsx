import React, { useState } from 'react';
import Select from 'react-select';

const CustomSelect = ({value, defaultValue, options, name, type, onChange, color}) => {
  const [isClearable, setIsClearable] = useState(false);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  return (
    <>
      <Select
        styles={{          
          singleValue: (provided, state) => ({
            ...provided,
            color: `black`,           
          }),      
          control: (provided) => ({
            ...provided,
            backgroundColor: `${color}`,
            fontSize: '19px',                      
          }),          
          option: (provided, state) => ({
            ...provided,             
            backgroundColor: `${options[state.data.index].toolColor}`,
            marginTop: state.data.index === 0 ? '-3px' : '0px',
            marginBottom:  state.data.index === options.length - 1 ? '-3px' : '0px',             
            border: state.isSelected? '2.5px groove  #2684ff':'0.1px solid black',
            borderRadius: '3px',
            padding: '8px',     
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',    
            color: "black"            
          }),
          dropdownIndicator: (provided) => ({
            ...provided,            
            color: 'black'
          })          
        }}
        defaultValue={options[0]}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name={name}
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