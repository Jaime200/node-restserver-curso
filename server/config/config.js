//==============================
//Puerto
//===============================
process.env.PORT = process.env.PORT || 3000;


//==============================
//Entorno
//===============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==============================
//BD
//===============================
let urlDB;
if(process.env.NODE_ENV==='dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}
else {
    urlDB = `mongodb://cafeuser:jaime789@ds151753.mlab.com:51753/cafe`
}

process.env.URLDB = urlDB


