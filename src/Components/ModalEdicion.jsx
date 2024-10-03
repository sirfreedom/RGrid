import React, {useEffect,useState} from 'react'
import {Modal, Button} from 'react-bootstrap/'
import {GetDog} from './Helpers'

function ModalEdicion(props) {

  const [imgDog,setimgDog] = useState('');
  const [NameDog,setNameDog] = useState('');
  const [GroupDog,setGroupDog] = useState('');
  const [CountryDog,setCountryDog] = useState('');
  const [TemperamentDog,setTemperamentDog] = useState('');
  const [CaracterDog,setCaracterDog] = useState('');
  const [LifeSpanDog, setLifeSpanDog] = useState('');
  const [Dog, setDog] = useState([]);

  useEffect(() => {

    if(props.show){
      GetDog(props.ValueId).then(dog => {
        
        setDog(dog);
        
        if (typeof(dog) !== 'undefined')
          {
              if ( typeof(dog.reference_image_id)  === 'string' )  
              {
                setimgDog('https://cdn2.thedogapi.com/images/' + dog.reference_image_id + '.jpg');
              }
              if ( typeof(dog.name)  === 'string' )
              {
                setNameDog(dog.name);
                setGroupDog(dog.breed_group);
                setCountryDog(dog.country_code);
                setTemperamentDog(dog.temperament);
                setCaracterDog(dog.bred_for);
                setLifeSpanDog(dog.life_span);
              }
          }

        console.log(dog);
      });
    }

  }, [props.show]);

  const Save = () => {
    //const tnombre = document.getElementById('tnombre');
    //props.cbGuardarPerro({...props.dog, name: tnombre.value}); 
  };

  return (
    <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{Dog.name}</Modal.Title>
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
            <img width="100%" height="100%" src={(imgDog === '') ? '' : (imgDog) } className={(imgDog === '') ? 'imgDog' : '' } alt="Dogs" />
          </td>
        </tr>
        <tr>
          <td className="TableCell">
            Group {GroupDog}
          </td>
        </tr>
        <tr>
          <td className='TableCell'>
            <strong> Country </strong> {CountryDog}
          </td>
        </tr>
        <tr>
          <td className="TableCell">
            <strong> Temperament </strong> {TemperamentDog}
            <br></br>
            <strong> Caracter </strong>
            {CaracterDog}
          </td>
        </tr>
        <tr>
          <td className="TableCell">
          <strong>  Life Span </strong>
           {LifeSpanDog} 
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

export default ModalEdicion;
