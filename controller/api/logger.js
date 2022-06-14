module.exports.jsonResponse = (res, status_code, status, status_text, data) => {
    finalresultjson = {};
    if(typeof status != "undefined" && status != "undefined" && status != "" && status != null)
    	finalresultjson.status = status;

    if(typeof status_text != "undefined" && status_text != "undefined" && status_text != "" && status_text != null)
    	finalresultjson.status_text = status_text;

    finalresultjson.status_text = status_text;
    if(typeof data != "undefined" && data != "undefined" && data != "" && data != null)
    	finalresultjson.data = data;

    if(typeof status_code != "undefined" && status_code != "undefined" && status_code != "" && status_code != null)
    	finalresultjson.status_code = status_code;
    else
    	status_code = 200;

    res.status(status_code).json(finalresultjson).end();
    return false;
}