const io = require('./utils/socket');
const app = require('./app');

io.init(app.listen(3000,()=>{ console.log('Runing on 3000...') }));
