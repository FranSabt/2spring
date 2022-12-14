import axios from "axios";
import SubscriptionDetail from "./SubscriptionDetail";
import { config } from "dotenv";
config();

const PaymentSubCreate = async (data: any) => {

    let sub = await SubscriptionDetail(data)
    let subscription = JSON.stringify(sub)
    let response: any = await axios.post('https://api.mercadopago.com/preapproval_plan', subscription, {headers: {
        'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN_MP,
        'Content-Type': 'application/json'
    }})
    return response
  }

export default PaymentSubCreate;