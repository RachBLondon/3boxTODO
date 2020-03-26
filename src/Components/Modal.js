import {Button, Modal} from 'react-bootstrap';

import React, {useState} from 'react';

export default function ModalComponent(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log('props', props)
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          {props.buttonText}
        </Button>
        
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          {props.children}
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer> */}

          <Modal.Footer />
        </Modal>
      </>
    );
  }
  
  