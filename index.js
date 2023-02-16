const express = require('express');
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const app = express();
app.use(express.json());
const fecha = new Date();
//imprimir TIket
app.post('/', (req, res) => {


 
    res.send('aki');

     let printer = new ThermalPrinter({
        type: PrinterTypes.epson,                                  // Printer type: 'star' or 'epson'
        interface: '//localhost/'+req.query.interface,                       // Printer interface
        characterSet: 'PC858_EURO',                                 // Printer character set - default: SLOVENIA
              
    });

    printer.alignCenter();
   
    printer.println(req.query.name_n);
   // printer.println(req.query.usu);
    printer.println(req.query.direc);
    printer.println(req.query.nif);
 
    printer.alignCenter();
    printer.newLine();
    printer.newLine();
    printer.setTextDoubleWidth();
    printer.println("TIKET");
    printer.setTextNormal();
    printer.newLine();
    
    printer.tableCustom([                               // Prints table with custom settings (text, align, width, bold)
        { text: fecha.toLocaleDateString(), align: "LEFT", width: 0.20 },
        { text: "Us:" + req.query.usu, align: "LEFT", width: 0.10 },
        { text: fecha.getHours() + ":" + fecha.getMinutes(), align: "LEFT", width: 0.25, bold: true },
        { text: "T"+req.query.serie, align: "RIGHT", width: 0.30 }
    ]);
    
    printer.newLine();
    printer.tableCustom([                               // Prints table with custom settings (text, align, width, bold)
        { text: "MESA:"+req.query.area+"-"+req.query.mesa , align: "LEFT", width: 0.50,bold:true },
        { text: "Cubiertos: "+req.query.comensales, align: "LEFT", width: 0.50 },

    ]);
    printer.newLine();


    printer.alignLeft();
    let total=0;
    for (let index = 0; index < req.body.length; index++) {
        printer.tableCustom([
            { text: req.body[index].cantidad , align: "LEFT", width: 0.05, bold: true },
            { text: (req.body[index].name), align: "LEFT", width: 0.55 },
            { text:new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(req.body[index].total) , align: "RIGHT", width: 0.15 },
        ]);
    total+=req.body[index].total;
    }
    printer.newLine();
    
    printer.setTextDoubleWidth();
    printer.tableCustom([
        
        { text:'TOTAL', align: "LEFT", width: 0.20 },
        { text:new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(total) , align: "RIGHT", width: 0.20 },
    ]);
    printer.setTextNormal();
    printer.newLine();
    printer.alignCenter();
    let base = (total/1.10);
    
    printer.println("10,00% sobre "+new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(base)+"  "+new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(total-base));

    printer.println("Gracias por su visita");
    printer.println("I.V.A Incluido");


 
    
    printer.cut();
    printer.openCashDrawer();  
    printer.beep(); 
    printer.execute();



    printer.isPrinterConnected(function (isConnected) {
        console.log(isConnected);
        res.send(isConnected);
    })

    

});
 
//comandar
app.post('/comanda', (req, res) => {

    //iniciar la inpresita
    let printer = new ThermalPrinter({
        type: PrinterTypes.epson,                                  // Printer type: 'star' or 'epson'
        interface: '//localhost/'+req.query.interface,                       // Printer interface
        characterSet: 'PC858_EURO',                                 // Printer character set - default: SLOVENIA
              
    });
  
    // obtener la fecha y la hora
    var today = new Date();
    var fecha = today.toLocaleDateString('en-US');
    var hora = today.toLocaleTimeString('en-US');
    //centrarmos el contenido
    printer.alignCenter();
    printer.setTextDoubleWidth();
    printer.println("COMANDA");
    printer.println("Area:" + req.query.area);
    printer.tableCustom([
        { text: "MESA:", align: "RIGHT", width: 0.15 },
        { text: req.query.mesa, align: "LEFT", width: 0.10 }
    ]);
    printer.setTextNormal();
    printer.setTypeFontB();
    printer.println("cubiertos:"+req.query.nro_comensales);
    printer.setTypeFontA();
    printer.tableCustom([
        { text:"Camarero:" + req.query.usu, align: "LEFT", width: 0.25, bold: true },
        { text:"Fecha:" + fecha, align: "LEFT", width: 0.35 },
        { text:hora, align: "LEFT", width: 0.70 },
    ]);
    for (let index = 0; index < req.body.length; index++) {
        printer.tableCustom([
            { text: req.body[index].cantidad + "", align: "LEFT", width: 0.10, bold: true },
            { text: req.body[index].name, align: "LEFT", width: 0.70 },
        ]);
    }
    printer.newLine();

    printer.alignLeft();
 
    printer.bold(true);
    printer.println("NOTA:");
    printer.bold(false);
    printer.println(req.query.coment);
    
   
    
    printer.cut();
   printer.execute();
    res.send('');
    console.log("-------------------------------------------------------------")
    
});

app.post('/test',(req,res)=>{

    res.send('exito');
console.log("exito de conexion");
});

app.listen(8080, '192.168.0.185');

 

 
