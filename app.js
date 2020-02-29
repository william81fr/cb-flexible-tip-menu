/*
 * Made by william81fr for goddesssrina
 * Improvements and issues at: https://github.com/william81fr/cb-flexible-tip-menu
 */

// modify the next few lines to adjust the admin panel
const nb_of_menu_items = 99; // max number of configurable menu items
const enable_thank_tippers = true; // whether the Thank Tippers module appears in the admin panel at all
const lang = 'en'; // language of the admin panel; values are 'en' or 'fr'; save and come back to the admin panel to see the changes

// don't modify anything from here on
const default_app_name = 'Flexible Tip Menu';
const is_debug = false; // this prevents the app from running, and instead shows debug info in the chat

const color_black = '#000000';
const color_white = '#FFFFFF';
const color_bright_red = '#FF0000';
const color_bright_green = '#00FF00';
const color_bright_blue = '#0000FF'
const color_pastel_red = '#ea9999';
const color_pastel_green = '#b6d7a8';
const color_pastel_blue = '#a4c2f4'

const colors_list = {
	'black': color_black,
	'white': color_white,
	'bright red': color_bright_red,
	'bright green': color_bright_green,
	'bright blue': color_bright_blue,
	'pastel red': color_pastel_red,
	'pastel green': color_pastel_green,
	'pastel blue': color_pastel_blue,
};

const group_mods = 'red';
const group_fans = 'green';
const group_50tk = 'darkblue';
const group_250tk = 'lightpurple';
const group_1000tk = 'darkpurple';
const group_havetk = 'lightblue';

const weight_normal = 'normal';
const weight_bold = 'bold';
const weight_bolder = 'bolder';

let shown_errors = []; // Used to show error messages only once


//
// CB has this feature where a setting name is transposed directly as a label in the admin UI
//	  for example, the "app_name" setting show as "App name" in the UI
// Apparently, the first letter is capitalized and all underscores are changed into spaces
//	  but most other characters are kept, including punctuation
//	  NB: accentuated letters are stripped
// Therefore, so as to keep our code readable, here is a map of variables and their labels:
//
const i18n = {
	en: {
		app_name: "GLOBAL SETTINGS -------------------------- App name",
		errors_shown_to: "Show the errors to...",
		thank_tippers: "THANK TIPPERS MODULE -------------------------- Enable/disable",
		thank_tippers_above_tokens: "Only tips above this limit will get a thank you",
		thank_tippers_publicly_background_color: "Background color for the public thanks (hexa code)",
		thank_tippers_publicly_text_color: "Text color for the public thanks (hexa code)",
		thank_tippers_publicly_boldness: "Text thickness for the public thanks",
		thank_tippers_publicly_format: "Template for the public thanks (variables are: {TIPPER}, {AMOUNT}, {SERVICE})",
		thank_tippers_privately_background_color: "Background color for the private thanks (hexa code)",
		thank_tippers_privately_text_color: "Text color for the private thanks (hexa code)",
		thank_tippers_privately_boldness: "Text thickness for the private thanks",
		thank_tippers_privately_format: "Template for the private thanks (variables are: {TIPPER}, {AMOUNT}, {SERVICE})",
		thank_tippers_remind_tip_note_format: "Template for the tip note reminder (variables are: {MESSAGE})",
		tip_menu_shown_to: "TIP MENU -------------------------- Show the tip menu to...",
		tip_menu_header: "Line before the tip menu",
		tip_menu_footer: "Line at the end of the tip menu",
		inline_separator: "Separator for a one-line tip menu (leave empty for multi-line)",
		inline_spacing: "Spacing around the one-liner separator",
		menu_background_color: "Background color for the tip menu (hexa code)",
		menu_text_color: "Text color for the tip menu (hexa code)",
		menu_boldness: "Text thickness for the tip menu",
		menu_repeat_minutes: "Wait this long (in minutes) before repeating the menu",
		menu_item_prefix: "Text prefix for the menu items (prepend)",
		menu_item_suffix: "Text suffix for the menu items (append)",
		menu_item_display_format: "Template for the tip menu items (variables are: {LABEL}, {AMOUNT})",
		sort_order: "Sort the menu items before display, regardless of their order below",
		menu_item_lbl: "menu item #",
		lbl_not_applicable: "n/a",
		lbl_tip_menu_shown_to_all: "everybody",
		lbl_tip_menu_shown_to_fans: "fans",
		//lbl_tip_menu_shown_to_50tk: "Dark Blue (Tipped 50 recently)",
		//lbl_tip_menu_shown_to_250tk: "Light Purple (Tipped 250 recently)",
		//lbl_tip_menu_shown_to_1000tk: "Dark Purple (Tipped 1000 recently)",
		//lbl_tip_menu_shown_to_havetk: "Light Blue (Own or purchased tokens)",
		lbl_tip_menu_shown_to_havetk: "own or purchased tokens",
		lbl_tip_menu_shown_to_self: "the user who sent the command",
		lbl_thank_tippers_publicly: "publicly",
		lbl_thank_tippers_privately: "privately",
		lbl_inline_spacing_before: "before",
		lbl_inline_spacing_after: "after",
		lbl_inline_spacing_both: "before + after",
		lbl_errors_shown_to_host: "broadcaster",
		lbl_errors_shown_to_hostmods: "broadcaster + moderators",
		lbl_sort_amount_asc: "lowest to highest",
		lbl_sort_amount_desc: "highest to lowest",
		default_thank_tippers_publicly_format: "{TIPPER} tipped {AMOUNT} for {SERVICE}",
		default_thank_tippers_privately_format: "Thank you {TIPPER} for your {AMOUNT}tk tip",
		default_thank_tippers_remind_tip_note_format: "Your tip note was: {MESSAGE}",
		default_menu_item_display_format: "{LABEL} ({AMOUNT}tk)",
	},
	fr: {
		app_name: "PARAMETRES GENERAUX -------------------------- Nom de l'aplication",
		errors_shown_to: "A qui montrer les erreurs...",
		thank_tippers: "MODULE REMERCIEMENT -------------------------- Activer/desactiver",
		thank_tippers_above_tokens: "Seuls les tips au dela de cette limite sont remercies",
		thank_tippers_publicly_background_color: "Couleur de fond pour les remerciements publiques (code hexa)",
		thank_tippers_publicly_text_color: "Couleur du texte pour les remerciements publiques (code hexa)",
		thank_tippers_publicly_boldness: "Epaisseur du texte pour les remerciements publiques",
		thank_tippers_publicly_format: "Modele pour les remerciements publiques (variables sont : {TIPPER}, {AMOUNT}, {SERVICE})",
		thank_tippers_privately_background_color: "Couleur de fond pour les remerciements prives (code hexa)",
		thank_tippers_privately_text_color: "Couleur du texte pour les remerciements prives (code hexa)",
		thank_tippers_privately_boldness: "Epaisseur du texte pour les remerciements prives",
		thank_tippers_privately_format: "Modele pour les remerciements prives (variables sont : {TIPPER}, {AMOUNT}, {SERVICE})",
		thank_tippers_remind_tip_note_format: "Modele pour le rappel de commentaire de tip (variables sont : {MESSAGE})",
		tip_menu_shown_to: "MENU DE TIPS -------------------------- A qui proposer le menu...",
		tip_menu_header: "Ligne avant le menu de tips",
		tip_menu_footer: "Ligne apres le menu de tips",
		inline_separator: "Separateur pour un menu monoligne (laisser vide pour multi ligne)",
		inline_spacing: "Espacement autour du separateur monoligne",
		menu_background_color: "Couleur de fond pour le menu de tips (code hexa)",
		menu_text_color: "Couleur du texte pour le menu de tips (code hexa)",
		menu_boldness: "Epaisseur du texte pour le menu de tips",
		menu_repeat_minutes: "Attendre ce delai (en minutes) avant de repeter le menu",
		menu_item_prefix: "Text prefix for the menu items (prepend)",
		menu_item_suffix: "Text suffix for the menu items (append)",
		menu_item_display_format: "Modele pour les elements du menu de tips (variables sont : {LABEL}, {AMOUNT})",
		sort_order: "Trier le menu avant affichage, peu importe l'ordre ci dessous",
		menu_item_lbl: "element du menu #",
		lbl_not_applicable: "n/a",
		lbl_tip_menu_shown_to_all: "tout le monde",
		lbl_tip_menu_shown_to_fans: "fans",
		//lbl_tip_menu_shown_to_50tk: "Bleu Fonce (A Tippe 50 recemment)",
		//lbl_tip_menu_shown_to_250tk: "Violet Clair (A tippe 250 recemment)",
		//lbl_tip_menu_shown_to_1000tk: "Violet Fonce (A tippe 1000 recemment)",
		//lbl_tip_menu_shown_to_havetk: "Bleu Clair (Possede des tokens)",
		lbl_tip_menu_shown_to_havetk: "possedant des tokens",
		lbl_tip_menu_shown_to_self: "l'utilisateur qui a envoye la commande",
		lbl_thank_tippers_publicly: "publiquement",
		lbl_thank_tippers_privately: "en prive",
		lbl_inline_spacing_before: "avant",
		lbl_inline_spacing_after: "apres",
		lbl_inline_spacing_both: "avant + apres",
		lbl_errors_shown_to_host: "streameur",
		lbl_errors_shown_to_hostmods: "streameur + moderateurs",
		lbl_sort_amount_asc: "du plus faible au plus eleve",
		lbl_sort_amount_desc: "du plus eleve au plus faible",
		default_thank_tippers_publicly_format: "{TIPPER} a tippe {AMOUNT} pour {SERVICE}",
		default_thank_tippers_privately_format: "Merci a {TIPPER} pour son tip de {AMOUNT}tk",
		default_thank_tippers_remind_tip_note_format: "Votre commentaire de tip etait : {MESSAGE}",
		default_menu_item_display_format: "{LABEL} ({AMOUNT}tk)",
	},
};


//
// Start storing settings
//
cb.settings_choices = [];

cb.settings_choices.push({
	'name': i18n[lang].app_name,
	'type': 'str',
	'minLength': 1,
	'maxLength': 99,
	'required': false,
});

cb.settings_choices.push({
	'name': i18n[lang].errors_shown_to,
	'type': 'choice',
	'choice1': i18n[lang].lbl_errors_shown_to_host,
	'choice2': i18n[lang].lbl_errors_shown_to_hostmods,
	'choice3': i18n[lang].lbl_not_applicable,
	'defaultValue': i18n[lang].lbl_errors_shown_to_host,
});

if(enable_thank_tippers) {
	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers,
		'type': 'choice',
		'choice1': i18n[lang].lbl_thank_tippers_publicly,
		'choice2': i18n[lang].lbl_thank_tippers_privately,
		'choice3': i18n[lang].lbl_not_applicable,
		'defaultValue': i18n[lang].lbl_not_applicable,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_above_tokens,
		'type': 'int',
		'minValue': 1,
		'maxValue': 999999,
		'defaultValue': 24,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_publicly_background_color,
		'type': 'str',
		'minLength': 6,
		'maxLength': 7,
		'defaultValue': color_white,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_publicly_text_color,
		'type': 'str',
		'minLength': 6,
		'maxLength': 7,
		'defaultValue': color_black,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_publicly_boldness,
		'type': 'choice',
		'choice1': weight_normal,
		'choice2': weight_bold,
		'choice3': weight_bolder,
		'defaultValue': weight_bold,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_publicly_format,
		'type': 'str',
		'minLength': 10,
		'maxLength': 99,
		'defaultValue': i18n[lang].default_thank_tippers_publicly_format,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_privately_background_color,
		'type': 'str',
		'minLength': 6,
		'maxLength': 7,
		'defaultValue': color_white,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_privately_text_color,
		'type': 'str',
		'minLength': 6,
		'maxLength': 7,
		'defaultValue': color_black,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_privately_boldness,
		'type': 'choice',
		'choice1': weight_normal,
		'choice2': weight_bold,
		'choice3': weight_bolder,
		'defaultValue': weight_bold,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_privately_format,
		'type': 'str',
		'minLength': 10,
		'maxLength': 99,
		'defaultValue': i18n[lang].default_thank_tippers_privately_format,
	});

	cb.settings_choices.push({
		'name': i18n[lang].thank_tippers_remind_tip_note_format,
		'type': 'str',
		'minLength': 10,
		'maxLength': 99,
		'defaultValue': i18n[lang].default_thank_tippers_remind_tip_note_format,
	});
}

cb.settings_choices.push({
	'name': i18n[lang].tip_menu_shown_to,
	'type': 'choice',
	'choice1': i18n[lang].lbl_tip_menu_shown_to_all,
	'choice2': i18n[lang].lbl_tip_menu_shown_to_fans,
	'choice3': i18n[lang].lbl_tip_menu_shown_to_havetk,
	'choice4': i18n[lang].lbl_not_applicable,
	'defaultValue': i18n[lang].lbl_tip_menu_shown_to_all,
});

cb.settings_choices.push({
	'name': i18n[lang].tip_menu_header,
	'type': 'str',
	'minLength': 1,
	'maxLength': 99,
	'required': false,
});

cb.settings_choices.push({
	'name': i18n[lang].tip_menu_footer,
	'type': 'str',
	'minLength': 1,
	'maxLength': 99,
	'required': false,
});

cb.settings_choices.push({
	'name': i18n[lang].inline_separator,
	'type': 'str',
	'minLength': 0,
	'maxLength': 10,
	'required': false,
});

cb.settings_choices.push({
	'name': i18n[lang].inline_spacing,
	'type': 'choice',
	'choice1': i18n[lang].lbl_inline_spacing_before,
	'choice2': i18n[lang].lbl_inline_spacing_after,
	'choice3': i18n[lang].lbl_inline_spacing_both,
	'choice4': i18n[lang].lbl_not_applicable,
	'defaultValue': i18n[lang].lbl_not_applicable,
	'required': false,
});

cb.settings_choices.push({
	'name': i18n[lang].menu_background_color,
	'type': 'str',
	'minLength': 6,
	'maxLength': 7,
	'defaultValue': color_black,
});

cb.settings_choices.push({
	'name': i18n[lang].menu_text_color,
	'type': 'str',
	'minLength': 6,
	'maxLength': 7,
	'defaultValue': color_white,
});

cb.settings_choices.push({
	'name': i18n[lang].menu_boldness,
	'type': 'choice',
	'choice1': weight_normal,
	'choice2': weight_bold,
	'choice3': weight_bolder,
	'defaultValue': weight_normal,
});

cb.settings_choices.push({
	'name': i18n[lang].menu_repeat_minutes,
	'type': 'int',
	'minValue': 0,
	'maxValue': 60,
	'defaultValue': 10,
});

cb.settings_choices.push({
	'name': i18n[lang].menu_item_prefix,
	'type': 'str',
	'minLength': 0,
	'maxLength': 100,
	'required': false,
});

cb.settings_choices.push({
	'name': i18n[lang].menu_item_suffix,
	'type': 'str',
	'minLength': 0,
	'maxLength': 100,
	'required': false,
});

cb.settings_choices.push({
	'name': i18n[lang].menu_item_display_format,
	'type': 'str',
	'minLength': 10,
	'maxLength': 99,
	'defaultValue': i18n[lang].default_menu_item_display_format,
});

cb.settings_choices.push({
	'name': i18n[lang].sort_order,
	'type': 'choice',
	'choice1': i18n[lang].lbl_sort_amount_asc,
	'choice2': i18n[lang].lbl_sort_amount_desc,
	'choice3': i18n[lang].lbl_not_applicable,
	'defaultValue': i18n[lang].lbl_sort_amount_asc,
});

for(let i=0; i<nb_of_menu_items; ++i) {
	const new_item = {
		'name': i18n[lang].menu_item_lbl + (i+1),
		'type': 'str',
		'minLength': 1,
		'maxLength': 99,
		'defaultValue': '',
		'required': false,
	};

	cb.settings_choices.push(new_item);
}

/*
 * Removes remaining {VAR} syntax from a string
 */
function clean_str(str) {
	return str.replace(/\s*{[A-Z_ -]+}\s*/g, ' ').trim();
}

/*
 * Display errors in the chat
 */
function alert_error(cfg_name, error_lbl, bg_color=null, txt_color=null) {
	bg_color = bg_color ? bg_color : color_bright_red;
	txt_color = txt_color ? txt_color : color_white;
	const app_name = cb.settings[i18n[lang].app_name] ? cb.settings[i18n[lang].app_name] : i18n[lang].default_app_name;
	const setting_name = ('undefined' === typeof i18n[lang][cfg_name]) ? cfg_name : i18n[lang][cfg_name];
	const setting_value = ('undefined' === typeof i18n[lang][cfg_name]) ? cb.settings[cfg_name] : cb.settings[i18n[lang][cfg_name]];
	const msg = '/!\\ ATTN '+cb.room_slug+': "'+setting_name+'" in '+app_name+' '+error_lbl+' (currently valued at "'+setting_value+'")';
	if(cbjs.arrayContains(shown_errors, msg)) {
		return;
	}

	switch(cb.settings[i18n[lang].errors_shown_to]) {
		case i18n[lang].lbl_errors_shown_to_host:
			cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder);
		break;

		case i18n[lang].lbl_errors_shown_to_hostmods:
			cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder);
			cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, weight_bolder, group_mods);
		break;

		default:
			// never mind
	}

	shown_errors.push(msg);
}

/*
 * Gets the hex value of a color from a settings value
 */
function get_color_code(cfg_color, default_value) {
	const cfg_varname = i18n[lang][cfg_color];
	const color_match = cb.settings[cfg_varname].match(/^#?([0-9a-f]{6})$/i);
	if(!color_match) {
		alert_error(cfg_color, 'should start with # followed by 6 numbers and letters (0 to 9 numbers and A through F letters)');
		return default_value;
	}

	return '#'+(color_match[1].toUpperCase());
}

/*
 * Gets the menu items separator, whether multi- or single-line and according to spacing setting
 */
function get_items_separator(cfg_spacing, cfg_separator) {
	let items_separator;
	if('' === cfg_separator) {
		items_separator = "\n";
	}
	else if(i18n[lang].lbl_inline_spacing_before === cfg_spacing) {
		items_separator = ' '+cfg_separator;
	}
	else if(i18n[lang].lbl_inline_spacing_after === cfg_spacing) {
		items_separator = cfg_separator+' ';
	}
	else if(i18n[lang].lbl_inline_spacing_both === cfg_spacing) {
		items_separator = ' '+cfg_separator+' ';
	}
	else {
		items_separator = cfg_separator;
	}

	return items_separator;
}

/*
 * Gets the sorted list of menu items from the app settings
 */
function get_menu_options() {
	let options_list = [];
	for(const setting_name in cb.settings) {
		if(!setting_name.startsWith(i18n[lang].menu_item_lbl)) continue;
		if(typeof cb.settings[setting_name] !== 'string') continue;

		const setting_value = cb.settings[setting_name].trim();
		if('' === setting_value) continue;

		const menu_item = setting_value.match(/^([0-9]+)(.+)$/i);
		if(null === menu_item) {
			alert_error(setting_name, 'should start with a number followed by a label: disabled for now', color_pastel_red, color_black);
			continue;
		}

		const [, item_amount, item_label] = menu_item;
		options_list.push({amount: parseInt(item_amount), label: item_label.trim()});
	};

	if(0 === options_list.length) {
		alert_error('tip menu as a whole', 'requires at least one valid item: the app will not display anything at this time');
		return [];
	}

	if(i18n[lang].lbl_not_applicable !== cb.settings[i18n[lang].sort_order]) {
		options_list.sort(function(a, b) {
			let res;
			if(i18n[lang].lbl_sort_amount_asc === cb.settings[i18n[lang].sort_order]) {
				res = a.amount - b.amount;
			}
			else {
				res = b.amount - a.amount;
			}

			return res;
		});
	}

	return options_list;
}

/*
 * Gets the parametrized tip menu lines according to format setting
 */
function get_tip_menu(options_list) {
	const inline_spacing = cb.settings[i18n[lang].inline_spacing];
	const menu_item_prefix = cb.settings[i18n[lang].menu_item_prefix];
	const menu_item_suffix = cb.settings[i18n[lang].menu_item_suffix];

	let tip_menu_items = [];
	if('' !== cb.settings[i18n[lang].app_name]) {
		tip_menu_items.push(cb.settings[i18n[lang].app_name]);
	}

	if('' !== cb.settings[i18n[lang].tip_menu_header]) {
		tip_menu_items.push(cb.settings[i18n[lang].tip_menu_header]);
	}

	for(const menu_option of options_list) {
		let msg = '';
		if(menu_item_prefix) {
			if(i18n[lang].lbl_not_applicable !== inline_spacing) {
				msg += menu_item_prefix+' ';
			}
			else {
				msg += menu_item_prefix;
			}
		}

		msg += cb.settings[i18n[lang].menu_item_display_format];
		msg = msg.replace(/{AMOUNT}/gi, menu_option.amount);
		msg = msg.replace(/{LABEL}/gi, menu_option.label);

		if(menu_item_suffix) {
			if(i18n[lang].lbl_not_applicable !== inline_spacing) {
				msg += ' '+menu_item_suffix;
			}
			else {
				msg += menu_item_suffix;
			}
		}

		tip_menu_items.push(msg);
	}

	if('' !== cb.settings[i18n[lang].tip_menu_footer]) {
		tip_menu_items.push(cb.settings[i18n[lang].tip_menu_footer]);
	}

	return tip_menu_items;
}

/*
 * Display the tip menu
 */
function show_menu(tip_menu_shown_to = null, username = null) {
	const menu_boldness = cb.settings[i18n[lang].menu_boldness];
	const background_color = get_color_code('menu_background_color', color_black);
	const text_color = get_color_code('menu_text_color', color_white);
	const options_list = get_menu_options();
	const menu_items_separator = get_items_separator(cb.settings[i18n[lang].inline_spacing], cb.settings[i18n[lang].inline_separator]);
	const tip_menu = get_tip_menu(options_list).join(menu_items_separator);

	if(tip_menu_shown_to === null) {
		tip_menu_shown_to = cb.settings[i18n[lang].tip_menu_shown_to];
	}

	switch(tip_menu_shown_to) {
		case i18n[lang].lbl_tip_menu_shown_to_all:
			cb.sendNotice(clean_str(tip_menu), '', background_color, text_color, menu_boldness);
		break;

		case i18n[lang].lbl_tip_menu_shown_to_fans:
			cb.sendNotice(clean_str(tip_menu), '', background_color, text_color, menu_boldness, group_fans); // send notice only to group
			cb.sendNotice(clean_str(tip_menu), cb.room_slug, background_color, text_color, menu_boldness); // also to the broadcaster for good measure
		break;

		case i18n[lang].lbl_tip_menu_shown_to_havetk:
			cb.sendNotice(clean_str(tip_menu), '', background_color, text_color, menu_boldness, group_havetk); // send notice only to group
			cb.sendNotice(clean_str(tip_menu), cb.room_slug, background_color, text_color, menu_boldness); // also tp the broadcaster for good measure
		break;

		case i18n[lang].lbl_tip_menu_shown_to_self:
			cb.sendNotice(clean_str(tip_menu), username, background_color, text_color, menu_boldness); // send notice only to username who asked for it
		break;

		default:
			// never mind
	}
}

/*
 * Start the tip menu with a repeating timer
 */
function show_menu_handler() {
	show_menu();

	if(0 < cb.settings[i18n[lang].menu_repeat_minutes]) {
		cb.setTimeout(show_menu_handler, 1000 * 60 * cb.settings[i18n[lang].menu_repeat_minutes]);
	}
}

/*
 * Look up a service from the tip menu by to its amount
 */
function find_service(tip_amount) {
	const options_list = get_menu_options();
	if(0 === options_list.length) {
		return false;
	}

	for(const menu_option of options_list) {
		if(menu_option.amount === tip_amount) {
			return menu_option.label;
		}
	}

	return false;
}

/*
 * Whether the thanks module displays public or private notices
 */
function is_public_thanks() {
	return i18n[lang].lbl_thank_tippers_publicly === cb.settings[i18n[lang].thank_tippers];
}

/*
 * Gets the formatted message to display in the chat for a tip
 */
function get_thanks_notice(tip_amount, from_user) {
	if(tip_amount <= cb.settings[i18n[lang].thank_tippers_above_tokens]) {
		return false;
	}

	let notice_tpl;
	if(is_public_thanks()) {
		notice_tpl = cb.settings[i18n[lang].thank_tippers_publicly_format];
	}
	else {
		notice_tpl = cb.settings[i18n[lang].thank_tippers_privately_format];
	}

	let notice = notice_tpl;
	notice = notice.replace(/{AMOUNT}/gi, tip_amount);
	notice = notice.replace(/{TIPPER}/gi, from_user);

	if(notice.match(/{SERVICE}/gi)) {
		const service_lbl = find_service(tip_amount);
		if(!service_lbl) {
			return false;
		}

		notice = notice.replace(/{SERVICE}/gi, service_lbl);
	}

	return notice;
}

/*
 * Gets the formatted message to display as a private notice to remind the tipper of their tip note
 */
function get_thank_tippers_remind_tip_note_notice(tip_note){
	let res;
	if('' === tip_note) {
		res = false;
	}
	else if (!cb.settings[i18n[lang].thank_tippers_remind_tip_note_format]) {
		res = false;
	}
	else if(!cb.settings[i18n[lang].thank_tippers_remind_tip_note_format].match(/{MESSAGE}/gi)) {
		res = false;
	}
	else {
		res = cb.settings[i18n[lang].thank_tippers_remind_tip_note_format].replace(/{MESSAGE}/gi, tip_note);
	}

	return res;
}

/*
 * Displays a notice to thank the tipper
 */
function thank_tipper(tip_amount, from_user, tip_note) {
	let background_color;
	let text_color;

	const notice = get_thanks_notice(tip_amount, from_user);

	if(is_public_thanks()) {
		background_color = get_color_code('thank_tippers_publicly_background_color', color_white);
		text_color = get_color_code('thank_tippers_publicly_text_color', color_black);
		cb.sendNotice(clean_str(notice), '', background_color, text_color, cb.settings[i18n[lang].thank_tippers_publicly_boldness]);
	}
	else {
		background_color = get_color_code('thank_tippers_privately_background_color', color_white);
		text_color = get_color_code('thank_tippers_privately_text_color', color_black);
		cb.sendNotice(clean_str(notice), from_user, background_color, text_color, cb.settings[i18n[lang].thank_tippers_privately_boldness]);
	}

	const private_notice = get_thank_tippers_remind_tip_note_notice(tip_note);
	if(private_notice) {
		background_color = get_color_code('thank_tippers_privately_background_color', color_white);
		text_color = get_color_code('thank_tippers_privately_text_color', color_black);
		cb.sendNotice(clean_str(private_notice), from_user, background_color, text_color, cb.settings[i18n[lang].thank_tippers_privately_boldness]);
	}
}

/*
 * Callback for when a tip is sent
 */
function thank_tipper_handler(tip) {
	thank_tipper(tip.amount, tip.from_user, tip.message);
}

/*
 * Whether a template string matches its expected format
 */
function check_template_format(cfg_setting, expected_options) {
	const cfg_varname = i18n[lang][cfg_setting];
	const notice_tpl = cb.settings[cfg_varname];
	if(!notice_tpl) {
		alert_error(cfg_setting, 'should not be empty');
		return false;
	}

	for(const i in expected_options) {
		const varname = '{'+expected_options[i]+'}';
		const regexp = new RegExp(varname, 'i');
		if(!regexp.test(notice_tpl)) {
			alert_error(cfg_setting, 'requires '+varname+' value');
			return false;
		}
	}

	return true;
}

/*
 * Replacement for the official cb.log() function, which does not appear to work
 */
function basic_log(obj, lbl) {
	let dbgRows = [];

	const dbgStart = new Date(Date.now());
	dbgRows.push('dbg start for "'+lbl+'" object at '+dbgStart.toTimeString());

	for(const idx in obj) {
		const type = typeof(obj[idx]);
		let msg = idx+': '+type;
		switch(type) {
			case 'string': // pass through
			case 'number':
				msg += ' ('+obj[idx]+')';
			break;

			case 'boolean':
				msg += ' ('+(obj[idx] ? 'true' : 'false')+')';
			break;

			case 'function':
				msg += ' ('+(obj[idx].length)+' params)';
			break;

			case 'object':
				let innerObj = [];
				for(const innerIdx in obj[idx]) {
					const innerType = obj[idx][innerIdx];
					innerObj.push(`in ${idx}[${innerIdx}]: ${innerType} (${obj[idx][innerIdx]})`);
				}

				if(0 === innerObj.length) {
					dbgRows.push(msg+' (empty)');
					continue;
				}

				if(idx === 'settings' || idx === 'settings_choices') {
					dbgRows.push(msg+' ('+innerObj.length+' elements)');
					continue;
				}

				dbgRows.push(msg+' ('+innerObj.length+' elements):');
				dbgRows.push(innerObj.join("\n"));
				continue;
			break;

			default:
				// nvm
		}

		dbgRows.push(msg);
	}

	const dbgEnd = new Date(Date.now());
	dbgRows.push('dbg end for "'+lbl+'" object at '+dbgEnd.toTimeString());

	return dbgRows;
}

/*
 * Displays the app's list of commands
 */
function show_commands_help(username, usergroup = null) {
	const app_name = cb.settings[i18n[lang].app_name] ? cb.settings[i18n[lang].app_name] : i18n[lang].default_app_name;
	let commands_list = [];
	commands_list.push('Available commands for '+app_name+':');
	commands_list.push('/menu or /tipmenu -- Display the tip menu in the chat (broadcaster and moderators display for everyone, and anyone else just for themselves)');
	commands_list.push('/colors or /colorslist -- Display a list of color codes');
	cb.sendNotice(commands_list.join("\n"), username, color_black, color_white, '', usergroup);
}

/*
 * Handle commands from users
 */
function commands_handler(msg) {
	if('/' !== msg.m.substring(0, 1)) {
		return msg; // not a command
	}

	const command = msg.m.substring(1);
	if(command.match(/^he?lp$/)) {
		msg['X-Spam'] = true;
		show_commands_help(msg.user);
	}
	else if(command.match(/^(?:tip)?_?menu$/)) {
		msg['X-Spam'] = true;
		if(msg.user === cb.room_slug || msg.is_mod) {
			show_menu(i18n[lang].lbl_tip_menu_shown_to_all);
		}
		else {
			show_menu(i18n[lang].lbl_tip_menu_shown_to_self, msg.user);
		}
	}
	else if(command.match(/^colou?rs_?(?:list)?$/)) {
		msg['X-Spam'] = true;
		let i = 0; // timer offset
		// use two different background colors to ensure all colored labels are shown
		for(const bgcolor of [color_black, color_white]) {
			// set a timer to try and group the notices by their background
			cb.setTimeout(function() {
				for(lbl in colors_list) {
					if(bgcolor === colors_list[lbl]) {
						continue;
					}

					// the notices can't be single line because the text color needs to change with each time
					cb.sendNotice(lbl+': '+colors_list[lbl], msg.user, bgcolor, colors_list[lbl]);
				}
			}, 1000 * ++i);
		}
	}
	else {
		// nvm
	}

	return msg;
}


//
// launch the app
//

if(is_debug) {
	cb.sendNotice(basic_log(cbjs, 'cbjs').join("\n"), cb.room_slug, color_black, color_white);
	cb.sendNotice(basic_log(cb, 'cb').join("\n"), cb.room_slug, color_white, color_black);
}
else if(i18n[lang].lbl_not_applicable === cb.settings[i18n[lang].tip_menu_shown_to]) {
	cb.setTimeout(function () {
		alert_error('tip_menu_shown_to', 'app is stopped');
	}, 1000 * 2);
}
else if (!check_template_format('menu_item_display_format', ['AMOUNT', 'LABEL'])) {
	cb.setTimeout(function () {
		alert_error('menu_item_display_format', 'has errors: app is stopped');
	}, 1000 * 2);
}
else {
	if(cb.settings[i18n[lang].menu_repeat_minutes] > 0) {
		// display the menu (it will re-display itself in a timed loop)
		cb.setTimeout(show_menu_handler, 1000 * 2);
	}
	else {
		cb.setTimeout(function () {
			alert_error('menu_repeat_minutes', 'the menu will not be shown again in the chat');
			show_menu();
		}, 1000 * 2);
	}


	cb.setTimeout(function () { 
		show_commands_help(cb.room_slug);
		show_commands_help('', group_mods);
	}, 1000 / 2);

	cb.onMessage(commands_handler);


	if(!enable_thank_tippers) {
		// never mind
	}
	else if(i18n[lang].lbl_not_applicable === cb.settings[i18n[lang].thank_tippers]) {
		cb.setTimeout(function () {
			alert_error('thank_tippers', 'disabled thanking module', color_black, color_white);
		}, 1000 * 2);
	}
	else if(!check_template_format('thank_tippers_publicly_format', ['TIPPER'])) {
		cb.setTimeout(function () {
			alert_error('thank_tippers_publicly_format', 'has errors, so the thanking module is disabled', color_pastel_red, color_black);
		}, 1000 * 2);
	}
	else if(!check_template_format('thank_tippers_privately_format', ['TIPPER'])) {
		cb.setTimeout(function () {
			alert_error('thank_tippers_privately_format', 'has errors, so the thanking module is disabled', color_pastel_red, color_black);
		}, 1000 * 2);
	}
	else {
		// start listening for tips
		cb.onTip(thank_tipper_handler);
	}
}
