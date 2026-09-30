/**
 * Created by zhangrunfu on 17/10/10.
 */
(function () {
    function XmlParser() {
        
    };

    /**
     *
     * @param xmlFile xmlFile should be a url
     */
    XmlParser.prototype.loadXml = function (xmlFile) {
        var xmlhttp = null;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET",xmlFile,false);
        xmlhttp.send();
        xmlDoc=xmlhttp.responseXML;

        return xmlDoc;

    };
})();