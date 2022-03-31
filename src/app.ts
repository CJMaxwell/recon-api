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
            database: 'Recon',
            instanceName: 'MSSQL14'
        }
    }
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Reconciliation App'
    });
});

app.get('/firstlevel', (req, res)=> {
    knex.select('*').from('firstlevelmatch').then((data: any) =>{
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/secondlevel', (req, res)=> {
    knex.select('*').from('secondlevelmatch').then((data: any) =>{
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/thirdlevel', (req, res)=> {
    knex.select('*').from('thirdlevelmatch').then((data: any) =>{
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/manual', (req, res)=> {
    knex.select('*').from('manualmatch').then((data: any) =>{
        res.json({
            message: 'success',
            data
        })
    });
});

app.get('/account-payable', (req, res)=> {
    knex
    .select(
        'gl.MainAccount AS glMainAccount',
        'gl.Name AS glName',
        'gl.[Closing balance] AS closingBalance',
        'ar.GLCode',
        knex.raw('SUM(ar.[Balance]) as total')
    )
    .from('AR_Table AS ar')
    .join('GL_Table AS gl', 'ar.GLCode', '=', 'gl.MainAccount')
    .groupBy('ar.GLCode','gl.MainAccount', 'gl.Name', 'gl.[Closing balance]')
    .then((data: any) => {
        res.json({
            message: 'success',
            data
        })
    });
})

app.get('/account-payable/:glCode', (req, res)=> {
    const { glCode } = req.params;
     knex
        .select('*')
        .from('AR_Table')
        .where('GLCode', glCode)
        .then((data: any) => {
            res.json({
                message: 'success',
                data
            })
        } );
})

app.get('/gl-overview', (req, res)=> {
    knex
       .select('*')
       .from('GL_Table')
       .then((data: any) => {
           res.json({
               message: 'success',
               data
           })
   });
})

app.get('/bank-statement', (req, res)=> {
     knex
        .select('*')
        .from('AR_Table')
        .then((data: any) => {
            res.json({
                message: 'success',
                data
            })
    });
});



app.listen(process.env.PORT || 4000, () => console.log(`Server started on http://localhost:${process.env.PORT}`));