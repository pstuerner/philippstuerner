/* https://github.com/d3/d3-voronoi Copyright 2015 Mike Bostock */
!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports)
        : "function" == typeof define && define.amd
        ? define(["exports"], t)
        : t((e.voronoi = {}));
})(this, function (e) {
    "use strict";
    function t(e) {
        return function () {
            return e;
        };
    }
    function n(e, t, n) {
        return (e.x - n.x) * (t.y - e.y) - (e.x - t.x) * (n.y - e.y);
    }
    function i(e, t) {
        return t.angle - e.angle;
    }
    function r(e, t) {
        (this.l = e), (this.r = t), (this.a = this.b = null);
    }
    function s(e, t, n) {
        var i = new r(e, null);
        return (i.a = t), (i.b = n), D.push(i), i;
    }
    function u(e, t, n) {
        (this.edge = e), (this.site = t), (this.angle = n);
    }
    function f(e, t, n) {
        var i = e.a,
            r = e.b;
        return new u(
            e,
            t,
            n
                ? Math.atan2(n.y - t.y, n.x - t.x)
                : e.l === t
                ? Math.atan2(r.x - i.x, i.y - r.y)
                : Math.atan2(i.x - r.x, r.y - i.y)
        );
    }
    function a(e, t, n, i) {
        for (var r, u, a, l, o, c, h, y, x, v, g = B.length; g--; )
            if (((o = B[g]), o && o.prepare()))
                for (h = o.edges, y = h.length, c = 0; y > c; )
                    (v = h[c].end()),
                        (a = v.x),
                        (l = v.y),
                        (x = h[++c % y].start()),
                        (r = x.x),
                        (u = x.y),
                        (Math.abs(a - r) > I || Math.abs(l - u) > I) &&
                            (h.splice(
                                c,
                                0,
                                f(
                                    s(
                                        o.site,
                                        v,
                                        Math.abs(a - e) < I && i - l > I
                                            ? {
                                                  x: e,
                                                  y:
                                                      Math.abs(r - e) < I
                                                          ? u
                                                          : i,
                                              }
                                            : Math.abs(l - i) < I && n - a > I
                                            ? {
                                                  x:
                                                      Math.abs(u - i) < I
                                                          ? r
                                                          : n,
                                                  y: i,
                                              }
                                            : Math.abs(a - n) < I && l - t > I
                                            ? {
                                                  x: n,
                                                  y:
                                                      Math.abs(r - n) < I
                                                          ? u
                                                          : t,
                                              }
                                            : Math.abs(l - t) < I && a - e > I
                                            ? {
                                                  x:
                                                      Math.abs(u - t) < I
                                                          ? r
                                                          : e,
                                                  y: t,
                                              }
                                            : null
                                    ),
                                    o.site,
                                    null
                                )
                            ),
                            ++y);
    }
    function l(e, t, n, i, r) {
        var s,
            u = e.a,
            f = e.b,
            a = u.x,
            l = u.y,
            o = f.x,
            c = f.y,
            h = 0,
            y = 1,
            x = o - a,
            v = c - l;
        if (((s = t - a), x || !(s > 0))) {
            if (((s /= x), 0 > x)) {
                if (h > s) return;
                y > s && (y = s);
            } else if (x > 0) {
                if (s > y) return;
                s > h && (h = s);
            }
            if (((s = i - a), x || !(0 > s))) {
                if (((s /= x), 0 > x)) {
                    if (s > y) return;
                    s > h && (h = s);
                } else if (x > 0) {
                    if (h > s) return;
                    y > s && (y = s);
                }
                if (((s = n - l), v || !(s > 0))) {
                    if (((s /= v), 0 > v)) {
                        if (h > s) return;
                        y > s && (y = s);
                    } else if (v > 0) {
                        if (s > y) return;
                        s > h && (h = s);
                    }
                    if (((s = r - l), v || !(0 > s))) {
                        if (((s /= v), 0 > v)) {
                            if (s > y) return;
                            s > h && (h = s);
                        } else if (v > 0) {
                            if (h > s) return;
                            y > s && (y = s);
                        }
                        return (
                            h > 0 && (e.a = { x: a + h * x, y: l + h * v }),
                            1 > y && (e.b = { x: a + y * x, y: l + y * v }),
                            e
                        );
                    }
                }
            }
        }
    }
    function o(e, t, n, i, r) {
        var s = e.b;
        if (s) return !0;
        var u,
            f,
            a = e.a,
            l = e.l,
            o = e.r,
            c = l.x,
            h = l.y,
            y = o.x,
            x = o.y,
            v = (c + y) / 2,
            g = (h + x) / 2;
        if (x === h) {
            if (t > v || v >= i) return;
            if (c > y) {
                if (a) {
                    if (a.y >= r) return;
                } else a = { x: v, y: n };
                s = { x: v, y: r };
            } else {
                if (a) {
                    if (a.y < n) return;
                } else a = { x: v, y: r };
                s = { x: v, y: n };
            }
        } else if (((u = (c - y) / (x - h)), (f = g - u * v), -1 > u || u > 1))
            if (c > y) {
                if (a) {
                    if (a.y >= r) return;
                } else a = { x: (n - f) / u, y: n };
                s = { x: (r - f) / u, y: r };
            } else {
                if (a) {
                    if (a.y < n) return;
                } else a = { x: (r - f) / u, y: r };
                s = { x: (n - f) / u, y: n };
            }
        else if (x > h) {
            if (a) {
                if (a.x >= i) return;
            } else a = { x: t, y: u * t + f };
            s = { x: i, y: u * i + f };
        } else {
            if (a) {
                if (a.x < t) return;
            } else a = { x: i, y: u * i + f };
            s = { x: t, y: u * t + f };
        }
        return (e.a = a), (e.b = s), !0;
    }
    function c(e, t, n, i) {
        for (var r, s = D.length; s--; )
            (r = D[s]),
                (!o(r, e, t, n, i) ||
                    !l(r, e, t, n, i) ||
                    (Math.abs(r.a.x - r.b.x) < I &&
                        Math.abs(r.a.y - r.b.y) < I)) &&
                    ((r.a = r.b = null), D.splice(s, 1));
    }
    function h(e) {
        e.U = e.C = e.L = e.R = e.P = e.N = null;
    }
    function y(e) {
        var t = e.circle;
        t &&
            (t.P || (J = t.N), F.remove(t), K.push(t), h(t), (e.circle = null));
    }
    function x() {
        h(this), (this.x = this.y = this.arc = this.site = this.cy = null);
    }
    function v(e) {
        var t = e.P,
            n = e.N;
        if (t && n) {
            var i = t.site,
                r = e.site,
                s = n.site;
            if (i !== s) {
                var u = r.x,
                    f = r.y,
                    a = i.x - u,
                    l = i.y - f,
                    o = s.x - u,
                    c = s.y - f,
                    h = 2 * (a * c - l * o);
                if (!(h >= -O)) {
                    var y = a * a + l * l,
                        v = o * o + c * c,
                        g = (c * y - l * v) / h,
                        C = (a * v - o * y) / h,
                        c = C + f,
                        d = K.pop() || new x();
                    (d.arc = e),
                        (d.site = r),
                        (d.x = g + u),
                        (d.y = c + Math.sqrt(g * g + C * C)),
                        (d.cy = c),
                        (e.circle = d);
                    for (var p = null, L = F._; L; )
                        if (d.y < L.y || (d.y === L.y && d.x <= L.x)) {
                            if (!L.L) {
                                p = L.P;
                                break;
                            }
                            L = L.L;
                        } else {
                            if (!L.R) {
                                p = L;
                                break;
                            }
                            L = L.R;
                        }
                    F.insert(p, d), p || (J = d);
                }
            }
        }
    }
    function g(e, t, n, i) {
        e.a || e.b
            ? e.l === n
                ? (e.b = i)
                : (e.a = i)
            : ((e.a = i), (e.l = t), (e.r = n));
    }
    function C(e, t, n, i) {
        var s = new r(e, t);
        return (
            D.push(s),
            n && g(s, e, t, n),
            i && g(s, t, e, i),
            B[e.i].edges.push(f(s, e, t)),
            B[t.i].edges.push(f(s, t, e)),
            s
        );
    }
    function d() {
        h(this), (this.edge = this.site = this.circle = null);
    }
    function p(e) {
        var t = Q.pop() || new d();
        return (t.site = e), t;
    }
    function L(e) {
        y(e), G.remove(e), Q.push(e), h(e);
    }
    function b(e) {
        var t = e.circle,
            n = t.x,
            i = t.cy,
            r = { x: n, y: i },
            s = e.P,
            u = e.N,
            f = [e];
        L(e);
        for (
            var a = s;
            a.circle &&
            Math.abs(n - a.circle.x) < I &&
            Math.abs(i - a.circle.cy) < I;

        )
            (s = a.P), f.unshift(a), L(a), (a = s);
        f.unshift(a), y(a);
        for (
            var l = u;
            l.circle &&
            Math.abs(n - l.circle.x) < I &&
            Math.abs(i - l.circle.cy) < I;

        )
            (u = l.N), f.push(l), L(l), (l = u);
        f.push(l), y(l);
        var o,
            c = f.length;
        for (o = 1; c > o; ++o)
            (l = f[o]), (a = f[o - 1]), g(l.edge, a.site, l.site, r);
        (a = f[0]),
            (l = f[c - 1]),
            (l.edge = C(a.site, l.site, null, r)),
            v(a),
            v(l);
    }
    function R(e) {
        (this.site = e), (this.edges = []);
    }
    function M(e) {
        return (B[e.i] = new R(e));
    }
    function U(e, t) {
        var n = e.site,
            i = n.x,
            r = n.y,
            s = r - t;
        if (!s) return i;
        var u = e.P;
        if (!u) return -(1 / 0);
        n = u.site;
        var f = n.x,
            a = n.y,
            l = a - t;
        if (!l) return f;
        var o = f - i,
            c = 1 / s - 1 / l,
            h = o / l;
        return c
            ? (-h +
                  Math.sqrt(
                      h * h -
                          2 * c * ((o * o) / (-2 * l) - a + l / 2 + r - s / 2)
                  )) /
                  c +
                  i
            : (i + f) / 2;
    }
    function N(e, t) {
        var n = e.N;
        if (n) return U(n, t);
        var i = e.site;
        return i.y === t ? i.x : 1 / 0;
    }
    function P(e) {
        for (var t, n, i, r, s = e.x, u = e.y, f = G._; f; )
            if (((i = U(f, u) - s), i > I)) f = f.L;
            else {
                if (((r = s - N(f, u)), !(r > I))) {
                    i > -I
                        ? ((t = f.P), (n = f))
                        : r > -I
                        ? ((t = f), (n = f.N))
                        : (t = n = f);
                    break;
                }
                if (!f.R) {
                    t = f;
                    break;
                }
                f = f.R;
            }
        M(e);
        var a = p(e);
        if ((G.insert(t, a), t || n)) {
            if (t === n)
                return (
                    y(t),
                    (n = p(t.site)),
                    G.insert(a, n),
                    (a.edge = n.edge = C(t.site, a.site)),
                    v(t),
                    void v(n)
                );
            if (!n) return void (a.edge = C(t.site, a.site));
            y(t), y(n);
            var l = t.site,
                o = l.x,
                c = l.y,
                h = e.x - o,
                x = e.y - c,
                d = n.site,
                L = d.x - o,
                b = d.y - c,
                R = 2 * (h * b - x * L),
                P = h * h + x * x,
                _ = L * L + b * b,
                m = { x: (b * P - x * _) / R + o, y: (h * _ - L * P) / R + c };
            g(n.edge, l, d, m),
                (a.edge = C(l, e, null, m)),
                (n.edge = C(e, d, null, m)),
                v(t),
                v(n);
        }
    }
    function _() {
        this._ = null;
    }
    function m(e, t) {
        var n = t,
            i = t.L,
            r = n.U;
        r ? (r.L === n ? (r.L = i) : (r.R = i)) : (e._ = i),
            (i.U = r),
            (n.U = i),
            (n.L = i.R),
            n.L && (n.L.U = n),
            (i.R = n);
    }
    function w(e, t) {
        var n = t,
            i = t.R,
            r = n.U;
        r ? (r.L === n ? (r.L = i) : (r.R = i)) : (e._ = i),
            (i.U = r),
            (n.U = i),
            (n.R = i.L),
            n.R && (n.R.U = n),
            (i.L = n);
    }
    function k(e) {
        for (; e.L; ) e = e.L;
        return e;
    }
    function q(e, t) {
        return t.y - e.y || t.x - e.x;
    }
    function A(e, t) {
        var n,
            i,
            r,
            s = e.sort(q).pop();
        for (D = [], B = new Array(e.length), G = new _(), F = new _(); ; )
            if (((r = J), s && (!r || s.y < r.y || (s.y === r.y && s.x < r.x))))
                (s.x !== n || s.y !== i) && (P(s), (n = s.x), (i = s.y)),
                    (s = e.pop());
            else {
                if (!r) break;
                b(r.arc);
            }
        if (t) {
            var n = t[0][0],
                i = t[0][1],
                u = t[1][0],
                f = t[1][1];
            c(n, i, u, f), a(n, i, u, f);
        }
        var l = { cells: B, edges: D };
        return (G = F = D = B = null), l;
    }
    function E(e) {
        return e[1];
    }
    function j(e) {
        return e[0];
    }
    function z() {
        function e(e) {
            var t = new Array(e.length),
                n = l[0][0],
                i = l[0][1],
                s = l[1][0],
                u = l[1][1];
            return (
                A(r(e), l).cells.forEach(function (r, f) {
                    var a = r.edges,
                        l = r.site,
                        o = (t[f] = a.length
                            ? a.map(function (e) {
                                  var t = e.start();
                                  return [t.x, t.y];
                              })
                            : l.x >= n && l.x <= s && l.y >= i && l.y <= u
                            ? [
                                  [n, u],
                                  [s, u],
                                  [s, i],
                                  [n, i],
                              ]
                            : []);
                    o.point = e[f];
                }),
                t
            );
        }
        function r(e) {
            return e.map(function (e, t) {
                return {
                    x: Math.round(f(e, t) / I) * I,
                    y: Math.round(a(e, t) / I) * I,
                    i: t,
                };
            });
        }
        var s = j,
            u = E,
            f = s,
            a = u,
            l = H;
        return (
            (e.links = function (e) {
                return A(r(e))
                    .edges.filter(function (e) {
                        return e.l && e.r;
                    })
                    .map(function (t) {
                        return { source: e[t.l.i], target: e[t.r.i] };
                    });
            }),
            (e.triangles = function (e) {
                var t = [];
                return (
                    A(r(e)).cells.forEach(function (r, s) {
                        for (
                            var u,
                                f,
                                a = r.site,
                                l = r.edges.sort(i),
                                o = -1,
                                c = l.length,
                                h = l[c - 1].edge,
                                y = h.l === a ? h.r : h.l;
                            ++o < c;

                        )
                            (u = h),
                                (f = y),
                                (h = l[o].edge),
                                (y = h.l === a ? h.r : h.l),
                                s < f.i &&
                                    s < y.i &&
                                    n(a, f, y) < 0 &&
                                    t.push([e[s], e[f.i], e[y.i]]);
                    }),
                    t
                );
            }),
            (e.x = function (n) {
                return arguments.length
                    ? ((s = n), (f = "function" == typeof n ? s : t(s)), e)
                    : s;
            }),
            (e.y = function (n) {
                return arguments.length
                    ? ((u = n), (a = "function" == typeof n ? u : t(u)), e)
                    : u;
            }),
            (e.extent = function (t) {
                return arguments.length
                    ? ((l = null == t ? H : t), e)
                    : l === H
                    ? null
                    : l;
            }),
            (e.size = function (t) {
                return arguments.length
                    ? e.extent(t && [[0, 0], t])
                    : l === H
                    ? null
                    : l && l[1];
            }),
            e
        );
    }
    var B,
        D,
        F,
        G,
        H = [
            [-1e6, -1e6],
            [1e6, 1e6],
        ],
        I = 1e-6;
    u.prototype = {
        start: function () {
            return this.edge.l === this.site ? this.edge.a : this.edge.b;
        },
        end: function () {
            return this.edge.l === this.site ? this.edge.b : this.edge.a;
        },
    };
    var J,
        K = [],
        O = 1e-12,
        Q = [];
    (R.prototype.prepare = function () {
        for (var e, t = this.edges, n = t.length; n--; )
            (e = t[n].edge), (e.b && e.a) || t.splice(n, 1);
        return t.sort(i), t.length;
    }),
        (_.prototype = {
            insert: function (e, t) {
                var n, i, r;
                if (e) {
                    if (
                        ((t.P = e),
                        (t.N = e.N),
                        e.N && (e.N.P = t),
                        (e.N = t),
                        e.R)
                    ) {
                        for (e = e.R; e.L; ) e = e.L;
                        e.L = t;
                    } else e.R = t;
                    n = e;
                } else
                    this._
                        ? ((e = k(this._)),
                          (t.P = null),
                          (t.N = e),
                          (e.P = e.L = t),
                          (n = e))
                        : ((t.P = t.N = null), (this._ = t), (n = null));
                for (t.L = t.R = null, t.U = n, t.C = !0, e = t; n && n.C; )
                    (i = n.U),
                        n === i.L
                            ? ((r = i.R),
                              r && r.C
                                  ? ((n.C = r.C = !1), (i.C = !0), (e = i))
                                  : (e === n.R &&
                                        (w(this, n), (e = n), (n = e.U)),
                                    (n.C = !1),
                                    (i.C = !0),
                                    m(this, i)))
                            : ((r = i.L),
                              r && r.C
                                  ? ((n.C = r.C = !1), (i.C = !0), (e = i))
                                  : (e === n.L &&
                                        (m(this, n), (e = n), (n = e.U)),
                                    (n.C = !1),
                                    (i.C = !0),
                                    w(this, i))),
                        (n = e.U);
                this._.C = !1;
            },
            remove: function (e) {
                e.N && (e.N.P = e.P), e.P && (e.P.N = e.N), (e.N = e.P = null);
                var t,
                    n,
                    i,
                    r = e.U,
                    s = e.L,
                    u = e.R;
                if (
                    ((n = s ? (u ? k(u) : s) : u),
                    r ? (r.L === e ? (r.L = n) : (r.R = n)) : (this._ = n),
                    s && u
                        ? ((i = n.C),
                          (n.C = e.C),
                          (n.L = s),
                          (s.U = n),
                          n !== u
                              ? ((r = n.U),
                                (n.U = e.U),
                                (e = n.R),
                                (r.L = e),
                                (n.R = u),
                                (u.U = n))
                              : ((n.U = r), (r = n), (e = n.R)))
                        : ((i = e.C), (e = n)),
                    e && (e.U = r),
                    !i)
                ) {
                    if (e && e.C) return void (e.C = !1);
                    do {
                        if (e === this._) break;
                        if (e === r.L) {
                            if (
                                ((t = r.R),
                                t.C &&
                                    ((t.C = !1),
                                    (r.C = !0),
                                    w(this, r),
                                    (t = r.R)),
                                (t.L && t.L.C) || (t.R && t.R.C))
                            ) {
                                (t.R && t.R.C) ||
                                    ((t.L.C = !1),
                                    (t.C = !0),
                                    m(this, t),
                                    (t = r.R)),
                                    (t.C = r.C),
                                    (r.C = t.R.C = !1),
                                    w(this, r),
                                    (e = this._);
                                break;
                            }
                        } else if (
                            ((t = r.L),
                            t.C &&
                                ((t.C = !1), (r.C = !0), m(this, r), (t = r.L)),
                            (t.L && t.L.C) || (t.R && t.R.C))
                        ) {
                            (t.L && t.L.C) ||
                                ((t.R.C = !1),
                                (t.C = !0),
                                w(this, t),
                                (t = r.L)),
                                (t.C = r.C),
                                (r.C = t.L.C = !1),
                                m(this, r),
                                (e = this._);
                            break;
                        }
                        (t.C = !0), (e = r), (r = r.U);
                    } while (!e.C);
                    e && (e.C = !1);
                }
            },
        }),
        (e.voronoi = z);
});

/* https://github.com/d3/d3-timer Copyright 2015 Mike Bostock */
"undefined" == typeof requestAnimationFrame &&
    (requestAnimationFrame =
        ("undefined" != typeof window &&
            (window.msRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.oRequestAnimationFrame)) ||
        function (e) {
            return setTimeout(e, 17);
        }),
    (function (e, n) {
        "object" == typeof exports && "undefined" != typeof module
            ? n(exports)
            : "function" == typeof define && define.amd
            ? define(["exports"], n)
            : n((e.timer = {}));
    })(this, function (e) {
        "use strict";
        function n() {
            (r = m = 0), (c = 1 / 0), t(u());
        }
        function t(e) {
            if (!r) {
                var t = e - Date.now();
                t > 24
                    ? c > e &&
                      (m && clearTimeout(m), (m = setTimeout(n, t)), (c = e))
                    : (m && ((m = clearTimeout(m)), (c = 1 / 0)),
                      (r = requestAnimationFrame(n)));
            }
        }
        function i(e, n, i) {
            (i = null == i ? Date.now() : +i), null != n && (i += +n);
            var o = { callback: e, time: i, flush: !1, next: null };
            a ? (a.next = o) : (f = o), (a = o), t(i);
        }
        function o(e, n, t) {
            (t = null == t ? Date.now() : +t),
                null != n && (t += +n),
                (l.callback = e),
                (l.time = t);
        }
        function u(e) {
            e = null == e ? Date.now() : +e;
            var n = l;
            for (l = f; l; )
                e >= l.time && (l.flush = l.callback(e - l.time, e)),
                    (l = l.next);
            (l = n), (e = 1 / 0);
            for (var t, i = f; i; )
                i.flush
                    ? (i = t ? (t.next = i.next) : (f = i.next))
                    : (i.time < e && (e = i.time), (i = (t = i).next));
            return (a = t), e;
        }
        var a,
            m,
            r,
            f,
            l,
            c = 1 / 0;
        (e.timer = i), (e.timerReplace = o), (e.timerFlush = u);
    });

/* https://github.com/d3/d3-color Copyright 2015 Mike Bostock */
"undefined" == typeof Map
    ? ((Map = function () {
          this.clear();
      }),
      (Map.prototype = {
          set: function (t, e) {
              return (this._[t] = e), this;
          },
          get: function (t) {
              return this._[t];
          },
          has: function (t) {
              return t in this._;
          },
          delete: function (t) {
              return t in this._ && delete this._[t];
          },
          clear: function () {
              this._ = Object.create(null);
          },
          get size() {
              var t = 0;
              for (var e in this._) ++t;
              return t;
          },
          forEach: function (t) {
              for (var e in this._) t(this._[e], e, this);
          },
      }))
    : (function () {
          var t = new Map();
          t.set(0, 0) !== t &&
              ((t = t.set),
              (Map.prototype.set = function () {
                  return t.apply(this, arguments), this;
              }));
      })(),
    (function (t, e) {
        "object" == typeof exports && "undefined" != typeof module
            ? e(exports)
            : "function" == typeof define && define.amd
            ? define(["exports"], e)
            : e((t.color = {}));
    })(this, function (t) {
        "use strict";
        function e() {}
        function s(t, e, s) {
            (this.r = Math.max(0, Math.min(255, Math.round(t)))),
                (this.g = Math.max(0, Math.min(255, Math.round(e)))),
                (this.b = Math.max(0, Math.min(255, Math.round(s))));
        }
        function n(t, e, s) {
            return (
                isNaN(t) && (t = 0),
                isNaN(e) && (e = 0),
                isNaN(s) && (s = 0),
                "#" +
                    (16 > t ? "0" + t.toString(16) : t.toString(16)) +
                    (16 > e ? "0" + e.toString(16) : e.toString(16)) +
                    (16 > s ? "0" + s.toString(16) : s.toString(16))
            );
        }
        function r(t, n, r) {
            return (
                1 === arguments.length &&
                    (t instanceof e || (t = l(t)),
                    t
                        ? ((t = t.rgb()), (r = t.b), (n = t.g), (t = t.r))
                        : (t = n = r = NaN)),
                new s(t, n, r)
            );
        }
        function i(t) {
            return r((t >> 16) & 255, (t >> 8) & 255, 255 & t);
        }
        function a(t, e, s) {
            (this.h = +t),
                (this.s = Math.max(0, Math.min(1, +e))),
                (this.l = Math.max(0, Math.min(1, +s)));
        }
        function o(t, e, s) {
            return (
                255 *
                (60 > t
                    ? e + ((s - e) * t) / 60
                    : 180 > t
                    ? s
                    : 240 > t
                    ? e + ((s - e) * (240 - t)) / 60
                    : e)
            );
        }
        function h(t, s, n) {
            if (1 === arguments.length)
                if (t instanceof a) (n = t.l), (s = t.s), (t = t.h);
                else if ((t instanceof e || (t = l(t)), t)) {
                    if (t instanceof a) return t;
                    t = t.rgb();
                    var r = t.r / 255,
                        i = t.g / 255,
                        o = t.b / 255,
                        h = Math.min(r, i, o),
                        u = Math.max(r, i, o),
                        c = u - h;
                    (n = (u + h) / 2),
                        c
                            ? ((s = 0.5 > n ? c / (u + h) : c / (2 - u - h)),
                              (t =
                                  r === u
                                      ? (i - o) / c + 6 * (o > i)
                                      : i === u
                                      ? (o - r) / c + 2
                                      : (r - i) / c + 4),
                              (t *= 60))
                            : ((t = NaN), (s = n > 0 && 1 > n ? 0 : t));
                } else t = s = n = NaN;
            return new a(t, s, n);
        }
        function l(t) {
            var e;
            return (
                (t = (t + "").trim().toLowerCase()),
                (e = R.exec(t))
                    ? ((e = parseInt(e[1], 16)),
                      r(
                          ((e >> 8) & 15) | ((e >> 4) & 240),
                          ((e >> 4) & 15) | (240 & e),
                          ((15 & e) << 4) | (15 & e)
                      ))
                    : (e = E.exec(t))
                    ? i(parseInt(e[1], 16))
                    : (e = z.exec(t))
                    ? r(e[1], e[2], e[3])
                    : (e = P.exec(t))
                    ? r(2.55 * e[1], 2.55 * e[2], 2.55 * e[3])
                    : (e = O.exec(t))
                    ? h(e[1], 0.01 * e[2], 0.01 * e[3])
                    : L.has(t)
                    ? i(L.get(t))
                    : null
            );
        }
        function u(t, e, s) {
            (this.l = +t), (this.a = +e), (this.b = +s);
        }
        function c(t) {
            return (
                255 *
                (0.0031308 >= t
                    ? 12.92 * t
                    : 1.055 * Math.pow(t, 1 / 2.4) - 0.055)
            );
        }
        function g(t) {
            return t > F ? t * t * t : G * (t - D);
        }
        function f(t) {
            return t > T ? Math.pow(t, 1 / 3) : t / G + D;
        }
        function d(t) {
            return (t /= 255) <= 0.04045
                ? t / 12.92
                : Math.pow((t + 0.055) / 1.055, 2.4);
        }
        function p(t, e, s) {
            (this.h = +t), (this.c = +e), (this.l = +s);
        }
        function b(t, e, n) {
            if (1 === arguments.length)
                if (t instanceof u) (n = t.b), (e = t.a), (t = t.l);
                else if (t instanceof p) {
                    var i = t.h * U;
                    (n = Math.sin(i) * t.c), (e = Math.cos(i) * t.c), (t = t.l);
                } else {
                    t instanceof s || (t = r(t));
                    var a = d(t.r),
                        o = d(t.g),
                        n = d(t.b),
                        h = f(
                            (0.4124564 * a + 0.3575761 * o + 0.1804375 * n) / K
                        ),
                        l = f(
                            (0.2126729 * a + 0.7151522 * o + 0.072175 * n) / Q
                        ),
                        c = f(
                            (0.0193339 * a + 0.119192 * o + 0.9503041 * n) / J
                        );
                    (n = 200 * (l - c)),
                        (e = 500 * (h - l)),
                        (t = 116 * l - 16);
                }
            return new u(t, e, n);
        }
        function N(t, e, s) {
            return (
                1 === arguments.length &&
                    (t instanceof p
                        ? ((s = t.l), (e = t.c), (t = t.h))
                        : (t instanceof u || (t = b(t)),
                          (s = t.l),
                          (e = Math.sqrt(t.a * t.a + t.b * t.b)),
                          (t = Math.atan2(t.b, t.a) * W),
                          0 > t && (t += 360))),
                new p(t, e, s)
            );
        }
        function m(t, e, s) {
            (this.h = +t), (this.s = +e), (this.l = +s);
        }
        function w(t, e, n) {
            if (1 === arguments.length)
                if (t instanceof m) (n = t.l), (e = t.s), (t = t.h);
                else {
                    t instanceof s || (t = r(t));
                    var i = t.r / 255,
                        a = t.g / 255,
                        o = t.b / 255;
                    n = (at * o + it * i - rt * a) / (at + it - rt);
                    var h = o - n,
                        l = (Y * (a - n) - tt * h) / Z,
                        u = Math.pow(n, nt);
                    (e = Math.sqrt(l * l + h * h) / (Y * u * (1 - u))),
                        (t = e ? Math.atan2(l, h) * W - 120 : NaN),
                        0 > t && (t += 360);
                }
            return new m(t, e, n);
        }
        function y(t, e) {
            (t = w(t)), (e = w(e));
            var s = isNaN(t.h) ? e.h : t.h,
                n = isNaN(t.s) ? e.s : t.s,
                r = t.l,
                i = isNaN(e.h) ? 0 : e.h - s,
                a = isNaN(e.s) ? 0 : e.s - n,
                o = e.l - r;
            return function (e) {
                return (
                    (t.h = s + i * e),
                    (t.s = n + a * e),
                    (t.l = r + o * e),
                    t + ""
                );
            };
        }
        function v(t, e) {
            var s = (t - e) % 360;
            return s + (s > 180 ? -360 : -180 > s ? 360 : 0);
        }
        function M(t, e) {
            (t = w(t)), (e = w(e));
            var s = isNaN(t.h) ? e.h : t.h,
                n = isNaN(t.s) ? e.s : t.s,
                r = t.l,
                i = isNaN(e.h) ? 0 : v(e.h, s),
                a = isNaN(e.s) ? 0 : e.s - n,
                o = e.l - r;
            return function (e) {
                return (
                    (t.h = s + i * e),
                    (t.s = n + a * e),
                    (t.l = r + o * e),
                    t + ""
                );
            };
        }
        function k(t, e) {
            (t = N(t)), (e = N(e));
            var s = isNaN(t.h) ? e.h : t.h,
                n = isNaN(t.c) ? e.c : t.c,
                r = t.l,
                i = isNaN(e.h) ? 0 : e.h - s,
                a = isNaN(e.c) ? 0 : e.c - n,
                o = e.l - r;
            return function (e) {
                return (
                    (t.h = s + i * e),
                    (t.c = n + a * e),
                    (t.l = r + o * e),
                    t + ""
                );
            };
        }
        function x(t, e) {
            (t = N(t)), (e = N(e));
            var s = isNaN(t.h) ? e.h : t.h,
                n = isNaN(t.c) ? e.c : t.c,
                r = t.l,
                i = isNaN(e.h) ? 0 : v(e.h, s),
                a = isNaN(e.c) ? 0 : e.c - n,
                o = e.l - r;
            return function (e) {
                return (
                    (t.h = s + i * e),
                    (t.c = n + a * e),
                    (t.l = r + o * e),
                    t + ""
                );
            };
        }
        function q(t, e) {
            (t = b(t)), (e = b(e));
            var s = t.l,
                n = t.a,
                r = t.b,
                i = e.l - s,
                a = e.a - n,
                o = e.b - r;
            return function (e) {
                return (
                    (t.l = s + i * e),
                    (t.a = n + a * e),
                    (t.b = r + o * e),
                    t + ""
                );
            };
        }
        function _(t, e) {
            (t = h(t)), (e = h(e));
            var s = isNaN(t.h) ? e.h : t.h,
                n = isNaN(t.s) ? e.s : t.s,
                r = t.l,
                i = isNaN(e.h) ? 0 : e.h - s,
                a = isNaN(e.s) ? 0 : e.s - n,
                o = e.l - r;
            return function (e) {
                return (
                    (t.h = s + i * e),
                    (t.s = n + a * e),
                    (t.l = r + o * e),
                    t + ""
                );
            };
        }
        function S(t, e) {
            (t = h(t)), (e = h(e));
            var s = isNaN(t.h) ? e.h : t.h,
                n = isNaN(t.s) ? e.s : t.s,
                r = t.l,
                i = isNaN(e.h) ? 0 : v(e.h, s),
                a = isNaN(e.s) ? 0 : e.s - n,
                o = e.l - r;
            return function (e) {
                return (
                    (t.h = s + i * e),
                    (t.s = n + a * e),
                    (t.l = r + o * e),
                    t + ""
                );
            };
        }
        function j(t, e) {
            (t = r(t)), (e = r(e));
            var s = t.r,
                i = t.g,
                a = t.b,
                o = e.r - s,
                h = e.g - i,
                l = e.b - a;
            return function (t) {
                return n(
                    Math.round(s + o * t),
                    Math.round(i + h * t),
                    Math.round(a + l * t)
                );
            };
        }
        e.prototype = {
            toString: function () {
                return this.rgb() + "";
            },
        };
        var L = new Map()
                .set("aliceblue", 15792383)
                .set("antiquewhite", 16444375)
                .set("aqua", 65535)
                .set("aquamarine", 8388564)
                .set("azure", 15794175)
                .set("beige", 16119260)
                .set("bisque", 16770244)
                .set("black", 0)
                .set("blanchedalmond", 16772045)
                .set("blue", 255)
                .set("blueviolet", 9055202)
                .set("brown", 10824234)
                .set("burlywood", 14596231)
                .set("cadetblue", 6266528)
                .set("chartreuse", 8388352)
                .set("chocolate", 13789470)
                .set("coral", 16744272)
                .set("cornflowerblue", 6591981)
                .set("cornsilk", 16775388)
                .set("crimson", 14423100)
                .set("cyan", 65535)
                .set("darkblue", 139)
                .set("darkcyan", 35723)
                .set("darkgoldenrod", 12092939)
                .set("darkgray", 11119017)
                .set("darkgreen", 25600)
                .set("darkgrey", 11119017)
                .set("darkkhaki", 12433259)
                .set("darkmagenta", 9109643)
                .set("darkolivegreen", 5597999)
                .set("darkorange", 16747520)
                .set("darkorchid", 10040012)
                .set("darkred", 9109504)
                .set("darksalmon", 15308410)
                .set("darkseagreen", 9419919)
                .set("darkslateblue", 4734347)
                .set("darkslategray", 3100495)
                .set("darkslategrey", 3100495)
                .set("darkturquoise", 52945)
                .set("darkviolet", 9699539)
                .set("deeppink", 16716947)
                .set("deepskyblue", 49151)
                .set("dimgray", 6908265)
                .set("dimgrey", 6908265)
                .set("dodgerblue", 2003199)
                .set("firebrick", 11674146)
                .set("floralwhite", 16775920)
                .set("forestgreen", 2263842)
                .set("fuchsia", 16711935)
                .set("gainsboro", 14474460)
                .set("ghostwhite", 16316671)
                .set("gold", 16766720)
                .set("goldenrod", 14329120)
                .set("gray", 8421504)
                .set("green", 32768)
                .set("greenyellow", 11403055)
                .set("grey", 8421504)
                .set("honeydew", 15794160)
                .set("hotpink", 16738740)
                .set("indianred", 13458524)
                .set("indigo", 4915330)
                .set("ivory", 16777200)
                .set("khaki", 15787660)
                .set("lavender", 15132410)
                .set("lavenderblush", 16773365)
                .set("lawngreen", 8190976)
                .set("lemonchiffon", 16775885)
                .set("lightblue", 11393254)
                .set("lightcoral", 15761536)
                .set("lightcyan", 14745599)
                .set("lightgoldenrodyellow", 16448210)
                .set("lightgray", 13882323)
                .set("lightgreen", 9498256)
                .set("lightgrey", 13882323)
                .set("lightpink", 16758465)
                .set("lightsalmon", 16752762)
                .set("lightseagreen", 2142890)
                .set("lightskyblue", 8900346)
                .set("lightslategray", 7833753)
                .set("lightslategrey", 7833753)
                .set("lightsteelblue", 11584734)
                .set("lightyellow", 16777184)
                .set("lime", 65280)
                .set("limegreen", 3329330)
                .set("linen", 16445670)
                .set("magenta", 16711935)
                .set("maroon", 8388608)
                .set("mediumaquamarine", 6737322)
                .set("mediumblue", 205)
                .set("mediumorchid", 12211667)
                .set("mediumpurple", 9662683)
                .set("mediumseagreen", 3978097)
                .set("mediumslateblue", 8087790)
                .set("mediumspringgreen", 64154)
                .set("mediumturquoise", 4772300)
                .set("mediumvioletred", 13047173)
                .set("midnightblue", 1644912)
                .set("mintcream", 16121850)
                .set("mistyrose", 16770273)
                .set("moccasin", 16770229)
                .set("navajowhite", 16768685)
                .set("navy", 128)
                .set("oldlace", 16643558)
                .set("olive", 8421376)
                .set("olivedrab", 7048739)
                .set("orange", 16753920)
                .set("orangered", 16729344)
                .set("orchid", 14315734)
                .set("palegoldenrod", 15657130)
                .set("palegreen", 10025880)
                .set("paleturquoise", 11529966)
                .set("palevioletred", 14381203)
                .set("papayawhip", 16773077)
                .set("peachpuff", 16767673)
                .set("peru", 13468991)
                .set("pink", 16761035)
                .set("plum", 14524637)
                .set("powderblue", 11591910)
                .set("purple", 8388736)
                .set("rebeccapurple", 6697881)
                .set("red", 16711680)
                .set("rosybrown", 12357519)
                .set("royalblue", 4286945)
                .set("saddlebrown", 9127187)
                .set("salmon", 16416882)
                .set("sandybrown", 16032864)
                .set("seagreen", 3050327)
                .set("seashell", 16774638)
                .set("sienna", 10506797)
                .set("silver", 12632256)
                .set("skyblue", 8900331)
                .set("slateblue", 6970061)
                .set("slategray", 7372944)
                .set("slategrey", 7372944)
                .set("snow", 16775930)
                .set("springgreen", 65407)
                .set("steelblue", 4620980)
                .set("tan", 13808780)
                .set("teal", 32896)
                .set("thistle", 14204888)
                .set("tomato", 16737095)
                .set("turquoise", 4251856)
                .set("violet", 15631086)
                .set("wheat", 16113331)
                .set("white", 16777215)
                .set("whitesmoke", 16119285)
                .set("yellow", 16776960)
                .set("yellowgreen", 10145074),
            $ = (s.prototype = new e()),
            H = 0.7;
        $.darker = function (t) {
            return (
                (t = null == t ? H : Math.pow(H, t)),
                new s(this.r * t, this.g * t, this.b * t)
            );
        };
        var I = 1 / H;
        ($.brighter = function (t) {
            return (
                (t = null == t ? I : Math.pow(I, t)),
                new s(this.r * t, this.g * t, this.b * t)
            );
        }),
            ($.rgb = function () {
                return this;
            }),
            ($.toString = function () {
                return n(this.r, this.g, this.b);
            });
        var C = (a.prototype = new e());
        (C.brighter = function (t) {
            return (
                (t = null == t ? I : Math.pow(I, t)),
                new a(this.h, this.s, this.l * t)
            );
        }),
            (C.darker = function (t) {
                return (
                    (t = null == t ? H : Math.pow(H, t)),
                    new a(this.h, this.s, this.l * t)
                );
            }),
            (C.rgb = function () {
                var t = (this.h % 360) + 360 * (this.h < 0),
                    e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
                    n = this.l,
                    r = 0.5 >= n ? n * (1 + e) : n + e - n * e,
                    i = 2 * n - r;
                return new s(
                    o(t >= 240 ? t - 240 : t + 120, i, r),
                    o(t, i, r),
                    o(120 > t ? t + 240 : t - 120, i, r)
                );
            });
        var O =
                /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/,
            P =
                /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/,
            z = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/,
            E = /^#([0-9a-f]{6})$/,
            R = /^#([0-9a-f]{3})$/;
        (l.prototype = e.prototype),
            (r.prototype = s.prototype),
            (h.prototype = a.prototype);
        var A = (u.prototype = new e()),
            B = 18;
        (A.brighter = function (t) {
            return new u(this.l + B * (null == t ? 1 : t), this.a, this.b);
        }),
            (A.darker = function (t) {
                return new u(this.l - B * (null == t ? 1 : t), this.a, this.b);
            });
        var D = 4 / 29,
            F = 6 / 29,
            G = 3 * F * F,
            J = 1.08883,
            K = 0.95047,
            Q = 1;
        A.rgb = function () {
            var t = (this.l + 16) / 116,
                e = isNaN(this.a) ? t : t + this.a / 500,
                n = isNaN(this.b) ? t : t - this.b / 200;
            return (
                (t = Q * g(t)),
                (e = K * g(e)),
                (n = J * g(n)),
                new s(
                    c(3.2404542 * e - 1.5371385 * t - 0.4985314 * n),
                    c(-0.969266 * e + 1.8760108 * t + 0.041556 * n),
                    c(0.0556434 * e - 0.2040259 * t + 1.0572252 * n)
                )
            );
        };
        var T = F * F * F,
            U = Math.PI / 180,
            V = (p.prototype = new e());
        (V.brighter = function (t) {
            return new p(this.h, this.c, this.l + B * (null == t ? 1 : t));
        }),
            (V.darker = function (t) {
                return new p(this.h, this.c, this.l - B * (null == t ? 1 : t));
            }),
            (V.rgb = function () {
                return b(this).rgb();
            }),
            (b.prototype = u.prototype);
        var W = 180 / Math.PI;
        N.prototype = p.prototype;
        var X = (m.prototype = new e());
        (X.brighter = function (t) {
            return (
                (t = null == t ? I : Math.pow(I, t)),
                new m(this.h, this.s, this.l * t)
            );
        }),
            (X.darker = function (t) {
                return (
                    (t = null == t ? H : Math.pow(H, t)),
                    new m(this.h, this.s, this.l * t)
                );
            });
        var Y = 1.97294,
            Z = -0.90649,
            tt = -0.29227,
            et = 1.78277,
            st = -0.14861,
            nt = 1,
            rt = Y * et,
            it = Y * Z,
            at = et * tt - Z * st;
        (X.rgb = function () {
            var t = isNaN(this.h) ? 0 : (this.h + 120) * U,
                e = Math.pow(this.l, nt),
                n = isNaN(this.s) ? 0 : this.s * e * (1 - e),
                r = Math.cos(t),
                i = Math.sin(t);
            return new s(
                255 * (e + n * (st * r + et * i)),
                255 * (e + n * (tt * r + Z * i)),
                255 * (e + n * Y * r)
            );
        }),
            (w.prototype = m.prototype),
            (t.color = l),
            (t.rgb = r),
            (t.hsl = h),
            (t.lab = b),
            (t.hcl = N),
            (t.cubehelix = w),
            (t.interpolateRgb = j),
            (t.interpolateHsl = S),
            (t.interpolateHslLong = _),
            (t.interpolateLab = q),
            (t.interpolateHcl = x),
            (t.interpolateHclLong = k),
            (t.interpolateCubehelix = M),
            (t.interpolateCubehelixLong = y);
    });
