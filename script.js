let Json = {
    website: {
        header: {
          	home: {
                ru: "Главная",
                en: "Home"
            },
            links: {
                ru: "Ссылки",
                en: "Links"
            },
            donuts: {
                ru: "Донат",
                en: "Donate"
            },
            language: {
                ru: "Язык",
                en: "Language"
            }
        },
        about: {
            grettings: {
                ru: "Привет \ud83d\udc4b",
                en: "Hi \ud83d\udc4b"
            },
            first: {
                ru: "Я Евгений Храмов. Мне ",
                en: "I'm Evgeniy Khramov. I'm"
            },
            years: {
                ru: " лет.",
                en: " years old."
            },
            second: {
                ru: "Я занимаюсь фронтендом и переводами проектов.",
                en: "I do frontend and translation projects."
            },
            third: {
                ru: "Знаю HTML, CSS и изучаю Python и JavaScript.",
                en: "I know HTML, CSS and learn Python and JavaScript."
            }
        },
        donuts: {
            beforeBr: {
                ru: "Я принимаю донаты,",
                en: "I accept donations,"
            },
            afterBr: {
                ru: "буду благодарен за любую сумму ❤️",
                en: "would be grateful for any amount ❤️"
            }
        }
    }
};
(function() {
    this.I18n = function(a) {
        this.language = a || "ru";
        (function(a) {
            a.contents = Json;
            a.contents.prop = function(a) {
                let c = this;
                a = a.split(".");
                for (let b = 0; b < a.length; b++) c = c[a[b]];
                return c
            };
            a.localize()
        })(this)
    };
    this.I18n.prototype.hasCachedContents = function() {
        return void 0 !== this.contents
    };
    this.I18n.prototype.lang = function(a) {
        "string" === typeof a && (this.language = a);
        this.localize();
        return this.language
    };
    this.I18n.prototype.localize = function() {
        let a = this.contents;
        if (this.hasCachedContents())
            for (let d = function(a, b, c) {
                    let f = function(a) {
                            for (let b in a)
                                if (a.hasOwnProperty(b) && "string" === typeof a[b]) return !0
                        },
                        e;
                    for (e in a)
                        if (a.hasOwnProperty(e) && "object" === typeof a[e]) {
                            let g = b.slice();
                            g.push(e);
                            f(a[e]) ? c.push(g.reduce(function(a, b, c, d) {
                                return a + "." + b
                            })) : d(a[e], g, c)
                        } return c
                }, f = d(a, [], []), c = 0; c < f.length; c++) {
                let b = f[c];
                a.prop(b).hasOwnProperty(this.language) ? ($('[data-i18n="' + b + '"]').text(a.prop(b)[this.language]), $('[data-i18n-value="' + b + '"]').attr("value", a.prop(b)[this.language])) : ($('[data-i18n="' +
                    b + '"]').text(a.prop(b).en), $('[data-i18n-value="' + b + '"]').attr("value", a.prop(b).ru))
            }
    }
}).apply(window);
$(document).ready(function() {
    function a(a) {
        $(".switch-lang li").removeClass("selected");
        a.addClass("selected")
    }
    let d = new I18n;
    d.localize();
    $(".switch-lang #ru").addClass("selected");
    $(".switch-lang #en").on("click", function() {
        d.lang("en");
        a($(this))
    });
    $(".switch-lang #ru").on("click", function() {
        d.lang("ru");
        a($(this))
    })
});
let today = new Date,
    bday = new Date("31 August 2006"),
    years = today - bday;
document.getElementById("age").innerHTML = new Date(years).getFullYear() - 1970
// Toggle navigation menu when navigation button is clicked
$('#nav-toggle').click(function() {
    $('#nav-menu').toggleClass('show');
});

// Получаем кнопку закрытия
const closeButton = document.getElementById('nav-close');

// Получаем меню навигации
const navMenu = document.getElementById('nav-menu');

// На кнопку закрытия вешаем обработчик события клика
closeButton.addEventListener('click', function() {
    // Удаляем класс show, чтобы скрыть меню
    navMenu.classList.remove('show');
});


// Получаем все ссылки в меню навигации
const navLinks = document.querySelectorAll('#nav-menu a');

// На каждую ссылку в меню навигации вешаем обработчик события клика
navLinks.forEach((link) => {
    link.addEventListener('click', function() {
        // Удаляем класс show, чтобы скрыть меню
        navMenu.classList.remove('show');
    });
});
// Get the modal element
var modal = document.getElementById("myModal");

// Get the close button
var closeBtn = document.getElementsByClassName("close")[0];

// When the user clicks on the close button, hide the modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, hide the modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Show the modal when the user clicks on a button or link
function showModal() {
  modal.style.display = "block";
}
