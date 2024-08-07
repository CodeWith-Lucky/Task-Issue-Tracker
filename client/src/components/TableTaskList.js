import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TableTaskList.css';
import AddTask from './AddTask';

const TaskTable = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filters, setFilters] = useState({
        date: '',
        status: '',
        priority: '',
    });
    const [loading, setLoading] = useState(true); // Loader state
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10); // Number of tasks per page
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            setLoading(true); // Start loading
            const response = await fetch('http://localhost:8800/getalltasks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTasks(data);
            setFilteredTasks(data); // Initialize filtered tasks with all fetched data
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [AddTask]);

    useEffect(() => {
        // Filter tasks based on current filters
        const { date, status, priority } = filters;
        let filtered = tasks;

        if (date) {
            filtered = filtered.filter(task => new Date(task.taskCreatedDate).toLocaleDateString() === new Date(date).toLocaleDateString());
        }
        if (status) {
            filtered = filtered.filter(task => task.taskStatus === status);
        }
        if (priority) {
            filtered = filtered.filter(task => task.taskPriority === priority);
        }

        setFilteredTasks(filtered);
    }, [filters, tasks]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8800/deletetasks/${ id }`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTasks(tasks.filter(task => task.id !== id));
                alert('Task deleted successfully');
            } else {
                alert('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (task) => {
        navigate('/add-task', { state: { task } }); // Navigate to AddTask with task details
    };

    const addTaskPage = () => {
        navigate('/add-task');
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const getRowStyle = (priority) => {
        switch (priority) {
            case 'High':
                return { color: "#ff0000", fontWeight: "bold" }; // Dark red
            case 'Medium':
                return { color: "#FFC300", fontWeight: "bold" }; // Medium yellow
            case 'Standard':
                return { color: "rgb(27 149 26)", fontWeight: "bold" }; // Light green
            default:
                return {};
        }
    };

    // Calculate paginated tasks
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredTasks.length / tasksPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container full">
            <div className="header">
                <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: "20px", margin: "0px" } }>
                    <h5 style={ { margin: '0', textAlign: "center", } }>Task List</h5>
                    <button className='btn btn-primary btn-sm btn-lg' onClick={ () => addTaskPage() }>Add New Task</button>
                </div>
            </div>

            <div className="filters-container mt-1">
                <div className="filter-item" style={ { height: "5px" } } >
                    <label htmlFor="date" className="form-label">Filter by Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={ filters.date }
                        onChange={ handleFilterChange }
                        className="form-control"

                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="status" className="form-label">Filter by Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={ filters.status }
                        onChange={ handleFilterChange }
                        className="form-select"
                    >
                        <option value="">All Statuses</option>
                        <option value="Initiated">Initiated</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="filter-item">
                    <label htmlFor="priority" className="form-label">Filter by Priority:</label>
                    <select
                        id="priority"
                        name="priority"
                        value={ filters.priority }
                        onChange={ handleFilterChange }
                        className="form-select"
                    >
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            { loading ? (
                <div className="loader" style={ { textAlign: "center" } }>
                    <div className="spinner-border text-primary" role="status">

                    </div>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table table-striped mt-1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Outlet Name</th>
                                <th>Outlet Module</th>
                                <th>Client Number</th>
                                <th>Task Title</th>
                                <th>Task Priority</th>
                                <th>Task Status</th>
                                <th>Task Created Date</th>
                                <th>Task Type</th>
                                <th>Task Assign To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { currentTasks.map(task => (
                                <tr key={ task.id }>
                                    <td>{ task.taskId }</td>
                                    <td>{ task.outletName }</td>
                                    <td>{ task.outletModule }</td>
                                    <td>{ task.clientNumber }</td>
                                    <td>{ task.taskTitle }</td>
                                    <td style={ getRowStyle(task.taskPriority) }>{ task.taskPriority }</td>
                                    <td>{ task.taskStatus }</td>
                                    <td>{ new Date(task.taskCreatedDate).toLocaleDateString() }</td>
                                    <td>{ task.taskType }</td>
                                    <td>{ task.taskAssignTo }</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm mr-2"

                                            onClick={ () => handleEdit(task) }
                                        >
                                            Edit
                                        </button>
                                        {/* <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Delete
                                        </button> */}
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>

                    <nav aria-label="Page navigation" >
                        <ul className="pagination">
                            { pageNumbers.map(number => (
                                <li key={ number } className={ `page-item ${ currentPage === number ? 'active' : '' }` }>
                                    <button
                                        className="page-link"
                                        onClick={ () => handlePageChange(number) }
                                    >
                                        { number }
                                    </button>
                                </li>
                            )) }
                        </ul>
                    </nav>
                </div>
            ) }
        </div>
    );
};

export default TaskTable;
