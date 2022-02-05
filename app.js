const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

//prisma clients
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()



var cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.set('views', __dirname + '/views/');
app.use(express.static(process.cwd() + '/views'));
app.use(bodyParser.json());
router.get('/', (req, res) => {
    res.render('static/index');
});

app.post('/api/flock', async (req, res) => {
    const date = req.body.date
    const flock = req.body.flock
    const getflocks = await prisma.flock.create({
        data: {
            flock: flock,
            data: date,

        },
    })

    res.json(getflocks)
})
//get flocks
app.get('/flock', async (req, res) => {
    const get = await prisma.flock.findMany()
    get.reverse()
    res.json({ flocks: get })
})


//get flock by id
app.get('/flock/:id', async (req, res) => {
    const { id } = req.params

    const get = await prisma.flock.findUnique({
        where: {
            id: Number(id)
        },
    })
    res.json({ flock: get })
})

//delete flock
app.delete('/flock/:id', async (req, res) => {
    const { id } = req.params
    const Order_delete = await prisma.order.deleteMany({
        where: {
            flock_id: Number(id)
        },

    })
    const deleteFlock = await prisma.flock.delete({
        where: {
            id: Number(id)
        },

    })
    if (deleteFlock) {
        res.json({ flock: id, delete: true, msg: "Flock has been deleted" })
    } else {
        res.json({ flock: id, delete: false, msg: "Flock not founded" })
    }
})

// get customers
app.get('/customers', async (req, res) => {
    const get = await prisma.customer.findMany()
    get.reverse()
    res.json({ customers: get })
})

//post customer
app.post('/api/customer', async (req, res) => {
    const Name = req.body.Name
    const phone = req.body.phone
    const phone1 = req.body.phone1
    const address = req.body.address
    const des = req.body.des
    const date = req.body.date
    const customer = await prisma.customer.create({
        data: {
            Name,
            phone,
            phone1,
            address,
            des,
            date,

        },
    })

    res.json({ add: true, customers: customer.id })
})

//get customer by id
app.get('/customer/:id', async (req, res) => {
    const { id } = req.params
    const get_customer = await prisma.customer.findUnique({
        where: {
            id: Number(id)
        },

    })
    const orders = await prisma.order.findMany({
        where: {
            Customer_id: Number(id)
        },

    })

    var received_payment = 0
    var pandingpayment = 0
    var Total_payment = 0


    for (i = 0; i < orders.length; i++) {  //loop through the array
        Total_payment += orders[0].Total_payment
        received_payment += orders[i].Net_received
        pandingpayment += orders[i].Net_Balance
    }

    res.json({ customer: get_customer, orders: orders, Total_payment:Total_payment, received_payment: received_payment, pandingpayment: pandingpayment })

})


// delete customer 
app.delete('/customer/:id', async (req, res) => {
    const { id } = req.params
    const customerOrder_delete = await prisma.order.deleteMany({
        where: {
            Customer_id: Number(id)
        },

    })
    if (customerOrder_delete) {
        console.log("all customer  orders deleted")
    }
    const get_customer = await prisma.customer.delete({
        where: {
            id: Number(id)
        },

    })
    if (get_customer) {
        res.json({ customer: id, delete: true, msg: "Customer has been deleted" })
    } else {
        res.json({ customer: id, delete: false, msg: "Customer not founded" })
    }
})

// update customer
app.put('/customer/:id', async (req, res) => {
    const { id } = req.params

    const Name = req.body.Name
    const phone = req.body.phone
    const phone1 = req.body.phone1
    const address = req.body.address
    const des = req.body.des
    const date = req.body.date
    const customer = await prisma.customer.update({
        where: {
            id: Number(id)
        },
        data: {
            Name,
            phone,
            phone1,
            address,
            des,
            date,
        },
    })

    res.json({ update: true, customers: customer.id })
})


//post order
app.post('/order', async (req, res) => {


    const Car_no = req.body.car
    const Customer_id = Number(req.body.Customer_id)
    const flock_id = Number(req.body.flock_id)
    const broker = req.body.broker
    const f_weight = Number(req.body.weight)
    const driver = req.body.driver
    const Rate = Number(req.body.Rate)
    const advance = Number(req.body.advance)
    const Date = req.body.date
    const time = req.body.time
    const order = await prisma.order.create({
        data: {
            time,
            Car_no,
            Customer_id: Customer_id,
            Date,
            Rate,
            advance,
            broker,
            driver,
            f_weight,
            flock_id: flock_id,
            Net_weight: 0,
            Total_payment: 0,
            received_payment: 0,
            Net_received: 0,
            Net_Amount: 0,
            Net_Balance: 0,
            Balance: 0,
            l_weight: 0,
        },
    })

    res.json({ add: true, order: order.id })
})


//get pendingorders by flock id
app.get('/pendingorders/:id', async (req, res) => {
    const { id } = req.params
    const data = await prisma.order.findMany({
        where: {
            status: false,
            flock_id: Number(id)
        },
        select: {
            id: true,
            status: true,
            time: true,
            Car_no: true,
            Customer_id: true,
            Date: true,
            Net_weight: true,
            Rate: true,
            Total_payment: true,
            advance: true,
            received_payment: true,
            Net_received: true,
            Net_Amount: true,
            Net_Balance: true,
            Balance: true,
            broker: true,
            driver: true,
            f_weight: true,
            l_weight: true,
            flock_id: true,
            Customer: {
                select: {
                    id: true,
                    Name: true,
                    phone: true
                }
            }
        }
    })
    data.reverse()
    res.json(data)

})
// get states by flock id
app.get('/states/:id', async (req, res) => {
    const { id } = req.params
    var sold = 0.0
    var earn = 0
    var received_payment = 0
    var pandingpayment = 0
    const customers = await prisma.customer.count()
    const orders = await prisma.order.findMany({
        where: {
            status: true,
            flock_id: Number(id)
        },


    })
    for (i = 0; i < orders.length; i++) {  //loop through the array

        sold += orders[i].Net_weight;  //Do the math!
        earn += orders[i].Total_payment
        received_payment += orders[i].Net_received
        if (orders[i].Net_Balance > 0) {
            pandingpayment += orders[i].Net_Balance
        }
    }
    var x = orders.length

    res.json({ sold: sold, earn: earn, pandingpayment: pandingpayment, received_payment: received_payment, x: x, customers: customers })

})

//get order by flock id
app.get('/orders/:id', async (req, res) => {
    const { id } = req.params
    const data = await prisma.order.findMany({
        where: {
            status: true,
            flock_id: Number(id)
        },
        select: {
            id: true,
            status: true,
            time: true,
            Car_no: true,
            Customer_id: true,
            Date: true,
            Net_weight: true,
            Rate: true,
            Total_payment: true,
            advance: true,
            received_payment: true,
            Net_received: true,
            Net_Amount: true,
            Net_Balance: true,
            Balance: true,
            broker: true,
            driver: true,
            f_weight: true,
            l_weight: true,
            flock_id: true,
            Customer: {
                select: {
                    id: true,
                    Name: true,
                    phone: true
                }
            }
        }


    })
    data.reverse()
    res.json(data)

})

// delete order
app.delete('/order/:id', async (req, res) => {
    const { id } = req.params
    const deleteOrder = await prisma.order.delete({
        where: {
            id: Number(id)
        },

    })
    if (deleteOrder) {
        res.json({ order: id, delete: true, msg: "order has been deleted" })
    } else {
        res.json({ order: id, delete: false, msg: "order not founded" })
    }
})

// update customer
app.put('/confirmorder/:id', async (req, res) => {
    const { id } = req.params

    const Car_no = req.body.car
    const broker = req.body.broker
    const f_weight = Number(req.body.f_weight)
    const driver = req.body.driver
    const Rate = Number(req.body.Rate)
    const advance = Number(req.body.advance)
    const Date = req.body.date
    const time = req.body.time
    const Total_payment = Number(req.body.total)
    const received_payment = Number(req.body.received_payment)
    const Net_received = Number(req.body.Net_received)
    const Net_Balance = Number(req.body.Net_Balance)
    const Balance = Number(req.body.Balance)
    const Net_weight = Number(req.body.Net_weight)
    const l_weight = Number(req.body.l_weight)

    const order = await prisma.order.update({
        where: {
            id: Number(id)
        },
        data: {
            status: true,
            time,
            Car_no,
            Date,
            Rate,
            advance,
            broker,
            driver,
            f_weight,
            Net_weight,
            Total_payment,
            received_payment,
            Net_received,
            Net_Amount: Net_Balance,
            Net_Balance,
            Balance,
            l_weight,
        },
    })

    res.json({ edit: true, order: order })
})

app.put('/order/:id', async (req, res) => {
    const { id } = req.params


    const Date = req.body.date
    const time = req.body.time

    const Net_received = Number(req.body.Net_received)
    const Net_Balance = Number(req.body.Net_Balance)
    const order = await prisma.order.update({
        where: {
            id: Number(id)
        },
        data: {
            time,
            Date,
            Net_received,
            Net_Balance,
        },
    })

    res.json({ edit: true, order: order })
})

app.listen(process.env.port || 5000);

console.log('Web Server is listening at port http://localhost:' + (process.env.port || 5000));