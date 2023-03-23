import * as React from "react";
import {RiBallPenLine, RiSuitcaseLine} from 'react-icons/ri'
import {BsCalendar2Date, BsTextareaT, BsCheck2Square, BsBuildings} from 'react-icons/bs'
import {BiUser} from 'react-icons/bi'
import {MdOutlineAlternateEmail, MdDelete} from 'react-icons/md'
import SignDragTool from '../components/sign-drag-tool'
import TextDragTool from '../components/text-drag-tool'
import ProgressIndicator from '../components/progress-indicator' 
import CustomSelect from '../components/custom-select' 


export default function Home() {
  // Temporary 
  const [options, setOptions] = React.useState([
    {value: "sudip", label: "Sudip"}, 
    {value: "krunal", label: "Krunal"}, 
    {value: "haresh", label: "Haresh"}, 
    {value: "jayant", label: "Jayant"}, 
    ]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(true);
  const [isFileShared, setIsFileShared] = React.useState(false);
  const [isToolSelectionMode, setIsToolSelectionMode] = React.useState(false);  
  const [selectedElement, setSelectedElement] = React.useState({});  

  const [serverURL, setServerURL] = React.useState('http://winsrv.eruditeworks.com/EwSignApi');
  const urlWithParams = window.location.href;
  const [uuid, setuuid] = React.useState(urlWithParams.slice(urlWithParams.indexOf('?')+1).split('&')[0].split('=')[1]);
  const [uuid_template_instance, setuuid_template_instance] = React.useState(urlWithParams.slice(urlWithParams.indexOf('?')+1).split('&')[1].split('=')[1]);

  const [activePage, setActivePage] = React.useState(0);
  const [imgLst, setImgLst] = React.useState([
    'https://cdn.glitch.global/5790e45e-8028-494f-9443-fac72a396419/Signature_Image.jpg?v=1676700133928',
  ]);
  const [img, setImg] = React.useState(null);

  // SIGNATURE TOOL
  const [signEleCount, setSignEleCount] = React.useState(0);
  const [signElems, setSignElems] = React.useState([]);
  

  // Text Tool
  const [textEleCount, setTextEleCount] = React.useState(0);
  const [textElems, setTextElems] = React.useState([]);

  // 
  // const [isModelOpen, setIsModelOpen] = React.useState(false);


  React.useEffect(() => {
    //const uuid = JSON.parse(localStorage.getItem('data'));
    console.log(window.location.href);
     
    console.log('@@@ UUID: '+ uuid);
    console.log('@@@ uuid_template_instance: '+ uuid_template_instance);
    
    const data = {"uuid": uuid, "salesforceUserId": "", "uuid_template_instance": uuid_template_instance};
    setIsLoading(false);
  //  fetch(`${serverURL}/api/fetchImagesData`, {
  //    method: "POST", 
  //    headers: {
  //      "Content-Type": "application/json"
  //    },
  //    body: JSON.stringify(data)
  //  })
  //    .then(res => res.json())
  //    .then(response => {
  //      const tempArr = []
  //      console.log('@@@ DATA FROM SERVER: '+ JSON.stringify(response));
  //      let data = response.data;
  //      if(data.cordinatesData.length>0) {
  //        let tempSignElems = [];
  //        data.cordinatesData.forEach((coord, index) => {
  //          if(coord.fieldType === 'Signature') {
  //            tempSignElems.push(signElems.concat({"eleId": `signEle${index}`, "pageId": coord.pageId, "x": coord.x, "y": coord.y, "width": coord.width, "height": coord.height}));
  //          }
  //        });
  //        setSignElems(tempSignElems);
  //      }
     
  //      data.images.forEach(file => {
  //        console.log('@@@ PATH: '+ file.path);
  //       tempArr.push(file.path);
  //      });
  //     setImgLst(tempArr);
  //    })
  //   .finally(() => {
  //    setTimeout(() => {
  //      setIsLoading(false);
  //    }, 3000);
  //    })
   }, []);
 
   React.useEffect(() =>{
     getImage(activePage);
   },[imgLst]);

  function handleSelectedEleNameChange(event) {
    console.log('@@@ VALUE: '+ event.target.value);
    console.log('@@@ selectedElement.type: '+ JSON.stringify(selectedElement));
    // selected element
    switch(selectedElement.type) {
      case "Signature": {
        console.log('Signature');
        setSignElems(signElems.map(ele => ele.name = event.target.value));
        break;
      }
      case "Text": {
        console.log('Text');
        break;
      }
      default: {
        break;
      }
    }
  }

  function handleSignToolClick(event) {
    console.log('@@@ SIGN tool is selected!!! ');
    switch(event.detail) {
      case 1: {
        console.log('Single click');
        setSignElems(signElems.concat({"type": "Signature", "name": `Signature${signEleCount+1}`, "eleId": `signEle${signEleCount}`, "pageId": activePage, "x": 0, "y": 0, "width": 160, "height": 40}));
        setSignEleCount(signEleCount+1);
        break;
      }
      case 2: {
        console.log('Double click');
        break;
      }
      default: {
        break;
      }
    }
  }

  function handleTextToolClick(event) {
    console.log('@@@ TEXT tool is selected!!! ');
    setTextElems(textElems.concat({"type": "Text", "name": `Text${textEleCount+1}`, "eleId": `textEle${textEleCount}`, "pageId": activePage, "x": 0, "y": 0, "width": 160, "height": 40}));
    setTextEleCount(textEleCount+1);
  }

  function handleDragStart(id, toolType, e) {
    console.log('@@@ Id: handleDragStart: '+ id);
    console.log('@@@ toolType: handleDragStart: '+ toolType);
    let ele;
    if(toolType === 'Signature') {
      ele = signElems.filter(ele => ele.eleId === id)
    }
    console.log('@@@ ELE : '+ JSON.stringify(ele));
    setSelectedElement(ele[0]);
    setIsToolSelectionMode(true);
  }
  
  function handleDragStop(id, toolType, data, e) {
    console.log('@@@ Data : Parent : handleDragStop : '+ JSON.stringify(data));
    console.log('@@@ toolType : Parent : handleDragStop : '+ toolType);
    console.log('@@@ Id: '+ id);
    
    if(toolType === 'Signature') {
      signElems.map(ele => {
        console.log(ele.eleId);
        if(ele.eleId === id) {
          ele.x = data.x;
          ele.y = data.y;
          return ele;
        }
      });
      return;
    }
    if(toolType === 'Text') {
      textElems.map(ele => {
        console.log(ele.eleId);
        if(ele.eleId === id) {
          ele.x = data.x;
          ele.y = data.y;
          return ele;
        }
      });
      
      return;
    }
    setIsToolSelectionMode(true);
  }
  
  function handleResize(id, toolType, data, e) {
      console.log('@@@ Data : Parent : handleResize : '+ JSON.stringify(data));
      console.log('@@@ toolType : Parent : handleDragStop : '+ toolType);
    
      if(toolType === 'Signature') {
          signElems.map(ele => {
            console.log(ele.eleId);
            if(ele.eleId === id) {
              console.log('@@@ Data : Parent : handleDragStop : '+data);
              ele.width = data.width;
              ele.height = data.height;
              return ele;
            }
          });
        return;
      }
      if(toolType === 'Text') {
        textElems.map(ele => {
          console.log(ele.eleId);
            if(ele.eleId === id) {
              console.log('@@@ Data : Parent : handleDragStop : '+data);
              ele.width = data.width;
              ele.height = data.height;
              return ele;
            }
        });
        return;
      }
  }

  function handlePaggination(index) {
    console.log("@@@ handlePaggination: "+ index);
    console.log("@@@ activePage: "+ activePage);
    console.log("@@@ Data: "+ JSON.stringify(signElems));
    if(index === activePage) return; 
    setActivePage(index); 
    getImage(index);
  }

  const getImage = async (index) => {
    setImg(imgLst[index]);
  };

  function handleContinue() {
    setIsLoading(true); 
    setIsFetching(false);
    console.log('@@@ handleContinue.');
    console.log('@@@ FINAL MAPPING OBJECT: '+ JSON.stringify(signElems));
    
    const body = {
      uuid: uuid,
      data: signElems
    }
    setIsLoading(false);
    // fetch(`${serverURL}/api/submitCordinatesData`, {
    //   method: "POST", 
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(body)
    // })
    // .then(res => res.json())
    // .then(response => {
    //   console.log(JSON.stringify(response));
     
    // })
    // .catch(error => {
    //   console.log('@@@ Saved coordinate: '+ JSON.stringify(error));
      
    // })
    // .finally(() => {
    //   setIsFileShared(true);
    //   setIsLoading(false);
    // })
  }

  // 
  const handleModelOpen =() =>{

  }

  return (
    <>
      {isLoading ? (
        <div style={{position:"absolute",zIndex:5,top:0,left:0,right:0,bottom:0,backgroundColor:"#E8EFF5"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",width:"100vw",flexDirection:"column"}}>
            <img src="https://media3.giphy.com/media/l7WGk7wh05yz1sTQNC/200w.gif"/>
            {isFetching ? <h4 >Fetching...</h4> : <h4 >Saving...</h4>}
          </div>
        </div>
      ): null}

      {isFileShared ? (
        <div style={{position:"absolute",zIndex:5,top:0,left:0,right:0,bottom:0,backgroundColor:"#E8EFF5"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",width:"100vw",flexDirection:"column"}}>
            <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTkxODQ2YzNhNGQ3MmY4YTkxN2ZiMzEzODAyMTA5OWI4Yzk3ZDk1OSZjdD1z/I5dflEG9U9haQ3fUUv/giphy.gif"/>
          </div>
        </div>
      ) : 
      
       <div className="container">
         <div className="left-sidebar">
           <div>
            <div className="tools-title">Signer</div>
            <CustomSelect options={options} name="signatory"></CustomSelect>
             <div className="tools-title">Signature fields</div>
             <div className="signature-tool">
               <button type="button" className="tool-btn signature-btn working-btn" onClick={handleSignToolClick}>
                 <RiBallPenLine className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Signature</p>
               </button>
              
               <button type="button" className="tool-btn btn-margin disabled-btn">
                 <RiBallPenLine className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Initails</p>
               </button>
             </div>
             <div className="tools-title">Standard fields</div>
             <div className="standard-tool">
               <button type="button" className="tool-btn btn-margin working-btn" onClick={handleTextToolClick}>
                 <BsTextareaT className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Textbox</p>
               </button>
              
               <button type="button" className="tool-btn btn-margin disabled-btn">
                 <BsCheck2Square className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Checkbox</p>
               </button>
             </div>
             <div className="tools-title">Auto-fill fields</div>
             <div className="standard-tool">
               <button type="button" className="tool-btn btn-margin disabled-btn">
                 <BsCalendar2Date className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Date Signed</p>
               </button>
              
               <button type="button" className="tool-btn btn-margin disabled-btn">
                 <BiUser className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Full Name</p>
               </button>
              
               <button type="button" className="tool-btn btn-margin disabled-btn">
                 <MdOutlineAlternateEmail className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Email</p>
               </button>
              
               <button type="button" className="tool-btn btn-margin disabled-btn">
                 <BsBuildings className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Company</p>
               </button>
              
               <button type="button" className="tool-btn btn-margin disabled-btn">
                 <RiSuitcaseLine className="tool-icon" /> <p style={{marginLeft: "12px", color: "#ffffff"}}>Job Title</p>
               </button>
             </div>
           </div>
         </div>
         <div>
           <div className="document" id="center-img-div">
            {signElems.map(ele => {
                  console.log(ele);
                  if(ele.pageId === activePage) {
                    return <SignDragTool id={ele.eleId} pageId={ele.pageId} x={ele.x} y={ele.y} width={ele.width} height={ele.height} handleDragStart={(toolType, e) => handleDragStart(ele.eleId, toolType, e)} handleDragStop={(data, e) => handleDragStop(ele.eleId, 'Signature', data, e)} handleResize={(data, e) => handleResize(ele.eleId, 'Signature', data, e)}/> 
                  }
                })}
              {textElems.map(ele => {
                  console.log(ele);
                  if(ele.pageId === activePage) {
                    return <TextDragTool id={ele.eleId} pageId={ele.pageId} x={ele.x} y={ele.y} width={ele.width} height={ele.height} handleDragStop={(data, e) => handleDragStop(ele.eleId, 'Text', data, e)} handleResize={(data, e) => handleResize(ele.eleId, 'Text', data, e)}/>  
                  }
                })}
              
              {console.log(img)}
              {img && <img src={img} style={{width: "100%"}}/>}
           </div>
         </div>
         <div className="right-sidebar" id="right-sidebar-div">
          {isToolSelectionMode ? 
            <>
            <div style={{backgroundColor:"white",position:"absolute"}} onClick={() => setIsToolSelectionMode(false)}>
              Close
            </div>
                <div class="right-sidebar-tool-header">
                  <RiBallPenLine style={{margin: "8px", color: "#555d65"}} />
                  <span style={{fontSize: "20px", color: "#555d65"}}>Signature</span>
                  <MdDelete style={{fontSize: "23px", marginLeft: "34px", color: "#555d65"}} />
                </div>
                <div style={{border: "solid #979797", borderWidth: "0 0 1px", padding: "16px"}}>
                  <label htmlFor="currentSignatory" style={{fontSize: "13px", color: "#555d65"}}>Assigned to</label>
                  <CustomSelect options={options} name="currentSignatory"></CustomSelect>
                </div>
        
                <div style={{border: "solid #979797", borderWidth: "0 0 1px", padding: "16px"}}>
                  <label style={{fontSize: "13px", color: "#555d65"}}>Field name<span style={{color: "red"}}>*</span></label>
                  {/* <CustomSelect options={options} name="currentSignatory"></CustomSelect> */}
                  <input defaultValue={selectedElement.name} onChange={(event) => handleSelectedEleNameChange(event)} style={{height: "1.7rem", width: "11.8rem", borderRadius: "3px", borderColor: "#cccccc"}} />
                </div>
            </>
            : null}
            
              {!isToolSelectionMode && imgLst &&
              imgLst.map((item, index) => {
                return (
                  <div className="flexbox-container paggination" onClick={() => handlePaggination(index)} key={index}>
                      <div className="flexbox-item">
                        <div className="page-count">{index+1}</div><img className="page-img"  style={{ border: index === activePage ? "2px solid" : "0px" }} src={imgLst[index]}/>
                      </div>
                    </div>
                );
              })}
          </div>
          <div className="navbar">          
           <ProgressIndicator></ProgressIndicator>
           <button className="continue-btn" onClick={handleContinue}>continue</button>
         </div>
       </div>
      } 

    </>
  )
}