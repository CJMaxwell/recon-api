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

app.get('/firstlevel', (req, res)=>{
    knex.select('*').from('firstlevelmatch').then((data: any) =>{
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/secondlevel', (req, res)=>{
    knex.select('*').from('secondlevelmatch').then((data: any) =>{
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/thirdlevel', (req, res)=>{
    knex.select('*').from('thirdlevelmatch').then((data: any) =>{
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/manual', (req, res)=>{
    knex.select('*').from('manualmatch').then((data: any) =>{
        res.json({
            message: 'success',
            data
        })
    })
});

app.get('/account-payable', (req, res)=>{
    // knex.select('*').from('manualmatch').then((data: any) =>{
    //     res.json({
    //         message: 'success',
    //         data
    //     })
    // })

    //  knex
    //     .select(
    //         'u.id',
    //         'u.first_name',
    //         'u.last_name',
    //         'u.username',
    //         'u.image_url',
    //         'u.is_admin',
    //         'u.phone',
    //         'u.info',
    //         'la.email',
    //         'cu.customer_id',
    //         'cu.department_id'
    //     )
    //     .from('user AS u')
    //     .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
    //     .leftJoin('customer_user AS cu', 'cu.user_id', 'u.id')
    //     .where('u.id', '=', id)
    //     .first()
    // );
})

app.listen(process.env.PORT || 4000, () => console.log(`Server started on http://localhost:${process.env.PORT}`));