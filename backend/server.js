require('dotenv').config(); 
const http=require('http');
const cron=require('node-cron');
const {deleteExpiredOrders}=require('./controller/Order.controller');
const app=require('./app');
const server=http.createServer(app);


server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled job to delete expired orders...');
    await deleteExpiredOrders();
  });