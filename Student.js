import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

function Student() {
    const [student, setStudent] = useState([])
    const role = localStorage.getItem('role');
    const studentId = localStorage.getItem('studentId');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8081/secure-students', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (Array.isArray(res.data)) {
                setStudent(res.data);
            } else {
                console.error("Expected an array but got:", res.data);
                setStudent([]);
            }
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                logout();
            }
        });
    }, [role, studentId])

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/student/'+id)
            setStudent(student.filter(s => s.ID !== id));
        }catch(err) {
            console.log(err);
        }
    }

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                {role === 'admin' && (
                  <Link to="/create" className='btn btn-success'>Add + </Link>
                )}
                <button className="btn btn-outline-danger float-end mb-2" onClick={logout}>Logout</button>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {role === 'admin' && <th>Password</th>}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                               student.map((data, i)=>  (
                                <tr key={i}>
                                    <td>{data.Name}</td>
                                    <td>{data.Email}</td>
                                    {role === 'admin' && <td>{data.Password}</td>}
                                    <td>
                                        {role === 'admin' ? (
                                          <>
                                            <Link to={`update/${data.ID}`} className='btn btn-primary'>update</Link>
                                            <button className='btn btn-danger ms-2' onClick={() => handleDelete(data.ID)}>Delete</button>
                                          </>
                                        ) : (
                                          <span className="text-muted">View Only</span>
                                        )}
                                    </td>
                                    
                                </tr>
                               ))
                               }

                        </tbody>
                    </table>
            </div>

        </div>
    )
}

export default Student