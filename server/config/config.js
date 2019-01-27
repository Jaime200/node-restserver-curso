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
    urlDB = 'mongodb://localhost:27017/cafe';
}
else {
    urlDB = process.env.MONGO_URI;
    //`mongodb://cafeuser:jaime789@ds151753.mlab.com:51753/cafe`
}

process.env.URLDB = urlDB

//==============================
//Vencimiento del token
//===============================
// 60 seg 
// 60 min
// 24 ho
// 30 dias

process.env.CADUCIDAD_TOKEN =  60 * 60 * 24 * 30 *30

//============================
//SEED  de autenticacion
//============================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo"

//============================
//GOOGLE cliente ID
//============================
process.env.CLIENT_ID = process.env.CLIENT_ID || "96184879457-rsfotj8iofngd3pabe35sj0p2uhbsfd0.apps.googleusercontent.com";