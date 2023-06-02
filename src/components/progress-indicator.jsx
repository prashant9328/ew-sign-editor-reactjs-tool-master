const ProgressIndicator = () => {
    return (
      <div style={{width: "100%", margin: "28px 12rem 0px 12rem"}}>
        
      <section className="progress-bar-section">
          <ol className="progress-bar">
              <li className="is-complete" style={{textAlign: 'left'}}><span style={{color: "#33b536"}}>Upload/Select template</span></li>
              <li className="is-complete" style={{textAlign: 'center'}}><span style={{color: "#33b536"}}>Add email detail</span></li>
              <li className="is-active"   style={{textAlign: 'right'}}><span style={{color: "#33b536"}}>Edit template</span></li>  
          </ol>
      </section>
      </div>
    )
  }
  
  export default ProgressIndicator;