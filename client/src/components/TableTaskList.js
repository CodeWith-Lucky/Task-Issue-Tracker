import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TableTaskList.css';
import AddTask from './AddTask';
import './TaskViewModal.css';


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
    const [tasksPerPage] = useState(30); // Number of tasks per page

    const [selectedTask, setSelectedTask] = useState(null); // State for selected task
    const [showModal, setShowModal] = useState(false); // State for modal visibility


    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            setLoading(true); // Start loading
            const response = await fetch('http://localhost:3005/getalltasks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            data.sort((a, b) => b.taskId - a.taskId);

            setTasks(data);
            setFilteredTasks(data); // Initialize filtered tasks with all fetched data
        } catch (error) {
            alert('Getting error to Fetch Data')
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
            const response = await fetch(`http://localhost:3005/deletetasks/${ id }`, {
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


    const openModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };


    const getRowStyle = (priority) => {
        switch (priority) {
            case 'High':
                return { color: "#ff0000", fontWeight: "bold" }; // Dark red
            case 'Medium':
                return { color: "#dbab19", fontWeight: "bold" }; // Medium yellow
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

            <div className="filters-container mt-1" >
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
                        <option value="">All Status</option>
                        <option value="Initiated">Initiated</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="In Testing">In Testing</option>
                        <option value="Deployed">Deployed</option>
                        <option value="Completed">Completed</option>
                        <option value="Closed">Closed</option>
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
                                <th>Task Title</th>
                                <th>Task Priority</th>
                                <th>Task Status</th>
                                <th>Task Created Date</th>
                                <th>Task Deadline Date</th>
                                <th>Task Type</th>
                                <th>Task Created By</th>
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
                                    <td>{ task.taskTitle }</td>
                                    <td style={ getRowStyle(task.taskPriority) }>{ task.taskPriority }</td>
                                    <td>{ task.taskStatus }</td>
                                    <td>{ new Date(task.taskCreatedDate).toLocaleDateString() }</td>
                                    <td>{ new Date(task.taskDeadline).toLocaleDateString() }</td>

                                    <td>{ task.taskType }</td>
                                    <td>{ task.taskCreatedBy }</td>
                                    <td>{ task.taskAssignTo }</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm mr-2"

                                            onClick={ () => handleEdit(task) }
                                        >
                                            <i className="bi bi-pencil-fill" />
                                        </button>
                                        <button
                                            className=" btn btn-secondary btn-sm mr-2"
                                            onClick={ () => openModal(task) }

                                        >
                                            <i className="bi bi-eye-fill" />
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

                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                            <li className={ `page-item ${ currentPage === 1 ? 'disabled' : '' }` }>
                                <button
                                    className="page-link"
                                    onClick={ () => handlePageChange(currentPage - 1) }
                                    disabled={ currentPage === 1 }
                                >
                                    Previous
                                </button>
                            </li>

                            {/* Display up to 10 pages */ }
                            { pageNumbers.slice(currentPage - 1, currentPage + 9).map(number => (
                                <li key={ number } className={ `page-item ${ currentPage === number ? 'active' : '' }` }>
                                    <button
                                        className="page-link"
                                        onClick={ () => handlePageChange(number) }
                                    >
                                        { number }
                                    </button>
                                </li>
                            )) }

                            <li className={ `page-item ${ currentPage === pageNumbers.length ? 'disabled' : '' }` }>
                                <button
                                    className="page-link"
                                    onClick={ () => handlePageChange(currentPage + 1) }
                                    disabled={ currentPage === pageNumbers.length }
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            ) }

            {/* Bootstrap Modal */ }
            <div className={ `modal fade ${ showModal ? 'show' : '' }` } tabIndex="-1" style={ { display: showModal ? 'block' : 'none' } } aria-labelledby="taskDetailModalLabel" aria-hidden={ !showModal }>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="taskDetailModalLabel">Task Details</h5>
                            <button type="button" className="btn-close" onClick={ closeModal } aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={ { overflow: "auto" } }>
                            { selectedTask && (
                                <div>
                                    <p><strong>ID:</strong> { selectedTask.taskId }</p>
                                    <p><strong>Outlet Name:</strong> { selectedTask.outletName }</p>
                                    <p><strong>Client Name:</strong> { selectedTask.clientName }</p>
                                    <p><strong>Client No.:</strong> { selectedTask.clientNumber }</p>
                                    <p><strong>Outlet Module:</strong> { selectedTask.outletModule }</p>
                                    <p><strong>Task Title:</strong> { selectedTask.taskTitle }</p>
                                    <p><strong>Task Details:</strong> { selectedTask.taskDetails }</p>
                                    <p><strong>Priority:</strong> { selectedTask.taskPriority }</p>
                                    <p><strong>Status:</strong> { selectedTask.taskStatus }</p>
                                    <p><strong>Created Date:</strong> { new Date(selectedTask.taskCreatedDate).toLocaleDateString() }</p>
                                    <p><strong>Deadline Date:</strong> { new Date(selectedTask.taskDeadline).toLocaleDateString() }</p>
                                    <p><strong>Task Type:</strong> { selectedTask.taskType }</p>
                                    <p><strong>Created By:</strong> { selectedTask.taskCreatedBy }</p>
                                    <p><strong>Assigned To:</strong> { selectedTask.taskAssignTo }</p>
                                </div>
                            ) }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={ closeModal }>Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default TaskTable;
