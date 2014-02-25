var yr = yr || require('yate/lib/runtime.js');

(function() {

    var cmpNN = yr.cmpNN;
    var cmpSN = yr.cmpSN;
    var nodeset2xml = yr.nodeset2xml;
    var nodeset2boolean = yr.nodeset2boolean;
    var nodeset2attrvalue = yr.nodeset2attrvalue;
    var nodeset2scalar = yr.nodeset2scalar;
    var scalar2attrvalue = yr.scalar2attrvalue;
    var xml2attrvalue = yr.xml2attrvalue;
    var scalar2xml = yr.scalar2xml;
    var xml2scalar = yr.xml2scalar;
    var simpleScalar = yr.simpleScalar;
    var simpleBoolean = yr.simpleBoolean;
    var selectNametest = yr.selectNametest;
    var closeAttrs = yr.closeAttrs;

    var M = new yr.Module();

    var j8 = [ ];

    var j9 = [ 1, 0 ];

    var j10 = [ 0, 'list' ];

    function p1(m, c0, i0, l0) {
        return simpleBoolean('list', c0);
    }

    var j11 = [ 2, p1 ];

    var j12 = [ 0, 'path' ];

    // match /
    M.t7 = function t7(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += "<h1>" + "hello world!" + "</h1>";
        r0 += m.a(m, m.s(j9, c0), 'list', a0)

        return r0;
    };
    M.t7.j = 1;
    M.t7.a = 1;

    // match /[ .list ] : list
    M.t8 = function t8(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += "<ul";
        a0.a = {
        };
        a0.s = 'ul';
        r0 += m.a(m, selectNametest('list', c0, []), '', a0)
        r0 += closeAttrs(a0);
        r0 += "</ul>";

        return r0;
    };
    M.t8.j = j11;
    M.t8.a = 1;

    // match .list
    M.t9 = function t9(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += "<li>";
        r0 += "PATH: " + nodeset2xml( ( selectNametest('path', c0, []) ) );
        r0 += "</li>";

        return r0;
    };
    M.t9.j = j10;
    M.t9.a = 0;

    M.matcher = {
        "": {
            "": [
                "t7"
            ],
            "list": [
                "t9"
            ]
        },
        "list": {
            "": [
                "t8"
            ]
        }
    };
    M.imports = [];

    yr.register('main', M);

})();