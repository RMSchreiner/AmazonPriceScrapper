require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const nightmare = require('nightmare')()


const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]


checkPrice()

async function checkPrice() {
    try{
    const priceString = await nightmare.goto(url)
        .wait("#priceblock_ourprice")
        .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
        .end()
    const priceNumber = parseFloat(priceString.replace('$', ''))
    if (priceNumber < minPrice){
       await sendEmail('Price is Low', 
        `The price on ${url} has dropped below ${minPrice}`)
    }
}catch(e){
   await sendEmail('Amazon price checker error', e.message)
   console.log("catch")
    throw e
}
}


function sendEmail(subject, body){
    const email = {
        to: 'vopope9730@flmcat.com',
        from: 'cool@email.com',
        subject: subject,
        text: body,
        html: body
    }

    return sgMail.send(email)
}

//https://app.sendgrid.com/settings/api_keys
//need to confirm sender identity on sendgrid before it works
//node parser.js "https://www.amazon.com/Sony-WH-XB700-Wireless-Bluetooth-Headphones/dp/B07PKW46WJ" 120
//temp mail for test email address
//above add in the email address and then the price you want it below

