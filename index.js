const express = require('express');
const bodyParser = require('body-parser');
const Article = require('./src/db').Article;
const read = require('node-readability');

const app = express();
const entityName = 'articles';


app.set('port', process.env.PORT || 8080)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
    '/css/bootstrap.css',
    express.static('node_modules/bootstrap/dist/css/bootstrap.css')
)

app.get(`/${entityName}`, (req, res, next)=>{
    Article.all((err, articles)=>{
        if(err){
            return next(err);
        }
        res.format({
            html: () => {
              res.render('article.ejs', { articles: articles });
            },
            json: () => {
              res.send(articles)
            }
          });
    })
})

app.post(`/${entityName}`, (req, res, next)=>{
    const {url} = req.body;

    read(url, (err, result)=>{
        if(err || !result){
            res.status(500).send('Error downloading article.');
        }

        Article.create(
            {title:result.title, content:result.content},
            (err, article) => {
                if(err){
                    return next(err);  
                }
                res.send('Created');
            }
        )
    })
    const article = {title: req.body.title};

    articles.push(article);
    res.send(article);
})

app.get(`/${entityName}/:id`, (req, res, next)=>{
    const { id } = req.params;
    
    Article.find(id, (err, article)=>{
        if(err){
            return next(err);
        }

        res.send(article);
    })
})

app.delete(`/${entityName}/:id`, (req, res, next)=>{
    const { id } = req.params;
    
    Article.delete(id, (err)=>{
        if(err){
            return next(err);
        }

        res.send({message:'Deleted'});
    })
})

app.listen(app.get('port'), () => {
	console.log(`app is running on port ${app.get('port')}`);
});

module.exports = app;