/**
 *  @Module Database
 */
const mysql = require('mysql2');
const config = require('../../config/config');
const logger = require('../../config/logger');

const connection = mysql.createConnection({
    host     : config.DB_HOST,
    user     : config.DB_USER,
    password : config.DB_PASS,
    database : config.DB_NAME
});

connection.connect((err, conn) => {
  if(!err) {
    logger.info("Connected to MySql!");
  } else {
    console.log(err);
    logger.error(err);
  }
});

/**
 * Consulta de URL encurtada com base no ID de inserção
 * 
 * @param {int} urlId - ID retornado ao realizar o encurtamento da URL
 * @param {mysql.queryCallback} callback - Callback de finalização da query
 */
function selectUrlById(urlId, callback) {
  connection.query("SELECT * FROM mbademobile WHERE id = ?;", [urlId], callback);
}

/**
 * Consulta de URL encurtada com base na data de inserção, consulta realizada das 00h até às 23h59min da data informada
 * 
 * @param {Date} date - Data em que a URL foi enviada para encurtar
 * @param {mysql.queryCallback} callback - Callback de finalização da query
 */
function selectUrlsByDate(date, callback) {
    let startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    let endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    connection.query("SELECT * FROM mbademobile WHERE createDate >= ? AND createDate <= ?;", [startDate, endDate], callback); 
}

/**
 * Consulta de URL encurtada com base na própria URL Curta
 * 
 * @param {String} shortUrl - URL Curta criada pela API
 * @param {mysql.queryCallback} callback - Callback de finalização da query
 */
function selectUrlsByShortUrl(shortUrl, callback) {
  connection.query("SELECT * FROM mbademobile WHERE shortUrl = ?;", [shortUrl], callback);
}

function selectMaxId(callback) {
  connection.query("SELECT MAX(id) as maxId FROM mbademobile;", callback);
}

/**
 * Armazena os dados da URL encurtada
 * 
 * @param {ShortURL} shortUrl - Informações a serem armazenadas da URL/URL encurtada      
 * @param {mysql.queryCallback} callback - Callback de finalização da query
 */
function insertUrl(shortUrl, callback) {
    let sql = "INSERT INTO mbademobile(url, shortUrl) VALUES (?, ?);"
    let values = [shortUrl.url, shortUrl.shortUrl];
    connection.query(sql, values, callback);
}

module.exports = {selectMaxId, selectUrlById, selectUrlsByDate, selectUrlsByShortUrl, insertUrl};