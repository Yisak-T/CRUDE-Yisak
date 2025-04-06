import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Student from './Student';
import CreateStudent from './CreateStudent';
import UpdateStudent from './UpdateStudent';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import ResetPassword from './ResetPassword';
import RequestReset from './RequestReset';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/request-reset' element={<RequestReset />} />
          <Route path='/' element={<ProtectedRoute><Student /></ProtectedRoute>} />
          <Route path='/create' element={<ProtectedRoute role="admin"><CreateStudent /></ProtectedRoute>} />
          <Route path='/update/:id' element={<ProtectedRoute role="admin"><UpdateStudent /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
