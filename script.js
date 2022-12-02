let demoJson = {
	"website": {
		"header": {
			"links": {
				"ru": "Ссылки",
				"en": "Links"
			},
			"projects": {
				"ru": "Проекты",
				"en": "Projects"
			},
			"donuts": {
				"ru": "Донаты",
				"en": "Donuts"
			},
			"language": {
				"ru": "Язык",
				"en": "Language"
			}
		},
		"about": {
			"grettings": {
				"ru": "Приветствую 👋",
				"en": "Hi 👋"
			},
			"first": {
				"ru": "Меня зовут Евгений Храмов.",
				"en": "My name's Evgeniy Khramov (thejenja_)"
			},
			"i": {
				"ru": "Я ",
				"en": "I'm "
			},
			"second": {
				"ru": "-летний frontend разработчик.",
				"en": "-year-old frontend developer."
			},
			"third": {
				"ru": "Изучаю Python и JavaScript.",
				"en": "I'm learning Python and JavaScript."
			}
		},
		"donuts": {
			"beforeBr": {
				"ru": "Также я принимаю донаты,",
				"en": "I also accept donations,"
			},
			"afterBr": {
				"ru": "буду благодарен за любую копеечку ❤️",
				"en": "I would be grateful for any penny ❤️"
			}
		}
	}
};

(function () {
	this.I18n = function (defaultLang) {
		let lang = defaultLang || 'ru';
		this.language = lang;

		(function (i18n) {
			i18n.contents = demoJson;
			i18n.contents.prop = function (key) {
				let result = this;
				let keyArr = key.split('.');
				for (let index = 0; index < keyArr.length; index++) {
					let prop = keyArr[index];
					result = result[prop];
				}
				return result;
			};
			i18n.localize();
		})(this);
	};

	this.I18n.prototype.hasCachedContents = function () {
		return this.contents !== undefined;
	};

	this.I18n.prototype.lang = function (lang) {
		if (typeof lang === 'string') {
			this.language = lang;
		}
		this.localize();
		return this.language;
	};

	this.I18n.prototype.localize = function () {
		let contents = this.contents;
		if (!this.hasCachedContents()) {
			return;
		}
		let dfs = function (node, keys, results) {
			let isLeaf = function (node) {
				for (let prop in node) {
					if (node.hasOwnProperty(prop)) {
						if (typeof node[prop] === 'string') {
							return true;
						}
					}
				}
			}
			for (let prop in node) {
				if (node.hasOwnProperty(prop) && typeof node[prop] === 'object') {
					let myKey = keys.slice();
					myKey.push(prop);
					if (isLeaf(node[prop])) {
						//results.push(myKey.reduce((prev, current) => prev + '.' + current));	//not supported in older mobile broweser
						results.push(myKey.reduce( function (previousValue, currentValue, currentIndex, array) {
							return previousValue + '.' + currentValue;
						}));
					} else {
						dfs(node[prop], myKey, results);
					}
				}
			}
			return results;
		};
		let keys = dfs(contents, [], []);
		for (let index = 0; index < keys.length; index++) {
			let key = keys[index];
			if (contents.prop(key).hasOwnProperty(this.language)) {
				$('[data-i18n="'+key+'"]').text(contents.prop(key)[this.language]);
				$('[data-i18n-value="'+key+'"]').attr('value', contents.prop(key)[this.language]);
			} else {
				$('[data-i18n="'+key+'"]').text(contents.prop(key)['en']);
				$('[data-i18n-value="'+key+'"]').attr('value', contents.prop(key)['ru']);
			}
		}
	};

}).apply(window);

$( document ).ready( function () {

	let i18n = new I18n();
	i18n.localize();
	$('.switch-lang #ru').addClass('selected');
	
	$('.switch-lang #en').on('click', function () {
		i18n.lang('en');
		selectLang($(this));
	})
	$('.switch-lang #ru').on('click', function () {
		i18n.lang('ru');
		selectLang($(this));
	})

	function selectLang (picker) {
		$('.switch-lang li').removeClass('selected');
		picker.addClass('selected');
	}
});