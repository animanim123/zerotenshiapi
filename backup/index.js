import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "API hidup 🚀",
    endpoint: ["/home", "/info", "/content"],
  });
});

app.get("/home", async (req, res) => {
  try {
    const response = await axios.get("https://mynimeku.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const animeOngoing = [];
    const mangaOngoing = [];

    $(
      ".mynimeku-update-widget--series .mynimeku-update-widget__list .mynimeku-update-widget__item",
    ).each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element)
        .find(".mynimeku-update-widget__type")
        .text()
        .trim();

      const status = $(element)
        .find(".mynimeku-update-widget__status")
        .text()
        .trim();

      const title = $(element)
        .find(".mynimeku-update-widget__series-title")
        .text()
        .trim();

      const href = $(element)
        .find(".mynimeku-update-widget__series-title")
        .attr("href");

      const slug = href?.split("/").filter(Boolean).pop();
      const katslug = href ? new URL(href).pathname.substring(1) : "";

      const eps = $(element)
        .find(".mynimeku-update-widget__latest-pill")
        .text()
        .trim();

      animeOngoing.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        eps,
      });
    });

    $(
      ".mynimeku-update-widget--komik .mynimeku-update-widget__list .mynimeku-update-widget__item",
    ).each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element)
        .find(".mynimeku-update-widget__type")
        .text()
        .trim();

      const status = $(element)
        .find(".mynimeku-update-widget__status")
        .text()
        .trim();

      const title = $(element)
        .find(".mynimeku-update-widget__series-title")
        .text()
        .trim();

      const href = $(element)
        .find(".mynimeku-update-widget__series-title")
        .attr("href");

      const slug = href?.split("/").filter(Boolean).pop();
      const katslug = href ? new URL(href).pathname.substring(1) : "";

      const ch = $(element)
        .find(".mynimeku-update-widget__latest-pill")
        .text()
        .trim();

      mangaOngoing.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        ch,
      });
    });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        ["series"]: animeOngoing,
        ["komik"]: mangaOngoing,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/info/:type/*", async (req, res) => {
  const type = req.params.type;
  const slug = req.params[0];
  const url = `https://www.mynimeku.com/${type}/${slug}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const img = $(".komik-series-hero")
      .children(".komik-series-hero__cover")
      .children("img");
    const getposter =
      img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
    const poster = getposter?.replace(/^\/\//, "https://");

    const title = $(".komik-series-hero")
      .children("h1.komik-series-hero__title")
      .text()
      .trim();
    const rating = $(".komik-series-table tbody tr")
      .eq(5)
      .find("td")
      .text()
      .trim();
    const description = $(".komik-series-entry p").first().text().trim();

    const genre = [];

    $(".komik-series-taxonomy__terms")
      .children("a")
      .each((i, element) => {
        const gen = $(element).text().trim();
        genre.push(gen);
      });

    const info = {};

    const native = $(".komik-series-table tbody tr").each((i, el) => {
      const label = $(el).find("th").text().trim();
      const value = $(el).find("td").text().trim();

      info[label] = value;
    });

    const episodelist = [];

    $(".komik-series-chapter-item").each((i, el) => {
      const episode = $(el)
        .find(".komik-series-chapter-item__num")
        .text()
        .trim();
      const episodetitle = $(el)
        .find(
          ".komik-series-chapter-item__title-row .komik-series-chapter-item__title",
        )
        .text()
        .trim();
      const episodedate = $(el)
        .find(".komik-series-chapter-item__date")
        .text()
        .trim();
      const episodehref = $(el).attr("href");
      const katepisode = new URL(episodehref).pathname.substring(1);
      const episodeId = episodehref.split("/").filter(Boolean).pop();

      episodelist.push({
        episode,
        episodetitle,
        episodedate,
        episodehref,
        katepisode,
        episodeId,
      });
    });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        poster,
        title,
        rating,
        genre,
        description,
        info,
        list: episodelist,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/content/:katcontent/*", async (req, res) => {
  const katcontent = req.params[0];
  const url = `https://www.mynimeku.com/${katcontent}/`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const gettitleseries = $(
      ".mynimeku-episode-head .mynimeku-episode-head__title",
    );
    const gettitlekomik = $(".entry-hero .entry-title");
    const selectTitle =
      gettitleseries.first().text().trim() ||
      gettitlekomik.first().text().trim();
    const titleepsode = selectTitle || "Unknown Title";

    const date = $(".post-info .time-info").text().trim();

    const servers1 = [];
    const servers2 = [];

    $(
      ".mynimeku-episode-player__servers .mynimeku-episode-server-group .mynimeku-episode-server-btn",
    )
      .slice(0, 6)
      .each((i, el) => {
        const server = $(el).attr("data-player-url");
        const servertitle = $(el).text().trim();

        servers1.push({
          server,
          servertitle,
        });
      });

    $(
      ".mynimeku-episode-player__servers .mynimeku-episode-server-group .mynimeku-episode-server-btn",
    )
      .slice(7, 12)
      .each((i, el) => {
        const server = $(el).attr("data-player-url");
        const servertitle = $(el).text().trim();

        servers2.push({
          server,
          servertitle,
        });
      });

    const komik = [];
    $(".komik-reader-content p img").each((i, el) => {
      const img = $(el).attr("src")?.replace(/^\/\//, "https://");
      const imgId = $(el).attr("img-id");
      komik.push({
        img,
        imgId,
      });
    });

    const nav = [];
    const navEpisode = $(".mynimeku-episode-nav__grid .mynimeku-episode-nav__col");
    const navKomik = $(".komik-chapter-nav__grid .komik-chapter-nav__col");
    const getnav = navEpisode.length > 0 ? navEpisode : navKomik;

    // prev
    const getpref =
      getnav.find(".mynimeku-episode-nav__control--prev").attr("href") ||
      getnav.find(".komik-chapter-nav__control--prev").attr("href");
    const pref = getpref
      ? new URL(getpref).pathname.substring(1)
      : "Tidak ada prev";

    // next
    const getnext =
      getnav.find(".mynimeku-episode-nav__control--next").attr("href") ||
      getnav.find(".komik-chapter-nav__control--next").attr("href");
    const next = getnext
      ? new URL(getnext).pathname.substring(1)
      : "Tidak ada next";

    nav.push({ pref, next });

    const listepisode = [];
    const listchapter = [];


    $(".mynimeku-episode-overlay__inner .mynimeku-episode-list .mynimeku-episode-card").each((i, el) => {
      const episode = $(el).find(".mynimeku-episode-card__num").text().trim();
      const episodetitle = $(el)
        .find(".mynimeku-episode-card__title")
        .text()
        .trim();
      const episodedate = $(el)
        .find(".mynimeku-episode-card__date")
        .text()
        .trim();
      const episodehref = $(el).attr("href");
      const katepisode = new URL(episodehref).pathname.substring(1);
      const episodeId = episodehref.split("/").filter(Boolean).pop();

      listepisode.push({
        episode,
        episodetitle,
        episodedate,
        episodehref,
        katepisode,
        episodeId,
      });
    });
    
    $(".komik-chapter-overlay__inner .komik-chapter-list__panel .komik-chapter-card-row").each((i, el) => {
      const chapter = $(el).find(".komik-chapter-card__number").text().trim();
      const chaptertitle = $(el)
        .find(".komik-chapter-card__text")
        .text()
        .trim();
      const chapterdate = $(el)
        .find(".komik-chapter-card__date")
        .text()
        .trim();
      const chapterhref = $(el).find(".komik-chapter-card").attr("href");
      const katchapter = new URL(chapterhref).pathname.substring(1);
      const chapterId = chapterhref.split("/").filter(Boolean).pop();

      listchapter.push({
        chapter,
        chaptertitle,
        chapterdate,
        chapterhref,
        katchapter,
        chapterId,
      });
    });

    const list = listepisode.length > 0 ? listepisode : listchapter;

    const content =
      servers1.length > 0 && servers2.length > 0
        ? { ["public"]: servers1, ["private"]: servers2 }
        : { komiks: komik };

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        titleepsode,
        date,
        content,
        nav,
        list,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/image", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send("URL tidak ada");
    }

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.mynimeku.com/",
        Origin: "https://www.mynimeku.com",
        Connection: "keep-alive",
      },
    });

    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Gagal ambil gambar");
  }
});

app.get("/latestseries/page/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/latest-series/page/${page}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const latestseries = [];
    const nav = [];

    $(".mynimeku-update-feed__list .mynimeku-update-feed__item").each((i, element) => {
      const img = $(element).find(".mynimeku-update-feed__cover").children("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find(".mynimeku-update-feed__body .mynimeku-update-feed__badges .mynimeku-update-feed__badge").first().text().trim();
      const status = $(element).find(".mynimeku-update-feed__body .mynimeku-update-feed__badges .mynimeku-update-feed__badge").last().text().trim();
      const title = $(element).find(".mynimeku-update-feed__body .mynimeku-update-feed__series-title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);
      const eps = $(element)
        .find(".mynimeku-update-feed__latest-link .mynimeku-update-feed__latest-content .mynimeku-update-feed__latest-pill")
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .trim()
        .split("\n")[0]
        .trim();

      latestseries.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        eps,
      });
    });

    $(".mynimeku-update-feed__pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        if (isNaN(page)) return;

        nav.push({
          page,
          active: $(el).hasClass("is-current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        latestseries,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/latestkomik/page/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/latest-komik/page/${page}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const latestkomik = [];
    const nav = [];

    $(".mynimeku-update-feed__list .mynimeku-update-feed__item").each((i, element) => {
      const img = $(element).find(".mynimeku-update-feed__cover").children("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find(".mynimeku-update-feed__body .mynimeku-update-feed__badges .mynimeku-update-feed__badge").first().text().trim();
      const status = $(element).find(".mynimeku-update-feed__body .mynimeku-update-feed__badges .mynimeku-update-feed__badge").last().text().trim();
      const title = $(element).find(".mynimeku-update-feed__body .mynimeku-update-feed__series-title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);
      const ch = $(element)
        .find(".mynimeku-update-feed__latest-link .mynimeku-update-feed__latest-content .mynimeku-update-feed__latest-pill")
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .trim()
        .split("\n")[0]
        .trim();

      latestkomik.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        ch,
      });
    });

      $(".mynimeku-update-feed__pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        if (isNaN(page)) return;

        nav.push({
          page,
          active: $(el).hasClass("is-current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        latestkomik,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/search/*", async (req, res) => {
  const keyword = req.params[0];
  const url = `https://www.mynimeku.com/search/${keyword}`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const search = [];

    $(".mynimeku-search-feed__list .mynimeku-search-feed__item").slice(0, 7).each((i, element) => {
      const img = $(element).find(".mynimeku-search-feed__cover").children("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find(".mynimeku-search-feed__body .mynimeku-search-feed__meta .mynimeku-search-feed__type").first().text().trim();
      const status = $(element).find(".mynimeku-search-feed__body .mynimeku-search-feed__meta .mynimeku-search-feed__status").last().text().trim();
      const title = $(element).find(".mynimeku-search-feed__body .mynimeku-search-feed__series-title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);

      search.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
      });
    });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        search,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/popular/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/full-list/mix/o:popular/page/${page}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const popular = [];
    const nav = [];

    $(".mynimeku-mix-feed__list .mynimeku-mix-feed__item").each((i, element) => {
      const img = $(element).find(".mynimeku-mix-feed__cover").children("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__meta .mynimeku-mix-feed__type").first().text().trim();
      const status = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__meta .mynimeku-mix-feed__status").last().text().trim();
      const title = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__series-title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);

      popular.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
      });
    });

    $(".mynimeku-mix-feed__pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        if (isNaN(page)) return;

        nav.push({
          page,
          active: $(el).hasClass("is-current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        popular,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/list/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/full-list/page/${page}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const list = [];
    const nav = [];

    $(".mynimeku-mix-feed__list .mynimeku-mix-feed__item").each((i, element) => {
      const img = $(element).find(".mynimeku-mix-feed__cover").children("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__meta .mynimeku-mix-feed__type").first().text().trim();
      const status = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__meta .mynimeku-mix-feed__status").last().text().trim();
      const title = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__series-title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);

      list.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
      });
    });

    $(".mynimeku-mix-feed__pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        if (isNaN(page)) return;

        nav.push({
          page,
          active: $(el).hasClass("is-current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        list,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/ongoing/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/full-list/mix/s:on-going/page/${page}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const ongoing = [];
    const nav = [];

    $(".mynimeku-mix-feed__list .mynimeku-mix-feed__item").each((i, element) => {
      const img = $(element).find(".mynimeku-mix-feed__cover").children("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__meta .mynimeku-mix-feed__type").first().text().trim();
      const status = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__meta .mynimeku-mix-feed__status").last().text().trim();
      const title = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__series-title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);

      ongoing.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
      });
    });

    $(".mynimeku-mix-feed__pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        if (isNaN(page)) return;

        nav.push({
          page,
          active: $(el).hasClass("is-current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        ongoing,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/movie/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/full-list/mix/t:MOVIE/page/${page}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const movie = [];
    const nav = [];

   $(".mynimeku-mix-feed__list .mynimeku-mix-feed__item").each((i, element) => {
      const img = $(element).find(".mynimeku-mix-feed__cover").children("img");
      const getposter = img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__meta .mynimeku-mix-feed__type").first().text().trim();
      const status = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__meta .mynimeku-mix-feed__status").last().text().trim();
      const title = $(element).find(".mynimeku-mix-feed__body .mynimeku-mix-feed__series-title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);

      movie.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
      });
    });

    $(".mynimeku-mix-feed__pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        if (isNaN(page)) return;

        nav.push({
          page,
          active: $(el).hasClass("is-current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        movie,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
