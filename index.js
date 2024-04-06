const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next)=> {
    const { id } = request.params

    const index = orders.findIndex(order =>order.id === id)

    if(index < 0){
        return response.status(404).json({error: "Order not found"}) 
    }

    request.orderIndex = index
    request.orderId = id
    next()
}

const showMetod = (request, response, next) => {
  console.log(`[${request.method}] - ${request.originalUrl}`);
  
    next();
};


app.use(showMetod);


app.get('/orders', (request, response) => {
    return response.json(orders)
})


app.post('/orders', (request, response) => {
const {order, clientName, price, status} = request.body

    const orderClient = {id:uuid.v4(), order, clientName, price, status}
    orders.push(orderClient)
    return response.status(201).json(orderClient)
})


app.put('/orders/:id', checkOrderId, (request, response) => {
    
    const { order, clientName, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, order, clientName, price, status}

    orders[index] = updateOrder
    return response.json(updateOrder)
})


app.delete('/orders/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex
    
    orders.splice(index, 1)

    return response.status(204).json()
})


app.get('/orders/:id', (request, response) => {
    const { id } = request.params
    
    const index = orders.find(order =>order.id === id)

    if(index < 0){
        return response.status(404).json({error: "Order not found"})
    }

    return response.json(index)
})


app.patch('/orders/:id', (request, response) => {
    const  id  = request.params.id
    const orderIndex = orders.findIndex((order) => order.id ===id)
    
    orders[orderIndex].status= "Pronto"
    return response.json(orders[orderIndex])
})


app.listen(3000, ()=> {
    console.log('Server is running')
})
