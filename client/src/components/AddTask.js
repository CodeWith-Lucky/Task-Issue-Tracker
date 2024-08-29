import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddTask.css";

const AddTask = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    outletName: "",
    outletModule: "",
    clientName: "",
    clientNumber: "",
    taskTitle: "",
    taskDetails: "",
    taskPriority: "",
    taskStatus: "",
    taskCreatedDate: "",
    taskType: "",
    taskCreatedBy: "",
    taskDeadline: "",
    taskAssignTo: "",
    taskId: "",
  });

  const formatDateForInput = (date) => {
    if (!(date instanceof Date)) {
      throw new Error("Invalid date object");
    }
  
    // Convert date to IST (UTC+5:30) and then to local date
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const dateInIST = new Date(date.getTime() + IST_OFFSET);
  
    // Format for HTML `date` input (yyyy-MM-dd)
    const formattedDateForInput = `${dateInIST.getUTCFullYear()}-${String(
      dateInIST.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(dateInIST.getUTCDate()).padStart(2, "0")}`;
  
    return formattedDateForInput;
  };
  

  function formatDateToYYYYMMDD(dates) {
    const day = String(dates.getDate()).padStart(2, '0');
    const month = String(dates.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = dates.getFullYear();
  
    return `${year}-${month}-${day}`;
  }
  

useEffect(() => {
  const task = location.state?.task;
  if (task) {
    console.log('Editing task:', task); // Check the data

    setFormData({
      ...task,
      taskCreatedDate: formatDateForInput(new Date(task.taskCreatedDate)),
      taskDeadline: formatDateToYYYYMMDD(new Date(task.taskDeadline))
    });

    console.log('de', task.taskDeadline);
    console.log('Form data set:', formData); // Ensure `formData` includes `taskDeadline`
  } else {

    const now = new Date();
    const formattedDateTime = formatDateForInput(now);

    setFormData((prevState) => ({
      ...prevState,
      taskCreatedDate: formattedDateTime,
      // Include other fields if needed
    }));
  }
}, [location.state]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      const method = formData.taskId ? "PUT" : "POST";
      console.log("Method:", method);

      const url = formData.taskId
        ? `http://localhost:3005/edittasks/${formData.taskId}`
        : "http://localhost:3005/addtask";
      console.log("URL:", url);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // credentials: 'include' // Add this line to send credentials
      });

      console.log("Response:", formData);

      if (response.ok) {
        alert(`${formData.taskId ? "Task Edit successfully" : "Task Created successfully"}`);
        navigate("/");
        setFormData({
          outletName: "",
          outletModule: "",
          clientName: "",
          clientNumber: "",
          taskTitle: "",
          taskDetails: "",
          taskPriority: "",
          taskStatus: "",
          taskCreatedDate: "",
          taskType: "",
          taskCreatedBy: "",
          taskDeadline: "",
          taskAssignTo: "",
          taskId: "",
        });
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const backList = () => {
    navigate("/");
  };

  return (
    <div
      className="container form-container mt-1"
      style={{ overflowY: "auto" }}
    >
      <h5 className="text-center mb-2">
        {formData.taskId ? "Edit Task" : "Add Task"}
      </h5>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "2px solid #ccc",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <div className="row">
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label htmlFor="outletName" className="form-label font-weight-bold">
              Outlet Name
            </label>
            <input
              type="text"
              className="form-control"
              id="outletName"
              name="outletName"
              value={formData.outletName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label
              htmlFor="outletModule"
              className="form-label font-weight-bold"
            >
              Property Module *
            </label>
            <select
              className="form-select"
              id="outletModule"
              name="outletModule"
              value={formData.outletModule}
              onChange={handleChange}
              required
            >
              <option value="">Select Module</option>
              <option value="Restaurant">Restaurant</option>
              <option value="QSR">QSR</option>
              <option value="PMS">PMS</option>
              <option value="Banquet">Banquet</option>
              <option value="Inventory">Inventory</option>
            </select>
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label
              htmlFor="taskPriority"
              className="form-label font-weight-bold"
            >
              Task Priority *
            </label>
            <select
              className="form-select"
              id="taskPriority"
              name="taskPriority"
              value={formData.taskPriority}
              onChange={handleChange}
              required
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label htmlFor="clientName" className="form-label font-weight-bold">
              Client Name
            </label>
            <input
              type="text"
              className="form-control"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label htmlFor="taskStatus" className="form-label font-weight-bold">
              Task Status *
            </label>
            <select
              className="form-select"
              id="taskStatus"
              name="taskStatus"
              value={formData.taskStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Initiated">Initiated</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="In Testing">In Testing</option>
              <option value="Deployed">Deployed</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label htmlFor="taskType" className="form-label font-weight-bold">
              Task Type *
            </label>
            <select
              className="form-select"
              id="taskType"
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              required
            >
              <option value="">Select Task Type</option>
              <option value="Bugs">Bugs</option>
              <option value="UI Change">UI Change</option>
              <option value="SetUp File Issue">SetUp File Issue</option>
              <option value="Calculation Error">Calculation Error</option>
              <option value="New Feature">New Feature</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label
              htmlFor="clientNumber"
              className="form-label font-weight-bold"
            >
              Client Number
            </label>
            <input
              type="text"
              className="form-control"
              id="clientNumber"
              name="clientNumber"
              value={formData.clientNumber}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label
              htmlFor="taskCreatedBy"
              className="form-label font-weight-bold"
            >
              Task Created By *
            </label>
            <select
              className="form-select"
              id="taskCreatedBy"
              name="taskCreatedBy"
              value={formData.taskCreatedBy}
              onChange={handleChange}
              required
            >
              <option value="">Select Task Created By</option>
              <option value="Uttam Sir">Uttam Sir</option>
              <option value="Nitin Sir">Nitin Sir</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label
              htmlFor="taskAssignTo"
              className="form-label font-weight-bold"
            >
              Task Assign To *
            </label>
            <select
              className="form-select"
              id="taskAssignTo"
              name="taskAssignTo"
              value={formData.taskAssignTo}
              onChange={handleChange}
              required
            >
              <option value="">Select Task Assign To</option>
              <option value="Uttam Sir">Uttam Sir</option>
              <option value="Nitin Sir">Nitin Sir</option>
              <option value="Lucky">Lucky</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label
              htmlFor="taskCreatedDate"
              className="form-label font-weight-bold"
            >
              Task Created Date *
            </label>
            <input
              type="date"
              className="form-control"
              id="taskCreatedDate"
              name="taskCreatedDate"
              value={formData.taskCreatedDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <label
              htmlFor="taskDeadline"
              className="form-label font-weight-bold"
            >
              Task Deadline Date *
            </label>
            <input
              type="date"
              className="form-control"
              id="taskDeadline"
              name="taskDeadline"
              value={formData.taskDeadline}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 col-md-12">
            <label htmlFor="taskTitle" className="form-label font-weight-bold">
              Task Title *
            </label>
            <input
              type="text"
              className="form-control"
              id="taskTitle"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleChange}
              style={{height:"38px"}}
            />
          </div>
          <div className="mb-3 col-md-12">
            <label
              htmlFor="taskDetails"
              className="form-label font-weight-bold"
            >
              Task Details *
            </label>
            <textarea
              className="form-control"
              id="taskDetails"
              name="taskDetails"
              rows="5"
              value={formData.taskDetails}
              onChange={handleChange}
              required
              style={{height:"50px"}}
            ></textarea>
          </div>

          <div className="sticky-footer" style={{ textAlign: "center" }}>
            <button type="submit" className="btn btn-success">
              {formData.taskId ? "Update Task" : "Submit Task"}
            </button>
            <button
              type="button"
              className="btn btn-danger ms-2"
              onClick={backList}
            >
              Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;

//   return (
//     <div
//       className="container form-container mt-2"
//     style={{maxWidth:"100%"}}
//     >
//       <span>

//         <h5 style={ { textAlign: "center", padding: "2px" } }>{ formData.taskId ? "Edit Task" : "Add Task" }</h5>
//       </span>

//       <form
//         onSubmit={ handleSubmit }
//         style={ {
//           border: "2px solid #ccc",
//           padding: "5px",
//           borderRadius: "5px",

//         } }
//       >
//         <div className="row">
//           {/* General Fields */ }
//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="outletName" className="form-label font-weight-bold">
//               Outlet Name
//             </label>
//             <input
//               type="text"
//               value={ formData.outletName }
//               onChange={ handleChange }
//               name="outletName"
//               className="form-control"
//               id="outletName"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="outletModule"
//               className="form-label font-weight-bold"
//             >
//               Property Module *
//             </label>
//             <select
//               name="outletModule"
//               value={ formData.outletModule }
//               onChange={ handleChange }
//               className="form-select"
//               id="outletModule"
//               required
//             >
//               <option value="">Select Module</option>
//               <option value="Restaurant">Restaurant</option>
//               <option value="QSR">QSR</option>
//               <option value="PMS">PMS</option>
//               <option value="Banquet">Banquet</option>
//               <option value="Inventory">Inventory</option>
//             </select>
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskPriority"
//               className="form-label font-weight-bold"
//             >
//               Task Priority *
//             </label>
//             <select
//               name="taskPriority"
//               value={ formData.taskPriority }
//               onChange={ handleChange }
//               className="form-select"
//               id="taskPriority"
//               required
//             >
//               <option value="">Select Priority</option>
//               <option value="High">High</option>
//               <option value="Medium">Medium</option>
//               <option value="Standard">Standard</option>
//             </select>
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="clientName" className="form-label font-weight-bold">
//               Client Name
//             </label>
//             <input
//               type="text"
//               value={ formData.clientName }
//               onChange={ handleChange }
//               name="clientName"
//               className="form-control"
//               id="clientName"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="taskStatus" className="form-label font-weight-bold">
//               Task Status *
//             </label>
//             <select
//               name="taskStatus"
//               value={ formData.taskStatus }
//               onChange={ handleChange }
//               className="form-select"
//               id="taskStatus"
//               required
//             >
//               <option value="">Select Status</option>
//               <option value="Initiated">Initiated</option>
//               <option value="Pending">Pending</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Tested & Completed</option>
//             </select>
//           </div>
//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="taskType" className="form-label font-weight-bold">
//               Task Type *
//             </label>
//             <select

//               value={ formData.taskType }
//               onChange={ handleChange }
//               name="taskType"
//               className="form-select"
//               id="taskType"
//               required
//             >
//               <option value="">Select Task Type</option>
//               <option value="Bugs">Bugs</option>
//               <option value="UI Change">UI Change</option>
//               <option value="SetUp File Issue">SetUp File Issue</option>
//               <option value="Calculation Error">Calculation Error</option>
//               <option value="New Feature">New Feature</option>
//             </select>
//           </div>
//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="clientNumber"
//               className="form-label font-weight-bold"
//             >
//               Client Number
//             </label>
//             <input
//               type="text"
//               value={ formData.clientNumber }
//               onChange={ handleChange }
//               name="clientNumber"
//               className="form-control"
//               id="clientNumber"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskCreatedBy"
//               className="form-label font-weight-bold"
//             >
//               Task Created By *
//             </label>
//             <select

//               value={ formData.taskCreatedBy }
//               onChange={ handleChange }
//               name="taskCreatedBy"
//               className="form-select"
//               id="taskCreatedBy"
//               required
//             >
//               <option value="">Select Task Created By</option>
//               <option value="Uttam Sir">Uttam Sir</option>
//               <option value="Nitin Sir">Nitin Sir</option>
//               <option value="Others">Others</option>

//             </select>
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskAssignTo"
//               className="form-label font-weight-bold"
//             >
//               Task Assign To *
//             </label>
//             <select

//               value={ formData.taskAssignTo }
//               onChange={ handleChange }
//               name="taskAssignTo"
//               className="form-select"
//               id="taskAssignTo"
//               required
//             >
//               <option value="">Select Task  Assign To</option>
//               <option value="Uttam Sir">Uttam Sir</option>
//               <option value="Nitin Sir">Nitin Sir</option>
//               <option value="Lucky">Lucky</option>
//               <option value="Others">Others</option>

//             </select>
//           </div>
//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskCreatedDate"
//               className="form-label font-weight-bold"
//             >
//               Task Created Date *
//             </label>
//             <input
//               type="datetime-local"
//               value={ formData.taskCreatedDate }
//               onChange={ handleChange }
//               name="taskCreatedDate"
//               className="form-control"
//               id="taskCreatedDate"
//               required
//             />
//           </div>

//           <div className="mb-3 col-md-12" style={ { width: "80%" } }>
//             <label htmlhtmlFor="taskTitle" className="form-label font-weight-bold">
//               Task Title *
//             </label>
//             <input
//               type="text"
//               value={ formData.taskTitle }
//               onChange={ handleChange }
//               name="taskTitle"
//               className="form-control"
//               id="taskTitle"
//               style={ { width: "100%" } }

//             />
//           </div>

//           <div className="mb-3 col-md-12" style={ { width: "80%" } }>
//             <label
//               htmlhtmlFor="taskDetails"
//               className="form-label font-weight-bold"
//             >
//               Task Details *
//             </label>
//             <input
//               name="taskDetails"
//               value={ formData.taskDetails }
//               onChange={ handleChange }
//               className="form-control"
//               id="taskDetails"
//               rows="5"
//               style={ { width: "100%" } }
//               required
//             ></input>
//           </div>

//           <div style={{ position: 'sticky', bottom: 0, textAlign: 'center' }}>
//   <button type="submit" className="btn btn-primary">
//     {formData.taskId ? "Update Task" : "Submit Task"}
//   </button>
//   <button
//     className="btn btn-secondary ml-2"
//     type="button"
//     onClick={backList}
//     style={{ marginLeft: "5px" }}
//   >
//     Back
//   </button>
// </div>

//         </div>

//       </form>
//     </div>
//   );

// good css

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./AddTask.css";

// const AddTask = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const getFormattedTime = () => {
//     const currentDate = new Date();
//     const options = {
//       hour: "numeric",
//       minute: "numeric",
//       second: "numeric",
//       hour12: true,
//     };
//     return currentDate.toLocaleTimeString("en-US", options);
//   };

//   const [formData, setFormData] = useState({
//     outletName: "",
//     outletModule: "",
//     clientName: "",
//     clientNumber: "",
//     taskTitle: "",
//     taskDetails: "",
//     taskPriority: "",
//     taskStatus: "",
//     taskCreatedDate: "", // Ensure this matches with input field
//     taskType: "",
//     taskCreatedBy: "",
//     taskAssignTo: "",
//     taskId: "",
//   });

//   const formatDateTimeForInput = (date) => {
//     if (!(date instanceof Date)) {
//       throw new Error("Invalid date object");
//     }

//     // Convert date to IST (UTC+5:30)
//     const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
//     const dateInIST = new Date(date.getTime() + IST_OFFSET);

//     // Extract date in yyyy-MM-dd format
//     const formattedDate = dateInIST.toISOString().slice(0, 10);

//     // Extract time in 12-hour format with AM/PM
//     let hours = dateInIST.getUTCHours();
//     const minutes = dateInIST.getUTCMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
//     const formattedTime = `${hours}:${
//       minutes < 10 ? "0" : ""
//     }${minutes} ${ampm}`;

//     // Note: HTML datetime-local input expects 24-hour time format
//     const formattedTimeForInput = `${dateInIST.getUTCFullYear()}-${String(
//       dateInIST.getUTCMonth() + 1
//     ).padStart(2, "0")}-${String(dateInIST.getUTCDate()).padStart(
//       2,
//       "0"
//     )}T${String(dateInIST.getUTCHours()).padStart(2, "0")}:${String(
//       dateInIST.getUTCMinutes()
//     ).padStart(2, "0")}`;

//     return formattedTimeForInput;
//   };

//   useEffect(() => {
//     const task = location.state?.task;
//     console.log(task);

//     if (task) {
//       // Format the task date-time for input
//       const formattedDateTime = task.taskCreatedDate
//         ? formatDateTimeForInput(new Date(task.taskCreatedDate.toISOString()))
//         : "";

//       setFormData({
//         ...task,
//         taskCreatedDate: formattedDateTime,
//       });
//     } else {
//       const now = new Date();
//       const formattedDateTime = formatDateTimeForInput(now);

//       setFormData((prevState) => ({
//         ...prevState,
//         taskCreatedDate: formattedDateTime,
//       }));
//     }
//   }, [location.state]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form Data:", formData);

//     try {
//       const method = formData.taskId ? "PUT" : "POST";
//       console.log("Method:", method);

//       const url = formData.taskId
//         ? `http://localhost:8800/edittasks/${formData.taskId}`
//         : "http://localhost:8800/addtask";
//       console.log("URL:", url);

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       console.log("Response:", formData);

//       if (response.ok) {
//         alert("Task added successfully");
//         setFormData({
//           outletName: "",
//           outletModule: "",
//           clientName: "",
//           clientNumber: "",
//           taskTitle: "",
//           taskDetails: "",
//           taskPriority: "",
//           taskStatus: "",
//           taskCreatedDate: "",
//           taskType: "",
//           taskCreatedBy: "",
//           taskAssignTo: "",
//           taskId: "",
//         });
//       } else {
//         console.error("Failed to add task");
//       }
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };

//   const backList = () => {
//     navigate("/");
//   };

//   return (
//     <div
//       className="container mt-2"
//       style={{ overflowY: "auto", height: "100vh" }}
//     >
//       <span>
//         <h3 style={{ textAlign: "center", padding: "0px" }}>Task Form</h3>
//       </span>

//       <form
//         onSubmit={handleSubmit}
//         style={{
//           border: "2px solid #ccc",
//           padding: "5px",
//           borderRadius: "5px",
//         }}
//       >
//         <div className="row">
//           {/* General Fields */}
//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="outletName" className="form-label font-weight-bold">
//               Outlet Name
//             </label>
//             <input
//               type="text"
//               value={formData.outletName}
//               onChange={handleChange}
//               name="outletName"
//               className="form-control"
//               id="outletName"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="outletModule"
//               className="form-label font-weight-bold"
//             >
//               Property Module
//             </label>
//             <select
//               name="outletModule"
//               value={formData.outletModule}
//               onChange={handleChange}
//               className="form-select"
//               id="outletModule"
//               required
//             >
//               <option value="">Select Module</option>
//               <option value="Restaurant">Restaurant</option>
//               <option value="QSR">QSR</option>
//               <option value="PMS">PMS</option>
//               <option value="Banquet">Banquet</option>
//               <option value="Inventory">Inventory</option>
//             </select>
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="clientName" className="form-label font-weight-bold">
//               Client Name
//             </label>
//             <input
//               type="text"
//               value={formData.clientName}
//               onChange={handleChange}
//               name="clientName"
//               className="form-control"
//               id="clientName"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="clientNumber"
//               className="form-label font-weight-bold"
//             >
//               Client Number
//             </label>
//             <input
//               type="text"
//               value={formData.clientNumber}
//               onChange={handleChange}
//               name="clientNumber"
//               className="form-control"
//               id="clientNumber"
//             />
//           </div>
//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskPriority"
//               className="form-label font-weight-bold"
//             >
//               Task Priority
//             </label>
//             <select
//               name="taskPriority"
//               value={formData.taskPriority}
//               onChange={handleChange}
//               className="form-select"
//               id="taskPriority"
//               required
//             >
//               <option value="">Select Priority</option>
//               <option value="High">High</option>
//               <option value="Medium">Medium</option>
//               <option value="Low">Low</option>
//             </select>
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="taskStatus" className="form-label font-weight-bold">
//               Task Status
//             </label>
//             <select
//               name="taskStatus"
//               value={formData.taskStatus}
//               onChange={handleChange}
//               className="form-select"
//               id="taskStatus"
//               required
//             >
//               <option value="">Select Status</option>
//               <option value="Initiated">Initiated</option>
//               <option value="Pending">Pending</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Resolved">Resolved</option>
//               <option value="Closed">Closed</option>
//             </select>
//           </div>

//           {/* Task Details */}
//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="taskTitle" className="form-label font-weight-bold">
//               Task Title
//             </label>
//             <input
//               type="text"
//               value={formData.taskTitle}
//               onChange={handleChange}
//               name="taskTitle"
//               className="form-control"
//               id="taskTitle"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskDetails"
//               className="form-label font-weight-bold"
//             >
//               Task Details
//             </label>
//             <input
//               type="text"
//               value={formData.taskDetails}
//               onChange={handleChange}
//               name="taskDetails"
//               className="form-control"
//               id="taskDetails"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskCreatedDate"
//               className="form-label font-weight-bold"
//             >
//               Task Created Date
//             </label>
//             <input
//               type="datetime-local"
//               value={formData.taskCreatedDate}
//               onChange={handleChange}
//               name="taskCreatedDate"
//               className="form-control"
//               id="taskCreatedDate"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label htmlhtmlFor="taskType" className="form-label font-weight-bold">
//               Task Type
//             </label>
//             <select
//               name="taskType"
//               value={formData.taskType}
//               onChange={handleChange}
//               className="form-select"
//               id="taskType"
//               required
//             >
//               <option value="">Select Type</option>
//               <option value="New">New</option>
//               <option value="Update">Update</option>
//               <option value="Support">Support</option>
//               <option value="Maintenance">Maintenance</option>
//             </select>
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskCreatedBy"
//               className="form-label font-weight-bold"
//             >
//               Task Created By
//             </label>
//             <input
//               type="text"
//               value={formData.taskCreatedBy}
//               onChange={handleChange}
//               name="taskCreatedBy"
//               className="form-control"
//               id="taskCreatedBy"
//             />
//           </div>

//           <div className="mb-3 col-lg-4 col-md-6 col-12">
//             <label
//               htmlhtmlFor="taskAssignTo"
//               className="form-label font-weight-bold"
//             >
//               Task Assign To
//             </label>
//             <input
//               type="text"
//               value={formData.taskAssignTo}
//               onChange={handleChange}
//               name="taskAssignTo"
//               className="form-control"
//               id="taskAssignTo"
//             />
//           </div>
//         </div>
//         <button
//           type="button"
//           className="btn btn-secondary"
//           style={{ marginRight: "10px" }}
//           onClick={backList}
//         >
//           Back
//         </button>
//         <button type="submit" className="btn btn-primary">
//           {formData.taskId ? "Update Task" : "Add Task"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddTask;
