const database = require('./services/database');
const logger = require('../config/logger');

/**
 * @Module Controller
 */

/**
 * @typedef {Object} ShortURL
 * 
 * @property {number} id - ID da url persistida no banco
 * @property {string} url - URL original
 * @property {string} shortUrl - URL encurtada
 * @property {Date} createDate - Data de criação da URL encurtada
 */

const queryCallback = function(resp, oneValue, redirect){
    return (error, rows, fields, result) => {
     if (error || rows.length == 0) {
         resp.status(404).json({message: "Nenhuma URL encontrada para os parâmetros especificados!"});
     } else if(!redirect){
         resp.status(200).json(oneValue ? rows[0] : rows);
     } else if (redirect) {
         const {url} = rows[0];
         resp.status(200).redirect(url);
     }
 }
};

/**
 * Função para gerar um id randômico
 * 
 * @param {int} length - Tamanho do id a ser gerado
 * @returns {String} - String aleatória
 */
 function makeId(length) {
    var result = '';
    var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Retorna uma url encurtada com base em um id
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {ShortURL}
 */
function getURLById(req, res, urlIdReq) {
    let urlId = urlIdReq || req.params.urlId;

    if(urlId && !Number.isNaN(urlId)) {
        database.selectUrlById(Number.parseInt(urlId), queryCallback(res, true, false));
        return;
    }
    
    return res.status(400).json({message: "Informe o id numérico da URL para busca."});
}

/**
 * Retorna todas as URLs encurtadas em uma data específica.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {Array<ShortURL>}
 */
 function getURLsByDate(req, res) {
    const {date} = req.body;

    var parts = date.split("-");
    if(parts.length == 3){
        var searchDate = new Date(parseInt(parts[2], 10),
                        parseInt(parts[1], 10) - 1,
                        parseInt(parts[0], 10), 0,0,0);
        database.selectUrlsByDate(searchDate, queryCallback(res, false, false));
        return;
    } else {
        return res.status(400).json({message: "A data deve estar no formato dd-MM-yyyy"});
    }
}

/**
 * Retorna uma url encurtada conforme o encurtamento da URL.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {ShortURL}
 */
 function getURLByShortUrl(req, res) {
    const {shortUrl} = req.body;

    let shortenUrl = req.protocol + '://' + req.get('host') + '/url-e/' + shortUrl;
    logger.info(shortenUrl);
    database.selectUrlsByShortUrl(shortenUrl, queryCallback(res, true, false));
    return;
}

/**
 * Encurta uma URL persistindo-a no banco de dados.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {ShortURL}
 */
function insertURL(req, res) {
    const { url } = req.body;
    let randomId = makeId(6);
    let id = 1;
    let shortenUrl = req.protocol + '://' + req.get('host') + '/url-e/';

    database.selectMaxId(
        (error, rows, fields, result) => {
            if (rows && rows.length == 1) {
                const {maxId} = rows[0];
                id = maxId + 1;
            }
            shortenUrl = shortenUrl + id + randomId;
            database.insertUrl({'url': url, 'shortUrl': shortenUrl}, (error, result) => {
                if(!error) {
                    database.selectUrlById(result.insertId, queryCallback(res, true, false));
                } else {
                    logger.error(error);
                }
            });
        });
    return;
}

/**
 * Redireciona uma url encurtada para a página da URL original.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
 function redirectURL(req, res) {
    let urlId = req.params.urlId;
    var shortUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    if(urlId) {
        database.selectUrlsByShortUrl(shortUrl, queryCallback(res, true, true));
    }
}

module.exports = {getURLById, getURLsByDate, getURLByShortUrl, insertURL, redirectURL}