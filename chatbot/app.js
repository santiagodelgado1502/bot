const {TSK} = require('./config');
const {TWID} = require('./config');


const client = require('twilio')(TWID, TSK);
const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const Messagingresponse = require('twilio').twiml.MessagingResponse;
const { ConnectionPolicyPage } = require('twilio/lib/rest/voice/v1/connectionPolicy');
const {MONGO_URI} = require('./config');
const Usuario = require('./models/usuario.models');

mongoose.connect( MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true } );

const app=express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  res.send('Hola mundo');
});

/*(async ()=>{
  try{
      
      //await usuario1.save();
      //console.log('El usuario fue creado sin problema');
      await Usuario.find({cedula:'1304327974'}).then(console.log)
      console.log('Se mostro la informacion');
  
  }
  catch (error) {

      console.log(error);
  }

})();*/
/*
client.messages
  .create({
     from: 'whatsapp:+14155238886',
     body: 'Prueba Mensaje bot',
     to: 'whatsapp:+593982207610'
   })
  .then(message => console.log(message.body));*/
  var arreglo = new Array();
  var arrfecha=new Array();
  let contador=0;
  let contadorfecha=0;
  app.post('/whatsapp',async (req,res)=>{
    let recibido=req.body.Body;
    arreglo[contador]=recibido;
    console.log(arreglo[contador]);
    console.log(contador)
    
    if(arreglo[0]==='Hola'){
      const twiml = new Messagingresponse();
      twiml.message("Hola este es tu diario virtual,Que desea hacer?");
      twiml.message("1. Consultar diario.");
      twiml.message("2. Ingresar un registro al diario.");
      twiml.message("3. Eliminar un registro del diario.");
      res.writeHead(200,{'Content-Type': 'text/xml'});
      res.end(twiml.toString());
      arreglo[0]=null;
      contador++;

    }
    else{
      if(arreglo[1]==='1'){//busca registro en la base de datos
        const twiml2 = new Messagingresponse();
        twiml2.message("Ingrese Fecha con el formato dd-mm-aaaa:");
        res.writeHead(200,{'Content-Type': 'text/xml'});
        res.end(twiml2.toString());
        contador++;
        arreglo[1]=null;
      }else{
        const fecha=arreglo[2];
        if(fecha!=null){
          console.log(fecha);
          const twiml3 = new Messagingresponse();
          twiml3.message(`Estos son los datos:${Usuario.findOne({fecha:fecha}).then(console.log).toString()}`);
          twiml3.message(`Si desea volver a las opciones principales escribir Hola`);
          res.writeHead(200,{'Content-Type': 'text/xml'});
          res.end(twiml3.toString());
          contador=0;
          arreglo[2]=null
          
        }
        else{
          if(arreglo[1]==='2'){//ingresa datos en la base de datos
            const twiml4 = new Messagingresponse();
            twiml4.message("Empezamos a ingresar los datos");
            twiml4.message("Ingrese Fecha con el formato dd-mm-aaaa:");
            res.writeHead(200,{'Content-Type': 'text/xml'});
            res.end(twiml4.toString());
            contador=contador+2;
            arreglo[1]=null;
          }else{
            
            const fecha2=arreglo[3];
            arrfecha[contadorfecha]=fecha2;
            if(fecha2!=null){
              const twiml4 = new Messagingresponse();
              twiml4.message("Ingrese lo que desea almacenar en el diario virtual:");
              res.writeHead(200,{'Content-Type': 'text/xml'});
              res.end(twiml4.toString());
              arreglo[3]=null;
              contadorfecha++;
              contador++;
            }
            else{
              
              const informacion=arreglo[4];
              if(informacion!=null){
                const usuario1=new Usuario({fecha:`${arrfecha[0]}`,informacion:`${informacion}`});
                (async ()=>{
                  try{
                      
                      await usuario1.save();
                      console.log('El usuario fue creado sin problema');
                      await Usuario.find().then(console.log);
                      console.log('Se mostro la informacion');
                      arreglo[4]=null;
                      contadorcfecha=0;
                      contador=0;
                  
                  }
                  catch (error) {
                
                      console.log(error);
                  }
                
                })();
                
                const twiml5 = new Messagingresponse();
                twiml5.message("Todos los datos fueron ingresados Si quiere regresar porfavor escribir Hola.");
                res.writeHead(200,{'Content-Type': 'text/xml'});
                res.end(twiml5.toString());
                
              }
              else{
                if(arreglo[1]==='3'){//Elimina registro de la base de datos
                  const twiml4 = new Messagingresponse();
                  twiml4.message("Ingrese la fecha del registro que desea eliminar:");
                  res.writeHead(200,{'Content-Type': 'text/xml'});
                  res.end(twiml4.toString());
                  contador=contador+4;
                  arreglo[1]=null;
                }else{
                  const fechaEliminar=arreglo[5];
                  if(fechaEliminar!=null){
                    (async ()=>{
                      try{
                          
                          //await usuario1.save();
                          //console.log('El usuario fue creado sin problema');
                          await Usuario.find().deleteOne({fecha:`${fechaEliminar}`})
                          console.log('Se mostro la informacion');
                          const twiml4 = new Messagingresponse();
                          twiml4.message("Registro eliminado.");
                          twiml4.message("Si desea volver a las opciones principales escriba Hola.");
                          res.writeHead(200,{'Content-Type': 'text/xml'});
                          res.end(twiml4.toString());
                          arreglo[5]=null;
                          contador=0;
                      
                      }
                      catch (error) {
                          const twiml4 = new Messagingresponse();
                          twiml4.message("Registro No encontrado.");
                          twiml4.message("Si desea volver a las opciones principales escriba Hola.");
                          res.writeHead(200,{'Content-Type': 'text/xml'});
                          res.end(twiml4.toString());
                          console.log(error);
                      }
                    
                    })();
                    

                  }else{
                    const twiml4 = new Messagingresponse();
                    twiml4.message("Opcion incorrecta.");
                    twiml4.message("Si desea volver a las opciones principales escriba Hola.");
                    res.writeHead(200,{'Content-Type': 'text/xml'});
                    res.end(twiml4.toString());
                    contador=0;

                  }
                }

              }

                
              
            }

          }
        }
        
      }

      /*
      switch(arreglo[1]) {
        case '1':
          const twiml = new Messagingresponse();
          twiml.message("1. Lunes");
          twiml.message("2. Martes");
          twiml.message("3. Cancelar");
          res.writeHead(200,{'Content-Type': 'text/xml'});
          res.end(twiml.toString());
            switch(arreglo[2]){
            case '1':
              const twiml4 = new Messagingresponse();
              twiml4.message("Estas son las horas disponibles:");
              res.writeHead(200,{'Content-Type': 'text/xml'});
              res.end(twiml4.toString());
            }
          break;
        case '2':
          const twiml2 = new Messagingresponse();
          twiml2.message("Ingrese su numero de cedula:");
          res.writeHead(200,{'Content-Type': 'text/xml'});
          res.end(twiml2.toString());
          
          break;
        case '3':
          const twiml3 = new Messagingresponse();
          twiml3.message(`Nos alegra poder ayudar si desean ver de nuevo las opviones escribir "Hola"`);
          res.writeHead(200,{'Content-Type': 'text/xml'});
          res.end(twiml3.toString());
          break;
        default:
          // code block
      }*/
      
          
      
    }
    
    
  })

  app.listen(5000,()=>{
    console.log('Server ejecutandose en el puerto 5000')
  })



