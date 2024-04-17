import { defineComponent as a, openBlock as s, createElementBlock as d, createCommentVNode as w, ref as h } from "vue";
window.TradingView = window.TradingView || {};
const b = a({
  name: "WChart",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      width: 980,
      height: 610,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: !1,
      allow_symbol_change: !0
    }, n = () => typeof window < "u" && window.document && window.document.createElement, i = () => document.getElementById(e.uniqueId + "-script"), o = () => i() !== null, r = (g) => {
      if (!n() || o())
        return;
      const p = document.createElement("script");
      p.id = e.uniqueId + "-script", p.type = "text/javascript", p.async = !0, p.src = "https://s3.tradingview.com/tv.js", p.onload = g, document.getElementsByTagName("head")[0].appendChild(p);
    }, m = () => {
      setTimeout(() => {
        if (typeof window.TradingView > "u")
          return;
        const g = { ...t, ...e.options };
        new window.TradingView.widget(Object.assign({ container_id: e.uniqueId }, g));
      }, 300);
    };
    r(() => m());
  }
}), c = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [i, o] of t)
    n[i] = o;
  return n;
}, y = ["id"];
function v(e, t, n, i, o, r) {
  return e.uniqueId ? (s(), d("div", {
    key: 0,
    id: e.uniqueId
  }, null, 8, y)) : w("", !0);
}
const Ee = /* @__PURE__ */ c(b, [["render", v]]), l = (e, t, n, i) => {
  const o = h(t), r = h(n), m = h(), g = () => typeof window < "u" && window.document && window.document.createElement, p = () => document.getElementById(r.value), u = () => p() !== null, _ = () => {
    if (!g() || u())
      return;
    const f = document.createElement("script");
    f.id = r.value + Date.now().toString(36), f.type = "text/javascript", f.async = !0, f.src = i, f.textContent = JSON.stringify(e), m.value && m.value.appendChild(f);
  };
  return setTimeout(() => {
    _();
  }, 300), { container: o, tradingview: m };
}, $ = a({
  name: "WCompanyProfile",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      symbol: "NASDAQ:AAPL",
      width: 480,
      height: 650,
      colorTheme: "light",
      isTransparent: !1,
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-company-profile-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
    );
    return { container: n, tradingview: i };
  }
}), S = ["id"];
function C(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, S);
}
const Ie = /* @__PURE__ */ c($, [["render", C]]), T = a({
  name: "WCryptoMarket",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: "light",
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-crypto-market-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
    );
    return { container: n, tradingview: i };
  }
}), E = ["id"];
function I(e, t, n, i, o, r) {
  return s(), d("div", {
    id: e.container,
    ref: "tradingview"
  }, null, 8, E);
}
const Fe = /* @__PURE__ */ c(T, [["render", I]]), F = a({
  name: "WEconomicCalendar",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      colorTheme: "light",
      isTransparent: !1,
      width: "510",
      height: "600",
      locale: "en",
      importanceFilter: "-1,0,1",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-economic-calendar-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js"
    );
    return { container: n, tradingview: i };
  }
}), U = ["id"];
function D(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, U);
}
const Ue = /* @__PURE__ */ c(F, [["render", D]]), O = a({
  name: "WForexCrossRates",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      symbol: "NASDAQ:AAPL",
      color: "blak",
      isTransparent: !1,
      largeChartUrl: "",
      displayMode: "regular",
      width: "100%",
      height: "100%",
      locale: "br",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-forex-cross-rates-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js"
    );
    return { container: n, tradingview: i };
  }
}), N = ["id"];
function M(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, N);
}
const De = /* @__PURE__ */ c(O, [["render", M]]), B = a({
  name: "WForexHeatMap",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      width: 770,
      height: 400,
      currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY"],
      isTransparent: !1,
      colorTheme: "light",
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-forex-heat-map-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js"
    );
    return { container: n, tradingview: i };
  }
}), X = ["id"];
function j(e, t, n, i, o, r) {
  return s(), d("div", {
    id: e.container,
    ref: "tradingview"
  }, null, 8, X);
}
const Oe = /* @__PURE__ */ c(B, [["render", j]]), q = a({
  name: "WCryptoHeatMap",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      dataSource: "Crypto",
      width: 770,
      height: 400,
      hasTopBar: !1,
      isDataSetEnabled: !1,
      colorTheme: "dark",
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-crypto-heat-map-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js"
    );
    return { container: n, tradingview: i };
  }
}), A = ["id"];
function k(e, t, n, i, o, r) {
  return s(), d("div", {
    id: e.container,
    ref: "tradingview"
  }, null, 8, A);
}
const Ne = /* @__PURE__ */ c(q, [["render", k]]), x = a({
  name: "WFundamentalData",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      symbol: "NASDAQ:AAPL",
      colorTheme: "light",
      isTransparent: !1,
      largeChartUrl: "",
      displayMode: "regular",
      width: 480,
      height: 830,
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-fundamental-data-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
    );
    return { container: n, tradingview: i };
  }
}), L = ["id"];
function P(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, L);
}
const Me = /* @__PURE__ */ c(x, [["render", P]]), R = a({
  name: "WMarketData",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      width: 770,
      height: 450,
      symbolsGroups: [
        {
          name: "Indices",
          originalName: "Indices",
          symbols: [
            {
              name: "FOREXCOM:SPXUSD",
              displayName: "S&P 500"
            },
            {
              name: "FOREXCOM:NSXUSD",
              displayName: "US 100"
            },
            {
              name: "FOREXCOM:DJI",
              displayName: "Dow 30"
            },
            {
              name: "INDEX:NKY",
              displayName: "Nikkei 225"
            },
            {
              name: "INDEX:DEU40",
              displayName: "DAX Index"
            },
            {
              name: "FOREXCOM:UKXGBP",
              displayName: "UK 100"
            }
          ]
        },
        {
          name: "Futures",
          originalName: "Futures",
          symbols: [
            {
              name: "CME_MINI:ES1!",
              displayName: "S&P 500"
            },
            {
              name: "CME:6E1!",
              displayName: "Euro"
            },
            {
              name: "COMEX:GC1!",
              displayName: "Gold"
            },
            {
              name: "NYMEX:CL1!",
              displayName: "Crude Oil"
            },
            {
              name: "NYMEX:NG1!",
              displayName: "Natural Gas"
            },
            {
              name: "CBOT:ZC1!",
              displayName: "Corn"
            }
          ]
        },
        {
          name: "Bonds",
          originalName: "Bonds",
          symbols: [
            {
              name: "CME:GE1!",
              displayName: "Eurodollar"
            },
            {
              name: "CBOT:ZB1!",
              displayName: "T-Bond"
            },
            {
              name: "CBOT:UB1!",
              displayName: "Ultra T-Bond"
            },
            {
              name: "EUREX:FGBL1!",
              displayName: "Euro Bund"
            },
            {
              name: "EUREX:FBTP1!",
              displayName: "Euro BTP"
            },
            {
              name: "EUREX:FGBM1!",
              displayName: "Euro BOBL"
            }
          ]
        },
        {
          name: "Forex",
          originalName: "Forex",
          symbols: [
            {
              name: "FX:EURUSD"
            },
            {
              name: "FX:GBPUSD"
            },
            {
              name: "FX:USDJPY"
            },
            {
              name: "FX:USDCHF"
            },
            {
              name: "FX:AUDUSD"
            },
            {
              name: "FX:USDCAD"
            }
          ]
        }
      ],
      showSymbolLogo: !0,
      colorTheme: "light",
      isTransparent: !1,
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-market-data-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
    );
    return { container: n, tradingview: i };
  }
}), G = ["id"];
function W(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, G);
}
const Be = /* @__PURE__ */ c(R, [["render", W]]), V = a({
  name: "WMiniChart",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      symbol: "FX:EURUSD",
      width: 350,
      height: 220,
      locale: "en",
      dateRange: "12M",
      colorTheme: "light",
      trendLineColor: "rgba(41, 98, 255, 1)",
      underLineColor: "rgba(41, 98, 255, 0.3)",
      underLineBottomColor: "rgba(41, 98, 255, 0)",
      isTransparent: !1,
      autosize: !1,
      largeChartUrl: "",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-mini-chart-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
    );
    return { container: n, tradingview: i };
  }
}), Y = ["id"];
function H(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, Y);
}
const Xe = /* @__PURE__ */ c(V, [["render", H]]), Q = a({
  name: "WScreener",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      width: 1100,
      height: 523,
      defaultColumn: "overview",
      defaultScreen: "general",
      market: "forex",
      showToolbar: !0,
      colorTheme: "light",
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-screener-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
    );
    return { container: n, tradingview: i };
  }
}), J = ["id"];
function K(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, J);
}
const je = /* @__PURE__ */ c(Q, [["render", K]]), Z = a({
  name: "WSingleTicker",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      symbol: "FX:EURUSD",
      width: 350,
      colorTheme: "light",
      isTransparent: !1,
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-single-ticker-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js"
    );
    return { container: n, tradingview: i };
  }
}), z = ["id"];
function ee(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, z);
}
const qe = /* @__PURE__ */ c(Z, [["render", ee]]), te = a({
  name: "WSnaps",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      feedMode: "all_symbols",
      colorTheme: "light",
      isTransparent: !1,
      displayMode: "regular",
      width: 480,
      height: 830,
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-snaps-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
    );
    return { container: n, tradingview: i };
  }
}), ne = ["id"];
function ie(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, ne);
}
const Ae = /* @__PURE__ */ c(te, [["render", ie]]), oe = a({
  name: "WStockMarket",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      colorTheme: "light",
      dateRange: "12M",
      exchange: "US",
      showChart: !0,
      locale: "en",
      largeChartUrl: "",
      isTransparent: !1,
      showSymbolLogo: !1,
      showFloatingTooltip: !1,
      width: "400",
      height: "600",
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(240, 243, 250, 0)",
      scaleFontColor: "rgba(120, 123, 134, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-stock-market-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js"
    );
    return { container: n, tradingview: i };
  }
}), re = ["id"];
function ae(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, re);
}
const ke = /* @__PURE__ */ c(oe, [["render", ae]]);
window.TradingView = window.TradingView || {};
const se = a({
  name: "WSymbolOverview",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = h("tradingview-symbol-overview-script"), n = {
      symbols: [
        ["Apple", "AAPL"],
        ["Google", "GOOGL"],
        ["Microsoft", "MSFT"]
      ],
      chartOnly: !1,
      width: 1e3,
      height: 400,
      locale: "en",
      colorTheme: "light",
      gridLineColor: "rgba(240, 243, 250, 0)",
      fontColor: "#787B86",
      isTransparent: !1,
      autosize: !1,
      showVolume: !1,
      scalePosition: "no",
      scaleMode: "Normal",
      fontFamily: "Trebuchet MS, sans-serif",
      noTimeScale: !1,
      valuesTracking: "1",
      chartType: "area",
      lineColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0)",
      topColor: "rgba(41, 98, 255, 0.3)"
    }, i = () => typeof window < "u" && window.document && window.document.createElement, o = () => document.getElementById(t.value), r = () => o() !== null, m = (p) => {
      if (!i() || r())
        return;
      const u = document.createElement("script");
      u.id = t.value + Date.now().toString(36), u.type = "text/javascript", u.async = !0, u.src = "https://s3.tradingview.com/tv.js", u.onload = p, document.getElementsByTagName("head")[0].appendChild(u);
    }, g = () => {
      setTimeout(() => {
        if (typeof window.TradingView > "u")
          return;
        const p = { ...n, ...e.options };
        new window.TradingView.MediumWidget(Object.assign({ container_id: e.uniqueId }, p));
      }, 300);
    };
    m(() => g());
  }
}), de = ["id"];
function ce(e, t, n, i, o, r) {
  return e.uniqueId ? (s(), d("div", {
    key: 0,
    id: e.uniqueId
  }, null, 8, de)) : w("", !0);
}
const xe = /* @__PURE__ */ c(se, [["render", ce]]), le = a({
  name: "WTechnicalAnalysis",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      interval: "1m",
      width: 425,
      isTransparent: !1,
      height: 450,
      symbol: "NASDAQ:AAPL",
      showIntervalTabs: !0,
      locale: "en",
      colorTheme: "light",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-technical-analysis-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
    );
    return { container: n, tradingview: i };
  }
}), pe = ["id"];
function ue(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, pe);
}
const Le = /* @__PURE__ */ c(le, [["render", ue]]), me = a({
  name: "WTicker",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      symbols: [
        {
          proName: "FOREXCOM:SPXUSD",
          title: "S&P 500"
        },
        {
          proName: "FOREXCOM:NSXUSD",
          title: "US 100"
        },
        {
          proName: "FX_IDC:EURUSD",
          title: "EUR/USD"
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin"
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum"
        }
      ],
      colorTheme: "light",
      isTransparent: !1,
      showSymbolLogo: !0,
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-ticker-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js"
    );
    return { container: n, tradingview: i };
  }
}), ge = ["id"];
function fe(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, ge);
}
const Pe = /* @__PURE__ */ c(me, [["render", fe]]), he = a({
  name: "WTickerTape",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      symbols: [
        {
          proName: "FOREXCOM:SPXUSD",
          title: "S&P 500"
        },
        {
          proName: "FOREXCOM:NSXUSD",
          title: "US 100"
        },
        {
          proName: "FX_IDC:EURUSD",
          title: "EUR/USD"
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin"
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum"
        }
      ],
      showSymbolLogo: !0,
      colorTheme: "light",
      isTransparent: !1,
      displayMode: "adaptive",
      locale: "en",
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-ticker-tape-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
    );
    return { container: n, tradingview: i };
  }
}), we = ["id"];
function _e(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, we);
}
const Re = /* @__PURE__ */ c(he, [["render", _e]]), be = a({
  name: "WMarketOverview",
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      colorTheme: "light",
      dateRange: "12M",
      showChart: !0,
      locale: "en",
      largeChartUrl: "",
      isTransparent: !1,
      showSymbolLogo: !0,
      showFloatingTooltip: !1,
      width: "400",
      height: "660",
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(240, 243, 250, 0)",
      scaleFontColor: "rgba(120, 123, 134, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      tabs: [
        {
          title: "Indices",
          symbols: [
            {
              s: "FOREXCOM:SPXUSD",
              d: "S&P 500"
            },
            {
              s: "FOREXCOM:NSXUSD",
              d: "US 100"
            },
            {
              s: "FOREXCOM:DJI",
              d: "Dow 30"
            },
            {
              s: "INDEX:NKY",
              d: "Nikkei 225"
            },
            {
              s: "INDEX:DEU40",
              d: "DAX Index"
            },
            {
              s: "FOREXCOM:UKXGBP",
              d: "UK 100"
            }
          ],
          originalTitle: "Indices"
        },
        {
          title: "Futures",
          symbols: [
            {
              s: "CME_MINI:ES1!",
              d: "S&P 500"
            },
            {
              s: "CME:6E1!",
              d: "Euro"
            },
            {
              s: "COMEX:GC1!",
              d: "Gold"
            },
            {
              s: "NYMEX:CL1!",
              d: "Crude Oil"
            },
            {
              s: "NYMEX:NG1!",
              d: "Natural Gas"
            },
            {
              s: "CBOT:ZC1!",
              d: "Corn"
            }
          ],
          originalTitle: "Futures"
        },
        {
          title: "Bonds",
          symbols: [
            {
              s: "CME:GE1!",
              d: "Eurodollar"
            },
            {
              s: "CBOT:ZB1!",
              d: "T-Bond"
            },
            {
              s: "CBOT:UB1!",
              d: "Ultra T-Bond"
            },
            {
              s: "EUREX:FGBL1!",
              d: "Euro Bund"
            },
            {
              s: "EUREX:FBTP1!",
              d: "Euro BTP"
            },
            {
              s: "EUREX:FGBM1!",
              d: "Euro BOBL"
            }
          ],
          originalTitle: "Bonds"
        },
        {
          title: "Forex",
          symbols: [
            {
              s: "FX:EURUSD"
            },
            {
              s: "FX:GBPUSD"
            },
            {
              s: "FX:USDJPY"
            },
            {
              s: "FX:USDCHF"
            },
            {
              s: "FX:AUDUSD"
            },
            {
              s: "FX:USDCAD"
            }
          ],
          originalTitle: "Forex"
        }
      ],
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-market-overview-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
    );
    return { container: n, tradingview: i };
  }
}), ye = ["id"];
function ve(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, ye);
}
const Ge = /* @__PURE__ */ c(be, [["render", ve]]), $e = a({
  name: "WSymbolInfo",
  props: {
    options: {
      type: Object,
      default: () => ({
        symbol: "NASDAQ:AAPL",
        width: 1e3,
        locale: "en",
        colorTheme: "light",
        isTransparent: !1
      })
    },
    uniqueId: {
      type: String,
      default: () => ""
    }
  },
  setup(e) {
    const t = {
      symbol: "NASDAQ:AAPL",
      width: 1e3,
      locale: "en",
      colorTheme: "light",
      isTransparent: !1,
      ...e.options
    }, { container: n, tradingview: i } = l(
      t,
      e.uniqueId,
      "tradingview-symbol-info-script",
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
    );
    return { container: n, tradingview: i };
  }
}), Se = ["id"];
function Ce(e, t, n, i, o, r) {
  return s(), d("div", {
    ref: "tradingview",
    id: e.container
  }, null, 8, Se);
}
const We = /* @__PURE__ */ c($e, [["render", Ce]]);
export {
  Ee as Chart,
  Ie as CompanyProfile,
  Ne as CryptoHeatMap,
  Fe as CryptoMarket,
  Ue as EconomicCalendar,
  De as ForexCrossRates,
  Oe as ForexHeatMap,
  Me as FundamentalData,
  Be as MarketData,
  Ge as MarketOverview,
  Xe as MiniChart,
  je as Screener,
  qe as SingleTicker,
  Ae as Snaps,
  ke as StockMarket,
  We as SymbolInfo,
  xe as SymbolOverview,
  Le as TechnicalAnalysis,
  Pe as Ticker,
  Re as TickerTape
};
