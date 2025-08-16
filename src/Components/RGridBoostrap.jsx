import '../Css/RGrid.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useCallback, useState, useEffect } from 'react';
import exportFromJSON from 'export-from-json';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as lodash from 'lodash';

const RGridBoostrap = props => {
  const [Rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(props.RowPerPage);
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

    const ChangeId = () => {
      try {
        if (props.rows.length === 0) {
          setRows([]);
          return;
        }
        const oComplete = props.rows.map((item, index) => { // A�adir 'index' como fallback
          const rowIdValue = item[props.ConfigurationId];
          let RowId;
          if (rowIdValue === undefined || rowIdValue === null) {
            console.warn(`ConfigurationId '${props.ConfigurationId}' not found or is null/undefined for row at index ${index}. Using fallback index as RowId.`);
            RowId = `fallback-${index}`; // Generar un ID �nico basado en el �ndice
          } else {
            RowId = rowIdValue;
          }
          // Asegurarse de que el RowId se extraiga correctamente si existe
          const { [props.ConfigurationId]: originalRowId, ...rest } = item;
          return { RowId, ...rest };
        });
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

  return (
    <div className="container-fluid p-0"> 
      {props.isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status"> 
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="ms-2 text-primary">Loading...</h2>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2 px-2"> 
            {props?.Export && (
              <div className="btn-group btn-group-sm" role="group" aria-label="Export options"> 
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

            {props.ShowPaging && (
            <div className="d-flex align-items-center">
              <label htmlFor="ddlPages" className="form-label me-1 mb-0 text-muted small">Rows per page:</label> 
              <select
                value={rowsPerPage}
                className="form-select form-select-sm"
                defaultValue="5"
                name="ddlPages"
                id="ddlPages"
                key="ddlPages"
                onChange={e => ddlPages_OnChange(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="9999">All</option>
              </select>
            </div>
            )}

          </div>

          <div className="card border-0 shadow-sm mb-3"> 
            <div className="card-header bg-primary text-white text-center py-1"> 
              <h5 className="mb-0">{props.Tittle}</h5> 
            </div>
            <div className="d-flex bg-dark text-white fw-bold py-0 px-0 small"> 
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
                  
                </div>
              )}

              {props.ShowEdit && (
                <div className="p-1 text-center" style={{ width: '60px' }}>
                  
                </div>
              )}
            </div>

            <div className="list-group list-group-flush border-0"> {/* Eliminar borde del list-group */}
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, idx) => (
                  <div
                    key={`row-${row.RowId || idx}`}
                    className="list-group-item list-group-item-action d-flex align-items-center py-1 px-2 border-0" /* Reducir padding y eliminar bordes */
                  >
                    {props.columns.map((column, colx) => (
                      <div
                        key={`cell-${row.RowId || idx}-${colx}`}
                        className="p-1 text-truncate small" /* Reducir padding y tama�o de fuente */
                        style={{ width: column.WidthColumn || `${100 / totalVisibleColumns}%` }}
                      >
                        {column.Selector(row)}
                      </div>
                    ))}

                    {props.ShowDelete && (
                      <div className="p-1 text-center" style={{ width: '60px' }}>

                          <a key={'a_delete' + Math.random().toString()}  onClick={() => props.DeleteId(row.RowId)}>
                            <img
                              alt="imgDelete"
                              className="imgDelete"
                              title="Delete"
                              border="0"
                              width="18px"
                              height="18px"
                              key={'imgDelete' + Math.random().toString() }
                            ></img>
                          </a>
                      </div>
                    )}

                    {props.ShowEdit && (
                      <div className="p-1 text-center" style={{ width: '60px' }}>
                       <a key={'a_edit' + row.RowId.toString()}  onClick={() => props.EditId(row.RowId)}>
                            <img
                              alt="imgEdit"
                              className="imgEdit"
                              title="Edit"
                              border="0"
                              width="18px"
                              height="18px"
                              value={row.RowId}
                              key={'imgEdit' + row.RowId.toString() }
                            ></img>
                          </a>

                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="list-group-item text-center py-1"> 
                  No data available.
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end py-1 px-1"> 
              {EnabledPaging() && (
                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm justify-content-end mb-0"> 
                    <li className={`page-item ${actualPageIndex === 1 ? 'disabled' : ''}`}>

                      <button className="page-link" onClick={PrevPage} disabled={actualPageIndex === 1}>
                        Previous Page
                      </button>

                    </li>
                    <li className="page-item disabled">
                      <span className="page-link text-muted"> 
                        Page {actualPageIndex} / {TotalPages}
                      </span>
                    </li>
                    <li className={`page-item ${actualPageIndex === TotalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={NextPage} disabled={actualPageIndex === TotalPages}>
                        Next Page
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RGridBoostrap;
