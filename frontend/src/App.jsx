import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout'
import Login from './pages/Login'
import TodoList from './components/todo/todoList';
import CreateTodoForm from './components/todo/CreateTodoFrom';
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './pages/Register';
import UsersList from './components/users/UsersList';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register/>}/>
        <Route
          path="/"
          element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>}
        >
          <Route index element={<TodoList />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateTodoForm/>
              </ProtectedRoute>}/>
          <Route
            path='/usersList'
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UsersList/>
              </ProtectedRoute>}/>
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
