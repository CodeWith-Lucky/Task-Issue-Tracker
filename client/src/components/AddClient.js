import React, { useState, useEffect } from 'react';
import "./AddClient.css";
import Select from 'react-select';

function AddClient({ showModal, setShowModal, onClientAdded, clientEdit }) {

    const [formData, setFormData] = useState({
        outletName: '',
        outletAddress: '',
        outletCity: '',
        outletOwnerName: '',
        outletOwnerNo: '',
        outletNos: '',
        outletLicenseNo: '',
        outletTerminalNos: '',
        outletInstallationDate: '',
        outletRenewalDate: '',
        outletRenewalCount: '',
        refPartName: '',
        outletSoftwareMode: '',
        outletSoftwareLink: '',
        outletModuleType: [],
        outletSoftwareCharge: '',
        isClosedReason: '',
        isActive: true,
        clientId: '',
    });

    useEffect(() => {
        if (clientEdit) {
            const moduleTypeArray = clientEdit.outletModuleType ? clientEdit.outletModuleType.split(',') : [];

            setFormData({
                clientId: clientEdit.clientId || '',
                outletName: clientEdit.outletName || '',
                outletAddress: clientEdit.outletAddress || '',
                outletCity: clientEdit.outletCity || '',
                outletOwnerName: clientEdit.outletOwnerName || '',
                outletOwnerNo: clientEdit.outletOwnerNo || '',
                outletNos: clientEdit.outletNos || '',
                outletLicenseNo: clientEdit.outletLicenseNo || '',
                outletTerminalNos: clientEdit.outletTerminalNos || '',
                outletInstallationDate: clientEdit.outletInstallationDate ? new Date(clientEdit.outletInstallationDate).toISOString().substr(0, 10) : '',
                outletRenewalDate: clientEdit.outletRenewalDate ? new Date(clientEdit.outletRenewalDate).toISOString().substr(0, 10) : '',
                outletRenewalCount: clientEdit.outletRenewalCount || '',
                refPartName: clientEdit.refPartName || '',
                outletSoftwareMode: clientEdit.outletSoftwareMode || '',
                outletSoftwareLink: clientEdit.outletSoftwareLink || '',
                outletModuleType: moduleTypeArray,
                outletSoftwareCharge: clientEdit.outletSoftwareCharge || '',
                isClosedReason: clientEdit.isClosedReason || '',
                isActive: clientEdit.isActive ?? true,
            });
        } else {
            setFormData({
                outletName: '',
                outletAddress: '',
                outletCity: '',
                outletOwnerName: '',
                outletOwnerNo: '',
                outletNos: '',
                outletLicenseNo: '',
                outletTerminalNos: '',
                outletInstallationDate: '',
                outletRenewalDate: '',
                outletRenewalCount: '',
                refPartName: '',
                outletSoftwareMode: '',
                outletSoftwareLink: '',
                outletModuleType: [],
                outletSoftwareCharge: '',
                isClosedReason: '',
                isActive: true,
                clientId: '',
            });
        }
    }, [clientEdit]);

    useEffect(() => {
        if (formData.outletSoftwareMode !== 'On Cloud') {
            setFormData(prev => ({ ...prev, outletSoftwareLink: '' }));
        }
    }, [formData.outletSoftwareMode]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleModuleTypeChange = (options) => {
        const selectedValues = options ? options.map(option => option.value) : [];
        setFormData(prevFormData => ({
            ...prevFormData,
            outletModuleType: selectedValues
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        const requiredFields = [
            'outletName',
            'outletAddress',
            'outletCity',
            'outletOwnerName',
            'outletOwnerNo',
            'outletSoftwareMode',
            'outletSoftwareCharge',
            'outletModuleType'
        ];

        for (let field of requiredFields) {
            if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
                alert(`Please fill out the ${field.replace(/([A-Z])/g, ' $1').trim()} field.`);
                return;
            }
        }

        try {
            const method = formData.clientId ? "PUT" : "POST";
            const url = formData.clientId
                ? `http://localhost:3005/editclient/${formData.clientId}`
                : "http://localhost:3005/addClient";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert(`${formData.clientId ? "Client Edit successfully" : "Client Created successfully"}`);
                setShowModal(false);
                onClientAdded();
                setFormData({
                    outletName: '',
                    outletAddress: '',
                    outletCity: '',
                    outletOwnerName: '',
                    outletOwnerNo: '',
                    outletNos: '',
                    outletLicenseNo: '',
                    outletTerminalNos: '',
                    outletInstallationDate: '',
                    outletRenewalDate: '',
                    outletRenewalCount: '',
                    refPartName: '',
                    outletSoftwareMode: '',
                    outletSoftwareLink: '',
                    outletModuleType: [],
                    outletSoftwareCharge: '',
                    isClosedReason: '',
                    isActive: true,
                    clientId: '',
                });
            } else {
                alert('Error creating/updating client');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating/updating client');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            outletName: '',
            outletAddress: '',
            outletCity: '',
            outletOwnerName: '',
            outletOwnerNo: '',
            outletNos: '',
            outletLicenseNo: '',
            outletTerminalNos: '',
            outletInstallationDate: '',
            outletRenewalDate: '',
            outletRenewalCount: '',
            refPartName: '',
            outletSoftwareMode: '',
            outletSoftwareLink: '',
            outletModuleType: [],
            outletSoftwareCharge: '',
            isClosedReason: '',
            isActive: true,
            clientId: '',
        });
    };

    const moduleOptions = [
        { value: 'Restaurant', label: 'Restaurant' },
        { value: 'QSR', label: 'QSR' },
        { value: 'PMS', label: 'PMS' },
        { value: 'Banquet', label: 'Banquet' },
        { value: 'Inventory', label: 'Inventory' },
        { value: 'Captain App', label: 'Captain App' },
        { value: 'QR Menu', label: 'QR Menu' },
    ];

    const selectedModuleOptions = moduleOptions.filter(option =>
        formData.outletModuleType.includes(option.value)
    );

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none', overflowY: 'auto', backdropFilter: 'blur(3px)' }} aria-labelledby="taskDetailModalLabel" aria-hidden={!showModal}>
            <div className="modal-dialog modal-xl custom">
                <div className="modal-content" style={{ maxWidth: "100%", margin: "auto" }}>
                    <div className="modal-header" style={{ padding: "3px" }}>
                        <h5 className="modal-title" id="taskDetailModalLabel">{formData.clientId ? "Update Client" : "Add Client"}</h5>
                        <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{ margin: "2px", padding: "2px" }}>
                        <form onSubmit={handleSubmit}>
                            {/* Row 1 */}
                            <div className="row g-3 mb-3">
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletName" className="form-label">Outlet Name <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter Outlet Name" name="outletName" id="outletName" value={formData.outletName} onChange={handleChange} required />
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletAddress" className="form-label">Outlet Address <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter Outlet Address" name="outletAddress" id="outletAddress" value={formData.outletAddress} onChange={handleChange} />
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletCity" className="form-label">Outlet City <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter Outlet City" name="outletCity" id="outletCity" value={formData.outletCity} onChange={handleChange} required />
                                </div>
                            </div>
                            {/* Row 2 */}
                            <div className="row g-3 mb-3">
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletOwnerName" className="form-label">Owner Name <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter Owner Name" name="outletOwnerName" id="outletOwnerName" value={formData.outletOwnerName} onChange={handleChange} />
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletOwnerNo" className="form-label">Owner No. <span style={{ color: 'red' }}>*</span></label>
                                    <input type="tel" className="form-control" placeholder="Enter Owner No" name="outletOwnerNo" id="outletOwnerNo" value={formData.outletOwnerNo} onChange={handleChange} />
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletNos" className="form-label">Outlet Nos.</label>
                                    <input type="number" className="form-control" placeholder="Enter Outlet Nos" name="outletNos" id="outletNos" value={formData.outletNos} onChange={handleChange} />
                                </div>
                            </div>
                            {/* Row 3 */}
                            <div className="row g-3 mb-3">
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletLicenseNo" className="form-label">Outlet License No.</label>
                                    <input type="text" className="form-control" placeholder="Enter License No" name="outletLicenseNo" id="outletLicenseNo" value={formData.outletLicenseNo} onChange={handleChange} />
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletTerminalNos" className="form-label">Outlet Terminal Nos.</label>
                                    <input type="number" className="form-control" placeholder="Enter Terminal Nos." name="outletTerminalNos" id="outletTerminalNos" value={formData.outletTerminalNos} onChange={handleChange} />
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="refPartName" className="form-label">Reference/Partner Name</label>
                                    <input type="text" className="form-control" placeholder="Enter Name" name="refPartName" id="refPartName" value={formData.refPartName} onChange={handleChange} />
                                </div>
                            </div>
                            {/* Row 4 */}
                            <div className="row g-3 mb-3">
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletInstallationDate" className="form-label">Outlet Installation Date <span style={{ color: 'red' }}>*</span> </label>
                                    <input type="date" className="form-control" name="outletInstallationDate" id="outletInstallationDate" value={formData.outletInstallationDate} onChange={handleChange} required />
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletRenewalDate" className="form-label">Outlet Renewal Date <span style={{ color: 'red' }}>*</span></label>
                                    <input type="date" className="form-control" name="outletRenewalDate" id="outletRenewalDate" value={formData.outletRenewalDate} onChange={handleChange}  required/>
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletRenewalCount" className="form-label">Outlet Renewal Count </label>
                                    <input type="number" className="form-control" placeholder="Enter Renewal Count" name="outletRenewalCount" id="outletRenewalCount" value={formData.outletRenewalCount} onChange={handleChange} />
                                </div>
                            </div>
                            {/* Row 5 */}
                            <div className="row g-3 mb-3">
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletModuleType" className="form-label">Outlet Module Type <span style={{ color: 'red' }}>*</span></label>
                                    <Select
                                        isMulti
                                        value={selectedModuleOptions}
                                        onChange={handleModuleTypeChange}
                                        options={moduleOptions}
                                        placeholder="Select Module Types"
                                        required
                                    />
                                </div>
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletSoftwareMode" className="form-label">Outlet Software Mode <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        className="form-select"
                                        name="outletSoftwareMode"
                                        id="outletSoftwareMode"
                                        onChange={handleChange}
                                        value={formData.outletSoftwareMode}
                                        required
                                    >
                                        <option value="" disabled>Select Software Mode</option>
                                        <option value="On Premises">On Premises</option>
                                        <option value="On Cloud">On Cloud</option>
                                    </select>
                                </div>
                                {formData.outletSoftwareMode === 'On Cloud' && (
                                    <div className="col-6 col-md-4">
                                        <label htmlFor="outletSoftwareLink" className="form-label">Software Link <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="outletSoftwareLink"
                                            name="outletSoftwareLink"
                                            placeholder="Enter Software Link"
                                            onChange={handleChange}
                                            value={formData.outletSoftwareLink}
                                        
                                        />
                                    </div>
                                )}
                                <div className="col-6 col-md-4">
                                    <label htmlFor="outletSoftwareCharge" className="form-label">Outlet Software Charge <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        className="form-select"
                                        name="outletSoftwareCharge"
                                        id="outletSoftwareCharge"
                                        onChange={handleChange}
                                        value={formData.outletSoftwareCharge}
                                    
                                    >
                                        <option value="" disabled>Select Software Charge Status</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Unpaid">Unpaid</option>
                                    </select>
                                </div>
                                <div className="col-6 col-md-4 d-flex align-items-center mt-4">
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        name="isActive"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="isActive">
                                        Active
                                    </label>
                                </div>
                                {!formData.isActive && (
                                    <div className="col-6 col-md-4">
                                        <label htmlFor='isClosedReason' className='form-label'>Closed Reason</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="isClosedReason"
                                            name="isClosedReason"
                                            placeholder="Enter Closed Reason"
                                            onChange={handleChange}
                                            value={formData.isClosedReason}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer" style={{ padding: "3px" }}>
                                <button type="submit" className="btn btn-success">{formData.clientId ? "Update Client" : "Add Client"}</button>
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default AddClient;
