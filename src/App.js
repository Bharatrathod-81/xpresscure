import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {

  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState({});
  const [input, setInput] = useState(null);
  const [tableClr, setTableClr] = useState(false);
  const [edit, setEdit] = useState({});
  const [openForm, setOpenForm] = useState(false)
  const limiPage = useRef(null)
  const [localData, setlocalData] = useState(JSON.parse(localStorage.getItem('xprescureData')) || []);

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('xprescureData') === null) {
        try {
          const { data } = await axios.get('https://dev.xpresscure.com/api/admin/lists_diseases');
          localStorage.setItem('xprescureData', JSON.stringify(data))
        } catch (err) {
          console.log(err);
        }
      }
    })();
  });


  useEffect(() => {
    if (input) {
      const newArr = localData.filter(e => e.department_name.toLowerCase().includes(input.toLowerCase()));
      limiPage.current = newArr;
      let num = `${pageNo}0` * 1
      let array = newArr.slice(num - 10, num)
      let arrReduce = array.reduce((acc, curr) =>
        curr.department_name in acc ?
          { ...acc, [curr.department_name]: [...acc[curr.department_name], curr] } :
          { ...acc, [curr.department_name]: [curr] }, {});
      setData(arrReduce)
    } else {
      limiPage.current = null;
      let num = `${pageNo}0` * 1
      let array = localData.slice(num - 10, num)
      let arrReduce = array.reduce((acc, curr) =>
        curr.department_name in acc ?
          { ...acc, [curr.department_name]: [...acc[curr.department_name], curr] } :
          { ...acc, [curr.department_name]: [curr] }, {});
      setData(arrReduce)
    }
  }, [pageNo, input])

  const pageQty = limiPage.current ? limiPage.current : localData;

  const editFunc = () => {
    const newData = localData.map(e => e._id === edit._id ? { ...e, ...edit } : e);
    localStorage.removeItem('xprescureData');
    localStorage.setItem('xprescureData', JSON.stringify(newData));
    setOpenForm(false)
  }

  const fillData = a => {
    setOpenForm(true)
    setEdit({ deparment: a.department_name, disease: a.disease_name, status: a.status, _id: a._id })
  }

  const deleteFunc = a => {
    const newData = localData?.filter(e => e._id !== a._id);
    localStorage.removeItem('xprescureData');
    localStorage.setItem('xprescureData', JSON.stringify(newData));
    setlocalData([...JSON.parse(localStorage.getItem('xprescureData'))]);
  }

  return (
    <div className="App">
      <div className="input-group mb-4 mt-4 d-flex justify-content-center">
        <div className='input-container'>
          <input
            onChange={e => setInput(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Department Name"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2" />
        </div>
      </div>
      {openForm && <div className='form-body'>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Department</label>
          <input
            onChange={e => setEdit({ ...edit, deparment: e.target.value })}
            value={edit.deparment}
            type="text"
            class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Disease</label>
          <input
            onChange={e => setEdit({ ...edit, disease: e.target.value })}
            value={edit.disease}
            type="text" class="form-control" id="exampleInputPassword1" />
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Status</label>
          <input
            onChange={e => setEdit({ ...edit, disease: e.target.value })}
            value={edit.status}
            type="text" class="form-control" id="exampleInputPassword1" />
        </div>
        <button
          onClick={e => {
            e.preventDefault()
            editFunc()}}
          class="btn btn-primary">Submit</button>
      </div>}
      <div className='table-body'>
        <table>
          <thead>
            <tr>
              <th className={tableClr ? 'Theading2' : 'Theading'}>DEPARTMENT</th>
              <th className={tableClr ? 'Theading2' : 'Theading'}>ICON</th>
              <th className={tableClr ? 'Theading2' : 'Theading'}>DISEASE</th>
              <th className={tableClr ? 'Theading2' : 'Theading'}>STATUS</th>
              <th className={tableClr ? 'Theading2' : 'Theading'}>
                <button
                  onClick={() => setTableClr(!tableClr)}
                  type="button"
                  className="btn btn-warning">COLOR</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data)?.map(e =>
              <tr key={e}>
                <td>{e}</td>
                <td className='d-flex flex-column img-container'>
                  {data[e]?.map(a => <img className='icon-img' src={a.icon} alt='icons' />)}
                </td>
                <td className='disease-container'>
                  {data[e]?.map(a => <div className='disease'>{a.disease_name}</div>)}
                </td>
                <td>
                  {data[e]?.map(a => <div className='disease'>{a.status}</div>)}
                </td>
                <td className='Btns'>
                  {data[e]?.map(a =>
                    <div className='disease '>
                      <button 
                      onClick={() => deleteFunc(a)}
                      className='me-2 btn-dan'>Delete</button>
                      <button
                        onClick={() => {
                          fillData(a)
                        }}
                        className='ms-3 btn-suc'>Edit</button>
                    </div>
                  )}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>

      <div className='mt-4 pageBtn'>
        {pageNo > 1 && <i
          onClick={() => setPageNo(pageNo - 1)}
          class="fa fa-exchange me-4"
          style={{ fontSize: '24px' }}></i>}

        <strong>{pageNo}</strong>

        {pageQty[`${pageNo}0` * 1] && <i
          onClick={() => setPageNo(pageNo + 1)}
          class="fa fa-exchange ms-4"
          style={{ fontSize: '24px' }}></i>}
      </div>

    </div>
  );
}

export default App;
