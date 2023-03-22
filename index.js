import express from 'express';
import fetch from 'node-fetch';

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const client = new PlaidApi(configuration);


const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const port = 3000;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/verifyUser', async (req, res) => {
    const data = req.body;
    const request = {
        is_shareable: true,
        template_id: 'idv_52xR9LKo77r1Np',
        gave_consent: true,
        user: {
            client_user_id: 'user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d',
            name: {
                given_name: data.firstName,
                family_name: data.lastName,
            },
            address: {
                street: data.street1,
                street2: data.street2,
                city: data.city,
                region: data.state,
                postal_code: data.zip,
                country: data.country
            },
        },
    };
    // console.log('body = ', JSON.stringify(req.body));
    // const request = {
    //     is_shareable: true,
    //     template_id: 'idv_52xR9LKo77r1Np',
    //     gave_consent: true,
    //     user: {
    //         client_user_id: 'user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d',
    //         email_address: 'acharleston@email.com',
    //         phone_number: '+11234567890',
    //         date_of_birth: '1975-01-18',
    //         name: {
    //             given_name: 'Anna',
    //             family_name: 'Charleston',
    //         },
    //         address: {
    //             street: '100 Market Street',
    //             street2: 'Apt 1A',
    //             city: 'San Francisco',
    //             region: 'CA',
    //             postal_code: '94103',
    //             country: 'US',
    //         },
    //         id_number: {
    //             value: '123456789',
    //             type: 'us_ssn',
    //         },
    //     },
    // };
    try {
        const response = await client.identityVerificationCreate(request);
    } catch (error) {
        res.json(error);
    }
    res.json(response);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
