import React, { useRef,useContext, useState, useEffect } from 'react';
import * as Yup from "yup";
import { EmployeeContex } from '../helper/EmployeeContex';


function Employee({ initialValues, onSubmit, isitEditing }) {
    const fileInputRef = useRef(null);
    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const { AllEmployee, setAllEmployee } = useContext(EmployeeContex)

    // Validation schema
    const validationSchema = Yup.object().shape({
        imageFile: Yup.mixed()
            .test(
                "fileRequired",
                "File is required",
                function (value) {
                    if (isitEditing && !value) {
                        // Create modunda resim zorunlu
                        return false;
                    }
                    // Edit modunda resim seçilmemişse mevcut resim adı kontrol edilir
                    if (!isitEditing && !value && this.parent.imageName) {
                        return true;
                    }
                    return !!value; // Resim seçilmişse geçerli
                }
            ),
        employeeName: Yup.string().required("A name is required"),
        occupation: Yup.string().required("An occupation is required"),
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (x) => {
                document.getElementById("Previewimg").src = x.target.result;
                setFormValues({ ...formValues, imageFile: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    useEffect(() => {
        setFormValues(initialValues);
    }, [initialValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("submit ten once form :",formValues)
            await validationSchema.validate(formValues, { abortEarly: false });
            setErrors({});
            onSubmit(formValues);
            if (!isitEditing)
                setAllEmployee([...AllEmployee, formValues]);
            else {
                setAllEmployee(
                    AllEmployee.map((employee) =>
                        employee.employeeID === formValues.employeeID ? formValues : employee
                    )
                ); // Güncellenen elemanı listeye ekle
            }
            setFormValues(initialValues); // Formu sıfırlama
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach((error) => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
    };

    return (
        <>
            <div className="container text-center">
                {!isitEditing ?
                    (<p className="lead">Create Employee</p>) :
                    (<p className="lead">Edit Employee</p>)
                }
            </div>
            <div className="form-group text-center">
                <img
                    id="Previewimg"
                    src={
                        formValues.imageFile
                            ? URL.createObjectURL(formValues.imageFile) // Yeni seçilen dosyanın önizlemesi
                            : formValues.imageName
                                ? `http://localhost:5081/api/Employee/GetEmployeeImage/${formValues.imageName}` // Mevcut resim
                                : "/img/image_placeholder.png" // Varsayılan resim
                    }
                    alt="Employee"
                    className="img-thumbnail"
                    style={{ width: "150px", height: "150px" }}
                />
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="imagefile">Image File</label>
                <input
                    type="file"
                    id="imagefile"
                    name="imageFile"
                    className="form-control"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                {errors.imageFile && <span className="error text-danger">{errors.imageFile}</span>}

                <label htmlFor="employeeName">Employee Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="employeeName"
                    name="employeeName"
                    placeholder="(ex. John...)"
                    value={formValues.employeeName}
                    onChange={handleInputChange}
                />
                {errors.employeeName && <span className="error text-danger">{errors.employeeName}</span>}

                <label htmlFor="occupation">Occupation:</label>
                <input
                    type="text"
                    className="form-control"
                    id="occupation"
                    name="occupation"
                    placeholder="Occupation"
                    value={formValues.occupation}
                    onChange={handleInputChange}
                />
                {errors.occupation && <span className="error text-danger">{errors.occupation}</span>}

                {
                    isitEditing ?
                        (<button className="btn btn-success btn-sm" type="submit">Save edit</button>) :
                        (<button className="btn btn-success btn-sm" type="submit">Save New</button>)
                }
            </form>
        </>
    );
}

export default Employee;
