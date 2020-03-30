import {Button, Modal} from 'react-bootstrap';

import React, {useState} from 'react';

export default function ModalComponent(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = (props) => {
      if(props && props.submitFunc){
        props.submitFunc();
      }
      setShow(false);
    };
    const handleShow = () => setShow(true);
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          {props.buttonText}
        </Button>
        
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a new TODO task</Modal.Title>
          </Modal.Header>
          {props.children}
            <Button variant="primary" onClick={handleClose.bind(null, props)} style={{width : '150px', marginLeft : 'auto', marginRight : 'auto', marginBottom : '30px'}}>
              Save Changes
            </Button>
        </Modal>
      </>
    );
  }
  
  