import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useCallback, useState, useEffect } from 'react';
import exportFromJSON from 'export-from-json';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Aunque no se usar� autoTable directamente, jsPDF sigue siendo �til para la exportaci�n
import * as lodash from 'lodash';

const RGridBoostrap = props => {
  const [Rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actualPageIndex, setActualPageIndex] = useState(1);
  const [TotalPages, setTotalPages] = useState(0);
  const [UniqueOrdering, setUniqueOrdering] = useState(false);

  
  const totalVisibleColumns = props.columns.length + (props.ShowDelete ? 1 : 0) + (props.ShowEdit ? 1 : 0);

  const handleExportar = e => {
    const doc = new jsPDF();
    const fileName = (props.Tittle + '_' + new Date().toLocaleString('es-AR'))
      .replace(/[/]/gi, '')
      .replace(/[: ]/g, '');

    const data = Rows.map(fila =>
      props.columns.reduce((prev, columna) => {
        return { ...prev, [columna.Tittle]: columna.Selector(fila) };
      }, {})
    );
    switch (e.target.value) {
      case 'csv':
        exportFromJSON({ data, fileName, exportType: exportFromJSON.types.csv });
        break;
      case 'xls':
        exportFromJSON({ data, fileName, exportType: exportFromJSON.types.xls });
        break;
      case 'pdf':
        doc.autoTable({
          head: [props.columns.map(columna => columna.Tittle)],
          body: Rows.map(fila =>
            props.columns.reduce((prev, columna) => {
              const dato = columna.Selector(fila);
              if (typeof dato !== 'string' && typeof dato !== 'number') {
                return [...prev, ''];
              }
              return [...prev, dato];
            }, [])
          ),
        });
        doc.save(fileName + '.pdf');
        break;
      default:
        break;
    }
  };

  const ddlPages_OnChange = value => {
    setRowsPerPage(Number(value));
    setActualPageIndex(1);
  };

  const EnabledPaging = () => {
    return Rows.length > 0 && rowsPerPage < 9999;
  };

  const PrevPage = () => {
    if (actualPageIndex > 1) {
      setActualPageIndex(actualPageIndex - 1);
    }
  };

  const NextPage = () => {
    if (actualPageIndex < TotalPages) {
      setActualPageIndex(actualPageIndex + 1);
    }
  };

  const CalculatePages = useCallback(() => {
    if (Rows.length === 0) {
      setTotalPages(0);
      return;
    }
    const iTotal = Math.ceil(Rows.length / rowsPerPage);
    setTotalPages(iTotal);
    if (actualPageIndex > iTotal && iTotal > 0) {
      setActualPageIndex(iTotal);
    } else if (actualPageIndex === 0 && iTotal > 0) {
      setActualPageIndex(1);
    }
  }, [Rows, rowsPerPage, actualPageIndex]);


  Object.prototype.renameProperty = function (oldName, newName) {
    if (oldName === newName) {
      return this;
    }
    if (this.hasOwnProperty(oldName)) {
      this[newName] = this[oldName];
    }
    return this;
  };

  const ChangeId = () => {
    try {
      if (props.rows.length === 0 || UniqueOrdering) {
        return;
      }

      setUniqueOrdering(true);
      const oComplete = [...props.rows];

      for (const item of oComplete) {
        // Evitar mutar el prototipo si es posible, o al menos ser consciente de ello.
        // Una alternativa ser�a:
        //const newItem = { ...item, ['RowId']: item[props.ConfigurationId] };
        //delete newItem[props.ConfigurationId];
        item.renameProperty(props.ConfigurationId, 'RowId');
      }

      setRows(lodash.sortBy(oComplete, 'RowId'));

    } catch (e) {
      console.error("Error in ChangeId:", e.message);
    }
  };

  const HandlerOrderby = (value) => {
    setRows(lodash.sortBy(Rows, value));
  };

  useEffect(() => {
    ChangeId();
  }, [props.rows, props.ConfigurationId]);

  useEffect(() => {
    CalculatePages();
  }, [Rows, rowsPerPage, CalculatePages]);

  const paginatedRows = Rows.slice(
    (actualPageIndex - 1) * rowsPerPage,
    actualPageIndex * rowsPerPage
  );

  // Funci�n para determinar el ancho de las columnas en el sistema de cuadr�cula de Bootstrap
  // Esto es un ejemplo simple, en un caso real, podr�as necesitar una l�gica m�s sofisticada
  // para distribuir el ancho de las columnas de forma equitativa o basada en el contenido.
  const getColumnWidthClass = (columnWidth) => {
    if (columnWidth) {
      // Si se proporciona un ancho espec�fico, se puede usar inline style o una clase personalizada
      // Para Bootstrap, podr�amos intentar mapear a col-X, pero es complejo sin conocer el total.
      // Por simplicidad, usaremos inline style para anchos espec�ficos.
      return {}; // Retorna un objeto vac�o para que el estilo se aplique directamente
    }
    // Si no hay ancho espec�fico, distribuir equitativamente
    const baseCol = Math.floor(12 / totalVisibleColumns);
    return { className: `col-${baseCol}` };
  };

  return (
    <div className="container-fluid mt-3">
      {props.isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="ms-2">Loading...</h2>
        </div>
      ) : (
        <React.Fragment>
          <div className="d-flex justify-content-between align-items-center mb-3">
            {props?.Export && (
              <div className="btn-group" role="group" aria-label="Export options">
                <button type="button" className="btn btn-outline-primary" value="csv" onClick={handleExportar}>
                  CSV
                </button>
                <button type="button" className="btn btn-outline-primary" value="xls" onClick={handleExportar}>
                  Excel
                </button>
                <button type="button" className="btn btn-outline-primary" value="pdf" onClick={handleExportar}>
                  PDF
                </button>
              </div>
            )}

            <div className="d-flex align-items-center">
              <label htmlFor="ddlPages" className="form-label me-2 mb-0">Rows per page:</label>
              <select
                value={rowsPerPage}
                className="form-select form-select-sm"
                name="ddlPages"
                id="ddlPages"
                onChange={e => ddlPages_OnChange(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="9999">All</option>
              </select>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header text-center bg-primary text-white">
              <h4 className="mb-0">{props.Tittle}</h4>
            </div>
          </div>

          <div className="border rounded overflow-hidden"> 

            <div className="d-flex bg-dark text-white fw-bold py-2 px-2"> 
              {props.columns.map((column, idx) => (
                <div
                  key={`header-col-${idx}`}
                  className="p-1 text-truncate" 
                  style={{ width: column.WidthColumn || `${100 / totalVisibleColumns}%` }} 
                >
                  {column.Tittle}{' '}
                  {column.Ordenable && (
                    <span
                      className="ms-1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => HandlerOrderby(column.ColumnOrdenable)}
                      title="Sort Asc"
                    >
                      &#9650;
                    </span>
                  )}
                </div>
              ))}

              {props.ShowDelete && (
                <div className="p-1 text-center" style={{ width: '60px' }}> 
                  Delete
                </div>
              )}

              {props.ShowEdit && (
                <div className="p-1 text-center" style={{ width: '60px' }}> 
                  Edit
                </div>
              )}
            </div>

            
            <div className="list-group list-group-flush"> 
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, idx) => (
                  <div
                    key={`row-${row.RowId || idx}`}
                    className="list-group-item list-group-item-action d-flex align-items-center" 
                  >
                    {props.columns.map((column, colx) => (
                      <div
                        key={`cell-${row.RowId || idx}-${colx}`}
                        className="p-1 text-truncate"
                        style={{ width: column.WidthColumn || `${100 / totalVisibleColumns}%` }}
                      >
                        {column.Selector(row)}
                      </div>
                    ))}

                    {props.ShowDelete && (
                      <div className="p-1 text-center" style={{ width: '60px' }}>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => props.DeleteId(row.RowId)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}

                    {props.ShowEdit && (
                      <div className="p-1 text-center" style={{ width: '60px' }}>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => props.EditId(row.RowId)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="list-group-item text-center py-3">
                  No data available.
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end py-2 px-2 bg-light border-top">
              {EnabledPaging() && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${actualPageIndex === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={PrevPage} disabled={actualPageIndex === 1}>
                        Previous
                      </button>
                    </li>
                    <li className="page-item disabled">
                      <span className="page-link">
                        Page {actualPageIndex} / {TotalPages}
                      </span>
                    </li>
                    <li className={`page-item ${actualPageIndex === TotalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={NextPage} disabled={actualPageIndex === TotalPages}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default RGridBoostrap;
