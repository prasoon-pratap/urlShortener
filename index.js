const express = require('express');

const app = express();

const mongoose = require('mongoose');

const ShortUrl = require('./models/url')

const port = process.env.PORT || 3000 ; 

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}))

app.get('/', async (req, res) => {
	const allData = await ShortUrl.find()
	res.render('index', { shortUrls: allData })
})


app.post('/short', async (req,res)=>{
    const fullUrl = req.body.fullUrl
    console.log('Url Requested: ', fullUrl);

    const record = new ShortUrl({
        full: fullUrl
    })
    await record.save()
    res.redirect('/');
})

app.get('/:shortid', async (req,res) => {
    const shortid = req.params.shortid;

    const rec = await ShortUrl.findOne({ short: shortid })

    if(!rec) return res.sendDate(404);

    rec.clicks++;
    await rec.save();

    res.redirect(rec.full);
    
})


mongoose.connect('mongodb://localhost/27017', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.on('open', async ()=> {

    await ShortUrl.create({full: 'http://google.com'})
    await ShortUrl.create({full: 'http://prasoon.co.in'})

    app.listen(port, () =>  console.log('server started on port ' + port))
})

