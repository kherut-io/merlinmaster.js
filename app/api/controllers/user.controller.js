exports.getUser = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'It looks like you\'re not logged in!' });
    
    res.send(req.user);
};