import React, { useEffect } from 'react'
import error1 from '../images/error1.png'

const UnexpectedError = () => {

  const getLogs=()=>{
    const error = localStorage.getItem('unexpected-error');
    console.error(error)
  }

  useEffect(()=>{
    getLogs()
  },[])

  return (
    <div>
        <div className='unexpected-outer'>
            <div className='unexpected-inner'>

                <img src={error1} alt="" />
                <div className='unexpected-message' style={{textAlign:'center',width:"80%",margin:"0 auto"}}>
                    <h4 className='unexpected-text-heading'>Unexpected Error!</h4>
                    <p>Please be patient! We're trying to fix the issue as soon as possible. <br />Thank You!</p>
                </div>

            </div>

        </div>
    </div>
  )
}

export default UnexpectedError