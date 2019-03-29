const app = require('./app');
const io = require('./utils/socket');

io.init(app.listen(3000,()=>{console.log('API is runing on 3000...')}));
