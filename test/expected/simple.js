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
    var simpleScalar = yr.simpleScalar;
    var simpleBoolean = yr.simpleBoolean;
    var selectNametest = yr.selectNametest;
    var closeAttrs = yr.closeAttrs;

    var M = new yr.Module();

    var j0 = [ ];

    var j1 = [ 1, 0 ];

    var j2 = [ 0, 'list' ];

    function p0(m, c0, i0, l0) {
        return simpleBoolean('list', c0);
    }

    var j3 = [ 2, p0 ];

    var j4 = [ 0, 'path' ];

    // match /
    M.t0 = function t0(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<h1>' + "hello world!" + '</h1>';
        r0 += m.a(m, [ c0 ], 'list', a0);

        return r0;
    };
    M.t0.j = 1;
    M.t0.a = 1;

    // match /[ .list ] : list
    M.t1 = function t1(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<ul';
        a0.a = {
        };
        a0.s = 'ul';
        r0 += m.a(m, selectNametest('list', c0, []), '', a0);
        r0 += closeAttrs(a0);
        r0 += '</ul>';

        return r0;
    };
    M.t1.j = j3;
    M.t1.a = 1;

    // match .list
    M.t2 = function t2(m, c0, i0, l0, a0) {
        var r0 = '';

        r0 += closeAttrs(a0);
        r0 += '<li>';
        r0 += "PATH: " + nodeset2xml( ( selectNametest('path', c0, []) ) );
        r0 += '</li>';

        return r0;
    };
    M.t2.j = j2;
    M.t2.a = 0;

    M.matcher = {
        "": {
            "": [
                "t0"
            ],
            "list": [
                "t2"
            ]
        },
        "list": {
            "": [
                "t1"
            ]
        }
    };
    M.imports = [];

    yr.register('main', M);

})();
