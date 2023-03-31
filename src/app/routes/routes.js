const controller = require('../api.controller');

/**
 * 
 * @param {Express} app 
 */
module.exports = (app) => {
    app.get('/search/:urlId', (req, resp) => {
        controller.getURLById(req, resp);
        return;
    });

    app.post('/search', (req, resp) => {
        const {urlId, date, shortUrl} = req.body;

        if(urlId || date || shortUrl) {
            if(urlId && !Number.isNaN(urlId)){
                controller.getURLById(req, resp, urlId);
            } else if(shortUrl){
                controller.getURLByShortUrl(req, resp);
            } else if(date) {
                controller.getURLsByDate(req, resp);
            }
            return;
        }
        
        return resp.status(400).json({message: "Informe o id da URL, a URL encurtada ou uma data para busca."});
    });

    app.post('/shorter', (req, resp) => {
        controller.insertURL(req, resp);
        return;
    });

    app.get('/url-e/:urlId', (req, resp) => {
        controller.redirectURL(req, resp);
        return;
    });
};