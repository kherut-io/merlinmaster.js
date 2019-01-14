exports.getUser = (req, res) => {
    if(typeof req.user == 'undefined')
        res.send({ ok: 0, errorText: 'It looks like you\'re not logged in!' });
    
    res.send(req.user);
};