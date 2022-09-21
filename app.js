const express = require('express');
const mysql = require('mysql');
const app = express();
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const bodyparser = require('body-parser');
const { response } = require('express');
app.use(bodyparser.json());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS Orders Project for MYSQL',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:4440/'
            }
        ]
    },
    apis: ['./app.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mani*123",
    database: "data"
})

con.connect(function (err) {
    if (err) {
        console.log(err);
    }
    console.log('DB connected successfully')
});

/**
 * @swagger
 * /:
 *  get:
 *      summary: This api is use to check if get method is working or not
 *      description: This api is use to check if get method is working or not
 *      responses:
 *          200:
 *              description: To test Get method
 */

app.get('/', (req, res) => {
    res.send('Welcone to Swagger api');
});

//Orders DB API


/**
 * @swagger
 *  component:
 *          schemas:
 *                  Orders:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type:integer
 *                              item_type:
 *                                  type:string
 *                              item_category:
 *                                  type:string
 *                              item_name:
 *                                  type:string
 *                              
 *                              
 *          
 */





//GET api-------------------------------------------------------------

/**
 * @swagger
 * /getOrders:
 *  get:
 *      summary: To get all orders
 *      description: this api fetch from mysql
 *      responses:
 *          200:
 *              description: this api fetch from Mysql
 *              content:
 *                      application/json:
 *                          schemas:
 *                              type: array
 *                              items: 
 *                                  $ref: '#data/Orders'
 * 
 */




app.get("/getOrders", function (req, res) {
    con.query("SELECT * FROM Orders", function (err, results) {
        if (err) {
            console.log(err);
        } else {
            res.send(results)
        }
        console.log(results)
    });
});


app.get('/orders', function (req, res) {
    con.query('select * from Orders', function (err, ord) {
        if (err) {
            console.log(err);
        } else {
            res.send(ord);
        }
        console.log(ord);
    })
});


//GET by id
/**
 * @swagger
 * /getOrders/id/{id}:
 *  get:
 *      summary: To get orders by ID
 *      description: this api fetch from mysql
 *      parameters:
 *           - in : path
 *             name: id
 *             required: true
 *             description: Numeric ID required
 *      responses:
 *          200:
 *              description: this api fetch from Mysql
 *              content:
 *                      application/json:
 *                          schemas:
 *                              type: array
 *                              items: 
 *                                                             
 */

app.get("/getOrders/id/:id", function (req, res) {
    var id = req.params.id
    con.query("SELECT * FROM Orders WHERE id = ?", [id], function (err, da) {
        if (err) {
            console.log(err);
        } else {
            res.send(da)
        }
        console.log(da);
    });

});

//Get by item name
/**
 * @swagger
 * /getOrders/itemName/{itemName}:
 *  get:
 *      summary: To get orders by Name
 *      description: this api fetch from mysql
 *      parameters:
 *           - in : path
 *             name: itemName
 *             required: true
 *             description: string required
 *      responses:
 *          200:
 *              description: this api fetch from Mysql
 *              content:
 *                      application/json:
 *                          schemas:
 *                              type: array
 *                              items: 
 *                               
 * 
 */
app.get('/getOrders/itemName/:itemName', function (req, res) {

    var itemName = req.params.itemName

    console.log('<<<<>>>>>>>>', itemName);

    con.query("SELECT * FROM Orders WHERE item_name = ?", [itemName], function (err, iName) {
        
        if (err) {
            console.log(err);
        } else {
            res.send(iName);
        }
        console.log(iName);
    })
});


//POST api

/**
 * @swagger
 * /getOrders/itemName/{itemName}:
 *  post:
 *      summary : to get orders by Name
 *      description : this api fetch from mysql
 *      requestBody :
 *           required : true
 *          content :
 *              application/json :
 *                  schemas :
 *                      $ref : '#data/Orders'
  *     responses :
 *          200 :
 *              description : data added successfully
 *                               
 * 
 */


app.post("/createorder", function (req, res) {

    var Body = req.body;

    con.query("INSERT INTO Orders SET ?", Body, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            res.json({
                message: "Data Created successfully",
            })
            console.log(Body);
        }

    });
});






//PUT Orders--------------------OK--------------


app.put('/update/:names', function (req, res) {
    var name = req.body.item_name;
    console.log(name);
    con.query('update Orders set item_name = ? , item_category = ? where id = ?', [name, req.params.names], function (err, r) {
        if (err) {
            console.log("error ocurred", err);
            res.send({
                "code": 400,
                "failed": "error in updating"
            })
        } else {
            console.log('Resultats: ', r);
            res.send({
                "code": 200,
                "success": "updated successfully ! "
            });
        }
    })
})


//-------------------------------------------------OK-----------------------------------------------------------------


//  Update user with id
app.put('/order/:id', function (req, res) {
    
    let id = req.params.id;
    console.log(id);
    
    let item = req.body.item_name;
    console.log(item);

    if (!id || !item) {
        return res.status(400).send({ err: item, message: 'Please provide item and item_number' });
    }
    con.query("UPDATE Orders SET item_name = ? WHERE id = ?", [item, id], function (err, results) {
        if (err) console.log(err);
        return res.send({  data: results, message: 'item has been updated successfully.' });
    });
});




//Delete all

app.delete('/delete', function (req, res) {
    con.query('delete from Orders', function (err, ele) {
        if (!err) {
            console.log('All elements are deleted successfully');
            res.end();
        } else {
            console.log(err);
        }
    })
});

//Delete by id------------------------------Not working

app.delete('/del/:id', function (req, res) {
    let id = req.params.id
    con.query('delete from Orders where id = ?', [id], function (err) {
        if (!err) {
            console.log('Selected item deleted successfully');
            res.end();
        } else {
            console.log(err);
        }
    })
});



app.listen(4440, function (err) {
    console.log("server running at localhost:4440....!");
});









