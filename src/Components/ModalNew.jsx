import React from 'react'
import {Modal, Button} from 'react-bootstrap/'

function ModalNew(props) {
 
    
      return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter1">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter1"> Nuevo Registro </Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
    
          <table className="Table" width="100%" align='center'>
            <thead>
              <tr>
                <td>
                </td>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td className="TableCell" align='Center' >
                
              </td>
            </tr>
            <tr>
              <td className="TableCell">
                
              </td>
            </tr>
            <tr>
              <td className='TableCell'>
                
              </td>
            </tr>
            <tr>
              <td className="TableCell">
           
              </td>
            </tr>
            <tr>
              <td className="TableCell">
              <strong>  Life Span </strong>
            
              </td>
            </tr>
            </tbody>
            <tfoot>
              <tr>
                 <td>
                </td>
              </tr>
            </tfoot>
          </table>
    
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    
export default ModalNew;
    