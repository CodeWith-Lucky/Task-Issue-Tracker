// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskTable from './components/TableTaskList.js';
import AddTask from './components/AddTask.js';
import Navbar from './components/Navbar.js'; // Assuming you have a Navbar component

const App = () => {
  
    return (
      <>
      <Navbar />
      
        <Routes>
          <Route path="/" element={<TaskTable />} />
          <Route path="/add-task" element={<AddTask />} />
        </Routes>
     
    </>
    );
};

export default App;
