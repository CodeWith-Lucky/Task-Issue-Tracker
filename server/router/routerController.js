import express from 'express';
import { poolPromise } from '../dbConfig/db.js';

const router = express.Router();

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
    taskType,
    taskCreatedBy,
    taskAssignTo // Removed the extra space here
  } = req.body;

  try {

    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('outletName', outletName)
      .input('outletModule', outletModule)
      .input('clientName', clientName)
      .input('clientNumber', clientNumber)
      .input('taskTitle', taskTitle)
      .input('taskDetails', taskDetails)
      .input('taskPriority', taskPriority)
      .input('taskStatus', taskStatus)
      .input('taskCreatedDate', taskCreatedDate)
      .input('taskType', taskType)
      .input('taskCreatedBy', taskCreatedBy)
      .input('taskAssignTo', taskAssignTo) // Removed the extra space here
      .query(`
        INSERT INTO dbo.taskInfo (
          outletName, outletModule, clientName, clientNumber, taskTitle, taskDetails, 
          taskPriority, taskStatus, taskCreatedDate, taskType, taskCreatedBy, taskAssignTo 
        ) 
        VALUES (
          @outletName, @outletModule, @clientName, @clientNumber, @taskTitle, @taskDetails, 
          @taskPriority, @taskStatus, @taskCreatedDate, @taskType, @taskCreatedBy, @taskAssignTo 
        )
      `);

    res.status(201).send('Task created successfully');
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
      taskCreatedDate, // Ensure this matches your frontend field
      taskType,
      taskCreatedBy,
      taskAssignTo
  } = req.body;

  try {
      const pool = await poolPromise;
      const result = await pool.request()
          .input('taskId', taskId)
          .input('outletName', outletName)
          .input('outletModule', outletModule)
          .input('clientName', clientName)
          .input('clientNumber', clientNumber)
          .input('taskTitle', taskTitle)
          .input('taskDetails', taskDetails)
          .input('taskPriority', taskPriority)
          .input('taskStatus', taskStatus)
          .input('taskCreatedDate', taskCreatedDate || new Date())
          .input('taskType', taskType)
          .input('taskCreatedBy', taskCreatedBy)
          .input('taskAssignTo', taskAssignTo)
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

export default router;
