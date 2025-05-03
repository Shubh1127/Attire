import Home from './Home/Home';
import SignIn from './Auth/SignIn';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Layout from './Layout/Layout';
import AddProduct from './Products/AddProduct';
import Settings from './Dashboard/Setting';
import AdminProtected from './AdminProtected/AdminProtected';
import Orders from './Pages/Orders';
import Customers from './Pages/Customers';
import Inventory from './Pages/Inventory';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <AdminProtected>
              <Layout />
            </AdminProtected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="settings" element={<Settings />} />
          <Route path='orders' element={<Orders />} />
          <Route path='customers' element={<Customers />} />
          <Route path='inventory' element={<Inventory />} />
        </Route>
        <Route path='*' element={<h1 className='text-center my-[48vh] text-4xl'>404 Not Found</h1>} />

      </Routes>
    </div>
  );
}

export default App;