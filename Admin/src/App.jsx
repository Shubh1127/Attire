import Home from './Home/Home'
import SignIn from './Auth/SignIn'
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Layout from './Layout/Layout'
import AddProduct from './Products/AddProduct'
function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<SignIn/>}/>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path='products' element={<AddProduct />} /> */}
          <Route path="products/add" element={<AddProduct />} />
          {/* <Route path="orders" element={<Orders />} /> */}
          {/* <Route path="customers" element={<div>Customers Page</div>} /> */}
          {/* <Route path="settings" element={<div>Settings Page</div>} /> */}
        </Route>
      </Routes>
    </div>
  )
}

export default App
