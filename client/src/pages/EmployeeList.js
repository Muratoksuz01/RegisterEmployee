import React, { useEffect, useContext, useState, useRef } from 'react'
import axios from "axios";
import { EmployeeContex } from '../helper/EmployeeContex';
// import Model from './Model';

import Employee from "./Employee"
function EmployeeList() {
    const fileInputRef = useRef(null);

    const initialValues = {
        imageFile: null,
        employeeName: "",
        occupation: "",
        imageName: ""
    }

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isitEditing, setisitEditing] = useState(false);

    const { AllEmployee, setAllEmployee } = useContext(EmployeeContex)
    useEffect(() => {
        console.log("useefec")
        fetchAllEmployees()
        console.log(AllEmployee)
    },[])
    const fetchAllEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5081/api/Employee");
            const employeesWithImageUrls = res.data.map((employee) => ({
                ...employee,
                imageUrl: `http://localhost:5081/api/Employee/GetEmployeeImage/${employee.imageName}`,
            }));
            setAllEmployee(employeesWithImageUrls);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };
    const deleteEmployee = (id) => {
        axios.delete(`http://localhost:5081/api/Employee/${id}`).then((res) => {
            console.log(res)
            setAllEmployee((prev) => prev.filter((m) => m.employeeID !== id));
        })
    }
    const editEmployee = (employee) => {
        setisitEditing(true)
        setSelectedEmployee(employee)
    }
    const handleEditSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("EmployeeID", selectedEmployee.employeeID);
            formData.append("EmployeeName", values.employeeName);
            formData.append("Occupation", values.occupation);
    
            // Eğer yeni bir dosya seçildiyse, dosyayı gönder
            if (values.imageFile) {
                formData.append("ImageFile", values.imageFile);
            } else {
                // Yeni bir dosya seçilmediyse mevcut resim adını gönder
                formData.append("ImageName", selectedEmployee.imageName);
            }
    
            console.log("PUT request formData:", formData);
            const res = await axios.put(
                `http://localhost:5081/api/Employee/${selectedEmployee.employeeID}`,
                formData
            );
            console.log(res);
            setisitEditing(false);
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };
    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("EmployeeName", values.employeeName);
            formData.append("Occupation", values.occupation);
            formData.append("ImageFile", values.imageFile); // Yeni dosya
    
            const res = await axios.post("http://localhost:5081/api/Employee", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(res);
            document.getElementById("Previewimg").src = "/img/image_placeholder.png";
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };
    return (
        <div className="row">
            <div className="bg-light py-5">
                <div className="container text-center">
                    <h1 className="display-4">Employee Register</h1>
                </div>
            </div>
            <div className="col-md-4">
                {isitEditing ? (
                    <Employee 
                    initialValues={selectedEmployee} 
                    onSubmit={handleEditSubmit} 
                    isitEditing={isitEditing} />) : 
                (<Employee
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    isitEditing={isitEditing}
                />)}

            </div>
            <div className="col-md-8">
                <div className="row">
                    {AllEmployee && AllEmployee.length > 0 ? ( // Veri kontrolü ekleniyor
                        AllEmployee.map((employee, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="form-group text-center">
                                            <img
                                                src={employee.imageUrl}
                                                alt={employee.employeeName}
                                                className="img-thumbnail"
                                                style={{ width: "150px", height: "150px" }}
                                            />
                                        </div>
                                        <h5 className="card-title text-center mt-3">{employee.employeeName}</h5>
                                        <p className="card-text text-center text-muted">{employee.occupation}</p>
                                        <div className="form-group text-center">
                                            <button
                                                onClick={() => deleteEmployee(employee.employeeID)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => editEmployee(employee)}
                                                className="btn btn-primary btn-sm"
                                               
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-md-12 text-center">
                            <p>No employees found.</p> {/* Eğer veri yoksa gösterilecek mesaj */}
                        </div>
                    )}
                </div>
            </div>
            {/* <Model
                // selectedEmployee={selectedEmployee}
                onSubmit={handleEditSubmit} /> */}
        </div>
    );

}

export default EmployeeList

