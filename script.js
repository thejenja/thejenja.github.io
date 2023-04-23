let Json = {
	website: {
		header: {
			home: {
				ru: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F",
				en: "Home"
			},
			links: {
				ru: "\u0421\u0441\u044B\u043B\u043A\u0438",
				en: "Links"
			},
			donuts: {
				ru: "\u0414\u043E\u043D\u0430\u0442",
				en: "Donate"
			},
			language: {
				ru: "\u042F\u0437\u044B\u043A",
				en: "Language"
			}
		},
		about: {
			grettings: {
				ru: "\u041F\u0440\u0438\u0432\u0435\u0442 \uD83D\uDC4B",
				en: "Hi \uD83D\uDC4B"
			},
			first: {
				ru: "\u042F \u0415\u0432\u0433\u0435\u043D\u0438\u0439 \u0425\u0440\u0430\u043C\u043E\u0432. \u041C\u043D\u0435 ",
				en: "I'm Evgeniy Khramov. I'm"
			},
			years: {
				ru: " \u043B\u0435\u0442.",
				en: " years old."
			},
			second: {
				ru: "\u042F \u0437\u0430\u043D\u0438\u043C\u0430\u044E\u0441\u044C \u0444\u0440\u043E\u043D\u0442\u0435\u043D\u0434\u043E\u043C \u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430\u043C\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432.",
				en: "I do frontend and translation projects."
			},
			third: {
				ru: "\u0417\u043D\u0430\u044E HTML, CSS \u0438 \u0438\u0437\u0443\u0447\u0430\u044E Python \u0438 JavaScript.",
				en: "I know HTML, CSS and learn Python and JavaScript."
			}
		},
		donuts: {
			beforeBr: {
				ru: "\u042F \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u044E \u0434\u043E\u043D\u0430\u0442\u044B,",
				en: "I accept donations,"
			},
			afterBr: {
				ru: "\u0431\u0443\u0434\u0443 \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u0435\u043D \u0437\u0430 \u043B\u044E\u0431\u0443\u044E \u0441\u0443\u043C\u043C\u0443 \u2764\uFE0F",
				en: "would be grateful for any amount \u2764\uFE0F"
			}
		}
	}
};
(function() {
	this.I18n = function(b) {
		this.language = b || "ru",
			function(b) {
				b.contents = Json, b.contents.prop = function(d) {
					let e = this;
					d = d.split(".");
					for (let a = 0; a < d.length; a++) e = e[d[a]];
					return e
				}, b.localize()
			}(this)
	}, this.I18n.prototype.hasCachedContents = function() {
		return void 0 !== this.contents
	}, this.I18n.prototype.lang = function(b) {
		return "string" == typeof b && (this.language = b), this.localize(), this.language
	}, this.I18n.prototype.localize = function() {
		let e = this.contents;
		if (this.hasCachedContents())
			for (let a, h = function(d, a, b) {
					let c, i = function(c) {
						for (let a in c)
							if (c.hasOwnProperty(a) && "string" == typeof c[a]) return !0
					};
					for (c in d)
						if (d.hasOwnProperty(c) && "object" == typeof d[c]) {
							let e = a.slice();
							e.push(c), i(d[c]) ? b.push(e.reduce(function(c, a) {
								return c + "." + a
							})) : h(d[c], e, b)
						} return b
				}, b = h(e, [], []), d = 0; d < b.length; d++) a = b[d], e.prop(a)
				.hasOwnProperty(this.language) ? ($("[data-i18n=\"" + a + "\"]")
					.text(e.prop(a)[this.language]), $("[data-i18n-value=\"" + a + "\"]")
					.attr("value", e.prop(a)[this.language])) : ($("[data-i18n=\"" + a + "\"]")
					.text(e.prop(a)
						.en), $("[data-i18n-value=\"" + a + "\"]")
					.attr("value", e.prop(a)
						.ru))
	}
})
.apply(window), $(document)
	.ready(function() {
		function b(b) {
			$(".switch-lang li")
				.removeClass("selected"), b.addClass("selected")
		}
		let a = new I18n;
		a.localize(), $(".switch-lang #ru")
			.addClass("selected"), $(".switch-lang #en")
			.on("click", function() {
				a.lang("en"), b($(this))
			}), $(".switch-lang #ru")
			.on("click", function() {
				a.lang("ru"), b($(this))
			})
	});
let today = new Date,
	bday = new Date("31 August 2006"),
	years = today - bday;
document.getElementById("age")
	.innerHTML = new Date(years)
	.getFullYear() - 1970, $("#nav-toggle")
	.click(function() {
		$("#nav-menu")
			.toggleClass("show")
	});
const closeButton = document.getElementById("nav-close"),
	navMenu = document.getElementById("nav-menu");
closeButton.addEventListener("click", function() {
	navMenu.classList.remove("show")
});
const navLinks = document.querySelectorAll("#nav-menu a");
navLinks.forEach(a => {
	a.addEventListener("click", function() {
		navMenu.classList.remove("show")
	})
});
let modal = document.getElementById("myModal"),
	closeBtn = document.getElementsByClassName("close")[0];
closeBtn.onclick = function() {
	modal.style.display = "none"
}, window.onclick = function(a) {
	a.target == modal && (modal.style.display = "none")
};

function showModal() {
	modal.style.display = "block"
}