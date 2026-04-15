import {useState,useEffect} from 'react';
import RGrid from './Components/RGridBoostrap';
import {ListAll} from './Components/Helpers'
import ModalEdicion from './Components/ModalEdicion';
import ModalNew from './Components/ModalNew';

const GrillaConfiguracion = [
  {
    Tittle: 'Nombre',
    Selector: fila => fila.attributes.name,
    WidthColumn: '40%',
    Ordenable: true,
    ColumnOrdenable: 'name',
  },
  {
    Tittle: 'Descripcion',
    Selector: fila => fila.attributes.description,
    WidthColumn: '40%',
    Ordenable: true,
    ColumnOrdenable: 'description'
  },
  {
    Tittle: 'Tipo',
    Selector: fila => fila.type,
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
      
      console.log(lDog);
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

        <div className='container-fluid'>

          <div className='row align-items-end'>
            <div className='col-6'>
                <button className="btn-2" onClick={GridNew} >  Nuevo Registro  </button>
            </div>
          </div>
          <div className='row align-items-center'>
            <div className='col-12'>

            <RGrid
              key="RGrid"
              Tittle="Grilla Dogs Test"
              rows={Dogs}
              RowPerPage={5}
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

            </div>
          </div>
          <div className='row'>
              <div className='col-12'>
                  <ModalEdicion show={ShowModalEdit} onHide={() => setShowModalEdit(false)}  ValueId={DogId} />
              </div>
          </div>
          <div className='row'>
              <div className='col-12'>
                  <ModalNew show={ShowModalNew} onHide={() => setShowModalNew(false)}  />
              </div>
          </div>
        </div>

    </>
  );
}

export default App;
