// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskTable from './components/TableTaskList';
import AddTask from './components/AddTask';
import Navbar from './components/Navbar'; // Import Navbar component
import AddClient from './components/AddClient';
import ClientList from './components/ClientList';

const App = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<TaskTable />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/manage-client" element={<ClientList />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
