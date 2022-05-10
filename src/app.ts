import express from 'express';
// import cors from 'cors';
const cors = require('cors');
import dotenv from 'dotenv';

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const knex = require('knex')({
    client: 'mssql',
    connection: {
        server: 'localhost',
        user: 'sa',
        password: 'password',
        options: {
            port: 59352,
            database: 'Recon_DB',
            instanceName: 'MSSQLSERVER01',
        }
    }
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Reconciliation App'
    });
});

app.get('/firstlevel', (req, res) => {
    knex.select('*').from('firstlevelmatch').then((data: any) => {
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/secondlevel', (req, res) => {
    knex.select('*').from('secondlevelmatch').then((data: any) => {
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/thirdlevel', (req, res) => {
    knex.select('*').from('thirdlevelmatch').then((data: any) => {
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/manual', (req, res) => {
    knex.select('*').from('manualmatch').then((data: any) => {
        res.json({
            message: 'success',
            data
        })
    });
});

app.get('/bs-only', (req, res) => {
    knex.select('*')
        .from('bsOnly')
        .whereNotNull('Date_y')
        .limit(100)
        .offset(0)
        .then((data: any) => {
            res.json({
                message: 'success',
                data
            })
        });
});

app.get('/leger-only', (req, res) => {
    knex.select('*')
        .from('ledgeronly')
        .limit(100)
        .offset(0)
        .then((data: any) => {
            res.json({
                message: 'success',
                data
            })
        });
});

// app.get('/account-payable', (req, res) => {
//     knex
//         .select(
//             'gl.MainAccount AS glMainAccount',
//             'gl.Name AS glName',
//             'gl.[Closing balance] AS closingBalance',
//             'ar.[GL Code]',
//             knex.raw('SUM(ar.[Balance]) as total')
//         )
//         .from('AR_Table AS ar')
//         .join('GL_Table AS gl', 'ar.[GL Code]', '=', 'gl.MainAccount')
//         .groupBy('ar.[GL Code]', 'gl.MainAccount', 'gl.Name', 'gl.[Closing balance]')
//         .then((data: any) => {
//             res.json({
//                 message: 'success',
//                 data
//             })
//         });
// })

// app.get('/account-payable/:glCode', (req, res) => {
//     const { glCode } = req.params;
//     knex
//         .select('*')
//         .from('AP_Table')
//         .where('[GL Code]', glCode)
//         .then((data: any) => {
//             res.json({
//                 message: 'success',
//                 data
//             })
//         });
// })

app.get('/account-payable', (req, res) => {
    let selection = ['APJ000073785', 'APJ000073788', 'APJ000073792', 'APJ000073793', 'APJ000073796'];
    knex
        .select(
            'gl.[Journal number] AS journalNumber',
            'gl.Voucher AS voucher',
            'gl.Description AS description',
            'gl.Date AS date',
            'gl.[Ledger dimension type] AS ledgerDimensionType',
            'gl.Amount AS amount',
            knex.raw('SUM(ap.[Invoice amount]) as total')
        )
        .from('GL_AP_Table AS gl')
        .join('AP_Table AS ap', 'ap.Voucher', '=', 'gl.Voucher')
        .whereIn('gl.Voucher', selection)
        .groupBy('ap.Voucher', 'gl.Voucher', 'gl.Description', 'gl.Date', 'gl.[Ledger dimension type]', 'gl.Amount', 'gl.[Journal number]', 'gl.Amount')
        .then((data: any) => {
            res.json({
                message: 'success',
                data
            })
        });
})

app.get('/account-payable/:voucher', (req, res) => {
    const { voucher } = req.params;
    knex
        .select(
            '[Invoice account] AS invoiceNumber',
            'Date AS date',
            'Invoice AS invoice',
            'Voucher AS voucher',
            'Currency AS currency',
            '[Invoice amount] AS invoiceAmount',
            '[Posted via intercompany] AS postingType',
            '[Due date] AS dueDate'
        )
        .from('AP_Table')
        .where('Voucher', voucher)
        .then((data: any) => {
            res.json({
                message: 'success',
                data
            })
        });
})

app.get('/gl-overview', (req, res) => {
    knex
        .select('*')
        .from('GL_AP_Table')
        .limit(100)
        .offset(0)
        .then((data: any) => {
            res.json({
                message: 'success',
                data
            })
        });
})

app.get('/bank-statement', (req, res) => {
    knex
        .select('*')
        .from('AP_Table')
        .limit(100)
        .offset(0)
        .then((data: any) => {
            res.json({
                message: 'success',
                data
            })
        });
});



app.listen(process.env.PORT || 4000, () => console.log(`Server started on http://localhost:${process.env.PORT}`));