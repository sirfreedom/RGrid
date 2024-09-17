import './Css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, {useState,useEffect} from 'react';
import RGrid from './Components/RGrid'
import {ListAll} from './Components/Helpers'
import {GetDog} from './Components/Helpers'


const GrillaConfiguracion = [
  {
    Tittle: 'Id',
    Selector: fila => fila.id,
    WidthColumn: '30%',
  },
  {
    Tittle: 'Nombre',
    Selector: fila => fila.name,
    WidthColumn: '30%',
    Ordenable: true,
    ColumnOrdenable: 'name',
  },
  {
    Tittle: 'Tamaño',
    Selector: fila => fila.breed_group,
    WidthColumn: '30%',
    Ordenable: true,
    ColumnOrdenable: 'breed_group'
  }
];


function App() {

  const [Dogs, setDogs] = useState([]);
  const [isCargando, setIsCargando] = useState(false);
  const [DogId,setDogId] = useState(0);
  const [Dog,setDog] = useState();
  const [modalEdit, setModalEdit] = useState(false); // Para el popup de ModalForm

  const FindDogs = () => {
    setIsCargando(true);
    ListAll().then(lDog => {
      setDogs(lDog);
      setIsCargando(false);
    });
  }
 
  useEffect(() => {
    ListAll().then(lDog => {
      setDogs(lDog);
    });
  }, []);
  
  useEffect(() => {
  GetDog(DogId).then(oDog => {
    setDog(oDog);
  });
  }, [DogId]);

 return (
    <>
            <button key="btnFindTest" id="btnFindTest" onClick={FindDogs}>
              Ver Perros Test
            </button>

            <br></br>
            <RGrid
              key="RGrid"
              Tittle="Grilla Dogs Test"
              rows={Dogs}
              columns={GrillaConfiguracion}
              ShowDelete="true"
              Export="true"
              DeleteId={id => console.log(id)}
              isLoading={isCargando}
              ConfigurationId="id"
            />
    </>
  );
}

export default App;
