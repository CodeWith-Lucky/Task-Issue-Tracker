import React, { useState, useEffect } from 'react';
import AddClient from './AddClient';
import './TableTaskList.css';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const ClientList = () => {
    const [clientLists, setClientLists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ fromDate: '', toDate: '', month: '', paymentStatus: '' });
    const [filteredClient, setFilteredClient] = useState([]);
    const [searchClient, setSearchClient] = useState('');
    const [renewalCount, setRenewalCount] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModalClientList, setShowModalClientList] = useState(false);
    const [file, setFile] = useState(null);
    const [showImportClientModal, setShowImportClientModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientPerPage] = useState(100); // Number of tasks per page

    const navigate = useNavigate();

    const fetchClient = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3005/getallclients', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok from server');
            }
            const data = await response.json();
            data.sort((a, b) => b.clientId - a.clientId);
            setClientLists(data);
            applyFilters(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };
    const applyFilters = (data) => {
        const { fromDate, toDate, month, paymentStatus } = filters;
        let filtered = data || clientLists;

        if (month) {
            const selectedMonth = new Date(month).getMonth() + 1;
            const selectedYear = new Date(month).getFullYear();

            filtered = filtered.filter(client => {
                const renewalDate = new Date(client.outletRenewalDate);
                return renewalDate.getMonth() + 1 === selectedMonth && renewalDate.getFullYear() === selectedYear;
            });
            setRenewalCount(filtered.length);
        }

        if (fromDate && toDate) {
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);

            filtered = filtered.filter(client => {
                const installDate = new Date(client.outletInstallationDate);
                return installDate >= startDate && installDate <= endDate;
            });
            
        }

        if (paymentStatus) {
            filtered = filtered.filter(client => {
                const chargeStatus = client.outletSoftwareCharge?.trim().toLowerCase();
                return chargeStatus === paymentStatus.toLowerCase();
            });
        }

        if (searchClient) {
            filtered = filtered.filter(client =>
                (client.outletOwnerName?.toLowerCase() || '').includes(searchClient.toLowerCase()) ||
                (client.outletName?.toLowerCase() || '').includes(searchClient.toLowerCase()) ||
                (client.outletModule?.toLowerCase() || '').includes(searchClient.toLowerCase())
            );
        }

        setFilteredClient(filtered);
    };




    useEffect(() => {
        fetchClient();
    }, []);

    useEffect(() => {
        applyFilters(); // Apply filters after client list is fetched or filters/search text changes
    }, [filters, searchClient, clientLists]);

    const handleFilterChanges = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters, [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchClient(e.target.value);
    };

    const handleEditClick = (client) => {
        setSelectedClient(client);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedClient(null);
    };

    const handleCloseModalClientList = () => {
        setSelectedClient(null);
        setShowModalClientList(false);
    };

    const handleShowModalClientList = (client) => {
        setSelectedClient(client);
        setShowModalClientList(true);
    };
    // import client 



    const handleImportFileChange = (e) => {
        const file = e.target.files[0];
        console.log('Selected file:', file); // Log the file to check if it's being set
        setFile(file);
    };

    const handleImportClient = async () => {
        if (!file) {
            alert('No file selected');
            return;
        }

        const formData = new FormData();

        formData.append('file', file);
        console.log(formData);

        for (const pair of formData.entries()) {
            console.log(`${ pair[0] }: ${ pair[1] }`); // This will log key-value pairs
        }

        try {
            setLoading(true)

            const response = await fetch('http://localhost:3005/importclient', {
                method: 'POST',

                body: formData,
            });


            if (response.ok) {
                setLoading(false);
                alert('Client Upload success');
                setShowImportClientModal(false); // Close the modal on success
                setFile(null); // Clear the selected file
                fetchClient();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            alert('Error: ' + error);
        }
    };

    const handleExportClient = () => {
        // Implement export functionality here if needed
        const fileName = 'Client_List.xlsx';

        const ws = XLSX.utils.json_to_sheet(clientLists);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

        XLSX.writeFile(wb, fileName);
    };

    // Simple styles for the modal (can be moved to a CSS file)
    const modalStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const modalContentStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center',
    };


    // Calculate paginated tasks
    const indexOfLastClient = currentPage * clientPerPage;
    const indexOfFirstClient = indexOfLastClient - clientPerPage;
    const currentClients = filteredClient.slice(indexOfFirstClient, indexOfLastClient);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredClient.length / clientPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className='container full'>
            <div className="header">
                <div
                    style={ {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '20px',
                        margin: '0px',
                        padding: '10px',
                    } }
                >
                    <h5
                        style={ {
                            margin: '0',
                            textAlign: 'left',
                            flex: '0 0 150px',
                        } }
                    >
                        Client List
                    </h5>
                    <div
                        style={ {
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flex: '1',
                        } }
                    >
                        <button
                            className="btn btn-primary btn-sm btn-lg"
                            style={ { marginRight: '10px' } }
                            onClick={ () => setShowModal(true) }
                        >
                            Add Client
                        </button>
                        <button
                            className="btn btn-primary btn-sm btn-lg"
                            style={ { marginRight: '10px' } }
                            onClick={ () => setShowImportClientModal(true) }
                        >
                            Import Client
                        </button>
                        <button
                            className="btn btn-primary btn-sm btn-lg"
                            onClick={ handleExportClient }
                        >
                            Export Client
                        </button>
                    </div>
                </div>
            </div>



            {/* Import Client Modal */ }
            { showImportClientModal && (
                <div className="modal" style={ modalStyle }>
                    <div className="modal-content" style={ modalContentStyle }>
                        <h5 >Import Clients</h5>
                        <form style={ { display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
                            <input
                                type="file"
                                name='file'
                                accept=".xlsx, .xls"
                                onChange={ handleImportFileChange } // Handle file selection here
                            />
                            <div style={ { marginTop: '10px' } }>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={ handleImportClient } // Trigger file upload
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={ { marginLeft: '10px' } }
                                    onClick={ () => setShowImportClientModal(false) } // Close the modal
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) }

            <div className="filters-container mt-1">
                <div className="filter-item mt-1">
                    <label htmlFor="month" className="form-label">Renewal Count By Month: { renewalCount }</label>
                    <input
                        type="month"
                        id="month"
                        name="month"
                        value={ filters.month }
                        onChange={ handleFilterChanges }
                        className="form-control"
                    />
                </div>
                <div className="filter-item mt-1">
                    <label htmlFor="fromDate" className="form-label">From Date:</label>
                    <input
                        type="date"
                        id="fromDate"
                        name="fromDate"
                        value={ filters.fromDate }
                        onChange={ handleFilterChanges }
                        className="form-control"
                    />
                </div>
                <div className="filter-item mt-1">
                    <label htmlFor="toDate" className="form-label">To Date:</label>
                    <input
                        type="date"
                        id="toDate"
                        name="toDate"
                        value={ filters.toDate }
                        onChange={ handleFilterChanges }
                        className="form-control"
                    />
                </div>
                <div className="filter-item mt-1">
                    <label htmlFor="paymentStatus" className="form-label">Payment Status:</label>
                    <select
                        id="paymentStatus"
                        name="paymentStatus"
                        value={ filters.paymentStatus }
                        onChange={ handleFilterChanges }
                        className="form-select"
                    >
                        <option value="">All</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                    </select>
                </div>
                <div className="filter-item mt-1">
                    <label htmlFor="search" className="form-label">Search:</label>
                    <input
                        type="text"
                        id="search"
                        value={ searchClient }
                        onChange={ handleSearchChange }
                        className="form-control"
                        placeholder="Search by Owner Name, Outlet Name, or Owner No"
                    />
                </div>
            </div>

            { loading ? (
                <div className="loader" style={ { textAlign: "center" } }>
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="table-container mt-1">
                    <table className="table table-striped mt-1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Owner Name</th>
                                <th>Outlet Name</th>
                                <th>Outlet Module</th>
                                <th>City</th>
                                <th>Installation Date</th>
                                <th>Renewal Date</th>
                                <th>Renewal Count</th>
                                <th>Software Mode</th>
                                <th>Payment Status</th>
                                <th>Active Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { Array.isArray(currentClients) && currentClients.map(client => (
                                <tr key={ client.clientId }>
                                    <td>{ client.clientId }</td>
                                    <td>{ client.outletOwnerName }</td>
                                    <td>{ client.outletName }</td>
                                    <td>{ client.outletModuleType }</td>
                                    <td>{ client.outletCity }</td>
                                    <td>{ new Date(client.outletInstallationDate).toLocaleDateString() }</td>
                                    <td>{ new Date(client.outletRenewalDate).toLocaleDateString() }</td>
                                    <td>{ client.outletRenewalCount }</td>
                                    <td>{ client.outletSoftwareMode }</td>
                                    <td>{ client.outletSoftwareCharge }</td>
                                    <td style={{width:"20px"}}>
                                            { client.isActive ? (
                                                <i className="bi bi-check-circle text-success"></i>
                                            ) : (
                                                <i className="bi bi-x-circle text-danger"></i>
                                            )}
                                        </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={ () => handleEditClick(client) }
                                        >
                                            <i className="bi bi-pencil-fill" />
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={ () => handleShowModalClientList(client) }
                                        >
                                            <i className="bi bi-eye-fill" />
                                        </button>
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
            <AddClient
                showModal={ showModal }
                setShowModal={ handleModalClose }
                onClientAdded={ fetchClient }
                clientEdit={ selectedClient }
            />

            <div className={ `modal fade ${ showModalClientList ? 'show' : '' }` } tabIndex="-1" style={ { display: showModalClientList ? 'block' : 'none' } } aria-labelledby="taskDetailModalLabel" aria-hidden={ !showModalClientList }>
                <div className="modal-dialog modal-xl custom">
                    <div className="modal-content" style={ { maxWidth: "100%", margin: "auto" } }>
                        <div className="modal-header" style={ { padding: "3px" } }>
                            <h5 className="modal-title" id="taskDetailModalLabel">Client Details</h5>
                            <button type="button" className="btn-close" onClick={ handleCloseModalClientList } aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            { selectedClient && (
                                <div className="row">
                                    <div className="col-md-4">
                                        <p><strong>ID:</strong> { selectedClient.clientId }</p>
                                        <p><strong>Outlet Name:</strong> { selectedClient.outletName }</p>
                                        <p><strong>Outlet Address:</strong> { selectedClient.outletAddress }</p>
                                        <p><strong>City:</strong> { selectedClient.outletCity }</p>
                                        <p><strong>Owner Name:</strong> { selectedClient.outletOwnerName }</p>
                                        <p><strong>Owner Number:</strong> { selectedClient.outletOwnerNo }</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Number of Outlets:</strong> { selectedClient.outletNos }</p>
                                        <p><strong>License No:</strong> { selectedClient.outletLicenseNo }</p>
                                        <p><strong>Terminal Nos:</strong> { selectedClient.outletTerminalNos }</p>
                                        <p><strong>Installation Date:</strong> { new Date(selectedClient.outletInstallationDate).toLocaleDateString() }</p>
                                        <p><strong>Renewal Date:</strong> { new Date(selectedClient.outletRenewalDate).toLocaleDateString() }</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p><strong>Renewal Count:</strong> { selectedClient.outletRenewalCount }</p>
                                        <p><strong>Partner/Ref Name:</strong> { selectedClient.refPartName }</p>
                                        <p><strong>Software Mode:</strong> { selectedClient.outletSoftwareMode }</p>
                                        <p><strong>Software Link:</strong> { selectedClient.outletSoftwareLink }</p>
                                        <p><strong>Module Type:</strong> { selectedClient.outletModuleType }</p>
                                        <p><strong>Software Charge:</strong> { selectedClient.outletSoftwareCharge }</p>
                                        <p><strong>Closed Reason:</strong> { selectedClient.isClosedReason }</p>
                                        <p><strong>Status:</strong> { selectedClient.isActive ? 'Active' : 'Inactive' }</p>
                                    </div>
                                </div>
                            ) }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={ handleCloseModalClientList }>Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ClientList;
