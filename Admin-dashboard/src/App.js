import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Home from './components/Home/Home.jsx';
import CustomPage from './components/Custompages/CustomPage.jsx';
import Settings from './components/setting/Setting.jsx';
import ManageUser from './components/manageUser/ManageUser.jsx';
import Product from './components/product/Product.jsx';
import CreateProduct from './components/product/CreateProduct.jsx'
import EditProduct from './components/product/EditProduct.jsx'
import CreateCustomPage from './components/Custompages/CreatePage.jsx';
import EditCustomPage from './components/Custompages/EditCustomPage.jsx';
import AdminBanner from './components/banner/Banner.jsx';
import EditBanner from './components/banner/Editbanner.jsx';
import Adminnavbar from './components/Adminnavbar/Adminnavbar.jsx';
import OrderTable from './components/order/Order.jsx';

function App() {
  return (
    <Router>
      <Adminnavbar/>
      <Dashboard>
        <Routes>
          <Route path="/admin" element={<Home />} />
          <Route path="/custompages" element={<CustomPage />} />
          <Route path="/create-custompage" element={<CreateCustomPage/>}/>
          <Route path='/edit-custompage/:slug' element={<EditCustomPage/>}/>
          <Route path="/settings" element={<Settings />} />
          <Route path="/user" element={<ManageUser/>}/>
          <Route path="/product" element={<Product/>}/>
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct/>} />
          <Route path="/banner" element={<AdminBanner/>}/>
          <Route path='/banner/:bannerId' element={<EditBanner />} />
          <Route path="/order" element={<OrderTable/>}/>

        </Routes>
      </Dashboard>
    </Router>
  );
}

export default App;