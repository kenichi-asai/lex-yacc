// This program was compiled from OCaml by js_of_ocaml 1.0
function caml_raise_with_arg (tag, arg) { throw [0, tag, arg]; }
function caml_raise_with_string (tag, msg) {
  caml_raise_with_arg (tag, new MlWrappedString (msg));
}
function caml_invalid_argument (msg) {
  caml_raise_with_string(caml_global_data[4], msg);
}
function caml_array_bound_error () {
  caml_invalid_argument("index out of bounds");
}
function caml_str_repeat(n, s) {
  if (!n) { return ""; }
  if (n & 1) { return caml_str_repeat(n - 1, s) + s; }
  var r = caml_str_repeat(n >> 1, s);
  return r + r;
}
function MlString(param) {
  if (param != null) {
    this.bytes = this.fullBytes = param;
    this.last = this.len = param.length;
  }
}
MlString.prototype = {
  string:null,
  bytes:null,
  fullBytes:null,
  array:null,
  len:null,
  last:0,
  toJsString:function() {
    return this.string = decodeURIComponent (escape(this.getFullBytes()));
  },
  toBytes:function() {
    if (this.string != null)
      var b = unescape (encodeURIComponent (this.string));
    else {
      var b = "", a = this.array, l = a.length;
      for (var i = 0; i < l; i ++) b += String.fromCharCode (a[i]);
    }
    this.bytes = this.fullBytes = b;
    this.last = this.len = b.length;
    return b;
  },
  getBytes:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return b;
  },
  getFullBytes:function() {
    var b = this.fullBytes;
    if (b !== null) return b;
    b = this.bytes;
    if (b == null) b = this.toBytes ();
    if (this.last < this.len) {
      this.bytes = (b += caml_str_repeat(this.len - this.last, '\0'));
      this.last = this.len;
    }
    this.fullBytes = b;
    return b;
  },
  toArray:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes ();
    var a = [], l = this.last;
    for (var i = 0; i < l; i++) a[i] = b.charCodeAt(i);
    for (l = this.len; i < l; i++) a[i] = 0;
    this.string = this.bytes = this.fullBytes = null;
    this.last = this.len;
    this.array = a;
    return a;
  },
  getArray:function() {
    var a = this.array;
    if (!a) a = this.toArray();
    return a;
  },
  getLen:function() {
    var len = this.len;
    if (len !== null) return len;
    this.toBytes();
    return this.len;
  },
  toString:function() { var s = this.string; return s?s:this.toJsString(); },
  valueOf:function() { var s = this.string; return s?s:this.toJsString(); },
  blitToArray:function(i1, a2, i2, l) {
    var a1 = this.array;
    if (a1)
      for (var i = 0; i < l; i++) a2 [i2 + i] = a1 [i1 + i];
    else {
      var b = this.bytes;
      if (b == null) b = this.toBytes();
      var l1 = this.last - i1;
      if (l <= l1)
        for (var i = 0; i < l; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
      else {
        for (var i = 0; i < l1; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
        for (; i < l; i++) a2 [i2 + i] = 0;
      }
    }
  },
  get:function (i) {
    var a = this.array;
    if (a) return a[i];
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return (i<this.last)?b.charCodeAt(i):0;
  },
  safeGet:function (i) {
    if (!this.len) this.toBytes();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    return this.get(i);
  },
  set:function (i, c) {
    var a = this.array;
    if (!a) {
      if (this.last == i) {
        this.bytes += String.fromCharCode (c & 0xff);
        this.last ++;
        return 0;
      }
      a = this.toArray();
    } else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    a[i] = c & 0xff;
    return 0;
  },
  safeSet:function (i, c) {
    if (this.len == null) this.toBytes ();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    this.set(i, c);
  },
  fill:function (ofs, len, c) {
    if (ofs >= this.last && this.last && c == 0) return;
    var a = this.array;
    if (!a) a = this.toArray();
    else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    var l = ofs + len;
    for (var i = ofs; i < l; i++) a[i] = c;
  },
  compare:function (s2) {
    if (this.string != null && s2.string != null) {
      if (this.string < s2.string) return -1;
      if (this.string > s2.string) return 1;
      return 0;
    }
    var b1 = this.getFullBytes ();
    var b2 = s2.getFullBytes ();
    if (b1 < b2) return -1;
    if (b1 > b2) return 1;
    return 0;
  },
  equal:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string == s2.string;
    return this.getFullBytes () == s2.getFullBytes ();
  },
  lessThan:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string < s2.string;
    return this.getFullBytes () < s2.getFullBytes ();
  },
  lessEqual:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string <= s2.string;
    return this.getFullBytes () <= s2.getFullBytes ();
  }
}
function MlWrappedString (s) { this.string = s; }
MlWrappedString.prototype = new MlString();
function MlMakeString (l) { this.bytes = ""; this.len = l; }
MlMakeString.prototype = new MlString ();
function caml_blit_string(s1, i1, s2, i2, len) {
  if (len === 0) return;
  if (i2 === s2.last && i1 === 0 && s1.last == len) {
    var s = s1.bytes;
    if (s !== null)
      s2.bytes += s1.bytes;
    else
      s2.bytes += s1.getBytes();
    s2.last += len;
    return;
  }
  var a = s2.array;
  if (!a) a = s2.toArray(); else { s2.bytes = s2.string = null; }
  s1.blitToArray (i1, a, i2, len);
}
function caml_call_gen(f, args) {
  if(f.fun)
    return caml_call_gen(f.fun, args);
  var n = f.length;
  var d = n - args.length;
  if (d == 0)
    return f.apply(null, args);
  else if (d < 0)
    return caml_call_gen(f.apply(null, args.slice(0,n)), args.slice(n));
  else
    return function (x){ return caml_call_gen(f, args.concat([x])); };
}
function caml_int64_compare(x,y) {
  var x3 = x[3] << 16;
  var y3 = y[3] << 16;
  if (x3 > y3) return 1;
  if (x3 < y3) return -1;
  if (x[2] > y[2]) return 1;
  if (x[2] < y[2]) return -1;
  if (x[1] > y[1]) return 1;
  if (x[1] < y[1]) return -1;
  return 0;
}
function caml_int_compare (a, b) {
  if (a < b) return (-1); if (a == b) return 0; return 1;
}
function caml_compare_val (a, b, total) {
  if (a === b && total) return 0;
  if (a instanceof MlString) {
    if (b instanceof MlString)
      return (a == b)?0:a.compare(b)
    else
      return 1;
  } else if (a instanceof Array && a[0] == (a[0]|0)) {
    var ta = a[0];
    if (ta === 250) return caml_compare_val (a[1], b, total);
    if (b instanceof Array && b[0] == (b[0]|0)) {
      var tb = b[0];
      if (tb === 250) return caml_compare_val (a, b[1], total);
      if (ta != tb) return (ta < tb)?-1:1;
      switch (ta) {
      case 248:
        return caml_int_compare(a[2], b[2]);
      case 255:
        return caml_int64_compare(a, b);
      default:
        if (a.length != b.length) return (a.length < b.length)?-1:1;
        for (var i = 1; i < a.length; i++) {
          var t = caml_compare_val (a[i], b[i], total);
          if (t != 0) return t;
        }
        return 0;
      }
    } else
      return 1;
  } else if (b instanceof MlString || (b instanceof Array && b[0] == (b[0]|0)))
    return -1;
  else {
    if (a < b) return -1;
    if (a > b) return 1;
    if (a != b) {
      if (!total) return 0;
      if (a == a) return 1;
      if (b == b) return -1;
    }
    return 0;
  }
}
function caml_compare (a, b) { return caml_compare_val (a, b, true); }
function caml_create_string(len) { return new MlMakeString(len); }
function caml_equal (x, y) { return +(caml_compare_val(x,y,false) == 0); }
var caml_js_regexps = { amp:/&/g, lt:/</g, quot:/\"/g, all:/[&<\"]/ };
function caml_js_html_escape (s) {
  if (!caml_js_regexps.all.test(s)) return s;
  return s.replace(caml_js_regexps.amp, "&amp;")
          .replace(caml_js_regexps.lt, "&lt;")
          .replace(caml_js_regexps.quot, "&quot;");
}
function caml_js_on_ie () {
  var ua = window.navigator?window.navigator.userAgent:"";
  return ua.indexOf("MSIE") != -1 && ua.indexOf("Opera") != 0;
}
function caml_js_wrap_callback(f) {
  var toArray = Array.prototype.slice;
  return function () {
    var args = (arguments.length > 0)?toArray.call (arguments):[0];
    return caml_call_gen(f, args);
  }
}
function caml_ml_out_channels_list () { return 0; }
var caml_global_data = [0];
function caml_register_global (n, v) { caml_global_data[n + 1] = v; }
var caml_named_values = {};
function caml_register_named_value(nm,v) {
  caml_named_values[nm] = v; return 0;
}
function caml_string_equal(s1, s2) {
  var b1 = s1.fullBytes;
  var b2 = s2.fullBytes;
  if (b1 != null && b2 != null) return (b1 == b2)?1:0;
  return (s1.getFullBytes () == s2.getFullBytes ())?1:0;
}
function caml_string_notequal(s1, s2) { return 1-caml_string_equal(s1, s2); }
(function(){function dZ(eU,eV,eW){return eU.length==2?eU(eV,eW):caml_call_gen(eU,[eV,eW]);}function ci(eS,eT){return eS.length==1?eS(eT):caml_call_gen(eS,[eT]);}var a=[0,new MlString("Invalid_argument")],b=[0,new MlString("Not_found")];caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,a);caml_register_global(2,[0,new MlString("Failure")]);var bU=[0,new MlString("Assert_failure")],bT=new MlString("Pervasives.do_at_exit"),bS=new MlString("String.sub"),bR=new MlString("br"),bQ=new MlString("textarea"),bP=new MlString("input"),bO=new MlString("\""),bN=new MlString(" name=\""),bM=new MlString("\""),bL=new MlString(" type=\""),bK=new MlString("<"),bJ=new MlString(">"),bI=new MlString(""),bH=[0,new MlString("stdin.ml"),55,16],bG=new MlString("main"),bF=new MlString("\n"),bE=new MlString("\n"),bD=new MlString("text"),bC=new MlString("submit"),bB=new MlString("\xe5\x85\xa5\xe5\x8a\x9b"),bA=new MlString("Stdin.Exit"),bz=new MlString("\xe5\x8c\x97"),by=new MlString("\xe5\x8d\x97"),bx=new MlString("\xe5\xae\xb6"),bw=new MlString("\xe6\x9d\xb1"),bv=new MlString("\xe7\xb5\x82\xe4\xba\x86\xe3\x81\x99\xe3\x82\x8b"),bu=new MlString("\xe8\xa5\xbf"),bt=new MlString("\xe9\x83\xa8\xe5\xb1\x8b"),bs=new MlString("\xe3\x80\x8d\xe3\x82\x92\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),br=new MlString("\xe3\x80\x8c"),bq=new MlString("\xe3\x82\x92"),bp=[0,new MlString("\xe7\xb5\x82\xe4\xba\x86\xe3\x81\x99\xe3\x82\x8b"),new MlString("")],bo=new MlString("\xe3\x81\x88\xef\xbc\x9f"),bn=new MlString("\xe3\x83\x8e\xe3\x83\x83\xe3\x82\xaf\xe3\x81\x99\xe3\x82\x8b"),bm=new MlString("\xe5\x8f\x96\xe3\x82\x8b"),bl=new MlString("\xe7\xbd\xae\xe3\x81\x8f"),bk=new MlString("\xe9\x96\x89\xe3\x81\x98\xe3\x82\x8b"),bj=new MlString("\xe9\x96\x8b\xe3\x81\x8f"),bi=new MlString("\xe3\x80\x8d\xe3\x82\x92\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),bh=new MlString("\xe3\x80\x8c"),bg=new MlString("\xe3\x80\x8d\xe3\x82\x92\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),bf=new MlString("\xe3\x80\x8c"),be=new MlString("\xe3\x81\x8b\xe3\x82\x89"),bd=new MlString("\xe3\x80\x8c\xe9\x83\xa8\xe5\xb1\x8b\xe3\x80\x8d\xe3\x81\xab\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),bc=new MlString("\xe3\x80\x8d\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),bb=new MlString("\xe3\x80\x8c\xe9\x83\xa8\xe5\xb1\x8b"),ba=new MlString("\xe5\x87\xba\xe3\x82\x8b"),a$=[0,new MlString("\xe7\xa7\xbb\xe5\x8b\x95\xe3\x81\x99\xe3\x82\x8b"),new MlString("\xe5\x87\xba")],a_=new MlString("\xe3\x80\x8c\xe9\x83\xa8\xe5\xb1\x8b\xe3\x80\x8d\xe3\x81\xab\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),a9=new MlString("\xe3\x81\x8b\xe3\x82\x89"),a8=new MlString("\xe3\x81\xab"),a7=new MlString("\xe3\x81\xb8"),a6=new MlString("\xe3\x80\x8c\xe5\xae\xb6\xe3\x80\x8d\xe3\x81\xab\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),a5=new MlString("\xe3\x80\x8d\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),a4=new MlString("\xe3\x80\x8c\xe5\xae\xb6"),a3=new MlString("\xe5\x87\xba\xe3\x82\x8b"),a2=[0,new MlString("\xe7\xa7\xbb\xe5\x8b\x95\xe3\x81\x99\xe3\x82\x8b"),new MlString("\xe5\x87\xba")],a1=new MlString("\xe3\x80\x8d\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),a0=new MlString("\xe3\x80\x8c\xe5\xae\xb6"),aZ=new MlString("\xe5\x85\xa5\xe3\x82\x8b"),aY=[0,new MlString("\xe7\xa7\xbb\xe5\x8b\x95\xe3\x81\x99\xe3\x82\x8b"),new MlString("\xe5\x85\xa5")],aX=new MlString("\xe3\x80\x8c\xe5\xae\xb6\xe3\x80\x8d\xe3\x81\xab\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),aW=new MlString("\xe3\x81\xab"),aV=new MlString("\xe3\x81\xb8"),aU=new MlString("\xe3\x80\x8d\xe3\x81\xab\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),aT=new MlString("\xe3\x80\x8c"),aS=new MlString("\xe3\x80\x8d\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),aR=new MlString("\xe3\x80\x8c"),aQ=new MlString("\xe9\x80\xb2\xe3\x82\x80"),aP=new MlString("\xe7\xa7\xbb\xe5\x8b\x95\xe3\x81\x99\xe3\x82\x8b"),aO=new MlString("\xe3\x80\x8d\xe3\x81\xab\xe3\x81\xa9\xe3\x81\x86\xe3\x81\x99\xe3\x82\x8b\xef\xbc\x9f"),aN=new MlString("\xe3\x80\x8c"),aM=new MlString("\xe3\x80\x8d\xef\xbc\x9f"),aL=new MlString("\xe3\x80\x8c"),aK=new MlString("Parser.Error"),aJ=new MlString("\xe3\x80\x8d\xef\xbc\x9f"),aI=new MlString("\xe3\x80\x8c"),aH=[0,[0,1,[0,0,[0,[0,new MlString("\xe6\x9d\xb1"),2],[0,[0,new MlString("\xe8\xa5\xbf"),3],[0,[0,new MlString("\xe5\x8d\x97"),4],[0,[0,new MlString("\xe5\x8c\x97"),5],[0,[0,new MlString("\xe5\xae\xb6"),6],[0,[0,new MlString("\xe3\x82\x92"),7],[0,[0,new MlString("\xe9\x8d\xb5"),8],[0,[0,new MlString("\xe5\xae\x9d"),9],[0,[0,new MlString("\xe3\x81\xb2"),10],[0,[0,new MlString("\xe3\x81\xab"),12],[0,[0,new MlString("\xe3\x81\xbf"),13],[0,[0,new MlString("\xe3\x81\x8d"),15],[0,[0,new MlString("\xe3\x81\x84"),16],[0,[0,new MlString("\xe3\x81\x8b"),17],[0,[0,new MlString("\xe3\x81\x9f"),19],[0,[0,new MlString("\xe9\x83\xa8"),21],[0,[0,new MlString("\xe3\x81\xb8"),23],[0,[0,new MlString("\xe9\x80\xb2"),24],[0,[0,new MlString("\xe3\x81\x99"),26],[0,[0,new MlString("\xe5\x85\xa5"),62],[0,[0,new MlString("\xe5\x87\xba"),29],[0,[0,new MlString("\xe6\x89\x89"),31],[0,[0,new MlString("\xe3\x83\x89"),32],[0,[0,new MlString("\xe3\x82\xb5"),33],[0,[0,new MlString("\xe5\x8f\x96"),37],[0,[0,new MlString("\xe3\x81\xa8"),46],[0,[0,new MlString("\xe7\xbd\xae"),39],[0,[0,new MlString("\xe3\x81\x8a"),39],[0,[0,new MlString("\xe9\x96\x8b"),41],[0,[0,new MlString("\xe9\x96\x89"),43],[0,[0,new MlString("\xe3\x81\xa8"),46],[0,[0,new MlString("\xe3\x83\x8e"),47],[0,[0,new MlString("\xe7\xb5\x82"),52],[0,[0,new MlString("\xe3\x81\x97"),56],[0,[0,new MlString("\xe8\xa1\x8c"),61],0]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]],[0,[0,2,[0,[0,new MlString("\xe6\x9d\xb1")],0]],[0,[0,3,[0,[0,new MlString("\xe8\xa5\xbf")],0]],[0,[0,4,[0,[0,new MlString("\xe5\x8d\x97")],0]],[0,[0,5,[0,[0,new MlString("\xe5\x8c\x97")],0]],[0,[0,6,[0,[0,new MlString("\xe5\xae\xb6")],0]],[0,[0,7,[0,[0,new MlString("\xe3\x82\x92")],0]],[0,[0,8,[0,[0,new MlString("\xe9\x8d\xb5")],0]],[0,[0,9,[0,[0,new MlString("\xe5\xae\x9d")],0]],[0,[0,10,[0,0,[0,[0,new MlString("\xe3\x81\x8c"),11],[0,[0,new MlString("\xe3\x82\x89"),41],0]]]],[0,[0,11,[0,0,[0,[0,new MlString("\xe3\x81\x97"),2],0]]],[0,[0,12,[0,[0,new MlString("\xe3\x81\xab")],[0,[0,new MlString("\xe3\x81\x97"),3],0]]],[0,[0,13,[0,0,[0,[0,new MlString("\xe3\x81\xaa"),14],0]]],[0,[0,14,[0,0,[0,[0,new MlString("\xe3\x81\xbf"),4],0]]],[0,[0,15,[0,0,[0,[0,new MlString("\xe3\x81\x9f"),5],0]]],[0,[0,16,[0,0,[0,[0,new MlString("\xe3\x81\x88"),6],[0,[0,new MlString("\xe3\x81\x8f"),25],0]]]],[0,[0,17,[0,0,[0,[0,new MlString("\xe3\x81\x8e"),8],[0,[0,new MlString("\xe3\x82\x89"),18],0]]]],[0,[0,18,[0,[0,new MlString("\xe3\x81\x8b\xe3\x82\x89")],0]],[0,[0,19,[0,0,[0,[0,new MlString("\xe3\x81\x8b"),20],0]]],[0,[0,20,[0,0,[0,[0,new MlString("\xe3\x82\x89"),9],0]]],[0,[0,21,[0,0,[0,[0,new MlString("\xe5\xb1\x8b"),22],0]]],[0,[0,22,[0,[0,new MlString("\xe9\x83\xa8\xe5\xb1\x8b")],0]],[0,[0,23,[0,[0,new MlString("\xe3\x81\xb8")],[0,[0,new MlString("\xe3\x82\x84"),22],0]]],[0,[0,24,[0,0,[0,[0,new MlString("\xe3\x82\x80"),25],0]]],[0,[0,25,[0,[0,new MlString("\xe9\x80\xb2\xe3\x82\x80")],0]],[0,[0,26,[0,0,[0,[0,new MlString("\xe3\x81\x99"),27],0]]],[0,[0,27,[0,0,[0,[0,new MlString("\xe3\x82\x80"),25],0]]],[0,[0,62,[0,0,[0,[0,new MlString("\xe3\x82\x8b"),28],0]]],[0,[0,28,[0,[0,new MlString("\xe5\x85\xa5\xe3\x82\x8b")],0]],[0,[0,29,[0,0,[0,[0,new MlString("\xe3\x82\x8b"),30],0]]],[0,[0,30,[0,[0,new MlString("\xe5\x87\xba\xe3\x82\x8b")],0]],[0,[0,31,[0,[0,new MlString("\xe6\x89\x89")],0]],[0,[0,32,[0,0,[0,[0,new MlString("\xe3\x82\xa2"),31],0]]],[0,[0,33,[0,0,[0,[0,new MlString("\xe3\x83\x9c"),34],0]]],[0,[0,34,[0,0,[0,[0,new MlString("\xe3\x83\x86"),35],0]]],[0,[0,35,[0,0,[0,[0,new MlString("\xe3\x83\xb3"),36],0]]],[0,[0,36,[0,[0,new MlString("\xe3\x82\xb5\xe3\x83\x9c\xe3\x83\x86\xe3\x83\xb3")],0]],[0,[0,37,[0,0,[0,[0,new MlString("\xe3\x82\x8b"),38],0]]],[0,[0,38,[0,[0,new MlString("\xe5\x8f\x96\xe3\x82\x8b")],0]],[0,[0,39,[0,0,[0,[0,new MlString("\xe3\x81\x8f"),40],0]]],[0,[0,40,[0,[0,new MlString("\xe7\xbd\xae\xe3\x81\x8f")],0]],[0,[0,41,[0,0,[0,[0,new MlString("\xe3\x81\x8f"),42],0]]],[0,[0,42,[0,[0,new MlString("\xe9\x96\x8b\xe3\x81\x8f")],0]],[0,[0,43,[0,0,[0,[0,new MlString("\xe3\x81\x98"),44],0]]],[0,[0,44,[0,0,[0,[0,new MlString("\xe3\x82\x8b"),45],0]]],[0,[0,45,[0,[0,new MlString("\xe9\x96\x89\xe3\x81\x98\xe3\x82\x8b")],0]],[0,[0,46,[0,0,[0,[0,new MlString("\xe3\x81\x98"),44],[0,[0,new MlString("\xe3\x82\x8b"),38],0]]]],[0,[0,47,[0,0,[0,[0,new MlString("\xe3\x83\x83"),48],0]]],[0,[0,48,[0,0,[0,[0,new MlString("\xe3\x82\xaf"),49],0]]],[0,[0,49,[0,0,[0,[0,new MlString("\xe3\x81\x99"),50],0]]],[0,[0,50,[0,0,[0,[0,new MlString("\xe3\x82\x8b"),51],0]]],[0,[0,51,[0,[0,new MlString("\xe3\x83\x8e\xe3\x83\x83\xe3\x82\xaf\xe3\x81\x99\xe3\x82\x8b")],0]],[0,[0,52,[0,0,[0,[0,new MlString("\xe4\xba\x86"),53],0]]],[0,[0,53,[0,0,[0,[0,new MlString("\xe3\x81\x99"),54],0]]],[0,[0,54,[0,0,[0,[0,new MlString("\xe3\x82\x8b"),55],0]]],[0,[0,55,[0,[0,new MlString("\xe7\xb5\x82\xe4\xba\x86\xe3\x81\x99\xe3\x82\x8b")],0]],[0,[0,56,[0,0,[0,[0,new MlString("\xe3\x82\x85"),57],0]]],[0,[0,57,[0,0,[0,[0,new MlString("\xe3\x81\x86"),58],0]]],[0,[0,58,[0,0,[0,[0,new MlString("\xe3\x82\x8a"),59],0]]],[0,[0,59,[0,0,[0,[0,new MlString("\xe3\x82\x87"),60],0]]],[0,[0,60,[0,0,[0,[0,new MlString("\xe3\x81\x86"),53],0]]],[0,[0,61,[0,0,[0,[0,new MlString("\xe3\x81\x8f"),25],0]]],0]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]],aG=new MlString("Lexer.Error"),aF=new MlString("Lexer.End_of_input"),aE=new MlString("\xe3\x81\x88\xe3\x81\xa3\xef\xbc\x9f"),aD=new MlString("\xe8\x8d\x89\xe5\x8e\x9f"),aC=new MlString("\xe5\xae\x9d"),aB=new MlString("\xe3\x82\xb2\xe3\x83\xbc\xe3\x83\xa0\xe3\x82\xaf\xe3\x83\xaa\xe3\x82\xa2\xef\xbc\x81"),aA=new MlString("> "),az=new MlString("\xe3\x82\x88\xe3\x81\x86\xe3\x81\x93\xe3\x81\x9d\xef\xbc\x81"),ay=new MlString("\xe7\xb5\x82\xe4\xba\x86\xe3\x81\x99\xe3\x82\x8b\xe3\x81\xab\xe3\x81\xaf\xe3\x80\x8c\xe7\xb5\x82\xe4\xba\x86\xe3\x81\x99\xe3\x82\x8b\xe3\x80\x8d\xe3\x81\xa8\xe5\x85\xa5\xe5\x8a\x9b\xe3\x81\x97\xe3\x81\xa6\xe3\x81\x8f\xe3\x81\xa0\xe3\x81\x95\xe3\x81\x84\xe3\x80\x82"),ax=new MlString("\xe3\x81\xaf\xe3\x82\x8b\xe3\x81\x8b\xe5\x8c\x97\xe3\x81\xab\xe5\xae\xb6\xe3\x81\x8c\xe8\xa6\x8b\xe3\x81\x88\xe3\x81\xbe\xe3\x81\x99\xe3\x80\x82"),aw=new MlString("\xe3\x81\xa8"),av=new MlString("\xe3\x81\xab\xe3\x81\x84\xe3\x82\x8b\xe3\x80\x82"),au=new MlString("\xe3\x81\x82\xe3\x81\xaa\xe3\x81\x9f\xe3\x81\xaf"),at=new MlString("\xe3\x81\x93\xe3\x81\x93\xe3\x81\xab\xe3\x81\xaf"),as=new MlString("\xe3\x81\x8c\xe3\x81\x82\xe3\x82\x8b\xe3\x80\x82"),ar=new MlString("\xe4\xbd\x95\xe3\x82\x82\xe3\x81\xaa\xe3\x81\x84\xe3\x80\x82"),aq=new MlString("\xe7\xa7\xbb\xe5\x8b\x95\xe3\x81\x99\xe3\x82\x8b"),ap=new MlString("\xe7\xb5\x82\xe4\xba\x86\xe3\x81\x99\xe3\x82\x8b"),ao=new MlString("\xe3\x81\x93\xe3\x81\xa8\xe3\x81\xaf\xe3\x81\xa7\xe3\x81\x8d\xe3\x81\xbe\xe3\x81\x9b\xe3\x82\x93\xe3\x80\x82"),an=new MlString("\xe3\x82\x92"),am=new MlString(""),al=new MlString("\xe3\x81\xbe\xe3\x81\x9f\xe9\x81\x8a\xe3\x82\x93\xe3\x81\xa7\xe3\x81\xad\xef\xbc\x81"),ak=new MlString("\xe3\x81\xae\xe3\x81\x8b\xe3\x82\x8f\xe3\x81\x8b\xe3\x82\x8a\xe3\x81\xbe\xe3\x81\x9b\xe3\x82\x93\xe3\x80\x82"),aj=new MlString("\xe3\x82\x92"),ai=new MlString("\xe3\x81\xa9\xe3\x81\x86\xe3\x82\x84\xe3\x81\xa3\xe3\x81\xa6"),ah=new MlString("\xe3\x81\xaf\xe3\x81\x82\xe3\x82\x8a\xe3\x81\xbe\xe3\x81\x9b\xe3\x82\x93\xe3\x80\x82"),ag=new MlString("\xe3\x81\x93\xe3\x81\x93\xe3\x81\xab"),af=new MlString("\xe6\x89\x89\xe3\x81\xaf\xe3\x81\x99\xe3\x81\xa7\xe3\x81\xab\xe9\x96\x89\xe3\x81\xbe\xe3\x81\xa3\xe3\x81\xa6\xe3\x81\x84\xe3\x82\x8b\xe3\x80\x82"),ae=new MlString("\xe3\x81\x82\xe3\x81\xaa\xe3\x81\x9f\xe3\x81\xaf\xe6\x89\x89\xe3\x82\x92\xe9\x96\x89\xe3\x82\x81\xe3\x81\x9f\xe3\x80\x82"),ad=new MlString("\xe3\x81\xaf\xe3\x81\x82\xe3\x82\x8a\xe3\x81\xbe\xe3\x81\x9b\xe3\x82\x93\xe3\x80\x82"),ac=new MlString("\xe3\x81\x93\xe3\x81\x93\xe3\x81\xab"),ab=new MlString("\xe9\x8d\xb5"),aa=new MlString("\xe3\x81\x82\xe3\x81\xaa\xe3\x81\x9f\xe3\x81\xaf\xe6\x89\x89\xe3\x82\x92\xe9\x96\x8b\xe3\x81\x84\xe3\x81\x9f\xe3\x80\x82"),$=new MlString("\xe6\x89\x89\xe3\x81\xaf\xe6\x96\xbd\xe9\x8c\xa0\xe3\x81\x95\xe3\x82\x8c\xe3\x81\xa6\xe3\x81\x84\xe3\x82\x8b\xe3\x80\x82"),_=new MlString("\xe6\x89\x89\xe3\x81\xaf\xe3\x81\x99\xe3\x81\xa7\xe3\x81\xab\xe9\x96\x8b\xe3\x81\x84\xe3\x81\xa6\xe3\x81\x84\xe3\x82\x8b\xe3\x80\x82"),Z=new MlString("\xe3\x81\x82\xe3\x81\xaa\xe3\x81\x9f\xe3\x81\xaf\xe6\x89\x89\xe3\x82\x92\xe9\x96\x8b\xe3\x81\x84\xe3\x81\x9f\xe3\x80\x82"),Y=new MlString("\xe3\x82\x92\xe6\x8c\x81\xe3\x81\xa3\xe3\x81\xa6\xe3\x81\x84\xe3\x81\xaa\xe3\x81\x84\xe3\x80\x82"),X=new MlString("\xe3\x81\x82\xe3\x81\xaa\xe3\x81\x9f\xe3\x81\xaf"),W=new MlString("\xe3\x82\x92\xe7\xbd\xae\xe3\x81\x84\xe3\x81\x9f\xe3\x80\x82"),V=new MlString("\xe3\x81\x82\xe3\x81\xaa\xe3\x81\x9f\xe3\x81\xaf"),U=new MlString("\xe3\x81\xaf\xe3\x81\x82\xe3\x82\x8a\xe3\x81\xbe\xe3\x81\x9b\xe3\x82\x93\xe3\x80\x82"),T=new MlString("\xe3\x81\x93\xe3\x81\x93\xe3\x81\xab"),S=new MlString("\xe3\x82\x92\xe6\x8c\x81\xe3\x81\xa3\xe3\x81\xa6\xe3\x81\x84\xe3\x82\x8b\xe3\x80\x82"),R=new MlString("\xe3\x81\x82\xe3\x81\xaa\xe3\x81\x9f\xe3\x81\xaf\xe3\x81\x99\xe3\x81\xa7\xe3\x81\xab"),Q=new MlString("\xe3\x82\x92\xe6\x89\x8b\xe3\x81\xab\xe5\x85\xa5\xe3\x82\x8c\xe3\x81\x9f\xef\xbc\x81"),P=new MlString("\xe3\x81\x82\xe3\x81\xaa\xe3\x81\x9f\xe3\x81\xaf"),O=new MlString("\xe5\x85\xa5"),N=new MlString("\xe5\x87\xba"),M=new MlString("\xe6\x89\x89\xe3\x81\x8c\xe9\x96\x89\xe3\x81\xbe\xe3\x81\xa3\xe3\x81\xa6\xe3\x81\x84\xe3\x81\xbe\xe3\x81\x99\xe3\x80\x82"),L=new MlString("\xe3\x81\x9d\xe3\x81\x93\xe3\x81\xab\xe3\x81\xaf\xe8\xa1\x8c\xe3\x81\x8b\xe3\x82\x8c\xe3\x81\xbe\xe3\x81\x9b\xe3\x82\x93\xe3\x80\x82"),K=[0,new MlString("\xe5\xae\x9d"),0],J=new MlString("\xe9\x83\xa8\xe5\xb1\x8b\xe3\x81\xae\xe4\xb8\xad"),I=[0,new MlString("\xe6\x89\x89"),0],H=new MlString("\xe5\xae\xb6\xe3\x81\xae\xe5\x89\x8d"),G=new MlString("\xe8\x8d\x89\xe5\x8e\x9f"),F=[0,new MlString("\xe3\x82\xb5\xe3\x83\x9c\xe3\x83\x86\xe3\x83\xb3"),[0,new MlString("\xe9\x8d\xb5"),0]],E=new MlString("\xe7\xa0\x82\xe6\xbc\xa0"),D=new MlString("\xe8\x8d\x89\xe5\x8e\x9f"),C=[0,[0,new MlString("\xe7\xa0\x82\xe6\xbc\xa0"),[0,[0,new MlString("\xe6\x9d\xb1"),new MlString("\xe7\xa0\x82\xe6\xbc\xa0")],[0,[0,new MlString("\xe8\xa5\xbf"),new MlString("\xe7\xa0\x82\xe6\xbc\xa0")],[0,[0,new MlString("\xe5\x8d\x97"),new MlString("\xe7\xa0\x82\xe6\xbc\xa0")],[0,[0,new MlString("\xe5\x8c\x97"),new MlString("\xe8\x8d\x89\xe5\x8e\x9f")],0]]]]],[0,[0,new MlString("\xe8\x8d\x89\xe5\x8e\x9f"),[0,[0,new MlString("\xe5\x8d\x97"),new MlString("\xe7\xa0\x82\xe6\xbc\xa0")],[0,[0,new MlString("\xe5\x8c\x97"),new MlString("\xe5\xae\xb6\xe3\x81\xae\xe5\x89\x8d")],0]]],[0,[0,new MlString("\xe5\xae\xb6\xe3\x81\xae\xe5\x89\x8d"),[0,[0,new MlString("\xe5\x85\xa5"),new MlString("\xe9\x83\xa8\xe5\xb1\x8b\xe3\x81\xae\xe4\xb8\xad")],[0,[0,new MlString("\xe5\x8d\x97"),new MlString("\xe8\x8d\x89\xe5\x8e\x9f")],0]]],[0,[0,new MlString("\xe9\x83\xa8\xe5\xb1\x8b\xe3\x81\xae\xe4\xb8\xad"),[0,[0,new MlString("\xe5\x87\xba"),new MlString("\xe5\xae\xb6\xe3\x81\xae\xe5\x89\x8d")],0]],0]]]],B=new MlString("\xe5\xae\x9d"),A=new MlString("\xe7\xbd\xae\xe3\x81\x8f"),z=new MlString("\xe5\xae\x9d"),y=new MlString("\xe5\x8f\x96\xe3\x82\x8b"),x=new MlString("\xe5\xae\x9d"),w=new MlString("\xe5\xae\xb6\xe3\x81\xab\xe3\x81\xaf\xe8\xaa\xb0\xe3\x82\x82\xe3\x81\x84\xe3\x81\xaa\xe3\x81\x84\xe3\x80\x82"),v=new MlString("\xe3\x83\x8e\xe3\x83\x83\xe3\x82\xaf\xe3\x81\x99\xe3\x82\x8b"),u=new MlString("\xe6\x89\x89"),t=new MlString("\xe9\x96\x89\xe3\x81\x98\xe3\x82\x8b"),s=new MlString("\xe6\x89\x89"),r=new MlString("\xe9\x96\x8b\xe3\x81\x8f"),q=new MlString("\xe6\x89\x89"),p=new MlString("\xe9\x8d\xb5"),o=new MlString("\xe7\xbd\xae\xe3\x81\x8f"),n=new MlString("\xe9\x8d\xb5"),m=new MlString("\xe5\x8f\x96\xe3\x82\x8b"),l=new MlString("\xe9\x8d\xb5"),k=new MlString("\xe3\x81\x82\xe3\x81\x84\xe3\x81\x9f\xe3\x81\x9f\xef\xbc\x81"),j=new MlString("\xe5\x8f\x96\xe3\x82\x8b"),i=new MlString("\xe3\x82\xb5\xe3\x83\x9c\xe3\x83\x86\xe3\x83\xb3");function h(c,e){var d=c.getLen(),f=e.getLen(),g=caml_create_string(d+f|0);caml_blit_string(c,0,g,0,d);caml_blit_string(e,0,g,d,f);return g;}function bZ(bY){var bV=caml_ml_out_channels_list(0);for(;;){if(bV){var bW=bV[2];try {}catch(bX){}var bV=bW;continue;}return 0;}}caml_register_named_value(bT,bZ);function b5(b2,b0){var b1=b0;for(;;){if(b1){var b3=b1[2],b4=0===caml_compare(b1[1],b2)?1:0;if(b4)return b4;var b1=b3;continue;}return 0;}}function ca(b_,b6){var b7=b6;for(;;){if(b7){var b9=b7[2],b8=b7[1],b$=b8[2];if(0===caml_compare(b8[1],b_))return b$;var b7=b9;continue;}throw [0,b];}}function co(ch){return ci(function(cb,cd){var cc=cb,ce=cd;for(;;){if(ce){var cf=ce[2],cg=ce[1];if(ci(ch,cg)){var cj=[0,cg,cc],cc=cj,ce=cf;continue;}var ce=cf;continue;}var ck=cc,cl=0;for(;;){if(ck){var cm=ck[2],cn=[0,ck[1],cl],ck=cm,cl=cn;continue;}return cl;}}},0);}function ct(cr,cp,cq){if(0<=cp&&0<=cq&&cp<=(cr.getLen()-cq|0)){var cs=caml_create_string(cq);caml_blit_string(cr,cp,cs,0,cq);return cs;}throw [0,a,bS];}var cu=[0,0],cv=false,cw=Array,cA=null,cz=undefined,cy=true;cu[1]=[0,function(cx){return cx instanceof cw?0:[0,new MlWrappedString(cx.toString())];},cu[1]];function cD(cB,cC){cB.appendChild(cC);return 0;}var cL=caml_js_on_ie(0)|0;function cK(cG){return caml_js_wrap_callback(function(cE){if(cE===cz){var cF=event,cH=ci(cG,cF);cF.returnValue=cH;var cI=cH;}else{var cJ=ci(cG,cE);if(!(cJ|0))cE.preventDefault();var cI=cJ;}return cI;});}var cM=window;function cP(cN,cO){return cN?ci(cO,cN[1]):0;}function cS(cR,cQ){return cR.createElement(cQ.toString());}function c3(cT,cU,cW,cV){if(0===cT&&0===cU)return cS(cW,cV);if(cL){var cX=new cw;cX.push(bK.toString(),cV.toString());cP(cT,function(cY){cX.push(bL.toString(),caml_js_html_escape(cY),bM.toString());return 0;});cP(cU,function(cZ){cX.push(bN.toString(),caml_js_html_escape(cZ),bO.toString());return 0;});cX.push(bJ.toString());return cW.createElement(cX.join(bI.toString()));}var c0=cS(cW,cV);cP(cT,function(c1){return c0.type=c1;});cP(cU,function(c2){return c0.name=c2;});return c0;}function c7(c6,c5,c4){return c3(c6,c5,c4,bP);}var c8=cM.document,c9=c3(0,0,c8,bQ);c9.readOnly=cy;c9.cols=80;c9.rows=25;var c$=cS(c8,bR),c_=c7([0,bD.toString()],0,c8),da=c7([0,bC.toString()],0,c8);da.value=bB.toString();function dc(db){c9.value=c9.value.concat(db.toString());return c9.scrollTop=c9.scrollHeight;}function de(dd){return dc(h(dd,bE));}function dg(df){return dc(bF);}var di=[0,bA];function dk(dj){da.onclick=cK(function(dh){return cv;});throw [0,di];}var dl=[0,aK];function dn(dm){if(dm)throw [0,dl,h(aL,h(dm[1],aM))];return dm;}function ds(dq,dp,dr){if(dp){if(caml_equal(dq,dp[1]))return dp[2];throw [0,dl,dr];}throw [0,dl,dr];}var dt=[0,aG],du=[0,aF];function dx(dv){if(3<=dv.getLen()){var dw=ct(dv,3,dv.getLen()-3|0);return [0,ct(dv,0,3),dw];}throw [0,du];}function dG(dy,dA){var dz=dy,dB=dA;for(;;){var dC=ca(dz,aH),dD=dC[2],dE=dC[1];if(dE){try {var dF=dx(dB),dH=dG(ca(dF[1],dD),dF[2]);}catch(dI){if(dI[1]!==b&&dI[1]!==du)throw dI;return [0,dE[1],dB];}return dH;}var dJ=dx(dB),dK=ca(dJ[1],dD),dL=dJ[2],dz=dK,dB=dL;continue;}}function dO(dM){try {var dN=dG(1,dM),dP=[0,dN[1],dO(dN[2])];}catch(dQ){if(dQ[1]===du)return 0;if(dQ[1]===b)throw [0,dt,h(aI,h(dM,aJ))];throw dQ;}return dP;}function dT(dR,dS){return de(dR);}function d0(dW,dU){var dV=ca(dU[1],dU[3]);if(b5(dW,dV[1])){if(b5(dW,dU[2]))return de(h(R,h(dW,S)));dU[2]=[0,dW,dU[2]];var dY=dV[1];dV[1]=dZ(co,function(dX){return caml_string_notequal(dX,dW);},dY);return de(h(P,h(dW,Q)));}return de(h(T,h(dW,U)));}function d6(d3,d1){var d2=ca(d1[1],d1[3]);if(b5(d3,d1[2])){var d5=d1[2];d1[2]=dZ(co,function(d4){return caml_string_notequal(d4,d3);},d5);d2[1]=[0,d3,d2[1]];return de(h(V,h(d3,W)));}return de(h(X,h(d3,Y)));}function d$(d8,d7){if(b5(d8,ca(d7[1],d7[3])[1]))switch(d7[4]){case 1:return de(_);case 2:d7[4]=1;return de(Z);default:return b5(ab,d7[2])?(d7[4]=1,de(aa)):de($);}return de(h(ac,h(d8,ad)));}function ea(d_,d9){return b5(d_,ca(d9[1],d9[3])[1])?1===d9[4]?(d9[4]=2,de(ae)):de(af):de(h(ag,h(d_,ah)));}var eb=[0,[0,A,ci(d6,B)],0],ec=[0,[0,x,[0,[0,y,ci(d0,z)],eb]],0],ed=[0,[0,v,ci(dT,w)],0],ee=[0,[0,t,ci(ea,u)],ed],ef=[0,[0,q,[0,[0,r,ci(d$,s)],ee]],ec],eg=[0,[0,o,ci(d6,p)],0],eh=[0,[0,l,[0,[0,m,ci(d0,n)],eg]],ef],eP=[0,D,0,[0,[0,E,[0,F]],[0,[0,G,[0,0]],[0,[0,H,[0,I]],[0,[0,J,[0,K]],0]]]],0,100],eG=[0,[0,i,[0,[0,j,ci(dT,k)],0]],eh];function eN(ei){var ej=caml_string_equal(ei[1],aD),ek=ej?b5(aC,ei[2]):ej;if(ek){de(aB);dk(0);}de(h(au,h(ei[1],av)));dc(at);var el=ca(ei[1],ei[3])[1];if(el){dc(el[1]);var em=el[2];for(;;){if(em){var eo=em[2],en=em[1];dc(aw);dc(en);var em=eo;continue;}de(as);break;}}else de(ar);dc(aA);return da.onclick=cK(function(eO){var ep=c9.value;c9.value=ep.concat(c_.value);dg(0);da.onclick=cK(function(eq){return cv;});var er=new MlWrappedString(c_.value);try {var es=dO(er);if(!es)throw [0,dl,bo];var et=es[2],eu=es[1];if(caml_string_notequal(eu,bz)&&caml_string_notequal(eu,by))if(caml_string_notequal(eu,bx))if(caml_string_notequal(eu,bw))if(caml_string_notequal(eu,bv))if(caml_string_notequal(eu,bu))if(caml_string_notequal(eu,bt)){var ev=ds(bq,et,h(br,h(eu,bs)));if(!ev)throw [0,dl,h(bf,h(eu,bg))];var ew=ev[1];if(caml_string_notequal(ew,bn)&&caml_string_notequal(ew,bm)&&caml_string_notequal(ew,bl)&&caml_string_notequal(ew,bk)&&caml_string_notequal(ew,bj))throw [0,dl,h(bh,h(eu,bi))];dn(ev[2]);var ex=[0,ew,eu],ey=1;}else{if(!et)throw [0,dl,a_];var ez=et[1];if(caml_string_notequal(ez,be))throw [0,dl,bd];dn(ds(ba,et[2],h(bb,h(ez,bc))));var ex=a$,ey=1;}else var ey=0;else{dn(et);var ex=bp,ey=1;}else var ey=0;else{if(!et)throw [0,dl,aX];var eA=et[2],eB=et[1];if(caml_string_notequal(eB,a9)){if(caml_string_notequal(eB,a8)&&caml_string_notequal(eB,a7))throw [0,dl,a6];dn(ds(aZ,eA,h(a0,h(eB,a1))));var eC=aY;}else{dn(ds(a3,eA,h(a4,h(eB,a5))));var eC=a2;}var ex=eC,ey=1;}else var ey=0;if(!ey){if(!et)throw [0,dl,h(aN,h(eu,aO))];var eD=et[1];if(caml_string_notequal(eD,aW)&&caml_string_notequal(eD,aV))throw [0,dl,h(aT,h(eu,aU))];dn(ds(aQ,et[2],h(aR,h(eu,h(eD,aS)))));var ex=[0,aP,eu];}var eE=ex[2],eF=ex[1];if(caml_string_notequal(eF,aq))if(caml_string_notequal(eF,ap)){var eH=ca(eE,eG);try {ci(ca(eF,eH),ei);}catch(eI){if(eI[1]!==b)throw eI;de(h(eE,h(an,h(eF,ao))));}}else if(caml_string_equal(eE,am)){de(al);dk(0);}else de(h(ai,h(eE,h(aj,h(eF,ak)))));else{var eJ=caml_string_equal(eE,O)?0:caml_string_equal(eE,N)?0:1,eK=eJ?0:1===ei[4]?0:(de(M),1);if(!eK)try {ei[1]=ca(eE,ca(ei[1],C));}catch(eL){if(eL[1]!==b)throw eL;de(L);}}}catch(eM){if(eM[1]===dl||eM[1]===dt)de(eM[2]);else{if(eM[1]!==b)throw eM;de(aE);}}dg(0);eN(ei);return cv;});}cM.onload=cK(function(eR){var eQ=c8.getElementById(bG.toString());if(eQ==cA)throw [0,bU,bH];cD(eQ,c9);cD(eQ,c$);cD(eQ,c_);cD(eQ,da);de(az);de(ay);de(ax);dg(0);eN(eP);return cv;});bZ(0);return;}());
