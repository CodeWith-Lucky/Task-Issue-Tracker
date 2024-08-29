import express from 'express';
import XLSX from 'xlsx';
import multer from 'multer';
import { poolPromise } from '../dbConfig/db.js';

const router = express.Router();

// Set up multer for file uploads
// Set up multer for file uploads
const upload = multer({ 
  dest: 'uploads/', // Directory where files will be uploaded
  // limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size to 10MB
  // fileFilter: (req, file, cb) => {
  //   // Optional: Filter to allow only specific file types
  //   const allowedTypes = /xlsx|xls/;
  //   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  //   const mimetype = allowedTypes.test(file.mimetype);

  //   if (mimetype && extname) {
  //     return cb(null, true);
  //   } else {
  //     cb(new Error('Only .xlsx or .xls files are allowed!'));
  //   }
  // }
});

router.post('/addtask', async (req, res) => {
  const {
    outletName,
    outletModule,
    clientName,
    clientNumber,
    taskTitle,
    taskDetails,
    taskPriority,
    taskStatus,
    taskCreatedDate,
    taskDeadline,
    taskType,
    taskCreatedBy,
    taskAssignTo // Removed the extra space here
  } = req.body;

  try {

    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('outletName', outletName ||null)
      .input('outletModule', outletModule ||null)
      .input('clientName', clientName ||null)
      .input('clientNumber', clientNumber ||null)
      .input('taskTitle', taskTitle ||null)
      .input('taskDetails', taskDetails ||null)
      .input('taskPriority', taskPriority ||null)
      .input('taskStatus', taskStatus ||null)
      .input('taskCreatedDate', taskCreatedDate ||null)
      .input('taskDeadline', taskDeadline ||null)
      .input('taskType', taskType ||null)
      .input('taskCreatedBy', taskCreatedBy ||null)
      .input('taskAssignTo', taskAssignTo ||null) // Removed the extra space here
      .query(`
        INSERT INTO dbo.taskInfo (
          outletName, outletModule, clientName, clientNumber, taskTitle, taskDetails, 
          taskPriority, taskStatus, taskCreatedDate, taskType, taskCreatedBy, taskAssignTo ,taskDeadline
        ) 
        VALUES (
          @outletName, @outletModule, @clientName, @clientNumber, @taskTitle, @taskDetails, 
          @taskPriority, @taskStatus, @taskCreatedDate, @taskType, @taskCreatedBy, @taskAssignTo ,@taskDeadline
        )
      `);

    res.status(200).send('Task created successfully' );
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error inserting data');
  }
});


// Read all tasks
router.get('/getalltasks', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM dbo.taskInfo
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error retrieving tasks:', err);
    res.status(500).send('Error retrieving tasks');
  }
});

router.delete('/deletetasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('taskId', taskId)
      .query(`
        DELETE FROM dbo.taskInfo WHERE taskId = @taskId
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send('Task deleted successfully');
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send('Error deleting task');
  }
});



router.put('/edittasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  console.log(taskId);

  const {
      outletName,
      outletModule,
      clientName,
      clientNumber,
      taskTitle,
      taskDetails,
      taskPriority,
      taskStatus,
      taskDeadline,
      taskCreatedDate, // Ensure this matches your frontend field
      taskType,
      taskCreatedBy,
      taskAssignTo
  } = req.body;

  try {
      const pool = await poolPromise;
      const result = await pool.request()
          .input('taskId', taskId)
          .input('outletName', outletName || null)
          .input('outletModule', outletModule || null)
          .input('clientName', clientName || null)
          .input('clientNumber', clientNumber || null)
          .input('taskTitle', taskTitle || null)
          .input('taskDetails', taskDetails || null)
          .input('taskPriority', taskPriority || null)
          .input('taskStatus', taskStatus || null)
          .input('taskCreatedDate', taskCreatedDate || new Date())
          .input('taskType', taskType || null)
          .input('taskCreatedBy', taskCreatedBy || null)
          .input('taskDeadline', taskDeadline || null)
          .input('taskAssignTo', taskAssignTo || null)
          .query(`
              UPDATE dbo.taskInfo
              SET 
                outletName = @outletName,
                outletModule = @outletModule,
                clientName = @clientName,
                clientNumber = @clientNumber,
                taskTitle = @taskTitle,
                taskDetails = @taskDetails,
                taskPriority = @taskPriority,
                taskStatus = @taskStatus,
                taskCreatedDate = @taskCreatedDate,
                taskType = @taskType,
                taskCreatedBy = @taskCreatedBy,
                taskDeadline = @taskDeadline,
                taskAssignTo = @taskAssignTo
              WHERE taskId = @taskId
          `);

      if (result.rowsAffected[0] === 0) {
          return res.status(404).send('Task not found');
      }
      res.status(200).send('Task updated successfully');
  } catch (err) {
      console.error('Error updating task:', err);
      res.status(500).send('Error updating task');
  }
});

// routing for  client crud


router.post('/addClient', async (req, res) => {
  const {
    outletName, outletAddress, outletCity, outletOwnerName, outletOwnerNo, outletNos, outletLicenseNo, outletTerminalNos,
    outletInstallationDate, outletRenewalDate, outletRenewalCount, refPartName, outletModuleType, outletSoftwareMode, outletSoftwareLink,isActive,outletSoftwareCharge,isClosedReason
  } = req.body;

  console.log({
    outletName, outletAddress, outletCity, outletOwnerName, outletOwnerNo, outletNos, outletLicenseNo, outletTerminalNos,
    outletInstallationDate, outletRenewalDate, outletRenewalCount, refPartName, outletModuleType, outletSoftwareMode, outletSoftwareLink,isActive,outletSoftwareCharge,isClosedReason
  });

  // Convert outletModuleType array into a comma-separated string
  const outletModuleTypeString = Array.isArray(outletModuleType) ? outletModuleType.join(',') : '';

  console.log(outletModuleTypeString);

  try {
    // Get the pool instance
    const pool = await poolPromise;

    // Execute the query
    const result = await pool.request()
      .input('outletName', outletName || null)
      .input('outletAddress', outletAddress || null)
      .input('outletCity', outletCity || null)
      .input('outletOwnerName', outletOwnerName || null)
      .input('outletOwnerNo', outletOwnerNo || null)
      .input('outletNos', outletNos || null)
      .input('outletLicenseNo', outletLicenseNo || null)
      .input('outletTerminalNos', outletTerminalNos || null)
      .input('outletInstallationDate', outletInstallationDate || null)
      .input('outletRenewalDate', outletRenewalDate || null)
      .input('outletRenewalCount', outletRenewalCount || null)
      .input('refPartName', refPartName)
      .input('outletModuleType', outletModuleTypeString || null)  // Store as a string
      .input('outletSoftwareMode', outletSoftwareMode || null)
      .input('outletSoftwareLink', outletSoftwareLink || null)
      .input('isActive', isActive || null)
      .input('isClosedReason',isClosedReason || null)
      .input('outletSoftwareCharge', outletSoftwareCharge || null)
      .query(`
        INSERT INTO dbo.clientInfo (
          outletName, outletAddress, outletCity, outletOwnerName, outletOwnerNo, outletNos, outletLicenseNo, outletTerminalNos,
          outletInstallationDate, outletRenewalDate, outletRenewalCount, refPartName, outletModuleType, outletSoftwareMode, outletSoftwareLink,isActive,isClosedReason,outletSoftwareCharge
        ) 
        VALUES (
          @outletName, @outletAddress, @outletCity, @outletOwnerName, @outletOwnerNo, @outletNos, @outletLicenseNo, @outletTerminalNos,
          @outletInstallationDate, @outletRenewalDate, @outletRenewalCount, @refPartName, @outletModuleType, @outletSoftwareMode, @outletSoftwareLink,@isActive,@isClosedReason,@outletSoftwareCharge
        )
      `);

    res.status(200).send('Client added successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error inserting data');
  }
});

router.get('/getallclients', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM dbo.clientInfo
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error retrieving tasks:', err);
    res.status(500).send('Error retrieving tasks');
  }
});


router.put('/editclient/:clientId', async (req, res) => {
  const { clientId } = req.params;
  console.log(`Client ID: ${clientId}`);

  const {
    outletName, outletAddress, outletCity, outletOwnerName, outletOwnerNo, outletNos, outletLicenseNo, outletTerminalNos,
    outletInstallationDate, outletRenewalDate, outletRenewalCount, refPartName, outletModuleType, outletSoftwareMode, outletSoftwareLink, isActive, outletSoftwareCharge, isClosedReason
  } = req.body;

  console.log({
    outletName, outletAddress, outletCity, outletOwnerName, outletOwnerNo, outletNos, outletLicenseNo, outletTerminalNos,
    outletInstallationDate, outletRenewalDate, outletRenewalCount, refPartName, outletModuleType, outletSoftwareMode, outletSoftwareLink, isActive, outletSoftwareCharge, isClosedReason
  });

  // Convert outletModuleType array into a comma-separated string
  const outletModuleTypeString = Array.isArray(outletModuleType) ? outletModuleType.join(',') : '';

  console.log(`Outlet Module Type: ${outletModuleTypeString}`);

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('clientId', clientId)
      .input('outletName', outletName)
      .input('outletAddress', outletAddress)
      .input('outletCity', outletCity)
      .input('outletOwnerName', outletOwnerName)
      .input('outletOwnerNo', outletOwnerNo)
      .input('outletNos', outletNos)
      .input('outletLicenseNo', outletLicenseNo)
      .input('outletTerminalNos', outletTerminalNos)
      .input('outletInstallationDate', outletInstallationDate)
      .input('outletRenewalDate', outletRenewalDate)
      .input('outletRenewalCount', outletRenewalCount)
      .input('refPartName', refPartName)
      .input('outletModuleType', outletModuleTypeString)  // Store as a string
      .input('outletSoftwareMode', outletSoftwareMode)
      .input('outletSoftwareLink', outletSoftwareLink)
      .input('isActive', isActive)
      .input('isClosedReason', isClosedReason)
      .input('outletSoftwareCharge', outletSoftwareCharge)
      .query(`
        UPDATE dbo.clientInfo SET
            outletName = @outletName,
            outletAddress = @outletAddress,
            outletCity = @outletCity,
            outletOwnerName = @outletOwnerName,
            outletOwnerNo = @outletOwnerNo,
            outletNos = @outletNos,
            outletLicenseNo = @outletLicenseNo,
            outletTerminalNos = @outletTerminalNos,
            outletInstallationDate = @outletInstallationDate,
            outletRenewalDate = @outletRenewalDate,
            outletRenewalCount = @outletRenewalCount,
            refPartName = @refPartName,
            outletModuleType = @outletModuleType,
            outletSoftwareMode = @outletSoftwareMode,
            outletSoftwareLink = @outletSoftwareLink,
            isActive = @isActive,
            isClosedReason = @isClosedReason,
            outletSoftwareCharge = @outletSoftwareCharge
        WHERE clientId = @clientId
      `);

    res.status(200).send('Client updated successfully');
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).send('Error updating data');
  }
});


// import client 


// Route to handle file import
router.post('/importclient', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log('Import file path:', filePath);

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    //console.log('Worksheet data:', worksheet);

    const pool = await poolPromise;

    // Function to convert Excel serial date number to JavaScript Date
    function excelDateToJSDate(serial) {
      const epoch = new Date(Date.UTC(1899, 11, 30)); // Excel base date
      return new Date(epoch.getTime() + serial * 86400 * 1000); // Convert days to milliseconds
    }

    // Function to format JavaScript Date to YYYY-MM-DD string
    function formatDateForSQL(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Loop through the rows in the worksheet
    for (const row of worksheet) {
      const {
        outletName,
        outletAddress,
        outletCity,
        outletOwnerName,
        outletOwnerNo,
        outletNos,
        outletLicenseNo,
        outletTerminalNos,
        outletInstallationDate,
        outletRenewalDate,
        outletRenewalCount,
        refPartName,
        outletModuleType,
        outletSoftwareMode,
        outletSoftwareLink,
        isActive,
        outletSoftwareCharge,
        isClosedReason,
      } = row;

      // Convert Excel serial dates to JavaScript Date objects
      const installationDate = typeof outletInstallationDate === 'number' ? excelDateToJSDate(outletInstallationDate) : new Date(outletInstallationDate);
      const renewalDate = typeof outletRenewalDate === 'number' ? excelDateToJSDate(outletRenewalDate) : new Date(outletRenewalDate);

      // Check if dates are valid
      if (isNaN(installationDate.getTime()) || isNaN(renewalDate.getTime())) {
        console.error('Invalid date values:', outletInstallationDate, outletRenewalDate);
        // Handle invalid dates, e.g., skip this row or throw an error
        continue;
      }

      // Format dates for SQL Server
      const formattedInstallationDate = formatDateForSQL(installationDate);
      const formattedRenewalDate = formatDateForSQL(renewalDate);

      console.log(`Installation date: ${formattedInstallationDate}`);
      console.log(`Renewal date: ${formattedRenewalDate}`);

      // Convert outletModuleType to a comma-separated string if it's an array
      const outletModuleTypeString = Array.isArray(outletModuleType)
        ? outletModuleType.join(',')
        : outletModuleType;

      // console.log('Inserting data:', {
      //   outletName,
      //   outletAddress,
      //   outletCity,
      //   outletOwnerName,
      //   outletOwnerNo,
      //   outletNos,
      //   outletLicenseNo,
      //   outletTerminalNos,
      //   outletInstallationDate: formattedInstallationDate,
      //   outletRenewalDate: formattedRenewalDate,
      //   outletRenewalCount,
      //   refPartName,
      //   outletModuleType: outletModuleTypeString,
      //   outletSoftwareMode,
      //   outletSoftwareLink,
      //   isActive,
      //   outletSoftwareCharge,
      //   isClosedReason,
      // });
      // Insert data into the database
      await pool.request()
        .input('outletName', outletName || null)
        .input('outletAddress', outletAddress || null)
        .input('outletCity', outletCity || null)
        .input('outletOwnerName', outletOwnerName || null)
        .input('outletOwnerNo', outletOwnerNo || null)
        .input('outletNos', outletNos || null)
        .input('outletLicenseNo', outletLicenseNo || null)
        .input('outletTerminalNos', outletTerminalNos || null)
        .input('outletInstallationDate', formattedInstallationDate || null)
        .input('outletRenewalDate', formattedRenewalDate || null)
        .input('outletRenewalCount', outletRenewalCount || null)
        .input('refPartName', refPartName || null)
        .input('outletModuleType', outletModuleTypeString || null)
        .input('outletSoftwareMode', outletSoftwareMode || null)
        .input('outletSoftwareLink', outletSoftwareLink || null)
        .input('isActive', isActive || null)
        .input('isClosedReason', isClosedReason || null)
        .input('outletSoftwareCharge', outletSoftwareCharge || null)
        .query(`
          INSERT INTO dbo.clientInfo (
            outletName, outletAddress, outletCity, outletOwnerName, outletOwnerNo, outletNos, outletLicenseNo, outletTerminalNos,
            outletInstallationDate, outletRenewalDate, outletRenewalCount, refPartName, outletModuleType, outletSoftwareMode, outletSoftwareLink, isActive, isClosedReason, outletSoftwareCharge
          ) 
          VALUES (
            @outletName, @outletAddress, @outletCity, @outletOwnerName, @outletOwnerNo, @outletNos, @outletLicenseNo, @outletTerminalNos,
            @outletInstallationDate, @outletRenewalDate, @outletRenewalCount, @refPartName, @outletModuleType, @outletSoftwareMode, @outletSoftwareLink, @isActive, @isClosedReason, @outletSoftwareCharge
          )
        `);
    }

    res.status(200).send('Clients imported successfully');
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send('Error processing file');
  }
});




export default router;
