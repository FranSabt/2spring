import { Router } from "express";
const mercadopago = require("mercadopago");
import { config } from "dotenv";
import PaymentCreate from "../../../controllers/PaymentsControllers/PaymentCreate";
import mongoose from "mongoose"
config();
const router = Router()

//* /payment/


mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP,
  });



router.post("/", async (req:any, res) => {
    const {name, lastName, phone, _id} = req.user
    let id = _id.toString()
    let address1;
    for (const address of req.user.address) {
        if (address.isDefault === true) {
            address1 = address
        }
    }
    if (!address1) {
        return res.status(400).send("Address not found!")
    }
    const {country, stateName, cityName, postalCode, streetName, streetNumber, floor, Apartment} = address1
    if (req.shoppingCart) {
        const cart: any = req.shoppingCart
        let items = await PaymentCreate(cart)
        let preference = {
            auto_return: 'approved',
            back_urls : {
                success : `http://localhost:3001/createorder?name=${name}&lastName=${lastName}&user_id=${id}&country=${country}&state_name=${stateName}&city_name=${cityName}&zip_code=${postalCode}&street_name=${streetName}&street_number=${streetNumber}&floor=${floor}&apartment=${Apartment}`
            },
            items
            // notification_url : 'http://localhost:3001/notificar'
        };
        const pruebaMercadoPago = await mercadopago.preferences.create(preference);
        res.send(pruebaMercadoPago.body.init_point)
    }
    if (req.item){
        const item: any = req.item
        let items = await PaymentCreate(item)
        let preference = {
            auto_return: 'approved',
            back_urls : {
                success : `http://localhost:3001/createorder?name=${name}&lastName=${lastName}&user_id=${id}&country=${country}&state_name=${stateName}&city_name=${cityName}&zip_code=${postalCode}&street_name=${streetName}&street_number=${streetNumber}&floor=${floor}&apartment=${Apartment}`
            },
            items
            // notification_url : 'http://localhost:3001/notificar'
        }
        const pruebaMercadoPago = await mercadopago.preferences.create(preference);
        res.send(pruebaMercadoPago.body.init_point)}

})
export default router;