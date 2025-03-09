import './Css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, {useState,useEffect} from 'react';
import RGrid from './Components/RGrid'
import {ListAll} from './Components/Helpers'
import ModalEdicion from './Components/ModalEdicion';
import ModalNew from './Components/ModalNew';


const GrillaConfiguracion = [
  {
    Tittle: 'Nombre',
    Selector: fila => fila.name,
    WidthColumn: '40%',
    Ordenable: true,
    ColumnOrdenable: 'name',
  },
  {
    Tittle: 'Grupo',
    Selector: fila => fila.breed_group,
    WidthColumn: '40%',
    Ordenable: true,
    ColumnOrdenable: 'breed_group'
  },
  {
    Tittle: 'Vida Promedio',
    Selector: fila => fila.life_span,
    WidthColumn: '20%',
  },
];

function App() {

  const [DogId,setDogId] = useState(0);
  const [Dogs, setDogs] = useState([]);
  const [ShowModalEdit, setShowModalEdit] = useState(false);
  const [ShowModalNew, setShowModalNew] = useState(false);

  useEffect(() => {
    ListAll().then(lDog => {
      setDogs(lDog);
    });
  }, []);

  const GridEdit = id => {
    setShowModalEdit(true);
    setDogId(id);
  };

const GridNew = () => {
  //console.log("paso");
  //alert("ssss");
  setShowModalNew(true);
  };

 return (
    <>
        <table width="100%" >
          <tr>
            <td>
              <button className="btn-2" onClick={GridNew} >  Nuevo Registro  </button>
            </td>
          </tr>
          <tr>
            <td>

            <RGrid
              key="RGrid"
              Tittle="Grilla Dogs Test"
              rows={Dogs}
              columns={GrillaConfiguracion}
              ShowDelete={true}
              ShowEdit={true}
              Export={true}
              TotalWidth="80%"
              DeleteId={id => alert("not implementes id" + id)}
              EditId={id => GridEdit(id)}
              isLoading={false}
              ConfigurationId="id" //Id de los datos de la grilla
            />
            </td>
          </tr>
          <tr>
            <td>
                <ModalEdicion show={ShowModalEdit} onHide={() => setShowModalEdit(false)}  ValueId={DogId} />
            </td>
          </tr>
          <tr>
            <td>
                <ModalNew show={ShowModalNew} onHide={() => setShowModalNew(false)}  />
            </td>
          </tr>

        </table>


    </>
  );
}

export default App;
