var QRCode;
!(function () {
  function a(a) {
    (this.mode = c.MODE_8BIT_BYTE), (this.data = a), (this.parsedData = []);
    for (var b = [], d = 0, e = this.data.length; e > d; d++) {
      var f = this.data.charCodeAt(d);
      f > 65536
        ? ((b[0] = 240 | ((1835008 & f) >>> 18)),
          (b[1] = 128 | ((258048 & f) >>> 12)),
          (b[2] = 128 | ((4032 & f) >>> 6)),
          (b[3] = 128 | (63 & f)))
        : f > 2048
        ? ((b[0] = 224 | ((61440 & f) >>> 12)),
          (b[1] = 128 | ((4032 & f) >>> 6)),
          (b[2] = 128 | (63 & f)))
        : f > 128
        ? ((b[0] = 192 | ((1984 & f) >>> 6)), (b[1] = 128 | (63 & f)))
        : (b[0] = f),
        (this.parsedData = this.parsedData.concat(b));
    }
    this.parsedData.length != this.data.length &&
      (this.parsedData.unshift(191),
      this.parsedData.unshift(187),
      this.parsedData.unshift(239));
  }
  function b(a, b) {
    (this.typeNumber = a),
      (this.errorCorrectLevel = b),
      (this.modules = null),
      (this.moduleCount = 0),
      (this.dataCache = null),
      (this.dataList = []);
  }
  function i(a, b) {
    if (void 0 == a.length) throw new Error(a.length + "/" + b);
    for (var c = 0; c < a.length && 0 == a[c]; ) c++;
    this.num = new Array(a.length - c + b);
    for (var d = 0; d < a.length - c; d++) this.num[d] = a[d + c];
  }
  function j(a, b) {
    (this.totalCount = a), (this.dataCount = b);
  }
  function k() {
    (this.buffer = []), (this.length = 0);
  }
  function m() {
    return "undefined" != typeof CanvasRenderingContext2D;
  }
  function n() {
    var a = !1,
      b = navigator.userAgent;
    return (
      /android/i.test(b) &&
        ((a = !0),
        (aMat = b.toString().match(/android ([0-9]\.[0-9])/i)),
        aMat && aMat[1] && (a = parseFloat(aMat[1]))),
      a
    );
  }
  function r(a, b) {
    for (var c = 1, e = s(a), f = 0, g = l.length; g >= f; f++) {
      var h = 0;
      switch (b) {
        case d.L:
          h = l[f][0];
          break;
        case d.M:
          h = l[f][1];
          break;
        case d.Q:
          h = l[f][2];
          break;
        case d.H:
          h = l[f][3];
      }
      if (h >= e) break;
      c++;
    }
    if (c > l.length) throw new Error("Too long data");
    return c;
  }
  function s(a) {
    var b = encodeURI(a)
      .toString()
      .replace(/\%[0-9a-fA-F]{2}/g, "a");
    return b.length + (b.length != a ? 3 : 0);
  }
  (a.prototype = {
    getLength: function () {
      return this.parsedData.length;
    },
    write: function (a) {
      for (var b = 0, c = this.parsedData.length; c > b; b++)
        a.put(this.parsedData[b], 8);
    },
  }),
    (b.prototype = {
      addData: function (b) {
        var c = new a(b);
        this.dataList.push(c), (this.dataCache = null);
      },
      isDark: function (a, b) {
        if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b)
          throw new Error(a + "," + b);
        return this.modules[a][b];
      },
      getModuleCount: function () {
        return this.moduleCount;
      },
      make: function () {
        this.makeImpl(!1, this.getBestMaskPattern());
      },
      makeImpl: function (a, c) {
        (this.moduleCount = 4 * this.typeNumber + 17),
          (this.modules = new Array(this.moduleCount));
        for (var d = 0; d < this.moduleCount; d++) {
          this.modules[d] = new Array(this.moduleCount);
          for (var e = 0; e < this.moduleCount; e++) this.modules[d][e] = null;
        }
        this.setupPositionProbePattern(0, 0),
          this.setupPositionProbePattern(this.moduleCount - 7, 0),
          this.setupPositionProbePattern(0, this.moduleCount - 7),
          this.setupPositionAdjustPattern(),
          this.setupTimingPattern(),
          this.setupTypeInfo(a, c),
          this.typeNumber >= 7 && this.setupTypeNumber(a),
          null == this.dataCache &&
            (this.dataCache = b.createData(
              this.typeNumber,
              this.errorCorrectLevel,
              this.dataList
            )),
          this.mapData(this.dataCache, c);
      },
      setupPositionProbePattern: function (a, b) {
        for (var c = -1; 7 >= c; c++)
          if (!(-1 >= a + c || this.moduleCount <= a + c))
            for (var d = -1; 7 >= d; d++)
              -1 >= b + d ||
                this.moduleCount <= b + d ||
                (this.modules[a + c][b + d] =
                  (c >= 0 && 6 >= c && (0 == d || 6 == d)) ||
                  (d >= 0 && 6 >= d && (0 == c || 6 == c)) ||
                  (c >= 2 && 4 >= c && d >= 2 && 4 >= d)
                    ? !0
                    : !1);
      },
      getBestMaskPattern: function () {
        for (var a = 0, b = 0, c = 0; 8 > c; c++) {
          this.makeImpl(!0, c);
          var d = f.getLostPoint(this);
          (0 == c || a > d) && ((a = d), (b = c));
        }
        return b;
      },
      createMovieClip: function (a, b, c) {
        var d = a.createEmptyMovieClip(b, c),
          e = 1;
        this.make();
        for (var f = 0; f < this.modules.length; f++)
          for (var g = f * e, h = 0; h < this.modules[f].length; h++) {
            var i = h * e,
              j = this.modules[f][h];
            j &&
              (d.beginFill(0, 100),
              d.moveTo(i, g),
              d.lineTo(i + e, g),
              d.lineTo(i + e, g + e),
              d.lineTo(i, g + e),
              d.endFill());
          }
        return d;
      },
      setupTimingPattern: function () {
        for (var a = 8; a < this.moduleCount - 8; a++)
          null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
        for (var b = 8; b < this.moduleCount - 8; b++)
          null == this.modules[6][b] && (this.modules[6][b] = 0 == b % 2);
      },
      setupPositionAdjustPattern: function () {
        for (
          var a = f.getPatternPosition(this.typeNumber), b = 0;
          b < a.length;
          b++
        )
          for (var c = 0; c < a.length; c++) {
            var d = a[b],
              e = a[c];
            if (null == this.modules[d][e])
              for (var g = -2; 2 >= g; g++)
                for (var h = -2; 2 >= h; h++)
                  this.modules[d + g][e + h] =
                    -2 == g || 2 == g || -2 == h || 2 == h || (0 == g && 0 == h)
                      ? !0
                      : !1;
          }
      },
      setupTypeNumber: function (a) {
        for (var b = f.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
          var d = !a && 1 == (1 & (b >> c));
          this.modules[Math.floor(c / 3)][(c % 3) + this.moduleCount - 8 - 3] =
            d;
        }
        for (var c = 0; 18 > c; c++) {
          var d = !a && 1 == (1 & (b >> c));
          this.modules[(c % 3) + this.moduleCount - 8 - 3][Math.floor(c / 3)] =
            d;
        }
      },
      setupTypeInfo: function (a, b) {
        for (
          var c = (this.errorCorrectLevel << 3) | b,
            d = f.getBCHTypeInfo(c),
            e = 0;
          15 > e;
          e++
        ) {
          var g = !a && 1 == (1 & (d >> e));
          6 > e
            ? (this.modules[e][8] = g)
            : 8 > e
            ? (this.modules[e + 1][8] = g)
            : (this.modules[this.moduleCount - 15 + e][8] = g);
        }
        for (var e = 0; 15 > e; e++) {
          var g = !a && 1 == (1 & (d >> e));
          8 > e
            ? (this.modules[8][this.moduleCount - e - 1] = g)
            : 9 > e
            ? (this.modules[8][15 - e - 1 + 1] = g)
            : (this.modules[8][15 - e - 1] = g);
        }
        this.modules[this.moduleCount - 8][8] = !a;
      },
      mapData: function (a, b) {
        for (
          var c = -1,
            d = this.moduleCount - 1,
            e = 7,
            g = 0,
            h = this.moduleCount - 1;
          h > 0;
          h -= 2
        )
          for (6 == h && h--; ; ) {
            for (var i = 0; 2 > i; i++)
              if (null == this.modules[d][h - i]) {
                var j = !1;
                g < a.length && (j = 1 == (1 & (a[g] >>> e)));
                var k = f.getMask(b, d, h - i);
                k && (j = !j),
                  (this.modules[d][h - i] = j),
                  e--,
                  -1 == e && (g++, (e = 7));
              }
            if (((d += c), 0 > d || this.moduleCount <= d)) {
              (d -= c), (c = -c);
              break;
            }
          }
      },
    }),
    (b.PAD0 = 236),
    (b.PAD1 = 17),
    (b.createData = function (a, c, d) {
      for (var e = j.getRSBlocks(a, c), g = new k(), h = 0; h < d.length; h++) {
        var i = d[h];
        g.put(i.mode, 4),
          g.put(i.getLength(), f.getLengthInBits(i.mode, a)),
          i.write(g);
      }
      for (var l = 0, h = 0; h < e.length; h++) l += e[h].dataCount;
      if (g.getLengthInBits() > 8 * l)
        throw new Error(
          "code length overflow. (" + g.getLengthInBits() + ">" + 8 * l + ")"
        );
      for (
        g.getLengthInBits() + 4 <= 8 * l && g.put(0, 4);
        0 != g.getLengthInBits() % 8;

      )
        g.putBit(!1);
      for (;;) {
        if (g.getLengthInBits() >= 8 * l) break;
        if ((g.put(b.PAD0, 8), g.getLengthInBits() >= 8 * l)) break;
        g.put(b.PAD1, 8);
      }
      return b.createBytes(g, e);
    }),
    (b.createBytes = function (a, b) {
      for (
        var c = 0,
          d = 0,
          e = 0,
          g = new Array(b.length),
          h = new Array(b.length),
          j = 0;
        j < b.length;
        j++
      ) {
        var k = b[j].dataCount,
          l = b[j].totalCount - k;
        (d = Math.max(d, k)), (e = Math.max(e, l)), (g[j] = new Array(k));
        for (var m = 0; m < g[j].length; m++) g[j][m] = 255 & a.buffer[m + c];
        c += k;
        var n = f.getErrorCorrectPolynomial(l),
          o = new i(g[j], n.getLength() - 1),
          p = o.mod(n);
        h[j] = new Array(n.getLength() - 1);
        for (var m = 0; m < h[j].length; m++) {
          var q = m + p.getLength() - h[j].length;
          h[j][m] = q >= 0 ? p.get(q) : 0;
        }
      }
      for (var r = 0, m = 0; m < b.length; m++) r += b[m].totalCount;
      for (var s = new Array(r), t = 0, m = 0; d > m; m++)
        for (var j = 0; j < b.length; j++)
          m < g[j].length && (s[t++] = g[j][m]);
      for (var m = 0; e > m; m++)
        for (var j = 0; j < b.length; j++)
          m < h[j].length && (s[t++] = h[j][m]);
      return s;
    });
  for (
    var c = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8,
      },
      d = { L: 1, M: 0, Q: 3, H: 2 },
      e = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7,
      },
      f = {
        PATTERN_POSITION_TABLE: [
          [],
          [6, 18],
          [6, 22],
          [6, 26],
          [6, 30],
          [6, 34],
          [6, 22, 38],
          [6, 24, 42],
          [6, 26, 46],
          [6, 28, 50],
          [6, 30, 54],
          [6, 32, 58],
          [6, 34, 62],
          [6, 26, 46, 66],
          [6, 26, 48, 70],
          [6, 26, 50, 74],
          [6, 30, 54, 78],
          [6, 30, 56, 82],
          [6, 30, 58, 86],
          [6, 34, 62, 90],
          [6, 28, 50, 72, 94],
          [6, 26, 50, 74, 98],
          [6, 30, 54, 78, 102],
          [6, 28, 54, 80, 106],
          [6, 32, 58, 84, 110],
          [6, 30, 58, 86, 114],
          [6, 34, 62, 90, 118],
          [6, 26, 50, 74, 98, 122],
          [6, 30, 54, 78, 102, 126],
          [6, 26, 52, 78, 104, 130],
          [6, 30, 56, 82, 108, 134],
          [6, 34, 60, 86, 112, 138],
          [6, 30, 58, 86, 114, 142],
          [6, 34, 62, 90, 118, 146],
          [6, 30, 54, 78, 102, 126, 150],
          [6, 24, 50, 76, 102, 128, 154],
          [6, 28, 54, 80, 106, 132, 158],
          [6, 32, 58, 84, 110, 136, 162],
          [6, 26, 54, 82, 110, 138, 166],
          [6, 30, 58, 86, 114, 142, 170],
        ],
        G15: 1335,
        G18: 7973,
        G15_MASK: 21522,
        getBCHTypeInfo: function (a) {
          for (var b = a << 10; f.getBCHDigit(b) - f.getBCHDigit(f.G15) >= 0; )
            b ^= f.G15 << (f.getBCHDigit(b) - f.getBCHDigit(f.G15));
          return ((a << 10) | b) ^ f.G15_MASK;
        },
        getBCHTypeNumber: function (a) {
          for (var b = a << 12; f.getBCHDigit(b) - f.getBCHDigit(f.G18) >= 0; )
            b ^= f.G18 << (f.getBCHDigit(b) - f.getBCHDigit(f.G18));
          return (a << 12) | b;
        },
        getBCHDigit: function (a) {
          for (var b = 0; 0 != a; ) b++, (a >>>= 1);
          return b;
        },
        getPatternPosition: function (a) {
          return f.PATTERN_POSITION_TABLE[a - 1];
        },
        getMask: function (a, b, c) {
          switch (a) {
            case e.PATTERN000:
              return 0 == (b + c) % 2;
            case e.PATTERN001:
              return 0 == b % 2;
            case e.PATTERN010:
              return 0 == c % 3;
            case e.PATTERN011:
              return 0 == (b + c) % 3;
            case e.PATTERN100:
              return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2;
            case e.PATTERN101:
              return 0 == ((b * c) % 2) + ((b * c) % 3);
            case e.PATTERN110:
              return 0 == (((b * c) % 2) + ((b * c) % 3)) % 2;
            case e.PATTERN111:
              return 0 == (((b * c) % 3) + ((b + c) % 2)) % 2;
            default:
              throw new Error("bad maskPattern:" + a);
          }
        },
        getErrorCorrectPolynomial: function (a) {
          for (var b = new i([1], 0), c = 0; a > c; c++)
            b = b.multiply(new i([1, g.gexp(c)], 0));
          return b;
        },
        getLengthInBits: function (a, b) {
          if (b >= 1 && 10 > b)
            switch (a) {
              case c.MODE_NUMBER:
                return 10;
              case c.MODE_ALPHA_NUM:
                return 9;
              case c.MODE_8BIT_BYTE:
                return 8;
              case c.MODE_KANJI:
                return 8;
              default:
                throw new Error("mode:" + a);
            }
          else if (27 > b)
            switch (a) {
              case c.MODE_NUMBER:
                return 12;
              case c.MODE_ALPHA_NUM:
                return 11;
              case c.MODE_8BIT_BYTE:
                return 16;
              case c.MODE_KANJI:
                return 10;
              default:
                throw new Error("mode:" + a);
            }
          else {
            if (!(41 > b)) throw new Error("type:" + b);
            switch (a) {
              case c.MODE_NUMBER:
                return 14;
              case c.MODE_ALPHA_NUM:
                return 13;
              case c.MODE_8BIT_BYTE:
                return 16;
              case c.MODE_KANJI:
                return 12;
              default:
                throw new Error("mode:" + a);
            }
          }
        },
        getLostPoint: function (a) {
          for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++)
            for (var e = 0; b > e; e++) {
              for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++)
                if (!(0 > d + h || d + h >= b))
                  for (var i = -1; 1 >= i; i++)
                    0 > e + i ||
                      e + i >= b ||
                      ((0 != h || 0 != i) &&
                        g == a.isDark(d + h, e + i) &&
                        f++);
              f > 5 && (c += 3 + f - 5);
            }
          for (var d = 0; b - 1 > d; d++)
            for (var e = 0; b - 1 > e; e++) {
              var j = 0;
              a.isDark(d, e) && j++,
                a.isDark(d + 1, e) && j++,
                a.isDark(d, e + 1) && j++,
                a.isDark(d + 1, e + 1) && j++,
                (0 == j || 4 == j) && (c += 3);
            }
          for (var d = 0; b > d; d++)
            for (var e = 0; b - 6 > e; e++)
              a.isDark(d, e) &&
                !a.isDark(d, e + 1) &&
                a.isDark(d, e + 2) &&
                a.isDark(d, e + 3) &&
                a.isDark(d, e + 4) &&
                !a.isDark(d, e + 5) &&
                a.isDark(d, e + 6) &&
                (c += 40);
          for (var e = 0; b > e; e++)
            for (var d = 0; b - 6 > d; d++)
              a.isDark(d, e) &&
                !a.isDark(d + 1, e) &&
                a.isDark(d + 2, e) &&
                a.isDark(d + 3, e) &&
                a.isDark(d + 4, e) &&
                !a.isDark(d + 5, e) &&
                a.isDark(d + 6, e) &&
                (c += 40);
          for (var k = 0, e = 0; b > e; e++)
            for (var d = 0; b > d; d++) a.isDark(d, e) && k++;
          var l = Math.abs((100 * k) / b / b - 50) / 5;
          return (c += 10 * l);
        },
      },
      g = {
        glog: function (a) {
          if (1 > a) throw new Error("glog(" + a + ")");
          return g.LOG_TABLE[a];
        },
        gexp: function (a) {
          for (; 0 > a; ) a += 255;
          for (; a >= 256; ) a -= 255;
          return g.EXP_TABLE[a];
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256),
      },
      h = 0;
    8 > h;
    h++
  )
    g.EXP_TABLE[h] = 1 << h;
  for (var h = 8; 256 > h; h++)
    g.EXP_TABLE[h] =
      g.EXP_TABLE[h - 4] ^
      g.EXP_TABLE[h - 5] ^
      g.EXP_TABLE[h - 6] ^
      g.EXP_TABLE[h - 8];
  for (var h = 0; 255 > h; h++) g.LOG_TABLE[g.EXP_TABLE[h]] = h;
  (i.prototype = {
    get: function (a) {
      return this.num[a];
    },
    getLength: function () {
      return this.num.length;
    },
    multiply: function (a) {
      for (
        var b = new Array(this.getLength() + a.getLength() - 1), c = 0;
        c < this.getLength();
        c++
      )
        for (var d = 0; d < a.getLength(); d++)
          b[c + d] ^= g.gexp(g.glog(this.get(c)) + g.glog(a.get(d)));
      return new i(b, 0);
    },
    mod: function (a) {
      if (this.getLength() - a.getLength() < 0) return this;
      for (
        var b = g.glog(this.get(0)) - g.glog(a.get(0)),
          c = new Array(this.getLength()),
          d = 0;
        d < this.getLength();
        d++
      )
        c[d] = this.get(d);
      for (var d = 0; d < a.getLength(); d++)
        c[d] ^= g.gexp(g.glog(a.get(d)) + b);
      return new i(c, 0).mod(a);
    },
  }),
    (j.RS_BLOCK_TABLE = [
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12],
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16],
    ]),
    (j.getRSBlocks = function (a, b) {
      var c = j.getRsBlockTable(a, b);
      if (void 0 == c)
        throw new Error(
          "bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b
        );
      for (var d = c.length / 3, e = [], f = 0; d > f; f++)
        for (
          var g = c[3 * f + 0], h = c[3 * f + 1], i = c[3 * f + 2], k = 0;
          g > k;
          k++
        )
          e.push(new j(h, i));
      return e;
    }),
    (j.getRsBlockTable = function (a, b) {
      switch (b) {
        case d.L:
          return j.RS_BLOCK_TABLE[4 * (a - 1) + 0];
        case d.M:
          return j.RS_BLOCK_TABLE[4 * (a - 1) + 1];
        case d.Q:
          return j.RS_BLOCK_TABLE[4 * (a - 1) + 2];
        case d.H:
          return j.RS_BLOCK_TABLE[4 * (a - 1) + 3];
        default:
          return void 0;
      }
    }),
    (k.prototype = {
      get: function (a) {
        var b = Math.floor(a / 8);
        return 1 == (1 & (this.buffer[b] >>> (7 - (a % 8))));
      },
      put: function (a, b) {
        for (var c = 0; b > c; c++) this.putBit(1 == (1 & (a >>> (b - c - 1))));
      },
      getLengthInBits: function () {
        return this.length;
      },
      putBit: function (a) {
        var b = Math.floor(this.length / 8);
        this.buffer.length <= b && this.buffer.push(0),
          a && (this.buffer[b] |= 128 >>> this.length % 8),
          this.length++;
      },
    });
  var l = [
      [17, 14, 11, 7],
      [32, 26, 20, 14],
      [53, 42, 32, 24],
      [78, 62, 46, 34],
      [106, 84, 60, 44],
      [134, 106, 74, 58],
      [154, 122, 86, 64],
      [192, 152, 108, 84],
      [230, 180, 130, 98],
      [271, 213, 151, 119],
      [321, 251, 177, 137],
      [367, 287, 203, 155],
      [425, 331, 241, 177],
      [458, 362, 258, 194],
      [520, 412, 292, 220],
      [586, 450, 322, 250],
      [644, 504, 364, 280],
      [718, 560, 394, 310],
      [792, 624, 442, 338],
      [858, 666, 482, 382],
      [929, 711, 509, 403],
      [1003, 779, 565, 439],
      [1091, 857, 611, 461],
      [1171, 911, 661, 511],
      [1273, 997, 715, 535],
      [1367, 1059, 751, 593],
      [1465, 1125, 805, 625],
      [1528, 1190, 868, 658],
      [1628, 1264, 908, 698],
      [1732, 1370, 982, 742],
      [1840, 1452, 1030, 790],
      [1952, 1538, 1112, 842],
      [2068, 1628, 1168, 898],
      [2188, 1722, 1228, 958],
      [2303, 1809, 1283, 983],
      [2431, 1911, 1351, 1051],
      [2563, 1989, 1423, 1093],
      [2699, 2099, 1499, 1139],
      [2809, 2213, 1579, 1219],
      [2953, 2331, 1663, 1273],
    ],
    o = (function () {
      var a = function (a, b) {
        (this._el = a), (this._htOption = b);
      };
      return (
        (a.prototype.draw = function (a) {
          function g(a, b) {
            var c = document.createElementNS("http://www.w3.org/2000/svg", a);
            for (var d in b) b.hasOwnProperty(d) && c.setAttribute(d, b[d]);
            return c;
          }
          var b = this._htOption,
            c = this._el,
            d = a.getModuleCount();
          Math.floor(b.width / d), Math.floor(b.height / d), this.clear();
          var h = g("svg", {
            viewBox: "0 0 " + String(d) + " " + String(d),
            width: "100%",
            height: "100%",
            fill: b.colorLight,
          });
          h.setAttributeNS(
            "http://www.w3.org/2000/xmlns/",
            "xmlns:xlink",
            "http://www.w3.org/1999/xlink"
          ),
            c.appendChild(h),
            h.appendChild(
              g("rect", {
                fill: b.colorDark,
                width: "1",
                height: "1",
                id: "template",
              })
            );
          for (var i = 0; d > i; i++)
            for (var j = 0; d > j; j++)
              if (a.isDark(i, j)) {
                var k = g("use", { x: String(i), y: String(j) });
                k.setAttributeNS(
                  "http://www.w3.org/1999/xlink",
                  "href",
                  "#template"
                ),
                  h.appendChild(k);
              }
        }),
        (a.prototype.clear = function () {
          for (; this._el.hasChildNodes(); )
            this._el.removeChild(this._el.lastChild);
        }),
        a
      );
    })(),
    p = "svg" === document.documentElement.tagName.toLowerCase(),
    q = p
      ? o
      : m()
      ? (function () {
          function a() {
            (this._elImage.src = this._elCanvas.toDataURL("image/png")),
              (this._elImage.style.display = "block"),
              (this._elCanvas.style.display = "none");
          }
          function d(a, b) {
            var c = this;
            if (
              ((c._fFail = b), (c._fSuccess = a), null === c._bSupportDataURI)
            ) {
              var d = document.createElement("img"),
                e = function () {
                  (c._bSupportDataURI = !1), c._fFail && _fFail.call(c);
                },
                f = function () {
                  (c._bSupportDataURI = !0), c._fSuccess && c._fSuccess.call(c);
                };
              return (
                (d.onabort = e),
                (d.onerror = e),
                (d.onload = f),
                (d.src =
                  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="),
                void 0
              );
            }
            c._bSupportDataURI === !0 && c._fSuccess
              ? c._fSuccess.call(c)
              : c._bSupportDataURI === !1 && c._fFail && c._fFail.call(c);
          }
          if (this._android && this._android <= 2.1) {
            var b = 1 / window.devicePixelRatio,
              c = CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function (
              a,
              d,
              e,
              f,
              g,
              h,
              i,
              j
            ) {
              if ("nodeName" in a && /img/i.test(a.nodeName))
                for (var l = arguments.length - 1; l >= 1; l--)
                  arguments[l] = arguments[l] * b;
              else
                "undefined" == typeof j &&
                  ((arguments[1] *= b),
                  (arguments[2] *= b),
                  (arguments[3] *= b),
                  (arguments[4] *= b));
              c.apply(this, arguments);
            };
          }
          var e = function (a, b) {
            (this._bIsPainted = !1),
              (this._android = n()),
              (this._htOption = b),
              (this._elCanvas = document.createElement("canvas")),
              (this._elCanvas.width = b.width),
              (this._elCanvas.height = b.height),
              a.appendChild(this._elCanvas),
              (this._el = a),
              (this._oContext = this._elCanvas.getContext("2d")),
              (this._bIsPainted = !1),
              (this._elImage = document.createElement("img")),
              (this._elImage.style.display = "none"),
              this._el.appendChild(this._elImage),
              (this._bSupportDataURI = null);
          };
          return (
            (e.prototype.draw = function (a) {
              var b = this._elImage,
                c = this._oContext,
                d = this._htOption,
                e = a.getModuleCount(),
                f = d.width / e,
                g = d.height / e,
                h = Math.round(f),
                i = Math.round(g);
              (b.style.display = "none"), this.clear();
              for (var j = 0; e > j; j++)
                for (var k = 0; e > k; k++) {
                  var l = a.isDark(j, k),
                    m = k * f,
                    n = j * g;
                  (c.strokeStyle = l ? d.colorDark : d.colorLight),
                    (c.lineWidth = 1),
                    (c.fillStyle = l ? d.colorDark : d.colorLight),
                    c.fillRect(m, n, f, g),
                    c.strokeRect(
                      Math.floor(m) + 0.5,
                      Math.floor(n) + 0.5,
                      h,
                      i
                    ),
                    c.strokeRect(Math.ceil(m) - 0.5, Math.ceil(n) - 0.5, h, i);
                }
              this._bIsPainted = !0;
            }),
            (e.prototype.makeImage = function () {
              this._bIsPainted && d.call(this, a);
            }),
            (e.prototype.isPainted = function () {
              return this._bIsPainted;
            }),
            (e.prototype.clear = function () {
              this._oContext.clearRect(
                0,
                0,
                this._elCanvas.width,
                this._elCanvas.height
              ),
                (this._bIsPainted = !1);
            }),
            (e.prototype.round = function (a) {
              return a ? Math.floor(1e3 * a) / 1e3 : a;
            }),
            e
          );
        })()
      : (function () {
          var a = function (a, b) {
            (this._el = a), (this._htOption = b);
          };
          return (
            (a.prototype.draw = function (a) {
              for (
                var b = this._htOption,
                  c = this._el,
                  d = a.getModuleCount(),
                  e = Math.floor(b.width / d),
                  f = Math.floor(b.height / d),
                  g = ['<table style="border:0;border-collapse:collapse;">'],
                  h = 0;
                d > h;
                h++
              ) {
                g.push("<tr>");
                for (var i = 0; d > i; i++)
                  g.push(
                    '<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' +
                      e +
                      "px;height:" +
                      f +
                      "px;background-color:" +
                      (a.isDark(h, i) ? b.colorDark : b.colorLight) +
                      ';"></td>'
                  );
                g.push("</tr>");
              }
              g.push("</table>"), (c.innerHTML = g.join(""));
              var j = c.childNodes[0],
                k = (b.width - j.offsetWidth) / 2,
                l = (b.height - j.offsetHeight) / 2;
              k > 0 && l > 0 && (j.style.margin = l + "px " + k + "px");
            }),
            (a.prototype.clear = function () {
              this._el.innerHTML = "";
            }),
            a
          );
        })();
  (QRCode = function (a, b) {
    if (
      ((this._htOption = {
        width: 256,
        height: 256,
        typeNumber: 4,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: d.H,
      }),
      "string" == typeof b && (b = { text: b }),
      b)
    )
      for (var c in b) this._htOption[c] = b[c];
    "string" == typeof a && (a = document.getElementById(a)),
      (this._android = n()),
      (this._el = a),
      (this._oQRCode = null),
      (this._oDrawing = new q(this._el, this._htOption)),
      this._htOption.text && this.makeCode(this._htOption.text);
  }),
    (QRCode.prototype.makeCode = function (a) {
      (this._oQRCode = new b(
        r(a, this._htOption.correctLevel),
        this._htOption.correctLevel
      )),
        this._oQRCode.addData(a),
        this._oQRCode.make(),
        (this._el.title = a),
        this._oDrawing.draw(this._oQRCode),
        this.makeImage();
    }),
    (QRCode.prototype.makeImage = function () {
      "function" == typeof this._oDrawing.makeImage &&
        (!this._android || this._android >= 3) &&
        this._oDrawing.makeImage();
    }),
    (QRCode.prototype.clear = function () {
      this._oDrawing.clear();
    }),
    (QRCode.CorrectLevel = d);
})();

function jsbarcodeLink() {
  /*! JsBarcode v3.11.3 | (c) Johan Lindell | MIT license */
  !(function (t) {
    var e = {};
    function n(r) {
      if (e[r]) return e[r].exports;
      var o = (e[r] = { i: r, l: !1, exports: {} });
      return t[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    (n.m = t),
      (n.c = e),
      (n.d = function (t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
      }),
      (n.r = function (t) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      (n.t = function (t, e) {
        if ((1 & e && (t = n(t)), 8 & e)) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, "default", { enumerable: !0, value: t }),
          2 & e && "string" != typeof t)
        )
          for (var o in t)
            n.d(
              r,
              o,
              function (e) {
                return t[e];
              }.bind(null, o)
            );
        return r;
      }),
      (n.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return n.d(e, "a", e), e;
      }),
      (n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (n.p = ""),
      n((n.s = 15));
  })([
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      e.default = function t(e, n) {
        !(function (t, e) {
          if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function");
        })(this, t),
          (this.data = e),
          (this.text = n.text || e),
          (this.options = n);
      };
    },
    function (t, e, n) {
      "use strict";
      var r;
      function o(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var i = (e.SET_A = 0),
        a = (e.SET_B = 1),
        u = (e.SET_C = 2),
        f = ((e.SHIFT = 98), (e.START_A = 103)),
        c = (e.START_B = 104),
        s = (e.START_C = 105);
      (e.MODULO = 103),
        (e.STOP = 106),
        (e.FNC1 = 207),
        (e.SET_BY_CODE = (o((r = {}), f, i), o(r, c, a), o(r, s, u), r)),
        (e.SWAP = { 101: i, 100: a, 99: u }),
        (e.A_START_CHAR = String.fromCharCode(208)),
        (e.B_START_CHAR = String.fromCharCode(209)),
        (e.C_START_CHAR = String.fromCharCode(210)),
        (e.A_CHARS = "[\0-_È-Ï]"),
        (e.B_CHARS = "[ -È-Ï]"),
        (e.C_CHARS = "(Ï*[0-9]{2}Ï*)"),
        (e.BARS = [
          11011001100, 11001101100, 11001100110, 10010011e3, 10010001100,
          10001001100, 10011001e3, 10011000100, 10001100100, 11001001e3,
          11001000100, 11000100100, 10110011100, 10011011100, 10011001110,
          10111001100, 10011101100, 10011100110, 11001110010, 11001011100,
          11001001110, 11011100100, 11001110100, 11101101110, 11101001100,
          11100101100, 11100100110, 11101100100, 11100110100, 11100110010,
          11011011e3, 11011000110, 11000110110, 10100011e3, 10001011e3,
          10001000110, 10110001e3, 10001101e3, 10001100010, 11010001e3,
          11000101e3, 11000100010, 10110111e3, 10110001110, 10001101110,
          10111011e3, 10111000110, 10001110110, 11101110110, 11010001110,
          11000101110, 11011101e3, 11011100010, 11011101110, 11101011e3,
          11101000110, 11100010110, 11101101e3, 11101100010, 11100011010,
          11101111010, 11001000010, 11110001010, 1010011e4, 10100001100,
          1001011e4, 10010000110, 10000101100, 10000100110, 1011001e4,
          10110000100, 1001101e4, 10011000010, 10000110100, 10000110010,
          11000010010, 1100101e4, 11110111010, 11000010100, 10001111010,
          10100111100, 10010111100, 10010011110, 10111100100, 10011110100,
          10011110010, 11110100100, 11110010100, 11110010010, 11011011110,
          11011110110, 11110110110, 10101111e3, 10100011110, 10001011110,
          10111101e3, 10111100010, 11110101e3, 11110100010, 10111011110,
          10111101110, 11101011110, 11110101110, 11010000100, 1101001e4,
          11010011100, 1100011101011,
        ]);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      (e.SIDE_BIN = "101"),
        (e.MIDDLE_BIN = "01010"),
        (e.BINARIES = {
          L: [
            "0001101",
            "0011001",
            "0010011",
            "0111101",
            "0100011",
            "0110001",
            "0101111",
            "0111011",
            "0110111",
            "0001011",
          ],
          G: [
            "0100111",
            "0110011",
            "0011011",
            "0100001",
            "0011101",
            "0111001",
            "0000101",
            "0010001",
            "0001001",
            "0010111",
          ],
          R: [
            "1110010",
            "1100110",
            "1101100",
            "1000010",
            "1011100",
            "1001110",
            "1010000",
            "1000100",
            "1001000",
            "1110100",
          ],
          O: [
            "0001101",
            "0011001",
            "0010011",
            "0111101",
            "0100011",
            "0110001",
            "0101111",
            "0111011",
            "0110111",
            "0001011",
          ],
          E: [
            "0100111",
            "0110011",
            "0011011",
            "0100001",
            "0011101",
            "0111001",
            "0000101",
            "0010001",
            "0001001",
            "0010111",
          ],
        }),
        (e.EAN2_STRUCTURE = ["LL", "LG", "GL", "GG"]),
        (e.EAN5_STRUCTURE = [
          "GGLLL",
          "GLGLL",
          "GLLGL",
          "GLLLG",
          "LGGLL",
          "LLGGL",
          "LLLGG",
          "LGLGL",
          "LGLLG",
          "LLGLG",
        ]),
        (e.EAN13_STRUCTURE = [
          "LLLLLL",
          "LLGLGG",
          "LLGGLG",
          "LLGGGL",
          "LGLLGG",
          "LGGLLG",
          "LGGGLL",
          "LGLGLG",
          "LGLGGL",
          "LGGLGL",
        ]);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = n(2);
      e.default = function (t, e, n) {
        var o = t
          .split("")
          .map(function (t, n) {
            return r.BINARIES[e[n]];
          })
          .map(function (e, n) {
            return e ? e[t[n]] : "";
          });
        if (n) {
          var i = t.length - 1;
          o = o.map(function (t, e) {
            return e < i ? t + n : t;
          });
        }
        return o.join("");
      };
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(0);
      var a = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(e, [
            {
              key: "encode",
              value: function () {
                for (var t = "110", e = 0; e < this.data.length; e++) {
                  var n = parseInt(this.data[e]).toString(2);
                  n = u(n, 4 - n.length);
                  for (var r = 0; r < n.length; r++)
                    t += "0" == n[r] ? "100" : "110";
                }
                return { data: (t += "1001"), text: this.text };
              },
            },
            {
              key: "valid",
              value: function () {
                return -1 !== this.data.search(/^[0-9]+$/);
              },
            },
          ]),
          e
        );
      })(((r = i) && r.__esModule ? r : { default: r }).default);
      function u(t, e) {
        for (var n = 0; n < e; n++) t = "0" + t;
        return t;
      }
      e.default = a;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(0),
        a = (r = i) && r.__esModule ? r : { default: r },
        u = n(1);
      var f = (function (t) {
        function e(t, n) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, e);
          var r = (function (t, e) {
            if (!t)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            return !e || ("object" != typeof e && "function" != typeof e)
              ? t
              : e;
          })(
            this,
            (e.__proto__ || Object.getPrototypeOf(e)).call(
              this,
              t.substring(1),
              n
            )
          );
          return (
            (r.bytes = t.split("").map(function (t) {
              return t.charCodeAt(0);
            })),
            r
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(
            e,
            [
              {
                key: "valid",
                value: function () {
                  return /^[\x00-\x7F\xC8-\xD3]+$/.test(this.data);
                },
              },
              {
                key: "encode",
                value: function () {
                  var t = this.bytes,
                    n = t.shift() - 105,
                    r = u.SET_BY_CODE[n];
                  if (void 0 === r)
                    throw new RangeError(
                      "The encoding does not start with a start character."
                    );
                  !0 === this.shouldEncodeAsEan128() && t.unshift(u.FNC1);
                  var o = e.next(t, 1, r);
                  return {
                    text:
                      this.text === this.data
                        ? this.text.replace(/[^\x20-\x7E]/g, "")
                        : this.text,
                    data:
                      e.getBar(n) +
                      o.result +
                      e.getBar((o.checksum + n) % u.MODULO) +
                      e.getBar(u.STOP),
                  };
                },
              },
              {
                key: "shouldEncodeAsEan128",
                value: function () {
                  var t = this.options.ean128 || !1;
                  return (
                    "string" == typeof t && (t = "true" === t.toLowerCase()), t
                  );
                },
              },
            ],
            [
              {
                key: "getBar",
                value: function (t) {
                  return u.BARS[t] ? u.BARS[t].toString() : "";
                },
              },
              {
                key: "correctIndex",
                value: function (t, e) {
                  if (e === u.SET_A) {
                    var n = t.shift();
                    return n < 32 ? n + 64 : n - 32;
                  }
                  return e === u.SET_B
                    ? t.shift() - 32
                    : 10 * (t.shift() - 48) + t.shift() - 48;
                },
              },
              {
                key: "next",
                value: function (t, n, r) {
                  if (!t.length) return { result: "", checksum: 0 };
                  var o = void 0,
                    i = void 0;
                  if (t[0] >= 200) {
                    i = t.shift() - 105;
                    var a = u.SWAP[i];
                    void 0 !== a
                      ? (o = e.next(t, n + 1, a))
                      : ((r !== u.SET_A && r !== u.SET_B) ||
                          i !== u.SHIFT ||
                          (t[0] =
                            r === u.SET_A
                              ? t[0] > 95
                                ? t[0] - 96
                                : t[0]
                              : t[0] < 32
                              ? t[0] + 96
                              : t[0]),
                        (o = e.next(t, n + 1, r)));
                  } else (i = e.correctIndex(t, r)), (o = e.next(t, n + 1, r));
                  var f = i * n;
                  return {
                    result: e.getBar(i) + o.result,
                    checksum: f + o.checksum,
                  };
                },
              },
            ]
          ),
          e
        );
      })(a.default);
      e.default = f;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.mod10 = function (t) {
          for (var e = 0, n = 0; n < t.length; n++) {
            var r = parseInt(t[n]);
            (n + t.length) % 2 == 0
              ? (e += r)
              : (e += ((2 * r) % 10) + Math.floor((2 * r) / 10));
          }
          return (10 - (e % 10)) % 10;
        }),
        (e.mod11 = function (t) {
          for (var e = 0, n = [2, 3, 4, 5, 6, 7], r = 0; r < t.length; r++) {
            var o = parseInt(t[t.length - 1 - r]);
            e += n[r % n.length] * o;
          }
          return (11 - (e % 11)) % 11;
        });
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r =
        Object.assign ||
        function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = arguments[e];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
          }
          return t;
        };
      e.default = function (t, e) {
        return r({}, t, e);
      };
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        o = n(2),
        i = a(n(3));
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }
      var u = (function (t) {
        function e(t, n) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, e);
          var r = (function (t, e) {
            if (!t)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            return !e || ("object" != typeof e && "function" != typeof e)
              ? t
              : e;
          })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
          return (
            (r.fontSize =
              !n.flat && n.fontSize > 10 * n.width ? 10 * n.width : n.fontSize),
            (r.guardHeight = n.height + r.fontSize / 2 + n.textMargin),
            r
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          r(e, [
            {
              key: "encode",
              value: function () {
                return this.options.flat
                  ? this.encodeFlat()
                  : this.encodeGuarded();
              },
            },
            {
              key: "leftText",
              value: function (t, e) {
                return this.text.substr(t, e);
              },
            },
            {
              key: "leftEncode",
              value: function (t, e) {
                return (0, i.default)(t, e);
              },
            },
            {
              key: "rightText",
              value: function (t, e) {
                return this.text.substr(t, e);
              },
            },
            {
              key: "rightEncode",
              value: function (t, e) {
                return (0, i.default)(t, e);
              },
            },
            {
              key: "encodeGuarded",
              value: function () {
                var t = { fontSize: this.fontSize },
                  e = { height: this.guardHeight };
                return [
                  { data: o.SIDE_BIN, options: e },
                  {
                    data: this.leftEncode(),
                    text: this.leftText(),
                    options: t,
                  },
                  { data: o.MIDDLE_BIN, options: e },
                  {
                    data: this.rightEncode(),
                    text: this.rightText(),
                    options: t,
                  },
                  { data: o.SIDE_BIN, options: e },
                ];
              },
            },
            {
              key: "encodeFlat",
              value: function () {
                return {
                  data: [
                    o.SIDE_BIN,
                    this.leftEncode(),
                    o.MIDDLE_BIN,
                    this.rightEncode(),
                    o.SIDE_BIN,
                  ].join(""),
                  text: this.text,
                };
              },
            },
          ]),
          e
        );
      })(a(n(0)).default);
      e.default = u;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      e.checksum = u;
      var o = i(n(3));
      function i(t) {
        return t && t.__esModule ? t : { default: t };
      }
      var a = (function (t) {
        function e(t, n) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
            -1 !== t.search(/^[0-9]{11}$/) && (t += u(t));
          var r = (function (t, e) {
            if (!t)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            return !e || ("object" != typeof e && "function" != typeof e)
              ? t
              : e;
          })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
          return (
            (r.displayValue = n.displayValue),
            n.fontSize > 10 * n.width
              ? (r.fontSize = 10 * n.width)
              : (r.fontSize = n.fontSize),
            (r.guardHeight = n.height + r.fontSize / 2 + n.textMargin),
            r
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          r(e, [
            {
              key: "valid",
              value: function () {
                return (
                  -1 !== this.data.search(/^[0-9]{12}$/) &&
                  this.data[11] == u(this.data)
                );
              },
            },
            {
              key: "encode",
              value: function () {
                return this.options.flat
                  ? this.flatEncoding()
                  : this.guardedEncoding();
              },
            },
            {
              key: "flatEncoding",
              value: function () {
                var t = "";
                return (
                  (t += "101"),
                  (t += (0, o.default)(this.data.substr(0, 6), "LLLLLL")),
                  (t += "01010"),
                  (t += (0, o.default)(this.data.substr(6, 6), "RRRRRR")),
                  { data: (t += "101"), text: this.text }
                );
              },
            },
            {
              key: "guardedEncoding",
              value: function () {
                var t = [];
                return (
                  this.displayValue &&
                    t.push({
                      data: "00000000",
                      text: this.text.substr(0, 1),
                      options: { textAlign: "left", fontSize: this.fontSize },
                    }),
                  t.push({
                    data: "101" + (0, o.default)(this.data[0], "L"),
                    options: { height: this.guardHeight },
                  }),
                  t.push({
                    data: (0, o.default)(this.data.substr(1, 5), "LLLLL"),
                    text: this.text.substr(1, 5),
                    options: { fontSize: this.fontSize },
                  }),
                  t.push({
                    data: "01010",
                    options: { height: this.guardHeight },
                  }),
                  t.push({
                    data: (0, o.default)(this.data.substr(6, 5), "RRRRR"),
                    text: this.text.substr(6, 5),
                    options: { fontSize: this.fontSize },
                  }),
                  t.push({
                    data: (0, o.default)(this.data[11], "R") + "101",
                    options: { height: this.guardHeight },
                  }),
                  this.displayValue &&
                    t.push({
                      data: "00000000",
                      text: this.text.substr(11, 1),
                      options: { textAlign: "right", fontSize: this.fontSize },
                    }),
                  t
                );
              },
            },
          ]),
          e
        );
      })(i(n(0)).default);
      function u(t) {
        var e,
          n = 0;
        for (e = 1; e < 11; e += 2) n += parseInt(t[e]);
        for (e = 0; e < 11; e += 2) n += 3 * parseInt(t[e]);
        return (10 - (n % 10)) % 10;
      }
      e.default = a;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(31),
        a = n(0);
      function u(t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      }
      function f(t, e) {
        if (!t)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        return !e || ("object" != typeof e && "function" != typeof e) ? t : e;
      }
      var c = (function (t) {
        function e() {
          return (
            u(this, e),
            f(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments)
            )
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(e, [
            {
              key: "valid",
              value: function () {
                return -1 !== this.data.search(/^([0-9]{2})+$/);
              },
            },
            {
              key: "encode",
              value: function () {
                var t = this,
                  e = this.data
                    .match(/.{2}/g)
                    .map(function (e) {
                      return t.encodePair(e);
                    })
                    .join("");
                return { data: i.START_BIN + e + i.END_BIN, text: this.text };
              },
            },
            {
              key: "encodePair",
              value: function (t) {
                var e = i.BINARIES[t[1]];
                return i.BINARIES[t[0]]
                  .split("")
                  .map(function (t, n) {
                    return (
                      ("1" === t ? "111" : "1") + ("1" === e[n] ? "000" : "0")
                    );
                  })
                  .join("");
              },
            },
          ]),
          e
        );
      })(((r = a) && r.__esModule ? r : { default: r }).default);
      e.default = c;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.default = function (t) {
          var e = [
            "width",
            "height",
            "textMargin",
            "fontSize",
            "margin",
            "marginTop",
            "marginBottom",
            "marginLeft",
            "marginRight",
          ];
          for (var n in e)
            e.hasOwnProperty(n) &&
              ((n = e[n]),
              "string" == typeof t[n] && (t[n] = parseInt(t[n], 10)));
          "string" == typeof t.displayValue &&
            (t.displayValue = "false" != t.displayValue);
          return t;
        });
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = {
        width: 2,
        height: 100,
        format: "auto",
        displayValue: !0,
        fontOptions: "",
        font: "monospace",
        text: void 0,
        textAlign: "center",
        textPosition: "bottom",
        textMargin: 2,
        fontSize: 20,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 10,
        marginTop: void 0,
        marginBottom: void 0,
        marginLeft: void 0,
        marginRight: void 0,
        valid: function () {},
      };
      e.default = r;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.getTotalWidthOfEncodings =
          e.calculateEncodingAttributes =
          e.getBarcodePadding =
          e.getEncodingHeight =
          e.getMaximumHeightOfEncodings =
            void 0);
      var r,
        o = n(7),
        i = (r = o) && r.__esModule ? r : { default: r };
      function a(t, e) {
        return (
          e.height +
          (e.displayValue && t.text.length > 0
            ? e.fontSize + e.textMargin
            : 0) +
          e.marginTop +
          e.marginBottom
        );
      }
      function u(t, e, n) {
        if (n.displayValue && e < t) {
          if ("center" == n.textAlign) return Math.floor((t - e) / 2);
          if ("left" == n.textAlign) return 0;
          if ("right" == n.textAlign) return Math.floor(t - e);
        }
        return 0;
      }
      function f(t, e, n) {
        var r;
        if (n) r = n;
        else {
          if ("undefined" == typeof document) return 0;
          r = document.createElement("canvas").getContext("2d");
        }
        return (
          (r.font = e.fontOptions + " " + e.fontSize + "px " + e.font),
          r.measureText(t).width
        );
      }
      (e.getMaximumHeightOfEncodings = function (t) {
        for (var e = 0, n = 0; n < t.length; n++)
          t[n].height > e && (e = t[n].height);
        return e;
      }),
        (e.getEncodingHeight = a),
        (e.getBarcodePadding = u),
        (e.calculateEncodingAttributes = function (t, e, n) {
          for (var r = 0; r < t.length; r++) {
            var o,
              c = t[r],
              s = (0, i.default)(e, c.options);
            o = s.displayValue ? f(c.text, s, n) : 0;
            var l = c.data.length * s.width;
            (c.width = Math.ceil(Math.max(o, l))),
              (c.height = a(c, s)),
              (c.barcodePadding = u(o, l, s));
          }
        }),
        (e.getTotalWidthOfEncodings = function (t) {
          for (var e = 0, n = 0; n < t.length; n++) e += t[n].width;
          return e;
        });
    },
    function (t, e, n) {
      "use strict";
      function r(t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      }
      function o(t, e) {
        if (!t)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        return !e || ("object" != typeof e && "function" != typeof e) ? t : e;
      }
      function i(t, e) {
        if ("function" != typeof e && null !== e)
          throw new TypeError(
            "Super expression must either be null or a function, not " +
              typeof e
          );
        (t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
          e &&
            (Object.setPrototypeOf
              ? Object.setPrototypeOf(t, e)
              : (t.__proto__ = e));
      }
      Object.defineProperty(e, "__esModule", { value: !0 });
      var a = (function (t) {
          function e(t, n) {
            r(this, e);
            var i = o(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(this)
            );
            return (
              (i.name = "InvalidInputException"),
              (i.symbology = t),
              (i.input = n),
              (i.message =
                '"' + i.input + '" is not a valid input for ' + i.symbology),
              i
            );
          }
          return i(e, Error), e;
        })(),
        u = (function (t) {
          function e() {
            r(this, e);
            var t = o(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(this)
            );
            return (
              (t.name = "InvalidElementException"),
              (t.message = "Not supported type to render on"),
              t
            );
          }
          return i(e, Error), e;
        })(),
        f = (function (t) {
          function e() {
            r(this, e);
            var t = o(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(this)
            );
            return (
              (t.name = "NoElementException"),
              (t.message = "No element to render on."),
              t
            );
          }
          return i(e, Error), e;
        })();
      (e.InvalidInputException = a),
        (e.InvalidElementException = u),
        (e.NoElementException = f);
    },
    function (t, e, n) {
      "use strict";
      var r = p(n(16)),
        o = p(n(7)),
        i = p(n(41)),
        a = p(n(42)),
        u = p(n(43)),
        f = p(n(11)),
        c = p(n(49)),
        s = n(14),
        l = p(n(12));
      function p(t) {
        return t && t.__esModule ? t : { default: t };
      }
      var d = function () {},
        h = function (t, e, n) {
          var r = new d();
          if (void 0 === t)
            throw Error("No element to render on was provided.");
          return (
            (r._renderProperties = (0, u.default)(t)),
            (r._encodings = []),
            (r._options = l.default),
            (r._errorHandler = new c.default(r)),
            void 0 !== e &&
              ((n = n || {}).format || (n.format = _()),
              r.options(n)[n.format](e, n).render()),
            r
          );
        };
      for (var y in ((h.getModule = function (t) {
        return r.default[t];
      }),
      r.default))
        r.default.hasOwnProperty(y) && b(r.default, y);
      function b(t, e) {
        d.prototype[e] =
          d.prototype[e.toUpperCase()] =
          d.prototype[e.toLowerCase()] =
            function (n, r) {
              var i = this;
              return i._errorHandler.wrapBarcodeCall(function () {
                r.text = void 0 === r.text ? void 0 : "" + r.text;
                var a = (0, o.default)(i._options, r);
                a = (0, f.default)(a);
                var u = t[e],
                  c = v(n, u, a);
                return i._encodings.push(c), i;
              });
            };
      }
      function v(t, e, n) {
        var r = new e((t = "" + t), n);
        if (!r.valid())
          throw new s.InvalidInputException(r.constructor.name, t);
        var a = r.encode();
        a = (0, i.default)(a);
        for (var u = 0; u < a.length; u++)
          a[u].options = (0, o.default)(n, a[u].options);
        return a;
      }
      function _() {
        return r.default.CODE128 ? "CODE128" : Object.keys(r.default)[0];
      }
      function g(t, e, n) {
        e = (0, i.default)(e);
        for (var r = 0; r < e.length; r++)
          (e[r].options = (0, o.default)(n, e[r].options)),
            (0, a.default)(e[r].options);
        (0, a.default)(n),
          new (0, t.renderer)(t.element, e, n).render(),
          t.afterRender && t.afterRender();
      }
      (d.prototype.options = function (t) {
        return (this._options = (0, o.default)(this._options, t)), this;
      }),
        (d.prototype.blank = function (t) {
          var e = new Array(t + 1).join("0");
          return this._encodings.push({ data: e }), this;
        }),
        (d.prototype.init = function () {
          var t;
          if (this._renderProperties)
            for (var e in (Array.isArray(this._renderProperties) ||
              (this._renderProperties = [this._renderProperties]),
            this._renderProperties)) {
              t = this._renderProperties[e];
              var n = (0, o.default)(this._options, t.options);
              "auto" == n.format && (n.format = _()),
                this._errorHandler.wrapBarcodeCall(function () {
                  var e = v(n.value, r.default[n.format.toUpperCase()], n);
                  g(t, e, n);
                });
            }
        }),
        (d.prototype.render = function () {
          if (!this._renderProperties) throw new s.NoElementException();
          if (Array.isArray(this._renderProperties))
            for (var t = 0; t < this._renderProperties.length; t++)
              g(this._renderProperties[t], this._encodings, this._options);
          else g(this._renderProperties, this._encodings, this._options);
          return this;
        }),
        (d.prototype._defaults = l.default),
        "undefined" != typeof window && (window.JsBarcode = h),
        "undefined" != typeof jQuery &&
          (jQuery.fn.JsBarcode = function (t, e) {
            var n = [];
            return (
              jQuery(this).each(function () {
                n.push(this);
              }),
              h(n, t, e)
            );
          }),
        (t.exports = h);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = n(17),
        o = n(18),
        i = n(24),
        a = n(30),
        u = n(33),
        f = n(38),
        c = n(39),
        s = n(40);
      e.default = {
        CODE39: r.CODE39,
        CODE128: o.CODE128,
        CODE128A: o.CODE128A,
        CODE128B: o.CODE128B,
        CODE128C: o.CODE128C,
        EAN13: i.EAN13,
        EAN8: i.EAN8,
        EAN5: i.EAN5,
        EAN2: i.EAN2,
        UPC: i.UPC,
        UPCE: i.UPCE,
        ITF14: a.ITF14,
        ITF: a.ITF,
        MSI: u.MSI,
        MSI10: u.MSI10,
        MSI11: u.MSI11,
        MSI1010: u.MSI1010,
        MSI1110: u.MSI1110,
        pharmacode: f.pharmacode,
        codabar: c.codabar,
        GenericBarcode: s.GenericBarcode,
      };
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.CODE39 = void 0);
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(0);
      var a = (function (t) {
          function e(t, n) {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              (t = t.toUpperCase()),
              n.mod43 &&
                (t += (function (t) {
                  return u[t];
                })(
                  (function (t) {
                    for (var e = 0, n = 0; n < t.length; n++) e += s(t[n]);
                    return (e %= 43);
                  })(t)
                )),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, t),
            o(e, [
              {
                key: "encode",
                value: function () {
                  for (var t = c("*"), e = 0; e < this.data.length; e++)
                    t += c(this.data[e]) + "0";
                  return { data: (t += c("*")), text: this.text };
                },
              },
              {
                key: "valid",
                value: function () {
                  return -1 !== this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/);
                },
              },
            ]),
            e
          );
        })(((r = i) && r.__esModule ? r : { default: r }).default),
        u = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
          "-",
          ".",
          " ",
          "$",
          "/",
          "+",
          "%",
          "*",
        ],
        f = [
          20957, 29783, 23639, 30485, 20951, 29813, 23669, 20855, 29789, 23645,
          29975, 23831, 30533, 22295, 30149, 24005, 21623, 29981, 23837, 22301,
          30023, 23879, 30545, 22343, 30161, 24017, 21959, 30065, 23921, 22385,
          29015, 18263, 29141, 17879, 29045, 18293, 17783, 29021, 18269, 17477,
          17489, 17681, 20753, 35770,
        ];
      function c(t) {
        return (function (t) {
          return f[t].toString(2);
        })(s(t));
      }
      function s(t) {
        return u.indexOf(t);
      }
      e.CODE39 = a;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.CODE128C = e.CODE128B = e.CODE128A = e.CODE128 = void 0);
      var r = u(n(19)),
        o = u(n(21)),
        i = u(n(22)),
        a = u(n(23));
      function u(t) {
        return t && t.__esModule ? t : { default: t };
      }
      (e.CODE128 = r.default),
        (e.CODE128A = o.default),
        (e.CODE128B = i.default),
        (e.CODE128C = a.default);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = i(n(5)),
        o = i(n(20));
      function i(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function a(t, e) {
        if (!t)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        return !e || ("object" != typeof e && "function" != typeof e) ? t : e;
      }
      var u = (function (t) {
        function e(t, n) {
          if (
            ((function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            /^[\x00-\x7F\xC8-\xD3]+$/.test(t))
          )
            var r = a(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(
                this,
                (0, o.default)(t),
                n
              )
            );
          else
            r = a(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n)
            );
          return a(r);
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          e
        );
      })(r.default);
      e.default = u;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = n(1),
        o = function (t) {
          return t.match(new RegExp("^" + r.A_CHARS + "*"))[0].length;
        },
        i = function (t) {
          return t.match(new RegExp("^" + r.B_CHARS + "*"))[0].length;
        },
        a = function (t) {
          return t.match(new RegExp("^" + r.C_CHARS + "*"))[0];
        };
      function u(t, e) {
        var n = e ? r.A_CHARS : r.B_CHARS,
          o = t.match(new RegExp("^(" + n + "+?)(([0-9]{2}){2,})([^0-9]|$)"));
        if (o)
          return o[1] + String.fromCharCode(204) + f(t.substring(o[1].length));
        var i = t.match(new RegExp("^" + n + "+"))[0];
        return i.length === t.length
          ? t
          : i +
              String.fromCharCode(e ? 205 : 206) +
              u(t.substring(i.length), !e);
      }
      function f(t) {
        var e = a(t),
          n = e.length;
        if (n === t.length) return t;
        t = t.substring(n);
        var r = o(t) >= i(t);
        return e + String.fromCharCode(r ? 206 : 205) + u(t, r);
      }
      e.default = function (t) {
        var e = void 0;
        if (a(t).length >= 2) e = r.C_START_CHAR + f(t);
        else {
          var n = o(t) > i(t);
          e = (n ? r.A_START_CHAR : r.B_START_CHAR) + u(t, n);
        }
        return e.replace(/[\xCD\xCE]([^])[\xCD\xCE]/, function (t, e) {
          return String.fromCharCode(203) + e;
        });
      };
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(5),
        a = (r = i) && r.__esModule ? r : { default: r },
        u = n(1);
      var f = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(
                this,
                u.A_START_CHAR + t,
                n
              )
            )
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(e, [
            {
              key: "valid",
              value: function () {
                return new RegExp("^" + u.A_CHARS + "+$").test(this.data);
              },
            },
          ]),
          e
        );
      })(a.default);
      e.default = f;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(5),
        a = (r = i) && r.__esModule ? r : { default: r },
        u = n(1);
      var f = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(
                this,
                u.B_START_CHAR + t,
                n
              )
            )
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(e, [
            {
              key: "valid",
              value: function () {
                return new RegExp("^" + u.B_CHARS + "+$").test(this.data);
              },
            },
          ]),
          e
        );
      })(a.default);
      e.default = f;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(5),
        a = (r = i) && r.__esModule ? r : { default: r },
        u = n(1);
      var f = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(
                this,
                u.C_START_CHAR + t,
                n
              )
            )
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(e, [
            {
              key: "valid",
              value: function () {
                return new RegExp("^" + u.C_CHARS + "+$").test(this.data);
              },
            },
          ]),
          e
        );
      })(a.default);
      e.default = f;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.UPCE = e.UPC = e.EAN2 = e.EAN5 = e.EAN8 = e.EAN13 = void 0);
      var r = c(n(25)),
        o = c(n(26)),
        i = c(n(27)),
        a = c(n(28)),
        u = c(n(9)),
        f = c(n(29));
      function c(t) {
        return t && t.__esModule ? t : { default: t };
      }
      (e.EAN13 = r.default),
        (e.EAN8 = o.default),
        (e.EAN5 = i.default),
        (e.EAN2 = a.default),
        (e.UPC = u.default),
        (e.UPCE = f.default);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ("value" in o) return o.value;
          var a = o.get;
          return void 0 !== a ? a.call(r) : void 0;
        },
        a = n(2),
        u = n(8),
        f = (r = u) && r.__esModule ? r : { default: r };
      var c = function (t) {
          return (
            (10 -
              (t
                .substr(0, 12)
                .split("")
                .map(function (t) {
                  return +t;
                })
                .reduce(function (t, e, n) {
                  return n % 2 ? t + 3 * e : t + e;
                }, 0) %
                10)) %
            10
          );
        },
        s = (function (t) {
          function e(t, n) {
            !(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
              -1 !== t.search(/^[0-9]{12}$/) && (t += c(t));
            var r = (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n)
            );
            return (r.lastChar = n.lastChar), r;
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, t),
            o(e, [
              {
                key: "valid",
                value: function () {
                  return (
                    -1 !== this.data.search(/^[0-9]{13}$/) &&
                    +this.data[12] === c(this.data)
                  );
                },
              },
              {
                key: "leftText",
                value: function () {
                  return i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "leftText",
                    this
                  ).call(this, 1, 6);
                },
              },
              {
                key: "leftEncode",
                value: function () {
                  var t = this.data.substr(1, 6),
                    n = a.EAN13_STRUCTURE[this.data[0]];
                  return i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "leftEncode",
                    this
                  ).call(this, t, n);
                },
              },
              {
                key: "rightText",
                value: function () {
                  return i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "rightText",
                    this
                  ).call(this, 7, 6);
                },
              },
              {
                key: "rightEncode",
                value: function () {
                  var t = this.data.substr(7, 6);
                  return i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "rightEncode",
                    this
                  ).call(this, t, "RRRRRR");
                },
              },
              {
                key: "encodeGuarded",
                value: function () {
                  var t = i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "encodeGuarded",
                    this
                  ).call(this);
                  return (
                    this.options.displayValue &&
                      (t.unshift({
                        data: "000000000000",
                        text: this.text.substr(0, 1),
                        options: { textAlign: "left", fontSize: this.fontSize },
                      }),
                      this.options.lastChar &&
                        (t.push({ data: "00" }),
                        t.push({
                          data: "00000",
                          text: this.options.lastChar,
                          options: { fontSize: this.fontSize },
                        }))),
                    t
                  );
                },
              },
            ]),
            e
          );
        })(f.default);
      e.default = s;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = function t(e, n, r) {
          null === e && (e = Function.prototype);
          var o = Object.getOwnPropertyDescriptor(e, n);
          if (void 0 === o) {
            var i = Object.getPrototypeOf(e);
            return null === i ? void 0 : t(i, n, r);
          }
          if ("value" in o) return o.value;
          var a = o.get;
          return void 0 !== a ? a.call(r) : void 0;
        },
        a = n(8),
        u = (r = a) && r.__esModule ? r : { default: r };
      var f = function (t) {
          return (
            (10 -
              (t
                .substr(0, 7)
                .split("")
                .map(function (t) {
                  return +t;
                })
                .reduce(function (t, e, n) {
                  return n % 2 ? t + e : t + 3 * e;
                }, 0) %
                10)) %
            10
          );
        },
        c = (function (t) {
          function e(t, n) {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              -1 !== t.search(/^[0-9]{7}$/) && (t += f(t)),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, t),
            o(e, [
              {
                key: "valid",
                value: function () {
                  return (
                    -1 !== this.data.search(/^[0-9]{8}$/) &&
                    +this.data[7] === f(this.data)
                  );
                },
              },
              {
                key: "leftText",
                value: function () {
                  return i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "leftText",
                    this
                  ).call(this, 0, 4);
                },
              },
              {
                key: "leftEncode",
                value: function () {
                  var t = this.data.substr(0, 4);
                  return i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "leftEncode",
                    this
                  ).call(this, t, "LLLL");
                },
              },
              {
                key: "rightText",
                value: function () {
                  return i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "rightText",
                    this
                  ).call(this, 4, 4);
                },
              },
              {
                key: "rightEncode",
                value: function () {
                  var t = this.data.substr(4, 4);
                  return i(
                    e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                    "rightEncode",
                    this
                  ).call(this, t, "RRRR");
                },
              },
            ]),
            e
          );
        })(u.default);
      e.default = c;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        o = n(2),
        i = u(n(3)),
        a = u(n(0));
      function u(t) {
        return t && t.__esModule ? t : { default: t };
      }
      var f = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          r(e, [
            {
              key: "valid",
              value: function () {
                return -1 !== this.data.search(/^[0-9]{5}$/);
              },
            },
            {
              key: "encode",
              value: function () {
                var t,
                  e =
                    o.EAN5_STRUCTURE[
                      ((t = this.data),
                      t
                        .split("")
                        .map(function (t) {
                          return +t;
                        })
                        .reduce(function (t, e, n) {
                          return n % 2 ? t + 9 * e : t + 3 * e;
                        }, 0) % 10)
                    ];
                return {
                  data: "1011" + (0, i.default)(this.data, e, "01"),
                  text: this.text,
                };
              },
            },
          ]),
          e
        );
      })(a.default);
      e.default = f;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        o = n(2),
        i = a(n(3));
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }
      var u = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          r(e, [
            {
              key: "valid",
              value: function () {
                return -1 !== this.data.search(/^[0-9]{2}$/);
              },
            },
            {
              key: "encode",
              value: function () {
                var t = o.EAN2_STRUCTURE[parseInt(this.data) % 4];
                return {
                  data: "1011" + (0, i.default)(this.data, t, "01"),
                  text: this.text,
                };
              },
            },
          ]),
          e
        );
      })(a(n(0)).default);
      e.default = u;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        o = u(n(3)),
        i = u(n(0)),
        a = n(9);
      function u(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function f(t, e) {
        if (!t)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        return !e || ("object" != typeof e && "function" != typeof e) ? t : e;
      }
      var c = [
          "XX00000XXX",
          "XX10000XXX",
          "XX20000XXX",
          "XXX00000XX",
          "XXXX00000X",
          "XXXXX00005",
          "XXXXX00006",
          "XXXXX00007",
          "XXXXX00008",
          "XXXXX00009",
        ],
        s = [
          ["EEEOOO", "OOOEEE"],
          ["EEOEOO", "OOEOEE"],
          ["EEOOEO", "OOEEOE"],
          ["EEOOOE", "OOEEEO"],
          ["EOEEOO", "OEOOEE"],
          ["EOOEEO", "OEEOOE"],
          ["EOOOEE", "OEEEOO"],
          ["EOEOEO", "OEOEOE"],
          ["EOEOOE", "OEOEEO"],
          ["EOOEOE", "OEEOEO"],
        ],
        l = (function (t) {
          function e(t, n) {
            !(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e);
            var r = f(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n)
            );
            if (((r.isValid = !1), -1 !== t.search(/^[0-9]{6}$/)))
              (r.middleDigits = t),
                (r.upcA = p(t, "0")),
                (r.text =
                  n.text || "" + r.upcA[0] + t + r.upcA[r.upcA.length - 1]),
                (r.isValid = !0);
            else {
              if (-1 === t.search(/^[01][0-9]{7}$/)) return f(r);
              if (
                ((r.middleDigits = t.substring(1, t.length - 1)),
                (r.upcA = p(r.middleDigits, t[0])),
                r.upcA[r.upcA.length - 1] !== t[t.length - 1])
              )
                return f(r);
              r.isValid = !0;
            }
            return (
              (r.displayValue = n.displayValue),
              n.fontSize > 10 * n.width
                ? (r.fontSize = 10 * n.width)
                : (r.fontSize = n.fontSize),
              (r.guardHeight = n.height + r.fontSize / 2 + n.textMargin),
              r
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, t),
            r(e, [
              {
                key: "valid",
                value: function () {
                  return this.isValid;
                },
              },
              {
                key: "encode",
                value: function () {
                  return this.options.flat
                    ? this.flatEncoding()
                    : this.guardedEncoding();
                },
              },
              {
                key: "flatEncoding",
                value: function () {
                  var t = "";
                  return (
                    (t += "101"),
                    (t += this.encodeMiddleDigits()),
                    { data: (t += "010101"), text: this.text }
                  );
                },
              },
              {
                key: "guardedEncoding",
                value: function () {
                  var t = [];
                  return (
                    this.displayValue &&
                      t.push({
                        data: "00000000",
                        text: this.text[0],
                        options: { textAlign: "left", fontSize: this.fontSize },
                      }),
                    t.push({
                      data: "101",
                      options: { height: this.guardHeight },
                    }),
                    t.push({
                      data: this.encodeMiddleDigits(),
                      text: this.text.substring(1, 7),
                      options: { fontSize: this.fontSize },
                    }),
                    t.push({
                      data: "010101",
                      options: { height: this.guardHeight },
                    }),
                    this.displayValue &&
                      t.push({
                        data: "00000000",
                        text: this.text[7],
                        options: {
                          textAlign: "right",
                          fontSize: this.fontSize,
                        },
                      }),
                    t
                  );
                },
              },
              {
                key: "encodeMiddleDigits",
                value: function () {
                  var t = this.upcA[0],
                    e = this.upcA[this.upcA.length - 1],
                    n = s[parseInt(e)][parseInt(t)];
                  return (0, o.default)(this.middleDigits, n);
                },
              },
            ]),
            e
          );
        })(i.default);
      function p(t, e) {
        for (
          var n = parseInt(t[t.length - 1]), r = c[n], o = "", i = 0, u = 0;
          u < r.length;
          u++
        ) {
          var f = r[u];
          o += "X" === f ? t[i++] : f;
        }
        return "" + (o = "" + e + o) + (0, a.checksum)(o);
      }
      e.default = l;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.ITF14 = e.ITF = void 0);
      var r = i(n(10)),
        o = i(n(32));
      function i(t) {
        return t && t.__esModule ? t : { default: t };
      }
      (e.ITF = r.default), (e.ITF14 = o.default);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      (e.START_BIN = "1010"),
        (e.END_BIN = "11101"),
        (e.BINARIES = [
          "00110",
          "10001",
          "01001",
          "11000",
          "00101",
          "10100",
          "01100",
          "00011",
          "10010",
          "01010",
        ]);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(10),
        a = (r = i) && r.__esModule ? r : { default: r };
      var u = function (t) {
          var e = t
            .substr(0, 13)
            .split("")
            .map(function (t) {
              return parseInt(t, 10);
            })
            .reduce(function (t, e, n) {
              return t + e * (3 - (n % 2) * 2);
            }, 0);
          return 10 * Math.ceil(e / 10) - e;
        },
        f = (function (t) {
          function e(t, n) {
            return (
              (function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, e),
              -1 !== t.search(/^[0-9]{13}$/) && (t += u(t)),
              (function (t, e) {
                if (!t)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return !e || ("object" != typeof e && "function" != typeof e)
                  ? t
                  : e;
              })(
                this,
                (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n)
              )
            );
          }
          return (
            (function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e &&
                  (Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, e)
                    : (t.__proto__ = e));
            })(e, t),
            o(e, [
              {
                key: "valid",
                value: function () {
                  return (
                    -1 !== this.data.search(/^[0-9]{14}$/) &&
                    +this.data[13] === u(this.data)
                  );
                },
              },
            ]),
            e
          );
        })(a.default);
      e.default = f;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.MSI1110 = e.MSI1010 = e.MSI11 = e.MSI10 = e.MSI = void 0);
      var r = f(n(4)),
        o = f(n(34)),
        i = f(n(35)),
        a = f(n(36)),
        u = f(n(37));
      function f(t) {
        return t && t.__esModule ? t : { default: t };
      }
      (e.MSI = r.default),
        (e.MSI10 = o.default),
        (e.MSI11 = i.default),
        (e.MSI1010 = a.default),
        (e.MSI1110 = u.default);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = n(4),
        i = (r = o) && r.__esModule ? r : { default: r },
        a = n(6);
      var u = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(
                this,
                t + (0, a.mod10)(t),
                n
              )
            )
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          e
        );
      })(i.default);
      e.default = u;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = n(4),
        i = (r = o) && r.__esModule ? r : { default: r },
        a = n(6);
      var u = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(
              this,
              (e.__proto__ || Object.getPrototypeOf(e)).call(
                this,
                t + (0, a.mod11)(t),
                n
              )
            )
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          e
        );
      })(i.default);
      e.default = u;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = n(4),
        i = (r = o) && r.__esModule ? r : { default: r },
        a = n(6);
      var u = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (t += (0, a.mod10)(t)),
            (t += (0, a.mod10)(t)),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          e
        );
      })(i.default);
      e.default = u;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = n(4),
        i = (r = o) && r.__esModule ? r : { default: r },
        a = n(6);
      var u = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (t += (0, a.mod11)(t)),
            (t += (0, a.mod10)(t)),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          e
        );
      })(i.default);
      e.default = u;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.pharmacode = void 0);
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(0);
      var a = (function (t) {
        function e(t, n) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, e);
          var r = (function (t, e) {
            if (!t)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            return !e || ("object" != typeof e && "function" != typeof e)
              ? t
              : e;
          })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
          return (r.number = parseInt(t, 10)), r;
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(e, [
            {
              key: "encode",
              value: function () {
                for (var t = this.number, e = ""; !isNaN(t) && 0 != t; )
                  t % 2 == 0
                    ? ((e = "11100" + e), (t = (t - 2) / 2))
                    : ((e = "100" + e), (t = (t - 1) / 2));
                return { data: (e = e.slice(0, -2)), text: this.text };
              },
            },
            {
              key: "valid",
              value: function () {
                return this.number >= 3 && this.number <= 131070;
              },
            },
          ]),
          e
        );
      })(((r = i) && r.__esModule ? r : { default: r }).default);
      e.pharmacode = a;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.codabar = void 0);
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(0);
      var a = (function (t) {
        function e(t, n) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
            0 === t.search(/^[0-9\-\$\:\.\+\/]+$/) && (t = "A" + t + "A");
          var r = (function (t, e) {
            if (!t)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            return !e || ("object" != typeof e && "function" != typeof e)
              ? t
              : e;
          })(
            this,
            (e.__proto__ || Object.getPrototypeOf(e)).call(
              this,
              t.toUpperCase(),
              n
            )
          );
          return (r.text = r.options.text || r.text.replace(/[A-D]/g, "")), r;
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(e, [
            {
              key: "valid",
              value: function () {
                return (
                  -1 !== this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/)
                );
              },
            },
            {
              key: "encode",
              value: function () {
                for (
                  var t = [], e = this.getEncodings(), n = 0;
                  n < this.data.length;
                  n++
                )
                  t.push(e[this.data.charAt(n)]),
                    n !== this.data.length - 1 && t.push("0");
                return { text: this.text, data: t.join("") };
              },
            },
            {
              key: "getEncodings",
              value: function () {
                return {
                  0: "101010011",
                  1: "101011001",
                  2: "101001011",
                  3: "110010101",
                  4: "101101001",
                  5: "110101001",
                  6: "100101011",
                  7: "100101101",
                  8: "100110101",
                  9: "110100101",
                  "-": "101001101",
                  $: "101100101",
                  ":": "1101011011",
                  "/": "1101101011",
                  ".": "1101101101",
                  "+": "101100110011",
                  A: "1011001001",
                  B: "1001001011",
                  C: "1010010011",
                  D: "1010011001",
                };
              },
            },
          ]),
          e
        );
      })(((r = i) && r.__esModule ? r : { default: r }).default);
      e.codabar = a;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.GenericBarcode = void 0);
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(0);
      var a = (function (t) {
        function e(t, n) {
          return (
            (function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
            (function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
          );
        }
        return (
          (function (t, e) {
            if ("function" != typeof e && null !== e)
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          })(e, t),
          o(e, [
            {
              key: "encode",
              value: function () {
                return {
                  data: "10101010101010101010101010101010101010101",
                  text: this.text,
                };
              },
            },
            {
              key: "valid",
              value: function () {
                return !0;
              },
            },
          ]),
          e
        );
      })(((r = i) && r.__esModule ? r : { default: r }).default);
      e.GenericBarcode = a;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.default = function (t) {
          var e = [];
          return (
            (function t(n) {
              if (Array.isArray(n)) for (var r = 0; r < n.length; r++) t(n[r]);
              else (n.text = n.text || ""), (n.data = n.data || ""), e.push(n);
            })(t),
            e
          );
        });
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.default = function (t) {
          return (
            (t.marginTop = t.marginTop || t.margin),
            (t.marginBottom = t.marginBottom || t.margin),
            (t.marginRight = t.marginRight || t.margin),
            (t.marginLeft = t.marginLeft || t.margin),
            t
          );
        });
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t &&
                  "function" == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? "symbol"
                  : typeof t;
              },
        o = u(n(44)),
        i = u(n(45)),
        a = n(14);
      function u(t) {
        return t && t.__esModule ? t : { default: t };
      }
      function f(t) {
        if ("string" == typeof t)
          return (function (t) {
            var e = document.querySelectorAll(t);
            if (0 === e.length) return;
            for (var n = [], r = 0; r < e.length; r++) n.push(f(e[r]));
            return n;
          })(t);
        if (Array.isArray(t)) {
          for (var e = [], n = 0; n < t.length; n++) e.push(f(t[n]));
          return e;
        }
        if (
          "undefined" != typeof HTMLCanvasElement &&
          t instanceof HTMLImageElement
        )
          return (
            (u = t),
            {
              element: (c = document.createElement("canvas")),
              options: (0, o.default)(u),
              renderer: i.default.CanvasRenderer,
              afterRender: function () {
                u.setAttribute("src", c.toDataURL());
              },
            }
          );
        if (
          (t && t.nodeName && "svg" === t.nodeName.toLowerCase()) ||
          ("undefined" != typeof SVGElement && t instanceof SVGElement)
        )
          return {
            element: t,
            options: (0, o.default)(t),
            renderer: i.default.SVGRenderer,
          };
        if (
          "undefined" != typeof HTMLCanvasElement &&
          t instanceof HTMLCanvasElement
        )
          return {
            element: t,
            options: (0, o.default)(t),
            renderer: i.default.CanvasRenderer,
          };
        if (t && t.getContext)
          return { element: t, renderer: i.default.CanvasRenderer };
        if (
          t &&
          "object" === (void 0 === t ? "undefined" : r(t)) &&
          !t.nodeName
        )
          return { element: t, renderer: i.default.ObjectRenderer };
        throw new a.InvalidElementException();
        var u, c;
      }
      e.default = f;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = i(n(11)),
        o = i(n(12));
      function i(t) {
        return t && t.__esModule ? t : { default: t };
      }
      e.default = function (t) {
        var e = {};
        for (var n in o.default)
          o.default.hasOwnProperty(n) &&
            (t.hasAttribute("jsbarcode-" + n.toLowerCase()) &&
              (e[n] = t.getAttribute("jsbarcode-" + n.toLowerCase())),
            t.hasAttribute("data-" + n.toLowerCase()) &&
              (e[n] = t.getAttribute("data-" + n.toLowerCase())));
        return (
          (e.value =
            t.getAttribute("jsbarcode-value") || t.getAttribute("data-value")),
          (e = (0, r.default)(e))
        );
      };
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = a(n(46)),
        o = a(n(47)),
        i = a(n(48));
      function a(t) {
        return t && t.__esModule ? t : { default: t };
      }
      e.default = {
        CanvasRenderer: r.default,
        SVGRenderer: o.default,
        ObjectRenderer: i.default,
      };
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(7),
        a = (r = i) && r.__esModule ? r : { default: r },
        u = n(13);
      var f = (function () {
        function t(e, n, r) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, t),
            (this.canvas = e),
            (this.encodings = n),
            (this.options = r);
        }
        return (
          o(t, [
            {
              key: "render",
              value: function () {
                if (!this.canvas.getContext)
                  throw new Error("The browser does not support canvas.");
                this.prepareCanvas();
                for (var t = 0; t < this.encodings.length; t++) {
                  var e = (0, a.default)(
                    this.options,
                    this.encodings[t].options
                  );
                  this.drawCanvasBarcode(e, this.encodings[t]),
                    this.drawCanvasText(e, this.encodings[t]),
                    this.moveCanvasDrawing(this.encodings[t]);
                }
                this.restoreCanvas();
              },
            },
            {
              key: "prepareCanvas",
              value: function () {
                var t = this.canvas.getContext("2d");
                t.save(),
                  (0, u.calculateEncodingAttributes)(
                    this.encodings,
                    this.options,
                    t
                  );
                var e = (0, u.getTotalWidthOfEncodings)(this.encodings),
                  n = (0, u.getMaximumHeightOfEncodings)(this.encodings);
                (this.canvas.width =
                  e + this.options.marginLeft + this.options.marginRight),
                  (this.canvas.height = n),
                  t.clearRect(0, 0, this.canvas.width, this.canvas.height),
                  this.options.background &&
                    ((t.fillStyle = this.options.background),
                    t.fillRect(0, 0, this.canvas.width, this.canvas.height)),
                  t.translate(this.options.marginLeft, 0);
              },
            },
            {
              key: "drawCanvasBarcode",
              value: function (t, e) {
                var n,
                  r = this.canvas.getContext("2d"),
                  o = e.data;
                (n =
                  "top" == t.textPosition
                    ? t.marginTop + t.fontSize + t.textMargin
                    : t.marginTop),
                  (r.fillStyle = t.lineColor);
                for (var i = 0; i < o.length; i++) {
                  var a = i * t.width + e.barcodePadding;
                  "1" === o[i]
                    ? r.fillRect(a, n, t.width, t.height)
                    : o[i] && r.fillRect(a, n, t.width, t.height * o[i]);
                }
              },
            },
            {
              key: "drawCanvasText",
              value: function (t, e) {
                var n,
                  r,
                  o = this.canvas.getContext("2d"),
                  i = t.fontOptions + " " + t.fontSize + "px " + t.font;
                t.displayValue &&
                  ((r =
                    "top" == t.textPosition
                      ? t.marginTop + t.fontSize - t.textMargin
                      : t.height + t.textMargin + t.marginTop + t.fontSize),
                  (o.font = i),
                  "left" == t.textAlign || e.barcodePadding > 0
                    ? ((n = 0), (o.textAlign = "left"))
                    : "right" == t.textAlign
                    ? ((n = e.width - 1), (o.textAlign = "right"))
                    : ((n = e.width / 2), (o.textAlign = "center")),
                  o.fillText(e.text, n, r));
              },
            },
            {
              key: "moveCanvasDrawing",
              value: function (t) {
                this.canvas.getContext("2d").translate(t.width, 0);
              },
            },
            {
              key: "restoreCanvas",
              value: function () {
                this.canvas.getContext("2d").restore();
              },
            },
          ]),
          t
        );
      })();
      e.default = f;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r,
        o = (function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              (r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(t, r.key, r);
            }
          }
          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        })(),
        i = n(7),
        a = (r = i) && r.__esModule ? r : { default: r },
        u = n(13);
      var f = "http://www.w3.org/2000/svg",
        c = (function () {
          function t(e, n, r) {
            !(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, t),
              (this.svg = e),
              (this.encodings = n),
              (this.options = r),
              (this.document = r.xmlDocument || document);
          }
          return (
            o(t, [
              {
                key: "render",
                value: function () {
                  var t = this.options.marginLeft;
                  this.prepareSVG();
                  for (var e = 0; e < this.encodings.length; e++) {
                    var n = this.encodings[e],
                      r = (0, a.default)(this.options, n.options),
                      o = this.createGroup(t, r.marginTop, this.svg);
                    this.setGroupOptions(o, r),
                      this.drawSvgBarcode(o, r, n),
                      this.drawSVGText(o, r, n),
                      (t += n.width);
                  }
                },
              },
              {
                key: "prepareSVG",
                value: function () {
                  for (; this.svg.firstChild; )
                    this.svg.removeChild(this.svg.firstChild);
                  (0, u.calculateEncodingAttributes)(
                    this.encodings,
                    this.options
                  );
                  var t = (0, u.getTotalWidthOfEncodings)(this.encodings),
                    e = (0, u.getMaximumHeightOfEncodings)(this.encodings),
                    n = t + this.options.marginLeft + this.options.marginRight;
                  this.setSvgAttributes(n, e),
                    this.options.background &&
                      this.drawRect(0, 0, n, e, this.svg).setAttribute(
                        "style",
                        "fill:" + this.options.background + ";"
                      );
                },
              },
              {
                key: "drawSvgBarcode",
                value: function (t, e, n) {
                  var r,
                    o = n.data;
                  r = "top" == e.textPosition ? e.fontSize + e.textMargin : 0;
                  for (var i = 0, a = 0, u = 0; u < o.length; u++)
                    (a = u * e.width + n.barcodePadding),
                      "1" === o[u]
                        ? i++
                        : i > 0 &&
                          (this.drawRect(
                            a - e.width * i,
                            r,
                            e.width * i,
                            e.height,
                            t
                          ),
                          (i = 0));
                  i > 0 &&
                    this.drawRect(
                      a - e.width * (i - 1),
                      r,
                      e.width * i,
                      e.height,
                      t
                    );
                },
              },
              {
                key: "drawSVGText",
                value: function (t, e, n) {
                  var r,
                    o,
                    i = this.document.createElementNS(f, "text");
                  e.displayValue &&
                    (i.setAttribute(
                      "style",
                      "font:" +
                        e.fontOptions +
                        " " +
                        e.fontSize +
                        "px " +
                        e.font
                    ),
                    (o =
                      "top" == e.textPosition
                        ? e.fontSize - e.textMargin
                        : e.height + e.textMargin + e.fontSize),
                    "left" == e.textAlign || n.barcodePadding > 0
                      ? ((r = 0), i.setAttribute("text-anchor", "start"))
                      : "right" == e.textAlign
                      ? ((r = n.width - 1),
                        i.setAttribute("text-anchor", "end"))
                      : ((r = n.width / 2),
                        i.setAttribute("text-anchor", "middle")),
                    i.setAttribute("x", r),
                    i.setAttribute("y", o),
                    i.appendChild(this.document.createTextNode(n.text)),
                    t.appendChild(i));
                },
              },
              {
                key: "setSvgAttributes",
                value: function (t, e) {
                  var n = this.svg;
                  n.setAttribute("width", t + "px"),
                    n.setAttribute("height", e + "px"),
                    n.setAttribute("x", "0px"),
                    n.setAttribute("y", "0px"),
                    n.setAttribute("viewBox", "0 0 " + t + " " + e),
                    n.setAttribute("xmlns", f),
                    n.setAttribute("version", "1.1"),
                    n.setAttribute("style", "transform: translate(0,0)");
                },
              },
              {
                key: "createGroup",
                value: function (t, e, n) {
                  var r = this.document.createElementNS(f, "g");
                  return (
                    r.setAttribute(
                      "transform",
                      "translate(" + t + ", " + e + ")"
                    ),
                    n.appendChild(r),
                    r
                  );
                },
              },
              {
                key: "setGroupOptions",
                value: function (t, e) {
                  t.setAttribute("style", "fill:" + e.lineColor + ";");
                },
              },
              {
                key: "drawRect",
                value: function (t, e, n, r, o) {
                  var i = this.document.createElementNS(f, "rect");
                  return (
                    i.setAttribute("x", t),
                    i.setAttribute("y", e),
                    i.setAttribute("width", n),
                    i.setAttribute("height", r),
                    o.appendChild(i),
                    i
                  );
                },
              },
            ]),
            t
          );
        })();
      e.default = c;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      var o = (function () {
        function t(e, n, r) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, t),
            (this.object = e),
            (this.encodings = n),
            (this.options = r);
        }
        return (
          r(t, [
            {
              key: "render",
              value: function () {
                this.object.encodings = this.encodings;
              },
            },
          ]),
          t
        );
      })();
      e.default = o;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        return function (e, n, r) {
          return n && t(e.prototype, n), r && t(e, r), e;
        };
      })();
      var o = (function () {
        function t(e) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, t),
            (this.api = e);
        }
        return (
          r(t, [
            {
              key: "handleCatch",
              value: function (t) {
                if ("InvalidInputException" !== t.name) throw t;
                if (this.api._options.valid === this.api._defaults.valid)
                  throw t.message;
                this.api._options.valid(!1), (this.api.render = function () {});
              },
            },
            {
              key: "wrapBarcodeCall",
              value: function (t) {
                try {
                  var e = t.apply(void 0, arguments);
                  return this.api._options.valid(!0), e;
                } catch (t) {
                  return this.handleCatch(t), this.api;
                }
              },
            },
          ]),
          t
        );
      })();
      e.default = o;
    },
  ]);
}

// jsbarcodeLink();

console.log("StockbalX Extension 7.6");

const clickSound = new Audio(chrome.runtime.getURL("click.mp3"));
const alertSound = new Audio(chrome.runtime.getURL("alert.mp3"));
const doubleClickSound = new Audio(chrome.runtime.getURL("doubleClick.mp3"));
let takeOutAllData;
let totalAmount = 0;
let colorId = "";
let eanToButtonClass = "";
let quotationEan = [];

async function playClickSound() {
  await clickSound.play();
}

async function playAlertSound() {
  await alertSound.play();
}

async function playDoubleClickSound() {
  await doubleClickSound.play();
}

const headTag = `    <meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stock Management</title>
<link rel="icon" href="https://appstickers-cdn.appadvice.com/1451174957/830155085/69f269a284978abfeeff1600b15a1d50-10.png">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Open+Sans+Condensed:wght@300&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">

`;

const bodyTag = ` 

<nav class="navbar navbar-default">
<div class="container-fluid">
  <div class="navbar-header">
    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="https://www.phco.my/">Stock Status</a>
  </div>

  <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    <ul class="nav navbar-nav">
      <!--
      <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>
      <li><a href="#">Link</a></li>
      -->
      <!--
      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Mode<span class="caret"></span></a>
        <ul class="dropdown-menu" style="min-width: 50px;">
          <li id="quotation">Quotation</li>
          <li id="default">Default</li>
          
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
      
          <li role="separator" class="divider"></li>
          <li><a href="#">Separated link</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">One more separated link</a></li>
        
        </ul>
      </li>
      -->
 

      <li class="navbar-form " id="navbar-option">
        <select id="select-mode" class="form-control">
        <option value="1">+ Qty</option>
        <option value="0">All</option>
        <option value="2">0 Qty</option>
        <option value="3">- Qty</option>
        </select>
      </li>
    </ul>
    <form class="navbar-form navbar-left" autocomplete='on'>
      <div class="form-group">
     
        <input id="txtSearch" type="text"  minlength="2"  class="form-control search-input-value" autofocus placeholder="Search" >
      </div>
      <button type="submit" class="btn btn-default btn-search btn-success" id="search-button">SEARCH</button>
      <span hidden id="spinner"></span>
    </form>
    
    <form class="navbar-form navbar-right" >
      <div class="form-group">

      <span class="glyphicon glyphicon-thumbs-up thumbs-up-display" id="thumbs-up" aria-hidden="true"></span>
      <div class="tooltiptext tooltiptext-pelw">PELW</div>
        
        <span class="glyphicon glyphicon-eye-open" id="eye-saver" aria-hidden="true"></span>
        <div class="tooltiptext tooltiptext-eye-saver">EYE SAVER</div>
    
        <span id="price-tag-button" class="glyphicon glyphicon-barcode" aria-hidden="true"></span>
        <div class="tooltiptext tooltiptext-price-tag">PRICE TAG</div>

        <span id="quotation-back-button" class="glyphicon glyphicon-list-alt btn-search quotation-back quotation-icon" aria-hidden="true"></span>
        <div class="tooltiptext tooltiptext-quotation">QUOTATION</div>
      
     
        <input type="text" maxlength="50" type="text" class="form-control" id="filter-search" placeholder="Filter" >
      </div>
    </form>
    
  </div>
</div>

</nav>

<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous"></script>

`;

const table = `
<!-- 
<div id="filter-div">
<input type="text" maxlength="50" type="text" class="form-control" id="filter-search" placeholder="Filter" >
</div>
-->
<button id="myBtn" title="Go to top">Top</button>
<table class="table tableFixHead" id="myTable">
<thead>
  <tr class="success">

    <th style="text-align: center;">EAN</th>
    <th style="text-align: center;">DESCRIPTION</th>
    <th style="text-align: center;">IMAGE</th>
    <th id="price" style="text-align: center;cursor: pointer;">
      <div class="tooltiptext">SORTING</div>
      PRICE
    </th>
    <th id="qty" style="text-align: center;cursor: pointer;">
    <div class="tooltiptext">HIGHLIGHT</div>
    QTY
    </th>
    <th id="git" style="text-align: center;cursor: pointer;">
    <div class="tooltiptext">HIGHLIGHT</div>
    GIT
    </th>
    <th id="p00" style="text-align: center;cursor: pointer;">
    <div class="tooltiptext">HIGHLIGHT</div>
    P00
    </th>
    <th id="p03" style="text-align: center;cursor: pointer;">
    <div class="tooltiptext">HIGHLIGHT</div>
    P03
    </th>
    <th id="p05" style="text-align: center;cursor: pointer;;">
    <div class="tooltiptext">HIGHLIGHT</div>
    P05
    </th>
    <th id="p06" style="text-align: center;cursor: pointer;">
    <div class="tooltiptext">HIGHLIGHT</div>
    P06
    </th>
    <th id="phq" style="text-align: center;cursor: pointer;">
    <div class="tooltiptext">HIGHLIGHT</div>
    PHQ
    </th>
    <th id="ppj" style="text-align: center;cursor: pointer;">
    <div class="tooltiptext">HIGHLIGHT</div>
    PPJ
    </th>
    <th id="wxr" style="text-align: center;cursor: pointer;">
    <div class="tooltiptext">HIGHLIGHT</div>
    WXR
    </th>

  </tr>
</thead>
<tbody id="green-tbody">
  
</tbody>
</table>
`;

const searchButton = document.querySelector(".btn-search");
let switchBigToSmallKey = 0;

if (document.querySelector(".search-input-value")) {
  let searchInputValue = document.querySelector(".search-input-value").value;
}

const sort1 = (c) => {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;

  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[c];
      y = rows[i + 1].getElementsByTagName("TD")[c];

      if (
        parseFloat(x.innerHTML.replace(/\,/g, "")) >
        parseFloat(y.innerHTML.replace(/\,/g, ""))
      ) {
        shouldSwitch = true;

        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
};

const sort2 = (c) => {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;

  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[c];
      y = rows[i + 1].getElementsByTagName("TD")[c];

      if (
        parseFloat(x.innerHTML.replace(/\,/g, "")) <
        parseFloat(y.innerHTML.replace(/\,/g, ""))
      ) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
};

function moveOriginalBody() {
  document.querySelector("html").innerHTML = "";
  insertBootstrap();
}

function insertBootstrap() {
  const head = document.querySelector("head");
  const body = document.querySelector("body");

  head.insertAdjacentHTML("afterbegin", headTag);

  body.insertAdjacentHTML("afterbegin", bodyTag);

  document.querySelector("nav").insertAdjacentHTML("afterend", table);
}

function tbodyDataToObj(tbody, obj) {
  ////tbody tr td:nth-child(2)
  tbody
    .querySelectorAll(".webstore")
    .forEach((tag) => obj.ean.push(tag.innerHTML));
  tbody
    .querySelectorAll("tbody tr td:nth-child(2)")
    .forEach((tag) => obj.name.push(tag.innerHTML));
  tbody
    .querySelectorAll("tbody tr td:nth-child(8)")
    .forEach((tag) => obj.price.push(tag.innerHTML)); //ori 7
  tbody
    .querySelectorAll("tbody tr td:nth-child(9)")
    .forEach((tag) => obj.qty.push(tag.innerHTML)); // ...8
  tbody
    .querySelectorAll("tbody tr td:nth-child(10)")
    .forEach((tag) => obj.git.push(tag.innerHTML)); // ...9
  tbody
    .querySelectorAll("tbody tr td:nth-child(11)")
    .forEach((tag) => obj.p00.push(tag.innerHTML)); // ...10
  tbody
    .querySelectorAll("tbody tr td:nth-child(12)")
    .forEach((tag) => obj.p03.push(tag.innerHTML)); // ..11
  tbody
    .querySelectorAll("tbody tr td:nth-child(13)")
    .forEach((tag) => obj.p05.push(tag.innerHTML)); // ..12
  tbody
    .querySelectorAll("tbody tr td:nth-child(14)")
    .forEach((tag) => obj.p06.push(tag.innerHTML)); // ..13
  tbody
    .querySelectorAll("tbody tr td:nth-child(15)")
    .forEach((tag) => obj.phq.push(tag.innerHTML)); // ..14
  tbody
    .querySelectorAll("tbody tr td:nth-child(16)")
    .forEach((tag) => obj.ppj.push(tag.innerHTML)); // ..15
  tbody
    .querySelectorAll("tbody tr td:nth-child(17)")
    .forEach((tag) => obj.ws1.push(tag.innerHTML)); // ..16
  tbody
    .querySelectorAll("tbody tr td:nth-child(18)")
    .forEach((tag) => obj.wxr.push(tag.innerHTML)); // ..17
}

function insertFetchDataToTBody(data, i, eanClass = "") {
  let img = `https://www.phco.my/images/thumbs/products/${data.ean[i]}/0.jpg`;
  let imgLink = `<a href="https://www.phco.my/filterSearch?adv=false&cid=0&mid=0&vid=0&q=${data.ean[i]}&sid=false&isc=true&orderBy=11" target="_blank">`;
  let list = `
  
  <tr>
   
  <td style='text-align:center; vertical-align:middle' id="list-ean" class=${eanClass}>
    <div class="tooltiptext change-tooltiptext">DOUBLE CLICK COPY</div>
    <span id="list-ean-span">${data.ean[i]}</span>
    
  </td>

  <td style="max-width: 20vw;width: 20vw;text-align:left; vertical-align:middle;font-size: 1.5rem;" id="list-name">
  <div class="tooltiptext">DOUBLE CLICK COPY</div>
  <span id="list-ean-name">${data.name[i]}</span>
  </td>

  <td style='text-align:center; vertical-align:middle'>
    ${imgLink}
      <img id="${data.ean[i]}" src=${img} alt="IMAGE" width="100px" height="100px" 
      onerror="this.onerror=null; this.src='https://icon-library.com/images/not-found-icon/not-found-icon-24.jpg'">
    </a>
  </td>



  <td style='text-align:center; vertical-align:middle' id="list-price">${data.price[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-qty">${data.qty[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-git">${data.git[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-p00">${data.p00[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-p03">${data.p03[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-p05">${data.p05[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-p06">${data.p06[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-phq">${data.phq[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-ppj">${data.ppj[i]}</td>
  <td style='text-align:center; vertical-align:middle' id="list-wxr">${data.wxr[i]}</td>
  </tr>
  `;

  document.querySelector("#green-tbody").insertAdjacentHTML("afterbegin", list);

  // doubleClickCopyEanAndName();
  // whenHeaderBeenClickChangeListColor(colorId);
}

function checkOriginalPageAbnormal(htmlParser) {
  const oldThead = [
    "EAN/UPC",
    "Desp",
    "Cat.",
    "Group",
    "Code",
    "Remark1",
    "Price",
    "Qty",
    "GIT",
    "P00",
    "P03",
    "P05",
    "P06",
    "PHQ",
    "PPJ",
    "WS1",
    "WXR",
  ];

  const oldThLength = htmlParser.querySelectorAll("th").length;

  for (let n = 0; n < oldThead.length; n++) {
    let originalInnerText = oldThead[n];
    let fetchInnerText = htmlParser.querySelector(
      `thead tr th:nth-child(${n + 1})`
    ).innerHTML;

    if (originalInnerText !== fetchInnerText) {
      playAlertSound();
      // alertSound.play();
      alert(`
      Warning!!!! System detect original webpage 
      "${originalInnerText}" changes to "${fetchInnerText}"!!! 
      Please remove extension!!!`);
    }
  }

  if (oldThLength !== 17) {
    playAlertSound();
    // alertSound.play();
    alert(`
    Warning!!!! System detect original webpage changes!!!
    Please remove extension!!!`);
  }
}

async function fetchData(inputdata) {
  try {
    let x = document.getElementById("select-mode").value;
    const allData = {
      ean: [],
      name: [],
      price: [],
      qty: [],
      git: [],
      p00: [],
      p03: [],
      p05: [],
      p06: [],
      phq: [],
      ppj: [],
      ws1: [],
      wxr: [],
    };
    const spinner = document.getElementById("spinner");

    spinner.removeAttribute("hidden");

    const response = await fetch(
      `http://stockbal.phcocap.com/default4.aspx?s=1&c=${inputdata}&q=${x}`
    );
    const html = await response.text();

    spinner.setAttribute("hidden", "");

    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(html, "text/html");
    const tbody = htmlDocument.querySelector("tbody");

    // checkOriginalPageAbnormal(htmlDocument);

    tbodyDataToObj(tbody, allData);

    if (allData.ean.length > 500 && allData.ean.length < 1000) {
      playAlertSound();
      // alertSound.play();
      alert(
        `Warning! ${allData.ean.length} item been found, maybe will cause the system to slow down or crash.`
      );
    } else if (allData.ean.length >= 1000) {
      playAlertSound();
      // alertSound.play();

      let r = confirm(
        `Warning! ${allData.ean.length} item  been found, maybe will cause the system to crash. if you want continue click "ok"`
      );

      if (r == true) {
        console.log("continue");
      } else {
        allData = {};
      }
    }

    takeOutAllData = allData;

    for (let i = 0; i < allData.ean.length; i++) {
      insertFetchDataToTBody(allData, i, eanToButtonClass);
    }
    whenHeaderBeenClickChangeListColor(colorId);
    doubleClickCopyEanAndName();

    setTimeout(() => {
      runReplaceImage();
    }, 1000);

    if (eanToButtonClass !== "") {
      clickEanCopyData();
    }

    setTimeout(() => {
      if (eanToButtonClass === "ean-to-button") {
        document.querySelectorAll(".change-tooltiptext").forEach((tag) => {
          tag.innerHTML = "Add";
        });
      }
      highLightBundleText();
    }, 500);
  } catch (error) {
    console.log(error);
    playAlertSound();
    // alertSound.play();
    alert("Item Not Found...");
  }
}

function removeBugOldHeader() {
  if (document.querySelector(".tblResult")) {
    document.querySelector(".tblResult").remove();
    console.log("remove bug header");
  }
}

function searchButtonOnClick() {
  const searchButton = document.querySelector(".btn-search");

  if (searchButton) {
    searchButton.addEventListener("click", (event) => {
      // const myAudio = new Audio(chrome.runtime.getURL("add.mp3"));
      // clickSound.play();
      playClickSound();

      /************** Clear tbody **************** */
      document.querySelector("#green-tbody").innerHTML = "";
      document.getElementById("filter-search").value = "";

      let searchInputValue = document.querySelector("input").value;

      event.preventDefault();

      fetchData(searchInputValue);

      document.querySelector("input").value = "";

      showThumbsUp();
    });
  }
}

function sortTable(column) {
  if (switchBigToSmallKey === 0) {
    sort1(column);
    switchBigToSmallKey = 1;
  } else {
    sort2(column);
    switchBigToSmallKey = 0;
  }
}

function switchNumberBigToSmallOrSmallToBig() {
  document.getElementById("price").addEventListener("click", () => {
    sortTable(3);
  });
  document.getElementById("qty").addEventListener("click", () => {
    sortTable(4);
  });
  document.getElementById("git").addEventListener("click", () => {
    sortTable(5);
  });
  document.getElementById("p00").addEventListener("click", () => {
    sortTable(6);
  });
  document.getElementById("p03").addEventListener("click", () => {
    sortTable(7);
  });
  document.getElementById("p05").addEventListener("click", () => {
    sortTable(8);
  });
  document.getElementById("p06").addEventListener("click", () => {
    sortTable(9);
  });
  document.getElementById("phq").addEventListener("click", () => {
    sortTable(10);
  });
  document.getElementById("ppj").addEventListener("click", () => {
    sortTable(11);
  });
  document.getElementById("wxr").addEventListener("click", () => {
    sortTable(12);
  });
}

function filterSearch() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("filter-search");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function filterInputOnChangeHandle() {
  document.getElementById("filter-search").addEventListener("keyup", () => {
    filterSearch();
  });
}

function clickHeadAddDecorationUnderline() {
  const headerId = [
    "price",
    "qty",
    "git",
    "p00",
    "p03",
    "p05",
    "p06",
    "phq",
    "ppj",
    "wxr",
  ];

  headerId.forEach((id) => {
    document.getElementById(id).addEventListener("click", () => {
      playClickSound();
      if (id !== "price") {
        document.getElementById(id).style.borderBottom = "5px solid #043b06";
        document.getElementById(id).style.borderTop = "5px solid #043b06";
        headerId
          .filter((el) => el !== id)
          .forEach((ID) => {
            document.getElementById(ID).style.border = null;
          });
        whenHeaderBeenClickChangeListColor(id);
        colorId = id;
      }
    });
  });
}

function whenHeaderBeenClickChangeListColor(id) {
  const listId = [
    "list-qty",
    "list-git",
    "list-p00",
    "list-p03",
    "list-p05",
    "list-p06",
    "list-phq",
    "list-ppj",
    "list-wxr",
  ];

  listId.forEach((listID) => {
    document.querySelectorAll(`#${listID}`).forEach((tag) => {
      tag.style.backgroundColor = "white";
      tag.style.color = "black";
    });
  });

  document.querySelectorAll(`#list-${id}`).forEach((tag) => {
    if (Number(tag.innerHTML) > 0) {
      tag.style.backgroundColor = "#4CAF50";
      tag.style.color = "white";
    } else if (Number(tag.innerHTML) < 0) {
      tag.style.backgroundColor = "#ef4f4f";
      tag.style.color = "white";
    }
  });
}

function doubleClickCopyEanAndName() {
  const eanAndNameId = ["#list-ean-span", "#list-ean-name"];

  eanAndNameId.forEach((id) => {
    document.querySelectorAll(id).forEach((tag) => {
      tag.addEventListener("dblclick", () => {
        playDoubleClickSound();

        let text = tag.innerHTML;
        console.log(text);
        let fakeTextarea = document.createElement("textarea");
        fakeTextarea.value = text;
        document.body.appendChild(fakeTextarea);
        fakeTextarea.select();
        document.execCommand("copy");
        document.body.removeChild(fakeTextarea);
      });
    });
  });
}

function googleFont() {
  // document.querySelector('body').style.fontFamily = 'Open Sans Condensed';
  // document.querySelector('body').style.fontFamily = 'Fredoka One';
  // document.querySelector('body').style.fontFamily = 'Montserrat';
  document.querySelector("body").style.fontFamily = "Noto Sans";
}

function clickMoveToTop() {
  document.getElementById("myBtn").addEventListener("click", () => {
    playClickSound();
    topFunction();
  });
}

function priceTagCancel() {
  const cancel = document.querySelector("#price-tag-button-cancel");
  cancel.addEventListener("click", () => {
    playClickSound();
    location.reload();
  });
  //price-tag-button-cancel
}

function toPriceTagPage() {
  let priceTagContainer = `
  <div id="price-tag-container">
    <div id="price-tag-area">
    </div>

   
      <div  class="price-tag-all-button" >


        <div class="glyphicon glyphicon-plus-sign price-tag-button-icon icon-cursor" id="price-tag-button-add" style="font-size: 5rem;" aria-hidden="true"></div>
        <div class="tooltiptext tooltiptext-price-tag-button-add">ADD</div>

        <div class="glyphicon glyphicon-edit price-tag-button-icon icon-cursor" id="price-tag-button-custom" style="font-size: 5rem;" aria-hidden="true"></div>
        <div class="tooltiptext tooltiptext-price-tag-button-custom">EDIT</div>


        <div class="glyphicon glyphicon-print price-tag-button-icon icon-cursor" id="price-tag-button-Print" style="font-size: 5rem;" aria-hidden="true"></div>
        <div class="tooltiptext tooltiptext-price-tag-button-print">PRINT</div>


        <div class="glyphicon glyphicon-trash  price-tag-button-icon icon-cursor" id="price-tag-button-cancel" style="font-size: 5rem;" aria-hidden="true"></div>
        <div class="tooltiptext tooltiptext-price-tag-button-cancel">DELETE ALL</div>

  

    </div>
    
  </div>
  `;

  document
    .querySelector("body")
    .insertAdjacentHTML("afterbegin", priceTagContainer);
  priceTagCancel();
  priceTagAddButton();
  bodyPriceTagToCenter();
  PrintButton();
  editButton();
  deletePriceTag();
}

function editButton() {
  const editBtn = document.getElementById("price-tag-button-custom");
  const priceTagArea = document.getElementById("price-tag-area");
  // priceTagArea.contentEditable = 'false';

  editBtn.addEventListener("click", () => {
    playClickSound();

    let t = "true";
    let f = "false";

    if (!priceTagArea.contentEditable) {
      priceTagArea.contentEditable = t;

      editBtn.classList.toggle("glyphicon-edit");
      editBtn.classList.toggle("glyphicon-wrench");
      playAlertSound();
      // alertSound.play();
      alert("Editing is only allowed before print");
    } else if (priceTagArea.contentEditable === t) {
      priceTagArea.contentEditable = f;
      editBtn.classList.toggle("glyphicon-wrench");
      editBtn.classList.toggle("glyphicon-edit");
    } else {
      priceTagArea.contentEditable = t;
      editBtn.classList.toggle("glyphicon-edit");
      editBtn.classList.toggle("glyphicon-wrench");
      playAlertSound();
      // alertSound.play();
      alert("Editing is only allowed before print");
    }
  });
}

function bodyPriceTagToCenter() {
  document.querySelector("body").setAttribute("id", "body-price-tag-center");
}

function disableBodyPriceTagToCenter() {
  document.querySelector("body").setAttribute("id", "");
}

function clickPriceTag() {
  const tBody = document.querySelector("tbody");
  const priceTagButton = document.getElementById("price-tag-button");
  const quotation = document.getElementById("quotation-back-button");

  priceTagButton.addEventListener("click", () => {
    playClickSound();
    hiddenEye();

    if (priceTagButton.innerHTML !== "back") {
      toPriceTagPage();
    }
    priceTagButton.innerHTML = "back";
    priceTagButton.setAttribute(
      "class",
      "btn btn-default btn-search btn-danger"
    );
    priceTagButton.style.right = "220px";
    priceTagButton.style.fontSize = "14px";
    priceTagButton.style.opacity = "1";
    quotation.style.display = "none";
    tBody.innerHTML = "";
    eanToButtonClass = "ean-to-button";
    // priceTagButton.setAttribute('id', 'price-tag-button-back');
    // backToPriceTagPage();
    offOriginalNavAndTable();
  });
}

function hiddenEye() {
  const eye = document.getElementById("eye-saver");

  let eyeClass = eye.getAttribute("class");

  if (eyeClass === "glyphicon glyphicon-eye-close") {
    eye.click();
  }

  eye.style.display = "none";
}

function clickQuotation() {
  const quotation = document.getElementById("quotation-back-button");
  const nav = document.querySelector("nav");
  const tBody = document.querySelector("tbody");
  const priceTagButton = document.getElementById("price-tag-button");

  quotation.addEventListener("click", () => {
    playClickSound();
    quotation.classList.toggle("quotation-icon");

    hiddenEye();

    priceTagButton.style.display = "none";
    tBody.innerHTML = "";

    if (quotation.innerHTML === "") {
      insertQuotationTable();
    }

    quotation.setAttribute(
      "class",
      "btn btn-default btn-search btn-danger quotation-to-back quotation-back"
    );
    quotation.innerHTML = "Back";
    quotation.setAttribute("id", "");
    backToQuotation();
    eanToButtonClass = "ean-to-button";
    // insertDataToQuotationTable();
  });
}

function backToPriceTagPage() {
  const back = document.querySelector("#price-tag-button");

  back.addEventListener("click", () => {
    playClickSound();
    offOriginalNavAndTable();
    onPriceTagPage();
  });
}

function backToQuotation() {
  const back = document.querySelector(".quotation-to-back");

  back.addEventListener("click", () => {
    playClickSound();
    offOriginalNavAndTable();
    onQuotation();
  });
}

// function backToPriceTagPage() {

// }

function clickCancel() {
  const cancel = document.querySelector("#quotation-button-cancel");
  cancel.addEventListener("click", () => {
    playClickSound();
    location.reload();
  });
}

function insertQuotationTable() {
  const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let dateObj = new Date();
  let date = dateObj.getDate();
  let month = monthArr[dateObj.getMonth()];
  let year = dateObj.getFullYear();

  const quotationThead = `
  <!-- modal 2 -->
  <div id="myModal-2" class="modal">
  <div class="modal-content">
    <!--
      <span class="close-pop">&times;</span>
      -->

      <div class='group'>
        
          <div class='popup-input-upload'>
              <input id="upload-input" class='form-input' name="name" type="text" required />

              <label class='label-quotation label-file-name' >File Name</label>
          </div>

   
          <div id=firebase-popup-button>
          <button id="save-to-firebase" type="submit" class="btn btn-primary popup-upload">Save</button>
          <button  class="btn btn-danger close-pop">&times;</button>
          </div>
         
          

      </div>

  </div>
</div>

  <!-- modal 1 -->
  <div id="myModal" class="modal">
  <div class="modal-content">
      <!--
      <span class="close-pop">&times;</span>
      -->

      <div class='group'>
        
          <div class='popup-input'>
              <input class='form-input popup-input-name' name="name" type="text" required />

              <label class='label-quotation label-name' >Description</label>
          </div>


          <div class='popup-input'>
              <input class='form-input popup-input-price' name="price" type="number" required />

              <label class='label-quotation label-price'>Price</label>
          </div>

          <div id=firebase-popup-button>
          <button type="submit" class="btn btn-primary popup-add">Add</button>
          <button  class="btn btn-danger close-pop">&times;</button>
          </div>
          

      </div>

  </div>
</div>


  <div id="quotation-container">
    <div id="quotaion-date">
    <!--
      <div>
        <input type="text" placeholder="Name" id="quotation-company-name">
      </div>
     --> 
      <div>${date}-${month}-${year}</div>
    </div>
  <table class="table table-hover " id="quotation-table">
  <thead>
  <tr class="info">
    <th class="quotaion-th" style="text-align: center;" id="delete-thead-quotation" ></th>

    <th class="quotaion-th" style="text-align: center;" id="ean-quotation">EAN</th>
  
    <th class="quotaion-th" style="text-align: center;" id="description-quotation">DESCRIPTION</th>
    <th class="quotaion-th" style="text-align: center;" id="image-quotation">IMAGE</th>
    <th class="quotaion-th" style="text-align: center;" id="quantity-quotation">QUANTITY</th>
    <th class="quotaion-th" style="text-align: center;" id="unit-price-quotation">PRICE</th>
    <th class="quotaion-th" style="text-align: center;" id="price-quotation">AMOUNT</th>
  
   
  </tr>
  </thead>
  <tbody id="quotation-tbody">
  
  </tbody>
  </table>


  <hr>

  <div id="quotation-button-container" class="container-total">
    <h3 id="total-amount-title">TOTAL AMOUNT</h3>
    <h3 id="total-amount-rm">RM<span id="total-amount">${totalAmount}</span></h3>
  </div>
  
  
    <div  class="all-quotation-button">
      <div class="glyphicon glyphicon-trash quotation-button-icon icon-cursor quotation-button-padding" id="quotation-button-cancel" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>
      <div class="tooltiptext tooltiptext-quotation-button-cancel">DELETE ALL</div>

      <div class="glyphicon glyphicon-edit quotation-button-icon icon-cursor quotation-button-padding" id="quotation-button-custom" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>
      <div class="tooltiptext tooltiptext-quotation-button-custom">OTHER ITEM</div>

      <div class="glyphicon glyphicon-cloud-upload quotation-button-icon icon-cursor quotation-button-padding" id="quotation-button-upload" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>
      <div class="tooltiptext tooltiptext-quotation-button-save">SAVE</div>


      <div class="glyphicon glyphicon-print quotation-button-icon icon-cursor quotation-button-padding" id="quotation-button-Print" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>
      <div class="tooltiptext tooltiptext-quotation-button-print">PRINT</div>

      
      <div class="glyphicon glyphicon-cloud quotation-button-icon icon-cursor quotation-button-padding" id="quotation-button-history" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>
      <div class="tooltiptext tooltiptext-quotation-button-history">HISTORY</div>

      <div class="glyphicon glyphicon-plus-sign quotation-button-icon icon-cursor quotation-button-padding" id="quotation-button-add" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>
      <div class="tooltiptext tooltiptext-quotation-button-add">ADD ITEM</div>

    </div>
   
  </div>
  
  
  `;

  offOriginalNavAndTable();

  document.querySelector("body").insertAdjacentHTML("afterend", quotationThead);

  quotationAddButton();
  clickCancel();
  PrintButton();
  quotationPopUp();
  firebasePopUp();
  shrink();
  shrinkFile();
  popUpAddItem();
  clickHistory();
}

function deleteButtonDisplayNone() {
  const deleteTheadQuotation = document.getElementById(
    "delete-thead-quotation"
  );
  const allDeleteButton = document.querySelectorAll(".delete-button");
  deleteTheadQuotation.style.display = "none";
  allDeleteButton.forEach((tag) => {
    tag.style.display = "none";
  });
}

function deleteButtonDisplayTableCell() {
  const deleteTheadQuotation = document.getElementById(
    "delete-thead-quotation"
  );
  const allDeleteButton = document.querySelectorAll(".delete-button");
  deleteTheadQuotation.style.display = "table-cell";
  allDeleteButton.forEach((tag) => {
    tag.style.display = "table-cell";
  });
}

function PrintButton() {
  const printButton = document.getElementById("quotation-button-Print");
  const allButton = document.querySelector(".all-quotation-button");
  const priceTagAllButton = document.querySelector(".price-tag-all-button");
  const topButton = document.getElementById("myBtn");
  const eye = document.getElementById("eye-saver");
  let eyeClass = eye.getAttribute("class");
  const printButtonPriceTag = document.getElementById("price-tag-button-Print");

  if (printButton) {
    printButton.addEventListener("click", () => {
      window.scroll(0, 0);
      playClickSound();

      deleteButtonDisplayNone();

      allButton.style.display = "none";

      if (topButton) {
        topButton.style.display = "none";
      }

      window.print();

      allButton.style.display = "flex";
      allButton.style.justifyContent = "flex-start";
      topButton.style.display = "block";
      deleteButtonDisplayTableCell();
    });
  } else {
    printButtonPriceTag.addEventListener("click", () => {
      window.scroll(0, 0);

      playClickSound();

      priceTagAllButton.style.display = "none";

      if (topButton) {
        topButton.style.display = "none";
      }

      window.print();

      priceTagAllButton.style.display = "flex";
      topButton.style.display = "block";
    });
  }
}

function clickEanCopyData() {
  // const allEan = document.querySelectorAll('.ean-to-button');
  const allEan = document.querySelectorAll(".ean-to-button #list-ean-span");
  const priceTagPage = document.getElementById("price-tag-container");
  const priceTagAddButton = document.getElementById("price-tag-button-add");
  const quotationAddButton = document.getElementById("quotation-button-add");

  allEan.forEach((tag) => {
    let obj = {
      ean: "",
      name: "",
      price: "",
    };

    tag.addEventListener("click", () => {
      let tagClass = tag.getAttribute("class");
      if (tagClass === "ean-to-button") {
        playClickSound();
      }

      playDoubleClickSound();
      obj.ean = tag.innerHTML;
      obj.value = 1;
      takeOutAllData.ean.find((num, index) => {
        if (num === obj.ean) {
          obj.name = takeOutAllData.name[index];
          obj.price = takeOutAllData.price[index];
        }
      });

      quotationEan.push(obj);
      // console.log(quotationEan);
      // console.log(takeOutAllData.ean.length);
      // console.log(takeOutAllData);

      offOriginalNavAndTable();

      if (priceTagPage) {
        onPriceTagPage();
        renderDataToPriceTagPage();
      } else {
        onQuotation();
        renderDataToQuotationTable();
      }
    });

    if (takeOutAllData.ean.length === 1) {
      document.getElementById("list-ean-span").click();

      setTimeout(() => {
        if (priceTagAddButton) {
          priceTagAddButton.click();
        } else {
          quotationAddButton.click();
        }

        document.getElementById("txtSearch").focus();

        document
          .getElementById("search-button")
          .setAttribute("class", "btn btn-default btn-search btn-warning");
        document.getElementById("search-button").innerHTML = "Auto Add";

        setTimeout(() => {
          document
            .getElementById("search-button")
            .setAttribute("class", "btn btn-default btn-search btn-success");
          document.getElementById("search-button").innerHTML = "SEARCH";
        }, 800);
      }, 500);
    }
  });
}

function renderDataToPriceTagPage() {
  const today = new Date();
  const todayString = today.toString().split(" ");
  const currentTime = `${todayString[0]} ${todayString[1]} ${todayString[2]} ${todayString[3]} ${todayString[4]}`;

  const priceTagArea = document.getElementById("price-tag-area");
  priceTagArea.innerHTML = "";

  quotationEan.forEach((obj, index) => {
    let showPrice = obj.price;

    if (showPrice.length > 8) {
      showPrice = "-";
    }

    const priceTag = `
    <div class="price-tag-unit">
 
      <div class="price-tag-name">${obj.name.substring(0, 80)}</div>
      <div class="price-tag-price">
        <span class="rm" style="font-size: 2rem;">RM</span>
        <!--
        <span id="price-tag-price">${obj.price}</span>
        -->
        <span id="price-tag-price">${showPrice}</span>
        <div class="price-tag-delete-parent">
          <span class="glyphicon glyphicon-remove-sign glyphicon-remove-sign-price-tag" id="price-tag-delete-${index}" aria-hidden="true"></span>
        </div>

      </div>
      <div>
      <span>
        <svg id="barcode-${
          obj.ean
        }-${index}" class="barcode" style="display: inline-block;"></svg>
      </span>
      <span>
        <div id="qrcode" class="qrcode-${obj.ean}-${index}"></div>
      </span>
      </div>
      
      
      <div class="price-tag-date">${currentTime}</div>
    </div>
    `;

    document
      .getElementById("price-tag-area")
      .insertAdjacentHTML("beforeend", priceTag);
  });

  quotationEan.forEach((obj, index) => {
    let element = document.getElementById(`barcode-${obj.ean}-${index}`);
    JsBarcode(element, obj.ean, {
      width: 1.1,
      height: 20,
      fontSize: 13,
    });
  });

  quotationEan.forEach((obj, index) => {
    let element = document.querySelector(`.qrcode-${obj.ean}-${index}`);

    var qrcode = new QRCode(element, {
      text: `https://www.phco.my/filterSearch?adv=false&cid=0&mid=0&vid=0&q=${obj.ean}&sid=false&isc=true&orderBy=11`,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.L,
    });
  });

  deletePriceTag();
}

function renderFirebaseToQuotationTable() {
  const quotationTbody = document.getElementById("quotation-tbody");
  quotationTbody.innerHTML = "";
}

function renderDataToQuotationTable() {
  const quotationTbody = document.getElementById("quotation-tbody");
  quotationTbody.innerHTML = "";

  quotationEan.forEach((obj, index) => {
    let img = `https://www.phco.my/images/thumbs/products/${obj.ean}/0.jpg`;

    const quotationTbody = `
    <tr id="quotation-tbody-tr">
    <td id="quotation-delete-${index}" class="delete-button"  style='text-align:center; vertical-align:middle;'><span class="glyphicon glyphicon-remove-sign glyphicon-remove-sign-quotation" aria-hidden="true"></span></td>

    <td id="quotation-ean" style='text-align:center; vertical-align:middle;'>
      <div>${obj.ean}</div>
      <svg id="quotation-${obj.ean}-${index}"></svg>
    </td>
    <td id="quotation-name" style="width: 200px;max-width: 200px;;text-align:left; vertical-align:middle;">${obj.name}</td>
    <td style='text-align:center; vertical-align:middle'>
    <img id="${obj.ean}" src=${img} alt="IMAGE" width="70px" height="70px" onerror="this.onerror=null; this.src='https://icon-library.com/images/not-found-icon/not-found-icon-24.jpg'">
    </td>
    <td style='text-align:center; vertical-align:middle;padding-left: 30px;padding-right: 0;'>
    <input class="quotation-input-number" type="number" id="quantity-${index}" name="quantity" min="1" max="100" value="${obj.value}" onkeydown="return false">
    </td>
    <td style='text-align:center; vertical-align:middle' id="unit-price-${index}">${obj.price}</td>
    <td style='text-align:center; vertical-align:middle' id="price-${index}"></td>

    </tr>
    `;

    document
      .getElementById("quotation-tbody")
      .insertAdjacentHTML("beforeend", quotationTbody);
  });

  calculateQuotation2();

  deleteButton();

  quotationEan.forEach((obj, index) => {
    let element = document.getElementById(`quotation-${obj.ean}-${index}`);
    JsBarcode(element, obj.ean, {
      width: 1,
      height: 15,
      displayValue: false,
    });
  });

  setTimeout(() => {
    runReplaceImage();
  }, 1000);
}

function calculateQuotation() {
  for (let i = 0; i < quotationEan.length; i++) {
    let qty = document.getElementById(`quantity-${i}`);
    let price = parseFloat(
      document.getElementById(`unit-price-${i}`).innerHTML.replace(/\,/g, "")
    );
    let amount = document.getElementById(`price-${i}`);

    amount.innerHTML = (qty.value * price).toFixed(2);

    qty.addEventListener("click", () => {
      playClickSound();
      quotationEan[i].value = qty.value;

      calculateQuotation();
    });
  }

  let TOTAL = 0;

  for (let n = 0; n < quotationEan.length; n++) {
    let AMOUNT = document.getElementById(`price-${n}`);

    TOTAL = Number(AMOUNT.innerHTML) + TOTAL;
  }

  totalAmount = TOTAL.toFixed(2);
  document.getElementById("total-amount").innerHTML = "";
  document
    .getElementById("total-amount")
    .insertAdjacentHTML("afterbegin", totalAmount);
}

function calculateQuotation2() {
  for (let i = 0; i < quotationEan.length; i++) {
    let qty = document.getElementById(`quantity-${i}`);
    let price = parseFloat(
      document.getElementById(`unit-price-${i}`).innerHTML.replace(/\,/g, "")
    );
    let amount = document.getElementById(`price-${i}`);

    amount.innerHTML = (qty.value * price).toFixed(2);

    qty.addEventListener("click", () => {
      playClickSound();
      quotationEan[i].value = qty.value;

      setTimeout(() => {
        calculateQuotation2();
      }, 1000);
    });
  }

  let TOTAL = 0;

  for (let n = 0; n < quotationEan.length; n++) {
    let AMOUNT = document.getElementById(`price-${n}`);

    TOTAL = Number(AMOUNT.innerHTML) + TOTAL;
  }

  totalAmount = TOTAL.toFixed(2);
  document.getElementById("total-amount").innerHTML = "";
  document
    .getElementById("total-amount")
    .insertAdjacentHTML("afterbegin", totalAmount);
}

function offOriginalNavAndTable() {
  document.querySelector("nav").style.display = "none";
  document.getElementById("myTable").style.display = "none";
}

function onOriginalNavAndTable() {
  document.querySelector("nav").style.display = "block";
  document.getElementById("myTable").style.display = "table";
}

function offQuotation() {
  const quotation = document.getElementById("quotation-container");
  quotation.style.display = "none";
}

function offPriceTagPage() {
  const priceTagPage = document.getElementById("price-tag-container");
  priceTagPage.style.display = "none";
}

function onPriceTagPage() {
  bodyPriceTagToCenter();
  const priceTagPage = document.getElementById("price-tag-container");
  priceTagPage.style.display = "block";
}

function onQuotation() {
  const quotation = document.getElementById("quotation-container");
  quotation.style.display = "block";
}

function quotationAddButton() {
  const addButton = document.getElementById("quotation-button-add");

  addButton.addEventListener("click", () => {
    playClickSound();
    offQuotation();
    onOriginalNavAndTable();
  });
}

function priceTagAddButton() {
  const addButton = document.getElementById("price-tag-button-add");

  addButton.addEventListener("click", () => {
    playClickSound();
    disableBodyPriceTagToCenter();
    offPriceTagPage();
    onOriginalNavAndTable();
    backToPriceTagPage();
  });
}

function deletePriceTag() {
  for (let i = 0; i < quotationEan.length; i++) {
    document
      .getElementById(`price-tag-delete-${i}`)
      .addEventListener("click", () => {
        playClickSound();
        quotationEan.splice(i, 1);

        // console.log(quotationEan);

        renderDataToPriceTagPage();
      });
  }
}

function deleteItemQuotation() {
  //quotationEan
  //quotation-delete-${index}
  for (let i = 0; i < quotationEan.length; i++) {
    document
      .getElementById(`quotation-delete-${i}`)
      .addEventListener("click", () => {
        // quotationEan = quotationEan.filter(obj => obj !== quotationEan[i]);
        playClickSound();
        quotationEan.splice(i, 1);
        console.log(quotationEan);

        renderDataToQuotationTable();
      });
  }
}

function deleteButton() {
  // const allEan = document.querySelectorAll('#quotation-ean');
  // const deleteThead = document.getElementById('delete-thead-quotation');
  // const deleteButton = document.querySelectorAll('.delete-button');

  deleteItemQuotation();
}

function firebasePopUp() {
  const modal2 = document.getElementById("myModal-2");
  const btn = document.getElementById("quotation-button-upload");
  const span = document.getElementsByClassName("close-pop")[0];
  const body = document.querySelector("body");

  btn.onclick = function () {
    playClickSound();
    modal2.style.display = "block";
  };

  span.onclick = function () {
    playClickSound();
    modal2.style.display = "none";
  };

  quotationEanAddToFirebase();
}

function quotationPopUp() {
  const modal = document.getElementById("myModal");

  const btn = document.getElementById("quotation-button-custom");

  const span = document.getElementsByClassName("close-pop")[1];

  btn.onclick = function () {
    playClickSound();
    modal.style.display = "block";
  };

  span.onclick = function () {
    playClickSound();
    modal.style.display = "none";
  };

  // window.onclick = function (event) {
  //   if (event.target == modal) {
  //     modal.style.display = "none";
  //   }
  // }
}

function shrink() {
  const popUpInputName = document.querySelector(".popup-input-name");
  const popUpInputPrice = document.querySelector(".popup-input-price");
  const labelName = document.querySelector(".label-name");
  const labelPrice = document.querySelector(".label-price");

  popUpInputName.addEventListener("change", (event) => {
    if (event.target.value !== "") {
      labelName.classList.add("shrink-name");
    } else {
      labelName.classList.remove("shrink-name");
    }
  });

  popUpInputPrice.addEventListener("change", (event) => {
    if (event.target.value !== "") {
      labelPrice.classList.add("shrink-price");
    } else {
      labelPrice.classList.remove("shrink-price");
    }
  });
}

function shrinkFile() {
  const uploadInput = document.getElementById("upload-input");
  const labelFile = document.querySelector(".label-file-name");

  uploadInput.addEventListener("change", (event) => {
    if (event.target.value !== "") {
      console.log("change");
      labelFile.classList.add("shrink-name");
    } else {
      labelFile.classList.remove("shrink-name");
    }
  });
}

function popUpAddItem() {
  const modal = document.getElementById("myModal");
  const add = document.querySelector(".popup-add");
  let popUpName = document.querySelector(".popup-input-name");
  let popUpPrice = document.querySelector(".popup-input-price");
  const labelName = document.querySelector(".label-name");
  const labelPrice = document.querySelector(".label-price");

  add.addEventListener("click", (event) => {
    event.preventDefault();
    playClickSound();
    console.log(typeof popUpPrice.value);

    if (popUpName.value == "" || popUpPrice.value == "") {
      console.log("empty name");
      modal.style.display = "none";
      return;
    }

    quotationEan.push({
      ean: "Null",
      name: popUpName.value,
      price: Number(popUpPrice.value).toFixed(2),
      value: 1,
    });

    popUpName.value = "";
    popUpPrice.value = "";
    labelName.classList.remove("shrink-name");
    labelPrice.classList.remove("shrink-price");

    modal.style.display = "none";

    renderDataToQuotationTable();
  });
}

function blockGoToBack() {
  history.pushState(null, document.title, location.href);
  window.addEventListener("popstate", function (event) {
    history.pushState(null, document.title, location.href);
  });
}

function autoClickHighLight(branch) {
  document.getElementById(branch).click();
}

function replaceErrorImage(num) {
  const allImg = document.querySelectorAll("img");
  const errorLink =
    "https://icon-library.com/images/not-found-icon/not-found-icon-24.jpg";

  allImg.forEach((tag) => {
    let tagSrc = tag.getAttribute("src");
    let tagId = tag.getAttribute("id");

    if (tagSrc === errorLink) {
      let img = new Image();
      img.src = `https://www.phco.my/images/thumbs/products/${tagId}/${num}.jpg`;

      img.onload = () => {
        tag.setAttribute("src", img.src);
      };
    }
  });
}

function runReplaceImage() {
  for (let n = 9; n > 1; n--) {
    replaceErrorImage(n);
  }
}

function eyeOnClick() {
  const htmlEyeSaver = `
  <div id="screen-shader" style="            transition: opacity 0.1s ease 0s;             z-index: 2147483647;            margin: 0;             border-radius: 0;             padding: 0;             background: #939393 !important;             pointer-events: none;             position: fixed;             top: -10%;             right: -10%;             width: 120%;             height: 120%;             opacity: 0.2000;            mix-blend-mode: multiply;             display: none;        "></div>
  `;

  document.querySelector("body").insertAdjacentHTML("afterend", htmlEyeSaver);

  const eye = document.getElementById("eye-saver");

  eye.addEventListener("click", () => {
    playClickSound();
    let eyeClass = eye.getAttribute("class");
    let screenShader = document.getElementById("screen-shader");

    eye.classList.toggle("glyphicon-eye-open");
    eye.classList.toggle("glyphicon-eye-close");

    if (eyeClass === "glyphicon glyphicon-eye-open") {
      screenShader.style.display = "block";
    } else {
      screenShader.style.display = "none";
    }
  });
}

function clickSaveToFirebase() {
  const btnSave = document.getElementById("save");

  btnSave.addEventListener("click", () => {
    firebasePopUp();
  });
}

function removeFirebaseFile() {
  const removeButton = document.querySelectorAll(".delete-firebase-data");

  removeButton.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      playClickSound();
      event.stopPropagation();
      let objRemove = {
        ID: event.target.id,
      };

      chrome.runtime.sendMessage({
        command: "remove",
        data: {
          remove: objRemove,
        },
      });

      setTimeout(() => {
        fetchFirebaseToHistoryList();
      }, 500);
    });
  });
}

function quotationEanAddToFirebase() {
  const inputUpload = document.querySelector("#upload-input");
  const today = new Date();
  const todayString = today.toString().split(" ");
  const currentTime = `${todayString[0]} ${todayString[1]} ${todayString[2]} ${todayString[3]} ${todayString[4]}`;
  const firebaseModal = document.getElementById("myModal-2");

  const timeToNum = new Date().getTime();

  // const saveBtn = document.getElementById('save');

  document.getElementById("save-to-firebase").addEventListener("click", () => {
    playClickSound();
    console.log(quotationEan.length);
    if (quotationEan.length > 0 && inputUpload.value !== "") {
      chrome.runtime.sendMessage({
        command: "post",
        data: {
          quotationEan,
          date: currentTime,
          timeNum: timeToNum,
          fileName: inputUpload.value,
        },
      });
      inputUpload.value = "";
      firebaseModal.style.display = "none";
      alert("Saved Successfully");
    } else {
      inputUpload.value = "";
      firebaseModal.style.display = "none";
      alert("Not Saved Yet");
    }
  });

  // saveBtn.addEventListener('click', () => {
  //   chrome.runtime.sendMessage({
  //     command: 'post',
  //     data: {
  //       quotationEan,
  //       fileName: inputUpload.value,
  //       date: currentTime
  //     } });
  // })
}

function clickHistory() {
  const quotationContainer = document.getElementById("quotation-container");
  const buttonHistory = document.getElementById("quotation-button-history");

  buttonHistory.onclick = () => {
    playClickSound();
    offQuotation();
    renderHistoryPage();
  };
}

function renderHistoryPage() {
  const body = document.querySelector("body");

  let homePage = `
  <div id='history-container'>
  <div id='history-button-group'>



      <div class="glyphicon glyphicon glyphicon glyphicon-home quotation-button-icon icon-cursor quotation-button-padding"
          id="back-to-home" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>

  </div>
  <table class="table table-hover">
      <thead>
          <tr class="info">
              <th class="quotaion-th" style="text-align: center;" id="history-file-name">FILE NAME</th>

              <th class="quotaion-th" style="text-align: center;" id="history-file-date">DATE</th>

              <th class="quotaion-th" style="text-align: center;" id="history-file-remove">REMOVE</th>
          </tr>
      </thead>
      <tbody id='table-history-tbody'>
                
      </tbody>
  </table>
</div>
  `;

  body.insertAdjacentHTML("afterbegin", homePage);
  // BackToQuotation();
  historyPageHomeButtion();
  fetchFirebaseToHistoryList();
}

function historyPageHomeButtion() {
  const homeButton = document.getElementById("back-to-home");

  homeButton.onclick = () => {
    playClickSound();
    location.reload();
  };
}

function offHistoryPage() {
  const historyList = document.getElementById("history-container");
  historyList.style.display = "none";
}

function onHistoryPage() {
  const historyList = document.getElementById("history-container");
  historyList.style.display = "flex";
}

function offFirebaseQuotation() {
  const firebaseQuotation = document.getElementById("quotation-container");
  firebaseQuotation.style.display = "none";
}

function onFirebaseQuotation() {
  const firebaseQuotation = document.getElementById("quotation-container");
  firebaseQuotation.style.display = "flex";
}

function backToFirebaseList() {
  const back = document.getElementById("back-to-quotation");

  back.addEventListener("click", () => {
    playClickSound();
    offFirebaseQuotation();
    onHistoryPage();
  });
}

function fetchFirebaseToHistoryList() {
  const tbodyHistory = document.getElementById("table-history-tbody");
  const trHistory = (ID, FILENAME, DATE) => `
              <tr id=${ID} class='tr-history'>
                <td style="text-align:center; vertical-align:middle" >${FILENAME}</td>
                <td style="text-align:center; vertical-align:middle" >${DATE}</td>
                <td style="text-align:center; vertical-align:middle" >
                <div id=${ID} class="glyphicon glyphicon glyphicon-remove quotation-button-icon icon-cursor quotation-button-padding delete-firebase-data"  aria-hidden="true"></div>
  
                </td>
              </tr>
          `;

  tbodyHistory.innerHTML = "";

  chrome.runtime.sendMessage({ command: "fetch" }, (response) => {
    console.log(response.data);
    response.data.forEach((item) => console.log(item.data, item));

    response.data.forEach((item) => {
      tbodyHistory.insertAdjacentHTML(
        "afterbegin",
        trHistory(
          item.id,
          item.quotationData.data.fileName,
          item.quotationData.data.date
        )
      );
    });
  });

  setTimeout(() => {
    removeFirebaseFile();
    clickCloudFile();
  }, 1000);
}

function clickCloudFile() {
  const trHistory = document.querySelectorAll(".tr-history");

  trHistory.forEach((fileName) => {
    fileName.addEventListener("click", (event) => {
      playClickSound();
      let id = event.target.parentElement.getAttribute("id");
      console.log(id);

      chrome.runtime.sendMessage({
        command: "send-id",
        data: id,
      });

      offHistoryPage();

      setTimeout(() => {
        catchFirebaseIdData();
      }, 2000);
    });
  });
}

function catchFirebaseIdData() {
  chrome.runtime.sendMessage({ command: "id-data" }, (response) => {
    console.log(response.data.dataItem);
    let date = response.data.dataItem.date;
    let quotationData = response.data.dataItem.quotationEan;
    let arrayPrice = [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    for (let i = 0; i < quotationData.length; i++) {
      let quotationData = response.data.dataItem.quotationEan;
      let price = parseFloat(
        quotationData[i].price.replace(/\,/g, "") * quotationData[i].value
      );
      arrayPrice.push(price);
    }

    console.log(arrayPrice);

    let totalAmount = arrayPrice.reduce(reducer, 0);
    console.log(totalAmount);

    firebaseQuotationTable(date, totalAmount);
    backToFirebaseList();
    renderFirebaseDataToQuotationTable(quotationData);
    // return response.data.dataItem;
  });
}

function firebaseQuotationTable(DATE, AMOUNT = 0) {
  const body = document.querySelector("body");

  let table = `
   
  <div id="quotation-container">
  <div id="quotaion-date">

    <div>${DATE}</div>
  </div>
<table class="table table-hover " id="quotation-table">
<thead>
<tr class="info">

  <th class="quotaion-th" style="text-align: center;" id="ean-quotation">EAN</th>
  <th class="quotaion-th" style="text-align: center;" id="description-quotation">DESCRIPTION</th>
  <th class="quotaion-th" style="text-align: center;" id="image-quotation">IMAGE</th>
  <th class="quotaion-th" style="text-align: center;" id="quantity-quotation">QUANTITY</th>
  <th class="quotaion-th" style="text-align: center;" id="unit-price-quotation">PRICE</th>
  <th class="quotaion-th" style="text-align: center;" id="price-quotation">AMOUNT</th>

</tr>
</thead>
<tbody id="quotation-tbody">

</tbody>
</table>

<hr>

<div id="quotation-button-container" class="container-total">
  <h3 id="total-amount-title">TOTAL AMOUNT</h3>
  <h3 id="total-amount-rm">RM<span id="total-amount">${AMOUNT.toFixed(
    2
  )}</span></h3>
</div>


  <div  class="all-quotation-button">

    <div class="glyphicon glyphicon glyphicon-chevron-left quotation-button-icon icon-cursor quotation-button-padding" id="back-to-quotation" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>


    <div class="glyphicon glyphicon-print quotation-button-icon icon-cursor quotation-button-padding" id="quotation-button-Print" style="font-size: 5rem; padding: 20px;" aria-hidden="true"></div>


    <!--
    <div class="tooltiptext tooltiptext-quotation-button-print">PRINT</div>
    -->
  </div>
 
</div>

  `;

  body.insertAdjacentHTML("afterbegin", table);
}

function renderFirebaseDataToQuotationTable(objData) {
  const quotationTbody = document.getElementById("quotation-tbody");
  quotationTbody.innerHTML = "";

  objData.forEach((obj, index) => {
    // let price = parseFloat(document.getElementById(`unit-price-${i}`).innerHTML.replace(/\,/g, ''));

    let img = `https://www.phco.my/images/thumbs/products/${obj.ean}/0.jpg`;

    let amount = obj.value * parseFloat(obj.price.replace(/\,/g, ""));

    const quotationTbody = `
    <tr id="quotation-tbody-tr">

    <td id="quotation-ean" style='text-align:center; vertical-align:middle;'>
      <div>${obj.ean}</div>
      <svg id="quotation-${obj.ean}-${index}"></svg>
    </td>
    <td id="quotation-name" style="width: 200px;max-width: 200px;;text-align:left; vertical-align:middle;">${
      obj.name
    }</td>
    <td style='text-align:center; vertical-align:middle'>
    <img id="${
      obj.ean
    }" src=${img} alt="IMAGE" width="70px" height="70px" onerror="this.onerror=null; this.src='https://icon-library.com/images/not-found-icon/not-found-icon-24.jpg'">
    </td>
    <td style='text-align:center; vertical-align:middle;padding-left: 30px;padding-right: 0;'>
      ${obj.value}
    </td>
    <td style='text-align:center; vertical-align:middle' id="unit-price-${index}">${
      obj.price
    }</td>
    <td style='text-align:center; vertical-align:middle' id="price-${index}">${amount.toFixed(
      2
    )}</td>

    </tr>
    `;

    document
      .getElementById("quotation-tbody")
      .insertAdjacentHTML("beforeend", quotationTbody);
  });

  // calculateQuotation2();
  PrintButton();
  // deleteButton();

  objData.forEach((obj, index) => {
    let element = document.getElementById(`quotation-${obj.ean}-${index}`);
    JsBarcode(element, obj.ean, {
      width: 1,
      height: 15,
      displayValue: false,
    });
  });

  setTimeout(() => {
    runReplaceImage();
  }, 1000);
}

function applyStyles() {
  document.body.style.padding = "35px 20px";
  document.body.style.textAlign = "center";
  document.body.style.fontWeight = "bolder";

  // var tds = document.querySelectorAll("td");
  // tds.forEach(function (td) {
  //   // td.style.textAlign = 'center';
  //   td.style.fontSize = "2rem";
  // });

  // var ths = document.querySelectorAll("th");
  // ths.forEach(function (th) {
  //   th.style.fontSize = "2rem";
  // });
}

function runV1() {
  jsbarcodeLink();
  moveOriginalBody();
  searchButtonOnClick();
  switchNumberBigToSmallOrSmallToBig();
  filterInputOnChangeHandle();
  clickHeadAddDecorationUnderline();
  googleFont();
  clickMoveToTop();
  clickQuotation();
  blockGoToBack();
  clickPriceTag();
  autoClickHighLight("p05");
  eyeOnClick();
  clickThumbsUp();

  setInterval(() => {
    removeBugOldHeader();
  }, 3000);
  applyStyles();
}

function runV2() {
  moveOriginalBody();
  loadIframe("https://stockbalx.vercel.app/");
}


// function insertStickyButtons() {
//   // 创建容器元素
//   var container = document.createElement("div");
//   container.id = "stickyButtonContainer";
//   container.style.position = "fixed";
//   container.style.bottom = "20px";
//   container.style.right = "20px";
//   container.style.zIndex = "9999";
//   container.style.display = "flex";
//   container.style.gap = "10px"; // 两个按钮之间的间距

//   // 创建 V1 按钮
//   var buttonV1 = document.createElement("button");
//   buttonV1.id = "stickyButtonV1";
//   buttonV1.className = "btn btn-primary";
//   buttonV1.innerText = "V1";
//   buttonV1.addEventListener("click", runV1);

//   // 创建 V2 按钮
//   var buttonV2 = document.createElement("button");
//   buttonV2.id = "stickyButtonV2";
//   buttonV2.className = "btn btn-success"; // 给 V2 一个绿色的样式，也可以用 btn-primary
//   buttonV2.innerText = "V2";
//   buttonV2.addEventListener("click", runV2);

//   // 把两个按钮加到容器里
//   container.appendChild(buttonV1);
//   container.appendChild(buttonV2);

//   // 把容器加到页面 body 上
//   document.body.appendChild(container);
// }
function insertStickyButtons() {
  // 创建容器元素
  var container = document.createElement("div");
  container.id = "stickyButtonContainer";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.gap = "10px";

  // 创建 V1 按钮
  // var buttonV1 = document.createElement("button");
  // buttonV1.id = "stickyButtonV1";
  // buttonV1.className = "btn btn-primary";
  // buttonV1.innerText = "V1";
  // buttonV1.addEventListener("click", runV1);

  // 创建 V2 按钮
  var buttonV2 = document.createElement("button");
  buttonV2.id = "stickyButtonV2";
  buttonV2.innerText = "Extensions";
  buttonV2.addEventListener("click", runV2);

  // 现代圆角模糊样式
  Object.assign(buttonV2.style, {
    padding: "10px 20px",
    borderRadius: "999px", // 超圆角
    background: "rgba(255, 255, 255, 0.2)", // 半透明
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "#323232",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    letterSpacing: "2px",
  });

  // 悬停效果
  buttonV2.addEventListener("mouseenter", function () {
    buttonV2.style.background = "rgba(255, 255, 255, 0.3)";
  });
  buttonV2.addEventListener("mouseleave", function () {
    buttonV2.style.background = "rgba(255, 255, 255, 0.2)";
  });

  // 添加按钮到容器
  // container.appendChild(buttonV1);
  container.appendChild(buttonV2);

  // 添加容器到页面
  document.body.appendChild(container);
}
insertStickyButtons();
//Get the button
var mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

document.querySelectorAll("#quantity").forEach((tag) => {
  console.log(tag.value);
});

function showThumbsUp() {
  let idThumbsUp = document.getElementById("thumbs-up");
  idThumbsUp.classList.remove("thumbs-up-display");
}

function hiddenThumbsUp() {
  let idThumbsUp = document.getElementById("thumbs-up");
  idThumbsUp.classList.add("thumbs-up-display");
}

function clickThumbsUp() {
  let idThumbsUp = document.getElementById("thumbs-up");
  idThumbsUp.addEventListener("click", () => {
    playClickSound();
    hiddenThumbsUp();
    voucherPrice();

    // withPelwPrice();
  });
}

//return to arr pelw and price [{pelw: 'PEWL000', price: 123}, ...]
async function fetchDataPelw() {
  try {
    const spinner = document.getElementById("spinner");

    spinner.removeAttribute("hidden");

    const response = await fetch(
      `http://stockbal.phcocap.com/default4.aspx?s=1&c=pelw&q=0`
    );
    const html = await response.text();

    spinner.setAttribute("hidden", "");

    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(html, "text/html");
    const tbody = htmlDocument.querySelector("tbody");

    // checkOriginalPageAbnormal(htmlDocument);

    // console.log(pelwPriceToArr(tbody)); // ALL PELW PRICE
    return pelwPriceToArr(tbody);
  } catch (error) {
    console.log(error);
    playAlertSound();
    // alertSound.play();
    alert("Pelw Not Found...");
  }
}

function pelwPriceToArr(tbody) {
  let result = [];
  let arrPelw = [];
  let arrPrice = [];

  //arr = [{pelw: 'PELW8003', price: '999'}]

  tbody.querySelectorAll(".webstore").forEach((tag, i) => {
    arrPelw.push(tag.innerHTML);
  });
  // tbody.querySelectorAll('tbody tr td:nth-child(2)').forEach(tag => obj.name.push(tag.innerHTML));
  tbody
    .querySelectorAll("tbody tr td:nth-child(7)")
    .forEach((tag, i) => arrPrice.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(8)').forEach(tag => obj.qty.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(9)').forEach(tag => obj.git.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(10)').forEach(tag => obj.p00.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(11)').forEach(tag => obj.p03.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(12)').forEach(tag => obj.p05.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(13)').forEach(tag => obj.p06.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(14)').forEach(tag => obj.phq.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(15)').forEach(tag => obj.ppj.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(16)').forEach(tag => obj.ws1.push(tag.innerHTML));
  // tbody.querySelectorAll('tbody tr td:nth-child(17)').forEach(tag => obj.wxr.push(tag.innerHTML));
  for (let y = 0; arrPelw.length > y; y++) {
    let obj = {
      pelw: arrPelw[y],
      price: Number(arrPrice[y].replace(/,/g, "")),
    };

    result.push(obj);
  }

  return result;
}

//return to [{location: 27, pelw: 'PELW4003', price: 999}]
function findPelwLocation() {
  let result = [];
  let allName = document.querySelectorAll("#list-ean-name");
  let allPrice = document.querySelectorAll("#list-price");

  allName.forEach((tag, i) => {
    let findP = tag.innerText.includes("[PELW");
    let find5years = tag.innerText.includes("5YEARS");
    let PELW3003 = tag.innerText.includes("PELW3003");
    let PELW4003 = tag.innerText.includes("PELW4003");
    let PELW2001 = tag.innerText.includes("PELW2001");
    let PELW3002 = tag.innerText.includes("PELW3002");
    let PELW6003 = tag.innerText.includes("PELW6003");
    let PELW4002 = tag.innerText.includes("PELW4002");
    let PELW3001 = tag.innerText.includes("PELW3001");
    let PELW8003 = tag.innerText.includes("PELW8003");
    let PELW4001 = tag.innerText.includes("PELW4001");
    let PELW6002 = tag.innerText.includes("PELW6002");
    let PELW8002 = tag.innerText.includes("PELW8002");
    let PELW8001 = tag.innerText.includes("PELW8001");
    let PELW2002 = tag.innerText.includes("PELW2002");

    if (findP === true && find5years === false) {
      if (PELW3003) {
        result.push({
          location: i,
          pelw: "PELW3003",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW4003) {
        result.push({
          location: i,
          pelw: "PELW4003",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW2001) {
        result.push({
          location: i,
          pelw: "PELW2001",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW3002) {
        result.push({
          location: i,
          pelw: "PELW3002",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW6003) {
        result.push({
          location: i,
          pelw: "PELW6003",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW4002) {
        result.push({
          location: i,
          pelw: "PELW4002",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW3001) {
        result.push({
          location: i,
          pelw: "PELW3001",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW8003) {
        result.push({
          location: i,
          pelw: "PELW8003",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW4001) {
        result.push({
          location: i,
          pelw: "PELW4001",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW6002) {
        result.push({
          location: i,
          pelw: "PELW6002",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW8002) {
        result.push({
          location: i,
          pelw: "PELW8002",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW8001) {
        result.push({
          location: i,
          pelw: "PELW8001",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
      if (PELW2002) {
        result.push({
          location: i,
          pelw: "PELW2002",
          price: Number(allPrice[i].innerText.replace(/,/g, "")),
        });
        return;
      }
    }
  });
  // console.log(result) // ADD PELW PRICE
  return result;
}

async function withPelwPrice() {
  try {
    let pelwPrice = await fetchDataPelw(); //return to arr pelw and price [{pelw: 'PEWL000', price: 123}, ...]
    let oriPrice = findPelwLocation(); //return to [{location: 27, pelw: 'PELW4003', price: 999}] // bug price: NaN
    let pelw = [];
    let result = [];

    oriPrice.forEach((obj1, i) => {
      let pelwArr = pelwPrice.find((obj2) => obj1.pelw === obj2.pelw);

      if (pelwArr) {
        pelw.push(pelwArr.price);
      } else {
        console.log(pelwArr); // pelwArr = undefined
      }
    });

    oriPrice.forEach((obj, i) => {
      obj.price = obj.price + pelw[i];
      result.push(obj);
    });

    console.log(pelwPrice, "pelwPrice");
    console.log(oriPrice, "oriPrice");
    console.log(pelw, "pelw");
    console.log(result, "result");

    updatePelwPrice(result);
  } catch (err) {
    let errMessage = {
      message: "withPelwPrice failed.",
      errors_message: err,
    };
    console.log(errMessage);
  }
}

function updatePelwPrice(arr) {
  // let allPrice = document.querySelectorAll('#list-price');

  arr.forEach((obj) => {
    let pelwPrice = obj.price.toFixed(2);
    document.querySelectorAll("#list-price")[obj.location].innerHTML = `
    ${pelwPrice}<div style='font-size: 1rem;color: red;'>5 years warranty *</div>`;

    document
      .querySelectorAll("#list-price")
      [obj.location].classList.add("pelw-color");
  });
}

// clickThumbsUp();

function voucherPrice() {
  let allPrice = document.querySelectorAll("#list-price");
  let allName = document.querySelectorAll("#list-ean-name");
  allName.forEach((name, i) => {
    let nameHtml = name.textContent;

    // Regular expression to search for '5YEARS'
    let regex = /5YEARS/;

    if (regex.test(nameHtml)) {
      let pcPrice = allPrice[i].textContent;

      // Remove commas from the string
      let numberWithoutCommas = pcPrice.replace(/,/g, "");

      // Convert the string to a number
      let number = parseFloat(numberWithoutCommas) + 50;

      // console.log(number); // Output: 99999.00

      // Convert the number to a string with commas and 2 decimal places
      let formattedNumber = number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      console.log(formattedNumber); // Output: "99,999.00"
      // Wrap the formatted number in a <span> with italic style

      // allPrice[i].innerHTML = `${formattedNumber}`;
      allPrice[i].style.fontStyle = "italic";
      allPrice[i].textContent = formattedNumber;
    }
  });
}

//5years icon design : click search, show 5years icon, when 5year get click, icon hidden
//css style same like other icon

//get PELW price => to a new Array [{pelw: '', price: ''}]
//http://stockbal.phcocap.com/default4.aspx?s=1&c=pelw&q=3
//from the link get the pelw name and price, price must change to number(string replace to no comma)

//find PELW from table but not include 5YEARS
//create a Array, inside obj = {location: '', price: '', pelw: ''}
//price string replace comma to '', then change to number update to array and price add selected pelw price
//after update the array, array will be [{location: '', price: pelw + price, pelw}]

//when click 5years icon update the table

//update the new Array include pelw price to price list(xxxx = xxxx(pelw))

//reset array

//stockbal extension 6.5 highlight bundle text

function findBundleLocation() {
  let result = [];
  let allName = document.querySelectorAll("#list-ean-name");

  allName.forEach((tag, i) => {
    let findBundle = tag.innerText.includes("BUNDLE");

    if (findBundle) {
      result.push({ location: i, text: tag.innerHTML });
    }
  });
  // console.log(result, 'show bundle text and location') // show bundle text and location
  return result; //{location: x, text: 'sdfsdf'}
}

function highLightText(arr) {
  let afterHighlight = [];

  arr.forEach((obj) => {
    obj.text = obj.text.replace(
      "BUNDLE",
      '<span style="color: #f44336;">BUNDLE</span>'
    );
    afterHighlight.push(obj);
  });

  // console.log(afterHighlight, 'afterHighlight');

  return afterHighlight;
}

function updateHighlight(arr) {
  // let allPrice = document.querySelectorAll('#list-price');

  arr.forEach((obj) => {
    // let pelwPrice = obj.price.toFixed(2);
    // document.querySelectorAll('#list-price')[obj.location].innerHTML = `
    // ${pelwPrice}<div style='font-size: 1rem;color: red;'>5 years warranty *</div>`;
    // document.querySelectorAll('#list-price')[obj.location].classList.add('pelw-color')
    document.querySelectorAll("#list-ean-name")[obj.location].innerHTML =
      obj.text;
  });
}

// (DS) AND (SM) HIGHLIGHT

function findSMLocation() {
  let result = [];
  let allName = document.querySelectorAll("#list-ean-name");

  allName.forEach((tag, i) => {
    let findSM = tag.innerText.includes("(SM)");

    if (findSM) {
      result.push({ location: i, text: tag.innerHTML });
    }
  });
  // console.log(result, 'show bundle text and location') // show bundle text and location
  return result; //{location: x, text: 'sdfsdf'}
}

function highLightTextSM(arr) {
  let afterHighlight = [];

  arr.forEach((obj) => {
    obj.text = obj.text.replace(
      "(SM)",
      '<span style="color: #f44336;">(SM)</span>'
    );
    afterHighlight.push(obj);
  });

  // console.log(afterHighlight, 'afterHighlight');

  return afterHighlight;
}

function findDSLocation() {
  let result = [];
  let allName = document.querySelectorAll("#list-ean-name");

  allName.forEach((tag, i) => {
    let findDS = tag.innerText.includes("(DS)");

    if (findDS) {
      result.push({ location: i, text: tag.innerHTML });
    }
  });
  // console.log(result, 'show bundle text and location') // show bundle text and location
  return result; //{location: x, text: 'sdfsdf'}
}

function highLightTextDS(arr) {
  let afterHighlight = [];

  arr.forEach((obj) => {
    obj.text = obj.text.replace(
      "(DS)",
      '<span style="color: #f44336;">(DS)</span>'
    );
    afterHighlight.push(obj);
  });

  // console.log(afterHighlight, 'afterHighlight');

  return afterHighlight;
}

// 5YEARS HIGHLIGHT

function find5YLocation() {
  let result = [];
  let allName = document.querySelectorAll("#list-ean-name");

  allName.forEach((tag, i) => {
    let find5Y = tag.innerText.includes("5YEARS");

    if (find5Y) {
      result.push({ location: i, text: tag.innerHTML });
    }
  });
  // console.log(result, 'show bundle text and location') // show bundle text and location
  return result; //{location: x, text: 'sdfsdf'}
}

function highLightText5Y(arr) {
  let afterHighlight = [];

  arr.forEach((obj) => {
    obj.text = obj.text.replace(
      "5YEARS",
      '<span style="color: #f44336;">5YEARS</span>'
    );
    afterHighlight.push(obj);
  });

  // console.log(afterHighlight, 'afterHighlight');

  return afterHighlight;
}

function highLightBundleText() {
  let arrNotYetHeighligh = findBundleLocation();
  updateHighlight(highLightText(arrNotYetHeighligh));

  let arrSMNotYetHeighligh = findSMLocation();
  updateHighlight(highLightTextSM(arrSMNotYetHeighligh));

  let arrDSNotYetHeighligh = findDSLocation();
  updateHighlight(highLightTextDS(arrDSNotYetHeighligh));

  let arr5YNotYetHeighligh = find5YLocation();
  updateHighlight(highLightText5Y(arr5YNotYetHeighligh));
}

function loadIframe(url, width = "100%", height = "100%") {
  // Clear the entire body content
  document.body.innerHTML = "";

  // Create the iframe element
  const iframe = document.createElement("iframe");

  // Set attributes
  iframe.src = url;
  iframe.width = width;
  iframe.height = height;
  iframe.style.border = "none";
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = width;
  iframe.style.height = height;

  // // Enhanced permissions
  // iframe.setAttribute("allow", "clipboard-write; clipboard-read");

  // Append the iframe to the body
  document.body.appendChild(iframe);

  // Add message listener for clipboard operations
  // window.addEventListener("message", (event) => {
  //   if (event.data.type === "copyToClipboard") {
  //     navigator.clipboard
  //       .writeText(event.data.text)
  //       .then(() => {
  //         iframe.contentWindow.postMessage(
  //           {
  //             type: "copySuccess",
  //             text: event.data.text,
  //           },
  //           "*"
  //         );
  //       })
  //       .catch((err) => {
  //         iframe.contentWindow.postMessage(
  //           {
  //             type: "copyError",
  //             error: err.message,
  //           },
  //           "*"
  //         );
  //       });
  //   }
  // });
}

// function clickQuotation() {
//   const quotation = document.getElementById("quotation-back-button");
//   const nav = document.querySelector("nav");
//   const tBody = document.querySelector("tbody");
//   const priceTagButton = document.getElementById("price-tag-button");

//   quotation.addEventListener("click", () => {
//     loadIframe("https://stockbalx.vercel.app/");
//     // loadIframe("http://192.168.5.118:3000/");

//     // playClickSound();
//     // quotation.classList.toggle("quotation-icon");

//     // hiddenEye();

//     // priceTagButton.style.display = "none";
//     // tBody.innerHTML = "";

//     // if (quotation.innerHTML === "") {
//     //   insertQuotationTable();
//     // }

//     // quotation.setAttribute(
//     //   "class",
//     //   "btn btn-default btn-search btn-danger quotation-to-back quotation-back"
//     // );
//     // quotation.innerHTML = "Back";
//     // quotation.setAttribute("id", "");
//     // backToQuotation();
//     // eanToButtonClass = "ean-to-button";
//   });
// }
// function clickThumbsUp() {
//   let idThumbsUp = document.getElementById("thumbs-up");
//   idThumbsUp.addEventListener("click", () => {
//     loadIframe("https://stockbalx.vercel.app/");
//     // loadIframe("http://192.168.5.118:3000/");

//     // playClickSound();
//     // hiddenThumbsUp();
//     // voucherPrice();
//   });
// }
