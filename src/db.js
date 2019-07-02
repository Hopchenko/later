const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('later:sqlite');

db.serialize(()=>{
    const sql = `CREATE TABLE IF NOT EXISTS articles
        (id integer primary key, title, content TEXT)
        `;
    db.run(sql)
})

class Article {
    static all(cb) {
        db.all(`SELECT * FROM articles`, cb);
    }

    static find(id, cb) {
        db.get(`SELECT * FROM articles WHERE id = ?`,id ,cb);
    }

    static create(data,cb) {
        const query = `INSERT INTO articles(title, content) VALUES (?, ?)`;
        db.run(query, data.title, data.content, cb);
    }

    static delete(id, cb){
        if(!id){
            return cb(new Error('Please provide an id'));
        }
        const query = `DELETE FROM articles WHERE id = ?`;
        db.run(query, id, cb);
    }
}

module.exports = db;
module.exports.Article = Article;