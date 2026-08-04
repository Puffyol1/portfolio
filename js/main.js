/**
 * main.js — 渲染 content.js 中的数据，处理交互
 *  - 按占位元素的 data-* 属性填充文本与列表
 *  - 项目卡片展开 / 折叠（无障碍）
 *  - 滚动淡入（IntersectionObserver）
 *  - 顶部导航滚动态
 */
(function () {
  "use strict";

  var c = window.SITE_CONTENT;
  if (!c) return;

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  // 安全转义，避免内容中的 HTML 被误解析
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // data-attr 名 → content 键名映射（不一致时用）
  var DATA_KEY_MAP = { academic: "academicProjects" };

  // 按 data-{section}="key" 填充单个文本节点
  function fill(root, dataKey) {
    var contentKey = DATA_KEY_MAP[dataKey] || dataKey;
    $$("[data-" + dataKey + "]", root).forEach(function (el) {
      var key = el.getAttribute("data-" + dataKey);
      if (dataKey === "hero") {
        // hero 特殊：按钮要带 href
        if (key === "primaryCta") {
          el.textContent = c.hero.primaryCta.label;
          el.setAttribute("href", c.hero.primaryCta.href);
        } else if (key === "secondaryCta") {
          el.textContent = c.hero.secondaryCta.label;
          el.setAttribute("href", c.hero.secondaryCta.href);
        } else if (c.hero[key] != null) {
          el.textContent = c.hero[key];
        }
      } else if (c[contentKey] && typeof c[contentKey][key] === "string") {
        el.textContent = c[contentKey][key];
      }
    });
  }

  // ---- 渲染：关于我 ----
  function renderAbout() {
    var root = $("#about");
    fill(root, "about");

    var edu = $("[data-about='education']", root);
    if (edu) {
      edu.innerHTML = c.about.education
        .map(function (e, idx) {
          var hasDetail = !!e.detail;
          var head =
            "<li" + (hasDetail ? ' class="edu-item edu-item--expandable"' : ' class="edu-item"') + ">" +
            (hasDetail
              ? '<button class="edu-head" type="button" aria-expanded="false" aria-controls="edu-detail-' + idx + '" id="edu-head-' + idx + '">'
              : '<div class="edu-head edu-head--plain">') +
            '<span class="edu-head__main">' +
              '<span class="school">' + esc(e.school) + "</span>" +
              '<span class="degree">' + esc(e.degree) + "</span>" +
              '<span class="note">' + esc(e.note) + "</span>" +
            "</span>" +
            (hasDetail ? '<span class="edu-caret" aria-hidden="true">+</span>' : "") +
            (hasDetail ? "</button>" : "</div>");

          var detail = "";
          if (hasDetail) {
            var det = e.detail;
            // 课程分组
            var groups = "";
            Object.keys(det.courses).forEach(function (groupName) {
              var tags = det.courses[groupName]
                .map(function (k) { return "<li>" + esc(k) + "</li>"; })
                .join("");
              groups +=
                '<div class="edu-courses__group">' +
                '<p class="edu-courses__label">' + esc(groupName) + "</p>" +
                '<ul class="tags">' + tags + "</ul>" +
                "</div>";
            });

            detail =
              '<div class="edu-detail" id="edu-detail-' + idx + '" role="region" aria-labelledby="edu-head-' + idx + '">' +
              '<div class="edu-detail__inner">' +
              '<p class="edu-gpa"><span class="edu-gpa__label">平均分</span><span class="edu-gpa__val">' + esc(det.gpa) + "</span></p>" +
              '<p class="subheading" style="margin-top:14px">修读课程</p>' +
              '<div class="edu-courses">' + groups + "</div>" +
              "</div>" +
              "</div>";
          }

          return head + detail + "</li>";
        })
        .join("");

      // 绑定教育下钻
      $$(".edu-head", edu).forEach(function (btn) {
        if (btn.tagName !== "BUTTON") return;
        btn.addEventListener("click", function () {
          var open = btn.getAttribute("aria-expanded") === "true";
          var detail = btn.parentElement.querySelector(".edu-detail");
          if (!detail) return;
          if (open) {
            // 收起：先撑开当前高度再归零，触发过渡
            detail.style.maxHeight = detail.scrollHeight + "px";
            requestAnimationFrame(function () {
              detail.style.maxHeight = "0px";
            });
            btn.setAttribute("aria-expanded", "false");
            btn.parentElement.classList.remove("is-open");
          } else {
            // 展开
            detail.style.maxHeight = detail.scrollHeight + "px";
            btn.setAttribute("aria-expanded", "true");
            btn.parentElement.classList.add("is-open");
            detail.addEventListener("transitionend", function onEnd() {
              if (btn.getAttribute("aria-expanded") === "true") {
                detail.style.maxHeight = "none";
              }
              detail.removeEventListener("transitionend", onEnd);
            });
          }
        });
      });
    }

    var kw = $("[data-about='keywords']", root);
    if (kw) {
      kw.innerHTML = c.about.keywords
        .map(function (k) {
          return "<li>" + esc(k) + "</li>";
        })
        .join("");
    }
  }

  // ---- 渲染：学术项目（可展开）----
  function renderAcademic() {
    var root = $("#academic");
    if (!root) return;
    fill(root, "academic");

    var wrap = $("[data-academic='items']", root);
    if (!wrap) return;

    wrap.innerHTML = c.academicProjects.items
      .map(function (p, i) {
        return (
          '<article class="academic-card" data-index="' + i + '">' +
          '<button class="academic-card__head" type="button" ' +
          'aria-expanded="false" aria-controls="aca-body-' + i + '" id="aca-head-' + i + '">' +
          '<span class="academic-card__titles">' +
          '<p class="academic-card__period">' + esc(p.period) + "</p>" +
          '<h3 class="academic-card__title">' + esc(p.title) + "</h3>" +
          (p.honor ? '<p class="academic-card__honor">' + esc(p.honor) + "</p>" : "") +
          '<p class="academic-card__summary">' + esc(p.summary) + "</p>" +
          "</span>" +
          '<span class="academic-card__icon" aria-hidden="true">+</span>' +
          "</button>" +
          '<div class="academic-card__body" id="aca-body-' + i + '" role="region" aria-labelledby="aca-head-' + i + '">' +
          '<dl class="academic-card__body-inner">' +
          "<dt>背景</dt><dd>" + esc(p.background) + "</dd>" +
          "<dt>做法</dt><dd>" + esc(p.approach) + "</dd>" +
          "<dt>收获</dt><dd>" + esc(p.takeaway) + "</dd>" +
          "</dl>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    // 绑定展开/收起（复用项目卡片逻辑）
    $$(".academic-card", wrap).forEach(function (card) {
      var btn = $(".academic-card__head", card);
      var body = $(".academic-card__body", card);
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        if (open) {
          body.style.maxHeight = body.scrollHeight + "px";
          requestAnimationFrame(function () { body.style.maxHeight = "0px"; });
          btn.setAttribute("aria-expanded", "false");
        } else {
          body.style.maxHeight = body.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
          body.addEventListener("transitionend", function onEnd() {
            if (btn.getAttribute("aria-expanded") === "true") body.style.maxHeight = "none";
            body.removeEventListener("transitionend", onEnd);
          });
        }
      });
    });
  }

  // ---- 渲染：经历时间线 ----
  function renderExperience() {
    var root = $("#experience");
    fill(root, "experience");

    var list = $("[data-experience='items']", root);
    if (list) {
      list.innerHTML = c.experience.items
        .map(function (it) {
          var points = it.points
            .map(function (p) {
              return "<li>" + esc(p) + "</li>";
            })
            .join("");
          return (
            "<li>" +
            '<span class="period">' +
            esc(it.period) +
            "</span>" +
            '<p class="role-line"><span class="company">' +
            esc(it.company) +
            '</span> · <span class="role">' +
            esc(it.role) +
            "</span></p>" +
            '<p class="summary">' +
            esc(it.summary) +
            "</p>" +
            '<ul class="points">' +
            points +
            "</ul>" +
            "</li>"
          );
        })
        .join("");
    }
  }

  // ---- 渲染：精选项目（可展开卡片）----
  function renderProjects() {
    var root = $("#projects");
    fill(root, "projects");

    var wrap = $("[data-projects='items']", root);
    if (!wrap) return;

    wrap.innerHTML = c.projects.items
      .map(function (p, i) {
        return (
          '<article class="project-card" data-index="' +
          i +
          '">' +
          '<button class="project-card__head" type="button" ' +
          'aria-expanded="false" aria-controls="proj-body-' +
          i +
          '" id="proj-head-' +
          i +
          '">' +
          '<span class="project-card__titles">' +
          '<h3 class="project-card__title">' +
          esc(p.title) +
          "</h3>" +
          (p.note
            ? '<p class="project-card__note">' + esc(p.note) + "</p>"
            : "") +
          (p.demo
            ? '<a class="project-card__demo" href="' +
              esc(p.demo) +
              '">查看脱敏演示看板 →</a>'
            : "") +
          '<p class="project-card__summary">' +
          esc(p.summary) +
          "</p>" +
          "</span>" +
          '<span class="project-card__icon" aria-hidden="true">+</span>' +
          "</button>" +
          '<div class="project-card__body" id="proj-body-' +
          i +
          '" role="region" aria-labelledby="proj-head-' +
          i +
          '">' +
          '<dl class="project-card__body-inner">' +
          "<dt>背景</dt><dd>" +
          esc(p.background) +
            "</dd>" +
          "<dt>做法</dt><dd>" +
          esc(p.approach) +
          "</dd>" +
          "<dt>收获</dt><dd>" +
          esc(p.takeaway) +
          "</dd>" +
          "</dl>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    // 绑定展开 / 折叠
    $$(".project-card", wrap).forEach(function (card) {
      var btn = $(".project-card__head", card);
      var body = $(".project-card__body", card);

      var toggle = function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        if (open) {
          body.style.maxHeight = body.scrollHeight + "px";
          // 先撑开再归零，确保过渡可触发
          requestAnimationFrame(function () {
            body.style.maxHeight = "0px";
          });
          btn.setAttribute("aria-expanded", "false");
        } else {
          body.style.maxHeight = body.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
          // 展开完成后放开高度，避免内容换行时被裁切
          body.addEventListener(
            "transitionend",
            function onEnd() {
              if (btn.getAttribute("aria-expanded") === "true") {
                body.style.maxHeight = "none";
              }
              body.removeEventListener("transitionend", onEnd);
            }
          );
        }
      };

      btn.addEventListener("click", toggle);
    });
  }

  // ---- 渲染：技能 ----
  function renderSkills() {
    var root = $("#skills");
    fill(root, "skills");

    var wrap = $("[data-skills='groups']", root);
    if (!wrap) return;

    wrap.innerHTML = c.skills.groups
      .map(function (g) {
        var tags = g.tags
          .map(function (t) {
            return "<li>" + esc(t) + "</li>";
          })
          .join("");
        return (
          '<div class="skill">' +
          '<h3 class="skill__name">' +
          esc(g.name) +
          "</h3>" +
          '<p class="skill__desc">' +
          esc(g.desc) +
          "</p>" +
          '<ul class="skill__tags">' +
          tags +
          "</ul>" +
          "</div>"
        );
      })
      .join("");
  }

  // ---- 渲染：联系方式 ----
  function renderContact() {
    var root = $("#contact");
    fill(root, "contact");

    var list = $("[data-contact='channels']", root);
    if (list) {
      list.innerHTML = c.contact.channels
        .map(function (ch) {
          return (
            "<li><a href='" +
            esc(ch.href) +
            "' target='_blank' rel='noopener noreferrer'>" +
            '<span class="label">' +
            esc(ch.label) +
            "</span>" +
            '<span class="hint">' +
            esc(ch.hint) +
            "</span>" +
            "</a></li>"
          );
        })
        .join("");
    }
  }

  // ---- 渲染：页脚 ----
  function renderFooter() {
    var el = $("[data-footer='note']");
    if (el) el.textContent = c.footer.note;
  }

  // ---- 滚动淡入 ----
  function initReveal() {
    var reveals = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  // ---- 顶部导航滚动态 ----
  function initHeaderScroll() {
    var header = $(".site-header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- 启动 ----
  function init() {
    fill(document, "hero");
    renderAbout();
    renderExperience();
    renderProjects();
    renderAcademic();
    renderSkills();
    renderContact();
    renderFooter();
    initReveal();
    initHeaderScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
