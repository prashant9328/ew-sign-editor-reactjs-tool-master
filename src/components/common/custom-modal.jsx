import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: "50vw",
      padding: 0
    },
};

export default function CustomModal({ modalHeaderTitle, children, closeModal }) {

    return <Modal
        isOpen={true}
        // onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Modal"
      >
        <div style={{ padding: "10px", borderBottom: "2px Solid #C2C2C2"}}>
            <p style={{textAlign: "center"}}>{modalHeaderTitle}</p>
        </div>
        {children}
        <div style={{ padding: "10px", borderTop: "2px Solid #C2C2C2", display: "flex", justifyContent: "center"}}>
            <button style={{ 
                backgroundColor: "#455b66", 
                color: "#ffffff", 
                cursor: "pointer", 
                padding: "10px 32px",
                fontSize: "16px", 
                border: "1px solid #f9f9f9",
                borderRadius: "4px",
                borderWidth: "0px 1px 0px 1px",
                textTransform: "uppercase"}} 
            onClick={closeModal}>
                I Agree
            </button>
        </div>
    </Modal>
}