const ProgressIndicator = () => {
    return (
      <div style={{width: "100%", margin: "28px 16rem 0px"}}>
        
      <section className="progress-bar-section">
          <ol className="progress-bar">
              <li className="is-complete"><span>Upload/Select template</span></li>
              {/* <li className="is-complete"><span>Add email detail</span></li> */}
              <li className="is-active"><span>Edit template</span></li>  
          </ol>
      </section>
      </div>
    )
  }
  
  export default ProgressIndicator;