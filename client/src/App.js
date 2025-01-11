import './App.css';
import { useState } from 'react';
import { EmployeeContex } from './helper/EmployeeContex';
import EmployeeList from './pages/EmployeeList';
function App() {
  const [AllEmployee,setAllEmployee]=useState([])
  // const [selectted,setselected]=useState([])
  return (
    <EmployeeContex.Provider value={{AllEmployee,setAllEmployee}}>
    <div className="container">
    <EmployeeList/>
    </div>
    </EmployeeContex.Provider>
  );
}

export default App;
