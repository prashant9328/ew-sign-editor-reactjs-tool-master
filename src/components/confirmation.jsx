import { hover } from '@testing-library/user-event/dist/hover';
import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";


const Confirmation = (props) => {
    const data =[
    'Account',
    'Contacts',
    'Account',
    'Contacts',
    'Account',
    'Contacts',
    'Account',
    'Contacts',
    'Account',
    'Contacts',
    'Account',
    'Contacts',
    'Account',
    'Contacts',
    'Account',
    'Contacts',
  ]

  const { writebackFields, updateFields, getContinueEventFromConfirmation, closePopup } = props;
  console.log("writebackFields",JSON.stringify(props.writebackFields));
  console.log("updateFields",JSON.stringify(props.updateFields));

    const sendEvent = ()=>{
        props.getContinueEventFromConfirmation(true);
    }
    const returnEvent = () =>{
      props.closePopup(false);
    }

    const [selectedPill,setSelectedPill]=useState('update')
    const [agreeToConditions,setAgreeToConditions]=useState(false)
    const toggleConditions=(e)=>{
      setAgreeToConditions(e)
      console.log(e)
    }
    const toggleAgreeToConditions=()=>{
      if(agreeToConditions==false){
        setAgreeToConditions(true);
      }
      if(agreeToConditions==true){
        setAgreeToConditions(false);
      }
    }

  return (
    <div className='inner-confirmationDiv'>
      <div className='return-btn'  onClick={()=>{returnEvent()}} ><RxCross2 />
      </div>
        <h3 >Accept Permissions</h3>
        <div className='salesforceFields' >
          {updateFields[0] &&
          
           (
            <div className='nestedSalesforceDiv'>
              <h4>Update from Salesforce</h4>
              <div className='nestedDataField' >
              {[...new Map(updateFields.map(i => [i.mappingField.apiName, i.mappingField.label])).values()].map(label => (
                                <span key={label}>{label}, </span>
                            ))}
              </div>
            </div>
          )
          }
            
          {writebackFields[0] && (
            <div className='nestedSalesforceDiv' >

<h4>Writeback to Salesforce</h4>
<div className='nestedDataField' >
{[...new Map(writebackFields.map(i => [i.mappingField.apiName, i.mappingField.label])).values()].map(label => (
                                <span key={label}>{label}, </span>
                            ))}

</div>
</div>
          )}
          {!writebackFields[0] && (
            <div style={{marginTop:'10px'}}>
              &nbsp;
            </div>
          )}
        </div>
        <div style={{marginBottom:'10vh',padding:'0px',marginLeft:'10px',alignContent:'center',alignItems:'center'}}>
        <div style={{display:'flex'}}>
          <div style={{margin:'auto'}}>

        <input style={{scale:'1',margin:'0px 10px 0px 10px',alignSelf:'center'}} type="checkbox" name="accept" id="accept" onChange={(e)=>toggleAgreeToConditions(e.target.value)}  />
          </div>

        <div>
        <label style={{fontSize:'smaller',color:'#5d6166'}} htmlFor="accept">Are you sure you want to proceed? This action will update or write back sensitive data of above mentioned fields. Please confirm before continuing.</label>
        </div>
        </div>
       </div>
        <div className='salesforce-Buttons' onClick={agreeToConditions?()=>{sendEvent()}:''} >
        
          <div className={agreeToConditions?'confirm-Button':'confirm-Button-disabled'}>

          CONFIRM
          </div>
        </div>
        
    </div>
  )
}

export default Confirmation