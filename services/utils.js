
exports.getHash = function(password){
    const crypto = require('crypto');
    const secret = 'thequickfoxjumpedoverthelazydog';
    const hash = crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex');
    return hash;
}

exports.getAsArray = function(str, del){    
    return str.split(del).map((item)=>parseInt(item));
}