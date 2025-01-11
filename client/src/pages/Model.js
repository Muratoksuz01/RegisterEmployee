// import React,{useContext} from 'react';
// import Employee from './Employee';
// import { EmployeeContex } from '../helper/EmployeeContex';

// function Model({ selectedEmployee, onSubmit }) {
//         const { AllEmployee, setAllEmployee,selectted,setselected } = useContext(EmployeeContex)
    
//     const initialValues = {
//         imageFile: selectted?.imageName || null,
//         employeeName: selectted?.employeeName || "",
//         occupation: selectted?.occupation || "",
//     };

//     return (
//         <>
//             <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">
//                                 Edit Employee - {selectedEmployee ? selectedEmployee.employeeName : ''}
//                             </h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <div className="modal-body">
//                             <Employee
//                                 initialValues={initialValues}
//                                 onSubmit={onSubmit}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Model;
