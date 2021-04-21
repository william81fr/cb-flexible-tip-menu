/**
 * Made by william81fr
 *
 * Please discuss improvements and issues at:
 * https://github.com/william81fr/cb-flexible-tip-menu
 */


//
// modify the next few lines to adjust the admin panel itself
//

/**
 * Language of the admin panel; values are 'en' or 'fr'
 *   (save and come back to the admin panel to see the changes)
 */
const lang = 'en';

/**
 * Max number of configurable menu items
 */
const nb_of_menu_items = 40;

/**
 * Number of configurable menus, not more than 26
 * Please leave at 1 for now
 */
const nb_of_distinct_menus = 1;


//
// don't modify anything from here on
//

/**
 * This prevents the app from running, and instead shows debug info in the chat
 */
 const is_debug = false;

/**
 * The app name can also be changed in the admin panel
 */
const default_app_name = 'Flexible Tip Menu';

/**
 * To generate indices for repeatable configurations
 */
const az = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Messages starting with these characters will be interpreted as commands
 */
const command_prefixes_allow_list = ['/', '!'];

/**
 * Sample list of hexadecimal color codes
 */
const colors_sample = {
	'black': '#000000',
	'white': '#FFFFFF',
	'bright red': '#FF0000',
	'bright green': '#00FF00',
	'bright blue': '#0000FF',
	'pastel red': '#ea9999',
	'pastel green': '#b6d7a8',
	'pastel blue': '#a4c2f4',
	'purple': '#bf3fbf',
};

/**
 * Identifiers to be used with cb.sendNotice()
 */
const user_groups = {
	mods: 'red',
	fans: 'green',
	tk_50: 'darkblue',
	tk_250: 'lightpurple',
	tk_1000: 'darkpurple',
	have_tk: 'lightblue',
};

/**
 * Can be used with cb.sendNotice()
 */
const font_weights = {
	normal: 'normal',
	bold: 'bold',
	bolder: 'bolder',
};

let shown_errors = []; // Used to show error messages only once


// cf. https://en.wikipedia.org/wiki/List_of_Unicode_characters
/*
const ascii_allowlist = [
	'\u{20}-\u{2F}', // ASCII Punctuation & Symbols
	'\u{30}-\u{39}', // ASCII Digits
	'\u{3A}-\u{40}', // ASCII Punctuation & Symbols
	'\u{41}-\u{5A}', // Latin Alphabet: Uppercase
	'\u{5B}-\u{60}', // ASCII Punctuation & Symbols
	'\u{61}-\u{7A}', // Latin Alphabet: Lowercase
	'\u{7B}-\u{7E}', // ASCII Punctuation & Symbols
];

const latin1_allowlist = [
	'\u{A0}-\u{BF}', // Latin-1 Punctuation & Symbols
	'\u{C0}-\u{DE}', // Letters: Uppercase
	'\u{DF}-\u{FF}', // Letters: Lowercase
];
*/


// cf. https://en.wikipedia.org/wiki/Miscellaneous_Symbols
// cf. https://en.wikipedia.org/wiki/Emoji#Unicode_blocks

/*
const misc_allowlist = [
	'\u{2600}-\u{26D4}',
	'\u{2700}-\u{27BF}',
	//'\u{1F300}-\u{1F64F}', // not recognized at the moment
	//'\u{1F680}-\u{1F6FF}', // not recognized at the moment
	//'\u{1F7E0}-\u{1F7EF}', // not recognized at the moment
	//'\u{1F900}-\u{1FADF}', // not recognized at the moment
];
*/

/**
 * Used by automod "chars" to identify ranges of Unicode characters to test for
 */
const automod_chars_allowranges = {
	text: [
		'\u{20}-\u{7E}', // most of ASCII 128
		'\u{A0}-\u{FF}', // some of latin1
		'\u{2600}-\u{26D4} \u{2700}-\u{27BF}', // early emotes
	],
	emoji: [
		{start: parseInt('1F300', 16), end: parseInt('1F64F', 16)},
		{start: parseInt('1F680', 16), end: parseInt('1F6FF', 16)},
		{start: parseInt('1F7E0', 16), end: parseInt('1F7EF', 16)},
		{start: parseInt('1F900', 16), end: parseInt('1FADF', 16)},
	],
};

/**
 * RegExp patterns used for commands (in chat)
 */
const command_patterns = {
	help: /^he?lp$/i,
	tip_menu: /^(?:tip)?_?menu$/i,
	colors_sample: /^colou?rs_?(?:list)?$/i,
};

/**
 * RegExp patterns used for label replacements before calling cb.sendNotice()
 */
const label_patterns = {
	amount: /\{AMOUNT\}/gi,
	app_name: /\{APP\}/gi,
	broadcaster_name: /\{BCASTER\}/gi,
	count: /\{COUNT\}/gi,
	item_idx: /\{ITEMIDX\}/gi,
	label: /\{LABEL\}/gi,
	message: /\{MESSAGE\}/gi,
	menu: /\{MENU\}/gi,
	menu_idx: /\{MENUIDX\}/gi,
	service_name: /\{SERVICE\}/gi,
	setting_name: /\{SETTING\}/gi,
	setting_value: /\{VALUE\}/gi,
	time: /\{TIME\}/gi,
	tipper_handle: /\{TIPPER\}/gi,
	username: /\{USER\}/gi,
	varname: /\{VARNAME\}/gi,
	visibility: /\{VISIBILITY\}/gi,
};

/**
 * RegExp patterns used in specific contexts (except commands and mere labels)
 */
 const specific_patterns = {
	automod_chars_allowed: new RegExp('^['+automod_chars_allowranges.text.join(' ')+']+$'),
	automod_link: /[0-9a-z]+:\/\/?[0-9a-z._-]+/i,
	hex_color: /^#?([0-9a-f]{6})$/i,
	menu_item: /^([0-9]+)(.+)$/,
	all_var_names: /\s*\{[0-9A-Z_ -]+\}\s*/g,
};


/**
 * CB has this feature where a setting name is transposed directly as a label in the admin UI
 *   for example, a setting called "app_name" is shown as "App name" in the UI
 *   except if you specify a "label", which is what we do in this app

 * All variable names are reused as:
 *   - CSS class names (unless next to punctuation or as the last word)
 *   	- this is currently not working on the Live website (2021-04)
 *   - HTML IDs (unless next to puncutation or as the first word)

 * Here are a few examples:
 *   - avoid "banner" in your variable name because it breaks the page layout (2020-02-29)
 *   - use "subject" in your variable name to hide the setting name in the admin panel (but still display the user input)
 *   - placing "message" or "top_alert" in your variable name makes a big box with a tame yellow in the background
 *   - placing "importantmessage" in your variable name sets a reddish color as the background
 *   - placing "successmessage" in your variable name sets a green color as the background
 *   - placing "debugmessage" in your variable name sets a purple color as the background
 *   - placing "cambouncernotes" in your variable name sets a bright yellow color as the background
 *   - placing "creat" in your variable name makes a big button with orange background and white text, but also with a white arrow
 *   - placing "code" in your variable name will use a fixed-size font

 * In order to keep our code readable, here is a map of variables internal to our app's workings VS in the Chaturbate UI:
 */
const settings_list = {
	app_name: 'debugmessage appName',
	errors_flag: 'importantmessage errorsFlag',
	automod_chars_flag: 'debugmessage automodCharsFlag',
	automod_links_flag: 'debugmessage automodLinksFlag',
	automod_record_flag: 'debugmessage automodRecordFlag',
	decorator_gender_flag: 'debugmessage decoratorGenderFlag',
	autothank_flag: 'debugmessage autothankFlag',
	autothank_above_tokens: 'autothankAboveTokens',
	autothank_publicly_background_color: 'autothankPubliclyBackgroundColor',
	autothank_publicly_text_color: 'autothankPubliclyTextColor',
	autothank_publicly_boldness: 'autothankPubliclyBoldness',
	autothank_publicly_format: 'successmessage autothankPubliclyFormat',
	autothank_privately_background_color: 'autothankPrivatelyBackgroundColor',
	autothank_privately_text_color: 'autothankPrivatelyTextColor',
	autothank_privately_boldness: 'autothankPrivatelyBoldness',
	autothank_privately_format: 'successmessage autothankPrivatelyFormat',
	autothank_remind_tip_note_format: 'successmessage autothankRemindTipNoteFormat',
	tip_menu_flag: 'debugmessage tipMenuShownTo',
	tip_menu_header: 'tipMenuHeader',
	tip_menu_footer: 'tipMenuFooter',
	inline_separator: 'inlineSeparator',
	inline_spacing: 'inlineSpacing',
	menu_background_color: 'menuBackgroundColor',
	menu_text_color: 'menuTextColor',
	menu_boldness: 'menuBoldness',
	menu_repeat_minutes: 'menuRepeatMinutes',
	menu_item_prefix: 'menuItemPrefix',
	menu_item_suffix: 'menuItemSuffix',
	menu_item_display_format: 'successmessage menuItemDisplayFormat',
	sort_order: 'sortOrder',
	menu_item_lbl: 'menuItemLbl',
};

/**
 * Localized labels for the admin UI & localized message templates for the chat
 */
const i18n = {
	en: {
		app_name: "GLOBAL SETTINGS ---------------------- App name",
		errors_flag: "Show the start-up errors to...",
		automod_chars_flag: 'AUTOMOD NONLATIN TEXT ----------------------',
		automod_links_flag: 'AUTOMOD LINKS ----------------------',
		automod_record_flag: 'Record automod infractions in chat (all automods)',
		automod_noaction: '[{APP}] Automod was set up as TESTING, and the message was not blocked',
		automod_user_count: '[{APP}] Automod recorded {COUNT} infractions for {USER}',
		decorator_gender_flag: "INDICATOR OF USER'S SEX IN CHAT ----------------------",
		autothank_flag: "AUTOMATICALLY THANK TIPPERS ----------------------",
		autothank_above_tokens: "Only tips above this limit will get a thank you",
		autothank_publicly_background_color: "Background color for the public thanks (hexa code)",
		autothank_publicly_text_color: "Text color for the public thanks (hexa code)",
		autothank_publicly_boldness: "Text thickness for the public thanks",
		autothank_publicly_format: "Template for the public thanks (variables are: {TIPPER}, {AMOUNT}, {SERVICE}) - english recommended",
		autothank_privately_background_color: "Background color for the private thanks (hexa code)",
		autothank_privately_text_color: "Text color for the private thanks (hexa code)",
		autothank_privately_boldness: "Text thickness for the private thanks",
		autothank_privately_format: "Template for the private thanks (variables are: {TIPPER}, {AMOUNT}, {SERVICE}) - english recommended",
		autothank_remind_tip_note_format: "Template for the tip note reminder (variables are: {MESSAGE}) - english recommended",
		tip_menu_flag: "TIP MENU {MENU} ----------------------",
		tip_menu_header: "Line before the tip menu {MENU}",
		tip_menu_footer: "Line at the end of the tip menu {MENU}",
		inline_separator: "Separator for a one-line tip menu {MENU} (leave empty for multi-line)",
		inline_spacing: "Spacing around the one-liner separator in menu {MENU}",
		menu_background_color: "Background color for the tip menu {MENU} (hexa code)",
		menu_text_color: "Text color for the tip menu {MENU} (hexa code)",
		menu_boldness: "Text thickness for the tip menu {MENU}",
		menu_repeat_minutes: "The menu {MENU} will repeat every X minutes",
		menu_item_prefix: "Text prefix for the menu {MENU} items (prepend)",
		menu_item_suffix: "Text suffix for the menu {MENU} items (append)",
		menu_item_display_format: "Template for the tip menu {MENU} items (variables are: {LABEL}, {AMOUNT}) - english recommended",
		colorslist_header: 'This is a sample list of colors to help you configure the bot:',
		sort_order: "Sort the menu {MENU} items before display, regardless of their order below",
		menu_item_lbl: "menu item #{MENUIDX}{ITEMIDX}",
		lbl_group_fans: "fans",
		lbl_group_havetk: "own or purchased tokens (light blue)",
		//lbl_group_50tk: "Dark Blue (Tipped 50 recently)",
		//lbl_group_250tk: "Light Purple (Tipped 250 recently)",
		//lbl_group_1000tk: "Dark Purple (Tipped 1000 recently)",
		lbl_broadcaster: "broadcaster only",
		lbl_host_mods: "broadcaster + moderators",
		lbl_everyone: "everyone in chat",
		lbl_single_user: "user only in chat",
		lbl_not_applicable: "n/a (disabled)",
		lbl_inline_spacing_before: "before",
		lbl_inline_spacing_after: "after",
		lbl_inline_spacing_both: "before + after",
		lbl_sort_amount_asc: "lowest to highest price",
		lbl_sort_amount_desc: "highest to lowest price",
		expl_autothank_publicly_format_recommend_english: "{TIPPER} tipped {AMOUNT} for {SERVICE}",
		expl_autothank_privately_format_recommend_english: "Thank you {TIPPER} for your {AMOUNT}tk tip",
		expl_autothank_remind_tip_note_format_recommend_english: "Your tip note was: {MESSAGE}",
		expl_menu_item_display_format_recommend_english: "{LABEL} ({AMOUNT}tk)",
		errmsg_format: "/!\\ ATTN {BCASTER}: '{SETTING}' in {APP} {LABEL} (currently valued at '{VALUE}')",
		errmsg_app_disabled: "app is disabled",
		errmsg_app_errors: "has errors: app is stopped",
		errmsg_missing: "requires {VARNAME} value",
		errmsg_empty: "should not be empty",
		errmsg_color_format: "should start with # followed by 6 numbers and letters (0 to 9 numbers and A through F letters)",
		errmsg_tipmenu_once: "the menu will not be shown again in the chat",
		errmsg_tipmenu_entire: "tip menu as a whole",
		errmsg_tipmenu_noitems: "requires at least one valid item: the app will not display anything at this time",
		errmsg_tipmenu_item_format: "should start with a number followed by a label: disabled for now",
		errmsg_thanks_module_disabled: "disabled thanking module",
		errmsg_thanks_module_errors: "has errors, so the thanking module is disabled",
		errmsg_dbg_start: "dbg start for '{LABEL}' object at {TIME}",
		errmsg_dbg_end: "dbg end for '{LABEL}' object at {TIME}",
		errmsg_automod_hidden: "[{APP}] The following message from {USER} was silently hidden from chat ({LABEL}):\n{MESSAGE}",
		errmsg_automod_chars: 'disallowed text',
		errmsg_automod_link: 'link attempt',
		expl_commands_available_recommend_english: "Available commands for {LABEL}:",
		expl_commands_tipmenu_recommend_english: "/menu or /tipmenu -- Display the tip menu in the chat (broadcaster and moderators display for everyone, and anyone else just for themselves)",
		expl_commands_colorslist_recommend_english: "/colors or /colorslist -- Display a list of color codes",
	},
	es: {
		app_name: "OPCIONES GLOBALES ---------------------- Nombre de la aplicacion",
		errors_flag: "Quien puede ver los errores...",
		automod_chars_flag: 'AUTOMOD NONLATIN TEXT ----------------------',
		automod_links_flag: 'AUTOMOD LINKS ----------------------',
		automod_record_flag: 'Guardar las infracciones automod en el chat (todos los autmods)',
		automod_noaction: '[{APP}] Automod esta configurado para TESTING, y el mensaje no ha sido escondido',
		automod_user_count: '[{APP}] Automod recorded {COUNT} infractions for {USER}',
		decorator_gender_flag: 'INDICATION DEL SEXO DE LOS USUARIOS EN EL CHAT ----------------------',
		autothank_flag: "MODULO AGRADECIMIENTOS ----------------------",
		autothank_above_tokens: "Solo los tips que superan este limite tendran agradecimientos",
		autothank_publicly_background_color: "Color de fondo para las gracias en publico (codigo hexa)",
		autothank_publicly_text_color: "Color del texto para las gracias en publico (codigo hexa)",
		autothank_publicly_boldness: "Grosor de la letra para las gracias en publico",
		autothank_publicly_format: "Modelo del mensaje para las gracias en publico (variables son: {TIPPER}, {AMOUNT}, {SERVICE}) - Ingles recommendado",
		autothank_privately_background_color: "Color de fondo para las gracias en privado (codigo hexa)",
		autothank_privately_text_color: "Color del texto para las gracias en privado (codigo hexa)",
		autothank_privately_boldness: "Grosor de la letra para las gracias en privado",
		autothank_privately_format: "Modelo del mensaje para las gracias en privado (variables son: {TIPPER}, {AMOUNT}, {SERVICE}) - Ingles recommendado",
		autothank_remind_tip_note_format: "Modelo del mensaje para el recordatorio de tip note (variables son: {MESSAGE}) - Ingles recommendado",
		tip_menu_flag: "MENU DE TIPS {MENU} ----------------------",
		tip_menu_header: "Linea antes del menu de tips {MENU}",
		tip_menu_footer: "Linea despues del menu de tips {MENU}",
		inline_separator: "Separacion para un menu monolinea (dejar vacio para multi linea)",
		inline_spacing: "Espacio alrededor de la separacion monolinea para el menu {MENU}",
		menu_background_color: "Color de fondo para el menu de tips {MENU} (codigo hexa)",
		menu_text_color: "Color del texto para el menu de tips {MENU} (codigo hexa)",
		menu_boldness: "Grosor de la letra para el menu de tips {MENU}",
		menu_repeat_minutes: "El menu {MENU} sera repetido cada X minutos",
		menu_item_prefix: "Prefijo para cada elemento del menu {MENU}",
		menu_item_suffix: "Sufijo para cada elemento del menu {MENU}",
		menu_item_display_format: "Modelo del mensaje para el menu de tips {MENU} (variables son: {LABEL}, {AMOUNT}) - Ingles recommendado",
		colorslist_header: 'A continuacion un listado de colores para ayudarle a configurar el bot:',
		sort_order: "Ordenar el menu {MENU}, sin tener cuenta de la orden aqui abajo",
		menu_item_lbl: "elemento del menu #{MENUIDX}{ITEMIDX}",
		lbl_group_fans: "fans",
		lbl_group_havetk: "teniendo tokens (azul clarito)",
		//lbl_group_50tk: "Azul Oscuro (Ha Tippeado 50 recientemente)",
		//lbl_group_250tk: "Violeta Clarito (Ha Tippeado 250 recientemente)",
		//lbl_group_1000tk: "Violeta Oscuro (Ha Tippeado 1000 recientemente)",
		lbl_broadcaster: "streamer",
		lbl_host_mods: "streamer + moderador",
		lbl_everyone: "todo el mundo en el chat",
		lbl_single_user: "solo el usuario en el chat",
		lbl_not_applicable: "n/a (desactivar)",
		lbl_inline_spacing_before: "antes",
		lbl_inline_spacing_after: "despues",
		lbl_inline_spacing_both: "antes + despues",
		lbl_sort_amount_asc: "del precio mas bajo al mas alto",
		lbl_sort_amount_desc: "del precio mas alto al mas bajo",
		expl_autothank_publicly_format_recommend_english: "{TIPPER} tipped {AMOUNT} for {SERVICE}",
		expl_autothank_privately_format_recommend_english: "Thank you {TIPPER} for your {AMOUNT}tk tip",
		expl_autothank_remind_tip_note_format_recommend_english: "Your tip note was: {MESSAGE}",
		expl_menu_item_display_format_recommend_english: "{LABEL} ({AMOUNT}tk)",
		errmsg_format: "/!\\ ATTN {BCASTER}: '{SETTING}' en {APP} {LABEL} (actualmente vale '{VALUE}')",
		errmsg_app_disabled: "el bot esta desactivado",
		errmsg_app_errors: "hay errores: el bot esta parado",
		errmsg_missing: "necesita el valor {VARNAME}",
		errmsg_empty: "no puede estar vacio",
		errmsg_color_format: "debe empezar con # seguido por 6 cifras y letras (cifras de 0 hasta 9 y letras de A hasta F)",
		errmsg_tipmenu_once: "el menu no se ensenara mas en el chat",
		errmsg_tipmenu_entire: "el tip menu",
		errmsg_tipmenu_noitems: "necesita al menos un elemento valido: la app no puede ensenar nada de momento",
		errmsg_tipmenu_item_format: "debe empezar por un numero seguido por una descripcion: desactivado de momento",
		errmsg_thanks_module_disabled: "MODULO de agradecimientos esta desactivado",
		errmsg_thanks_module_errors: "hay errores, asi que el MODULO de agradecimientos esta desactivado",
		errmsg_dbg_start: "dbg empieza para objeto '{LABEL}': {TIME}",
		errmsg_dbg_end: "dbg fin para objeto '{LABEL}': {TIME}",
		errmsg_automod_hidden: "[{APP}] The following message from {USER} was silently hidden from chat ({LABEL}):\n{MESSAGE}",
		errmsg_automod_chars: 'disallowed text',
		errmsg_automod_link: 'link attempt',
		expl_commands_available_recommend_english: "Available commands for {LABEL}:",
		expl_commands_tipmenu_recommend_english: "/menu or /tipmenu -- Display the tip menu in the chat (broadcaster and moderators display for everyone, and anyone else just for themselves)",
		expl_commands_colorslist_recommend_english: "/colors or /colorslist -- Display a list of color codes",
	},
	fr: {
		app_name: "PARAMETRES GENERAUX ---------------------- Nom de l'aplication",
		errors_flag: "A qui montrer les erreurs de demarrage...",
		automod_chars_flag: 'AUTOMOD NONLATIN TEXT ----------------------',
		automod_links_flag: 'AUTOMOD LINKS ----------------------',
		automod_record_flag: 'Enregistrer les infractions automod dans le chat (tous les autmods)',
		automod_noaction: "[{APP}] Automod est configure pour TESTING, et le message n'a pas ete masque",
		automod_user_count: '[{APP}] Automod a enregistre {COUNT} infractions pour {USER}',
		decorator_gender_flag: 'INDICATEUR DU SEXE DES UTILISATEURS DU CHAT ----------------------',
		autothank_flag: "MODULE REMERCIEMENTS ----------------------",
		autothank_above_tokens: "Seuls les tips au dela de cette limite sont remercies",
		autothank_publicly_background_color: "Couleur de fond pour les remerciements en public (code hexa)",
		autothank_publicly_text_color: "Couleur du texte pour les remerciements en public (code hexa)",
		autothank_publicly_boldness: "Epaisseur du texte pour les remerciements en public",
		autothank_publicly_format: "Modele du message pour les remerciements en public (variables sont : {TIPPER}, {AMOUNT}, {SERVICE}) - anglais recommande",
		autothank_privately_background_color: "Couleur de fond pour les remerciements prives (code hexa)",
		autothank_privately_text_color: "Couleur du texte pour les remerciements prives (code hexa)",
		autothank_privately_boldness: "Epaisseur du texte pour les remerciements prives",
		autothank_privately_format: "Modele du message pour les remerciements prives (variables sont : {TIPPER}, {AMOUNT}, {SERVICE}) - anglais recommande",
		autothank_remind_tip_note_format: "Modele du message pour le rappel de tip note (variables sont : {MESSAGE}) - anglais recommande",
		tip_menu_flag: "MENU DE TIPS {MENU} ----------------------",
		tip_menu_header: "Ligne avant le menu de tips {MENU}",
		tip_menu_footer: "Ligne apres le menu de tips {MENU}",
		inline_separator: "Separateur pour un menu monoligne (laisser vide pour multi ligne)",
		inline_spacing: "Espacement autour du separateur monoligne dans le menu {MENU}",
		menu_background_color: "Couleur de fond pour le menu de tips {MENU} (code hexa)",
		menu_text_color: "Couleur du texte pour le menu de tips {MENU} (code hexa)",
		menu_boldness: "Epaisseur du texte pour le menu de tips {MENU}",
		menu_repeat_minutes: "Le menu {MENU} sera repete toutes les X minutes",
		menu_item_prefix: "Prefixe pour chaque element du menu {MENU}",
		menu_item_suffix: "Suffixe pour chaque element du menu {MENU}",
		menu_item_display_format: "Modele du message pour le menu de tips {MENU} (variables sont : {LABEL}, {AMOUNT}) - anglais recommande",
		colorslist_header: 'Voici une liste de couleurs pour vous aider a parametrer le bot:',
		sort_order: "Trier le menu {MENU} avant affichage, peu importe l'ordre ci dessous",
		menu_item_lbl: "element du menu #{MENUIDX}{ITEMIDX}",
		lbl_group_fans: "fans",
		lbl_group_havetk: "possedant des tokens (bleu clair)",
		//lbl_group_50tk: "Bleu Fonce (A Tippe 50 recemment)",
		//lbl_group_250tk: "Violet Clair (A tippe 250 recemment)",
		//lbl_group_1000tk: "Violet Fonce (A tippe 1000 recemment)",
		lbl_broadcaster: "streameur seulement",
		lbl_host_mods: "streameur + moderateurs",
		lbl_everyone: "tout le monde dans le chat",
		lbl_single_user: "utilisateur uniquement dans le chat",
		lbl_not_applicable: "n/a (desactiver)",
		lbl_inline_spacing_before: "avant",
		lbl_inline_spacing_after: "apres",
		lbl_inline_spacing_both: "avant + apres",
		lbl_sort_amount_asc: "du prix le plus faible au plus eleve",
		lbl_sort_amount_desc: "du prix le plus eleve au plus faible",
		expl_autothank_publicly_format_recommend_english: "{TIPPER} tipped {AMOUNT} for {SERVICE}",
		expl_autothank_privately_format_recommend_english: "Thank you {TIPPER} for your {AMOUNT}tk tip",
		expl_autothank_remind_tip_note_format_recommend_english: "Your tip note was: {MESSAGE}",
		expl_menu_item_display_format_recommend_english: "{LABEL} ({AMOUNT}tk)",
		errmsg_format: "/!\\ ATTN {BCASTER}: '{SETTING}' dans {APP} {LABEL} (vaut actuellement '{VALUE}')",
		errmsg_app_disabled: "l'app est desactivee",
		errmsg_app_errors: "a des erreurs : l'app est arretee",
		errmsg_missing: "necessite une valeur {VARNAME}",
		errmsg_empty: "ne devrait pas etre vide",
		errmsg_color_format: "devrait commencer par un # suivi de 6 chiffres et lettres (chiffres de 0 jusque 9 et lettres de A jusque F)",
		errmsg_tipmenu_once: "le menu ne sera pas repete dans le chat",
		errmsg_tipmenu_entire: "le menu dans son ensemble",
		errmsg_tipmenu_noitems: "requiert au moins un element valide : l'app ne peut rien afficher",
		errmsg_tipmenu_item_format: "devrait commencer par un nombre suivi d'un libelle : desactive pour le moment",
		errmsg_thanks_module_disabled: "module de remerciements inactif",
		errmsg_thanks_module_errors: "contient des erreurs, ainsi le module de remerciements est inactif",
		errmsg_dbg_start: "debut dbg pour '{LABEL}' a {TIME}",
		errmsg_dbg_end: "fin dbg pour '{LABEL}' a {TIME}",
		errmsg_automod_hidden: "[{APP}] The following message from {USER} was silently hidden from chat ({LABEL}):\n{MESSAGE}",
		errmsg_automod_chars: 'disallowed text',
		errmsg_automod_link: 'link attempt',
		expl_commands_available_recommend_english: "Available commands for {LABEL}:",
		expl_commands_tipmenu_recommend_english: "/menu or /tipmenu -- Display the tip menu in the chat (broadcaster and moderators display for everyone, and anyone else just for themselves)",
		expl_commands_colorslist_recommend_english: "/colors or /colorslist -- Display a list of color codes",
	},
};



/**
 * Main object for the app, grouping all the custom methods
 */
const FlexibleTipMenu = {
	/**
	 * Archive of automod infractions, recorded while the bot is running
	 */
	automod_infractions: {},

	/**
	 * Removes remaining {VAR} syntax from a notice template;
	 * This is expected to run at the last moment before cb.sendNotice()
	 * After all variables were reasonably replaced
	 * @param {string} notice_tpl The notice template meant for cb.sendNotice()
	 * @returns The updated message
	 */
	clean_str: function(notice_tpl) {
		if(!notice_tpl.trim()) {
			return '';
		}

		const cfg_app_name = FlexibleTipMenu.val('app_name');

		return notice_tpl
			.replace(label_patterns.app_name, cfg_app_name ? cfg_app_name : default_app_name)
			.replace(label_patterns.broadcaster_name, cb.room_slug)
			.replace(specific_patterns.all_var_names, ' ')
			.trim();
	},

	/**
	 * Display app errors in the chat, according to app settings
	 * @param {string} cfg_name The name of the app setting that failed
	 * @param {string} error_lbl A short label to insert in the notice
	 * @param {string} bg_color Color code for the background
	 * @param {string} txt_color Color code for the text
	 */
	alert_error: function(cfg_name, error_lbl, bg_color=null, txt_color=null) {
		bg_color = bg_color ? bg_color : colors_sample['bright red'];
		txt_color = txt_color ? txt_color : colors_sample.white;
		const cfg_app_name = FlexibleTipMenu.val('app_name');
		const cfg_setting_name = FlexibleTipMenu.i18n(cfg_name);
		const setting_name = (null === cfg_setting_name) ? cfg_name : cfg_setting_name;
		const setting_value = FlexibleTipMenu.val(cfg_name);
		const msg = FlexibleTipMenu.i18n('errmsg_format')
			.replace(label_patterns.app_name, cfg_app_name ? cfg_app_name : default_app_name)
			.replace(label_patterns.broadcaster_name, cb.room_slug)
			.replace(label_patterns.label, error_lbl)
			.replace(label_patterns.setting_value, setting_value)
			.replace(label_patterns.setting_name, setting_name);

		if(!shown_errors.includes(msg)) {
			switch(FlexibleTipMenu.val('errors_flag')) {
				case FlexibleTipMenu.i18n('lbl_broadcaster'):
					cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, font_weights.bolder);
				break;

				case FlexibleTipMenu.i18n('lbl_host_mods'):
					cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, font_weights.bolder);
					cb.sendNotice(msg, cb.room_slug, bg_color, txt_color, font_weights.bolder, user_groups.mods);
				break;

				default:
					// never mind
			}

			shown_errors.push(msg);
		}
	},

	/**
	 * Gets the hex value of a color from a settings value
	 * @param {string} cfg_color The name of the app setting
	 * @param {string} default_value Default color code in case the app setting is misspelled by the user
	 * @returns The uppercased hex code prefixed with a #
	 */
	get_color_code: function(cfg_color, default_value) {
		const cfg_value = FlexibleTipMenu.val(cfg_color);
		const color_match = specific_patterns.hex_color.exec(cfg_value);
		if(null === color_match) {
			FlexibleTipMenu.alert_error(cfg_color, FlexibleTipMenu.i18n('errmsg_color_format'));
			return default_value;
		}

		return '#'+(color_match[1].toUpperCase());
	},

	/**
	 * Gets the menu items separator, whether multi- or single-line and according to spacing setting
	 * @param {string} cfg_spacing The app setting name for spacing option
	 * @param {string} cfg_separator The app setting name for separator option
	 * @returns {string} The value
	 */
	get_items_separator: function(cfg_spacing, cfg_separator) {
		let items_separator;
		if('' === cfg_separator) {
			items_separator = "\n";
		}
		else if(FlexibleTipMenu.i18n('lbl_inline_spacing_before') === cfg_spacing) {
			items_separator = ' '+cfg_separator;
		}
		else if(FlexibleTipMenu.i18n('lbl_inline_spacing_after') === cfg_spacing) {
			items_separator = cfg_separator+' ';
		}
		else if(FlexibleTipMenu.i18n('lbl_inline_spacing_both') === cfg_spacing) {
			items_separator = ' '+cfg_separator+' ';
		}
		else {
			items_separator = cfg_separator;
		}

		return items_separator;
	},

	/**
	 * Gets the localized list of menu items from the app settings, potentially sorted
	 * @returns {array} The list
	 */
	get_menu_options: function() {
		let options_list = [];
		for(const setting_name in cb.settings) {
			if(!setting_name.startsWith(settings_list.menu_item_lbl)) continue;
			if('string' !== typeof cb.settings[setting_name]) continue;

			const setting_value = cb.settings[setting_name].trim();
			if('' === setting_value) continue;

			const menu_item = specific_patterns.menu_item.exec(setting_value);
			if(null === menu_item) {
				FlexibleTipMenu.alert_error(setting_name, FlexibleTipMenu.i18n('errmsg_tipmenu_item_format'), colors_sample['pastel red'], colors_sample.black);
				continue;
			}

			const [, item_amount, item_label] = menu_item;
			options_list.push({amount: parseInt(item_amount), label: item_label.trim()});
		};

		if(0 === options_list.length) {
			FlexibleTipMenu.alert_error(FlexibleTipMenu.i18n('errmsg_tipmenu_entire'), FlexibleTipMenu.i18n('errmsg_tipmenu_noitems'));
			return [];
		}

		if(!FlexibleTipMenu.is_disabled('sort_order')) {
			options_list.sort(function(a, b) {
				let res;
				if(FlexibleTipMenu.i18n('lbl_sort_amount_asc') === FlexibleTipMenu.val('sort_order')) {
					res = a.amount - b.amount;
				}
				else {
					res = b.amount - a.amount;
				}

				return res;
			});
		}

		return options_list;
	},

	/**
	 * Gets the parametrized tip menu lines according to format setting
	 * @param {array} options_list Typically from FlexibleTipMenu.get_menu_options()
	 * @returns {array} The list of lines suitable for cb.sendNotice()
	 */
	get_tip_menu: function(options_list) {
		const has_inline_spacing = (FlexibleTipMenu.i18n('lbl_not_applicable') !== FlexibleTipMenu.val('inline_spacing'));
		const menu_item_prefix = FlexibleTipMenu.val('menu_item_prefix');
		const menu_item_suffix = FlexibleTipMenu.val('menu_item_suffix');
		const menu_item_display_format = FlexibleTipMenu.val('menu_item_display_format');

		let tip_menu_items = [];
		if('' !== FlexibleTipMenu.val('app_name')) {
			tip_menu_items.push(FlexibleTipMenu.val('app_name'));
		}

		if('' !== FlexibleTipMenu.val('tip_menu_header')) {
			tip_menu_items.push(FlexibleTipMenu.val('tip_menu_header'));
		}

		for(const menu_option of options_list) {
			let msg = '';
			if(menu_item_prefix) {
				msg += menu_item_prefix;
				if(has_inline_spacing) {
					msg += ' ';
				}
			}

			msg += menu_item_display_format;
			msg = msg.replace(label_patterns.amount, menu_option.amount);
			msg = msg.replace(label_patterns.label, menu_option.label);
			msg = msg.replace(label_patterns.broadcaster_name, cb.room_slug);

			if(menu_item_suffix) {
				msg += menu_item_suffix;
				if(has_inline_spacing) {
					msg += ' ';
				}
			}

			tip_menu_items.push(msg);
		}

		if('' !== FlexibleTipMenu.val('tip_menu_footer')) {
			tip_menu_items.push(FlexibleTipMenu.val('tip_menu_footer'));
		}

		return tip_menu_items;
	},

	/**
	 * Display the tip menu, potentially to a specific user or group
	 * @param {string} tip_menu_flag Name of the app setting to know who to display to (if anyone)
	 * @param {string} username Specific user who may have asked for the menu
	 */
	show_menu: function(tip_menu_flag = null, username = null) {
		const menu_boldness = FlexibleTipMenu.val('menu_boldness');
		const background_color = FlexibleTipMenu.get_color_code('menu_background_color', colors_sample.black);
		const text_color = FlexibleTipMenu.get_color_code('menu_text_color', colors_sample.white);
		const options_list = FlexibleTipMenu.get_menu_options();
		const menu_items_separator = FlexibleTipMenu.get_items_separator(FlexibleTipMenu.val('inline_spacing'), FlexibleTipMenu.val('inline_separator'));
		const tip_menu = FlexibleTipMenu.get_tip_menu(options_list).join(menu_items_separator);
		const tip_menu_str = FlexibleTipMenu.clean_str(tip_menu);

		if(tip_menu_flag === null) {
			tip_menu_flag = FlexibleTipMenu.val('tip_menu_flag');
		}

		switch(tip_menu_flag) {
			case FlexibleTipMenu.i18n('lbl_broadcaster'):
				cb.sendNotice(tip_menu_str, cb.room_slug, background_color, text_color, menu_boldness); // only to the broadcaster
			break;

			case FlexibleTipMenu.i18n('lbl_everyone'):
				cb.sendNotice(tip_menu_str, '', background_color, text_color, menu_boldness);
			break;

			case FlexibleTipMenu.i18n('lbl_group_fans'):
				cb.sendNotice(tip_menu_str, '', background_color, text_color, menu_boldness, user_groups.fans); // send notice only to group
				cb.sendNotice(tip_menu_str, cb.room_slug, background_color, text_color, menu_boldness); // also to the broadcaster for good measure
			break;

			case FlexibleTipMenu.i18n('lbl_group_havetk'):
				cb.sendNotice(tip_menu_str, '', background_color, text_color, menu_boldness, user_groups.have_tk); // send notice only to group
				cb.sendNotice(tip_menu_str, cb.room_slug, background_color, text_color, menu_boldness); // also to the broadcaster for good measure
			break;

			case FlexibleTipMenu.i18n('lbl_single_user'):
				cb.sendNotice(tip_menu_str, username, background_color, text_color, menu_boldness); // send notice only to username who asked for it
			break;

			default:
				// never mind
		}
	},

	/**
	 * Start the tip menu with a repeating timer;
	 * This is meant to be called on app startup
	 */
	show_menu_handler: function() {
		FlexibleTipMenu.show_menu();

		const nb_minutes = FlexibleTipMenu.val('menu_repeat_minutes');
		if(isNaN(nb_minutes) || !parseInt(nb_minutes)) {
			// never mind
		}
		else {
			cb.setTimeout(FlexibleTipMenu.show_menu_handler, 1000 * 60 * parseInt(nb_minutes));
		}
	},

	/**
	 * Look up a service name from the tip menu(s) by its amount
	 * @param {integer} tip_amount
	 * @returns {boolean|string} The name of the corresponding service in a tip menu, or false
	 */
	find_service: function(tip_amount) {
		const options_list = FlexibleTipMenu.get_menu_options();
		if(!options_list || !options_list.length) {
			return false;
		}

		for(const menu_option of options_list) {
			if(menu_option.amount === tip_amount) {
				return menu_option.label;
			}
		}

		return false;
	},

	/**
	 * Whether the thanks module displays public or user-specific notices
	 * @returns {boolean} bool
	 */
	is_public_thanks: function() {
		return FlexibleTipMenu.i18n('lbl_everyone') === FlexibleTipMenu.val('autothank_flag');
	},

	/**
	 * Gets the formatted notice to display in the chat for a tip
	 * @param {integer} tip_amount
	 * @param {string} from_user
	 * @returns {string} The message suitable for cb.sendNotice()
	 */
	get_thanks_notice: function(tip_amount, from_user) {
		if(tip_amount <= FlexibleTipMenu.val('autothank_above_tokens')) {
			return false;
		}

		let notice_tpl;
		if(is_public_thanks()) {
			notice_tpl = FlexibleTipMenu.val('autothank_publicly_format');
		}
		else {
			notice_tpl = FlexibleTipMenu.val('autothank_privately_format');
		}

		let notice = notice_tpl;
		if(label_patterns.service_name.test(notice)) {
			const service_lbl = FlexibleTipMenu.find_service(tip_amount);
			if(!service_lbl) {
				return false;
			}

			notice = notice.replace(label_patterns.service_name, service_lbl);
		}

		notice = notice.replace(label_patterns.amount, tip_amount);
		notice = notice.replace(label_patterns.tipper_handle, from_user);
		notice = notice.replace(label_patterns.broadcaster_name, cb.room_slug);
		return notice;
	},

	/**
	 * Gets the formatted message to display as a user-specific notice to remind the tipper of their tip note
	 * @param {string} tip_note
	 */
	get_autothank_remind_tip_note_notice: function(tip_note) {
		let res;
		if('' === tip_note) {
			res = false;
		}
		else if (!FlexibleTipMenu.val('autothank_remind_tip_note_format')) {
			res = false;
		}
		else if(!FlexibleTipMenu.val('autothank_remind_tip_note_format').match(label_patterns.message)) {
			res = false;
		}
		else {
			res = FlexibleTipMenu.val('autothank_remind_tip_note_format')
				.replace(label_patterns.message, tip_note)
				.replace(label_patterns.broadcaster_name, cb.room_slug);
		}

		return res;
	},

	/**
	 * Displays a notice to thank the tipper
	 * @param {integer} tip_amount
	 * @param {string} from_user
	 * @param {string} tip_note
	 */
	thank_tipper: function(tip_amount, from_user, tip_note) {
		let background_color;
		let text_color;

		const notice = FlexibleTipMenu.get_thanks_notice(tip_amount, from_user);
		const msg = FlexibleTipMenu.clean_str(notice);

		if(!msg) {
			// never mind
		}
		else if(FlexibleTipMenu.is_public_thanks()) {
			background_color = FlexibleTipMenu.get_color_code('autothank_publicly_background_color', colors_sample.white);
			text_color = FlexibleTipMenu.get_color_code('autothank_publicly_text_color', colors_sample.black);
			cb.sendNotice(msg, '', background_color, text_color, FlexibleTipMenu.val('autothank_publicly_boldness'));
		}
		else {
			background_color = FlexibleTipMenu.get_color_code('autothank_privately_background_color', colors_sample.white);
			text_color = FlexibleTipMenu.get_color_code('autothank_privately_text_color', colors_sample.black);
			cb.sendNotice(msg, from_user, background_color, text_color, FlexibleTipMenu.val('autothank_privately_boldness'));
		}

		const private_notice = FlexibleTipMenu.get_autothank_remind_tip_note_notice(tip_note);
		const private_msg = FlexibleTipMenu.clean_str(private_notice);
		if(private_msg) {
			background_color = FlexibleTipMenu.get_color_code('autothank_privately_background_color', colors_sample.white);
			text_color = FlexibleTipMenu.get_color_code('autothank_privately_text_color', colors_sample.black);
			cb.sendNotice(private_msg, from_user, background_color, text_color, FlexibleTipMenu.val('autothank_privately_boldness'));
		}
	},

	/**
	 * Callback for when a tip is sent
	 * @param {tip} tip The tip object that was fired with the event
	 */
	thank_tipper_handler: function(tip) {
		if(tip.is_anon_tip) {
			// nothing here
		}
		else {
			FlexibleTipMenu.thank_tipper(parseInt(tip.amount), tip.from_user, tip.message.trim());
		}
	},

	/**
	 * Whether a template string matches its expected format;
	 * This will run at bot startup, as a kind of autotest to guide the user in case of misconfiguration
	 * @param {string} cfg_setting The name of an app setting, which should refer to a notice template string
	 * @param {array} expected_options A list of mandatory labels this template is expected to have
	 * @returns
	 */
	check_template_format: function(cfg_setting, expected_options) {
		//const cfg_varname = i18n[lang][cfg_setting];
		const notice_tpl = FlexibleTipMenu.val(cfg_setting);
		if(!notice_tpl) {
			FlexibleTipMenu.alert_error(cfg_setting, FlexibleTipMenu.i18n('errmsg_empty'));
			return false;
		}

		const errmsg_missing_tpl = FlexibleTipMenu.i18n('errmsg_missing');
		for(const i in expected_options) {
			const varname = '{'+expected_options[i]+'}';
			const regexp = new RegExp(varname, 'i');
			if(!regexp.test(notice_tpl)) {
				const lbl = errmsg_missing_tpl.replace(label_patterns.varname, varname);
				FlexibleTipMenu.alert_error(cfg_setting, lbl);
				return false;
			}
		}

		return true;
	},

	/**
	 * Replacement for the official cb.log() function, which does not appear to work;
	 * This is meant for debugging and NOT for production
	 * @param {*} obj The object to debug in chat
	 * @param {*} lbl To identify the object in chat
	 * @returns {array} Debug lines to display in chat
	 */
	basic_log: function(obj, lbl) {
		let dbg_rows = [];

		const dbg_start = new Date(Date.now());
		const dbg_lbl_start = FlexibleTipMenu.i18n('errmsg_dbg_start')
			.replace(label_patterns.label, lbl)
			.replace(label_patterns.time, dbg_start.toTimeString());
		dbg_rows.push(dbg_lbl_start);

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
						dbg_rows.push(msg+' (empty)');
						continue;
					}

					if(idx === 'settings' || idx === 'settings_choices') {
						dbg_rows.push(msg+' ('+innerObj.length+' elements)');
						continue;
					}

					dbg_rows.push(msg+' ('+innerObj.length+' elements):');
					dbg_rows.push(innerObj.join("\n"));
					continue;
				break;

				default:
					// never mind
			}

			dbg_rows.push(msg);
		}

		const dbg_end = new Date(Date.now());
		const dbg_lbl_end = FlexibleTipMenu.i18n('errmsg_dbg_end')
			.replace(label_patterns.label, lbl)
			.replace(label_patterns.time, dbg_end.toTimeString());
		dbg_rows.push(dbg_lbl_end);

		return dbg_rows;
	},

	/**
	 * Displays the app's list of commands
	 * @param {string} username The user who called the command in chat
	 * @param {string} usergroup Who should see the menu in chat
	 */
	show_commands_help: function(username, usergroup = null) {
		let commands_list = [];
		commands_list.push(FlexibleTipMenu.i18n('expl_commands_available_recommend_english'));
		commands_list.push(FlexibleTipMenu.i18n('expl_commands_tipmenu_recommend_english'));
		commands_list.push(FlexibleTipMenu.i18n('expl_commands_colorslist_recommend_english'));

		const notice = FlexibleTipMenu.clean_str(commands_list.join("\n"));
		cb.sendNotice(notice, username, colors_sample.black, colors_sample.white, '', usergroup);
	},

	/**
	 * Recommended way to hide message in public chat, but still echoed back to the user
	 * @param {message} message The message that came in from the fired event
	 * @returns {message} The updated message
	 */
	hide_message: function(msg) {
		msg['X-Spam'] = true;
		return msg;
	},

	/**
	 * Handle generic messages from users
	 * @param {message} message The message that came in from the fired event
	 * @returns {message} The updated message
	 */
	message_handler: function(message) {
		const txt_msg = message.m.trim();
		if(command_prefixes_allow_list.includes(txt_msg.substring(0, 1))) {
			message = FlexibleTipMenu.commands_handler(message); // that's a command, not a plain message
		}
		else {
			message = FlexibleTipMenu.plaintext_handler(message); // not a command
		}

		return message;
	},

	/**
	 * Modify a message according to an automod module's settings
	 * @param {message} message The message that came in from the fired event
	 * @param {string} module_flag The main setting to determine how this automod should run
	 * @param {string} notice_tpl The main notice template
	 * @param {string} module_lbl A small label to identify the automod in chat (in the main notice)
	 * @returns {message} The updated message
	 */
	 automod_plaintext: function(message, module_flag, notice_tpl, module_lbl) {
		const txt_msg = message.m.trim();

		// standard warning for the model, so they know that automod did something
		cb.setTimeout(function() {
			const notice = FlexibleTipMenu.i18n(notice_tpl)
				.replace(label_patterns.label, FlexibleTipMenu.i18n(module_lbl))
				.replace(label_patterns.username, message.user)
				.replace(label_patterns.message, txt_msg);

			cb.sendNotice(FlexibleTipMenu.clean_str(notice), cb.room_slug);
		}, 1000);

		if(FlexibleTipMenu.i18n('lbl_broadcaster') !== FlexibleTipMenu.val(module_flag)) {
			// take action
			message = FlexibleTipMenu.hide_message(message);
		}
		else {
			// don't hide the message, only warn the model
			cb.setTimeout(function() {
				const notice = FlexibleTipMenu.i18n('automod_noaction');
				cb.sendNotice(FlexibleTipMenu.clean_str(notice), cb.room_slug);
			}, 1500);
		}

		const automod_record_enabled = !FlexibleTipMenu.is_disabled('automod_record_flag');
		if(automod_record_enabled) {
			const automod_record_flag = FlexibleTipMenu.val('automod_record_flag');
			if('undefined' === typeof FlexibleTipMenu.automod_infractions[message.user]) {
				FlexibleTipMenu.automod_infractions[message.user] = 0;
			}

			++FlexibleTipMenu.automod_infractions[message.user];

			cb.setTimeout(function() {
				const lbl = FlexibleTipMenu.i18n('automod_user_count')
					.replace(label_patterns.username, message.user)
					.replace(label_patterns.count, FlexibleTipMenu.automod_infractions[message.user]);

				const notice = FlexibleTipMenu.clean_str(lbl);

				switch(automod_record_flag) {
					case FlexibleTipMenu.i18n('lbl_broadcaster'):
						cb.sendNotice(notice, cb.room_slug);
					break;

					case FlexibleTipMenu.i18n('lbl_everyone'):
						cb.sendNotice(notice);
					break;

					case FlexibleTipMenu.i18n('lbl_single_user'):
						cb.sendNotice(notice, '', '', '', '', message.user);
					break;

					default:
						// never mind
				}
			}, 2000);
		}

		return message;
	},

	/**
	 * Whether a single character is allowed for display in chat
	 * @param {string} c Single character to test (against Unicode ranges etc)
	 * @returns {boolean} bool
	 */
	automod_validate_single_char: function(c) {
		if(specific_patterns.automod_chars_allowed.test(c)) {
			return true;
		}

		const code_point_int = parseInt(c.codePointAt(0));
		//const code_point_hex = code_point_int.toString(16);

		let c_res = false; // assume false at first, and revise as soon as a match is found
		for(const allowed_range of automod_chars_allowranges.emoji) {
			//const range_start_hex = allowed_range.start.toString(16);
			//const range_end_hex = allowed_range.end.toString(16);
			if(code_point_int >= allowed_range.start && code_point_int <= allowed_range.end) {
				//cb.sendNotice(`code point for ${c} is ${code_point_hex}: more than ${range_end_hex}`, cb.room_slug);
				c_res = true;
				break;
			}
		}

		//cb.sendNotice(`code point for ${c} is ${code_point_hex}: ${c_res ? "ok" : "ko"}`, cb.room_slug);
		return c_res;
	},

	/**
	 * Whether a complete message is allowed for display in chat
	 * @param {string} txt_msg A copy of the message that came in from the fired event
	 * @returns {boolean} bool
	 */
	automod_chars_validator: function(txt_msg) {
		if(specific_patterns.automod_chars_allowed.test(txt_msg)) {
			return true; // whole text is ascii-128
		}

		if(!automod_chars_allowranges.emoji.length) {
			return true; // we don't have anything more to test against
		}

		const iterator = txt_msg[Symbol.iterator]();
		let char = iterator.next();

		let str_res = true;
		while(!char.done && str_res) {
			str_res = FlexibleTipMenu.automod_validate_single_char(char.value);
			char = iterator.next();
		}

		return str_res;
	},

	/**
	 * Decorator to add the gender to messages in chat, according to the app preferences
	 * @param {message} message The message that came in from the fired event
	 * @returns {message} The updated message
	 */
	decorator_gender: function(message) {
		const decorator_gender_flag = FlexibleTipMenu.val('decorator_gender_flag');

		const only_broadcaster = (FlexibleTipMenu.i18n('lbl_broadcaster') === decorator_gender_flag);
		if(only_broadcaster && message.user !== cb.room_slug) {
			return message; // change nothing
		}

		const only_mods = (FlexibleTipMenu.i18n('lbl_host_mods') === decorator_gender_flag);
		if(only_mods && !message.is_mod) {
			return message; // change nothing
		}

		const only_fans = (FlexibleTipMenu.i18n('lbl_group_fans') === decorator_gender_flag);
		if(only_fans && !message.is_fan) {
			return message; // change nothing
		}

		const only_havetk = (FlexibleTipMenu.i18n('lbl_group_havetk') === decorator_gender_flag);
		if(only_havetk && !message.has_tokens) {
			return message; // change nothing
		}

		// cf. https://en.wikipedia.org/wiki/Miscellaneous_Symbols
		// cf. https://en.wikipedia.org/wiki/Planet_symbols#Mars
		// ♀ U+2640 Female sign
		// ♂ U+2642 Male sign
		// ⚥ U+26A5 Male and female sign
		// ⚧ U+26A7 Transsexualism
		// ⚲ U+26B2 Neutral, genderless
		// ⚤ U+26A4 Heterosexuality
		// ⚣ U+26A3 Male homosexuality
		// ⚢ U+26A2 Lesbianism
		// ⚥⚥ U+26A5 Bisexuality

		let prefix = '';
		if('m' === message.gender) prefix = '\u2642'; // male
		else if('f' === message.gender) prefix = '\u2640'; // female
		else if('s' === message.gender) prefix = '\u26A7'; // trans
		else if('c' === message.gender) prefix = '\u26A4'; // couple
		else return message;

		message.m = prefix + ' ' + message.m.trim();
		return message;
	},

	/**
	 * Handle plain messages from users (non-commands); will pass through automods and decorators
	 * @param {message} message The message that came in from the fired event
	 * @returns {message} The updated message
	 */
	plaintext_handler: function(message) {
		const txt_msg = message.m.trim();

		const automod_chars_enabled = !FlexibleTipMenu.is_disabled('automod_chars_flag');
		if(automod_chars_enabled && !FlexibleTipMenu.automod_chars_validator(txt_msg)) {
			message = FlexibleTipMenu.automod_plaintext(
				message,
				'automod_chars_flag',
				'errmsg_automod_hidden',
				'errmsg_automod_chars'
			);
		}

		const automod_links_enabled = !FlexibleTipMenu.is_disabled('automod_links_flag');
		if(automod_links_enabled && specific_patterns.automod_link.test(txt_msg.replace(' ', ''))) {
			message = FlexibleTipMenu.automod_plaintext(
				message,
				'automod_links_flag',
				'errmsg_automod_hidden',
				'errmsg_automod_link'
			);
		}

		const decorator_gender_enabled = !FlexibleTipMenu.is_disabled('decorator_gender_flag');
		if(decorator_gender_enabled) {
			message = FlexibleTipMenu.decorator_gender(message);
		}

		return message;
	},

	/**
	 * Show a sample of colors to the user who asked for them
	 * @param {string} username
	 */
	show_colors_sample: function(username) {
		let i = 0; // timer offset

		cb.setTimeout(function() {
			const notice = FlexibleTipMenu.clean_str(FlexibleTipMenu.i18n('colorslist_header'));
			cb.sendNotice(notice, username);
		}, 1000 * ++i);

		// use two different background colors to ensure all colored labels are shown
		for(const bgcolor of [colors_sample.black, colors_sample.white]) {
			// set a timer to try and group the notices by their background
			cb.setTimeout(function() {
				for(const color_lbl in colors_sample) {
					const color_code = colors_sample[color_lbl];
					if(bgcolor === color_code) {
						continue;
					}

					// the notices can't be single line because the text color needs to change with each time
					cb.sendNotice(color_lbl+': '+color_code, username, bgcolor, color_code);
				}
			}, 1000 * ++i);
		}
	},

	/**
	 * Handle commands from users;
	 * This will hide the command itself in chat
	 * @param {message} message The message that came in from the fired event
	 * @returns {message} The updated message
	 */
	commands_handler: function(message) {
		const txt_msg = message.m.trim();
		const txt_command = txt_msg.substring(1).trim();

		if(command_patterns.help.test(txt_command)) {
			FlexibleTipMenu.show_commands_help(message.user);
		}
		else if(command_patterns.tip_menu.test(txt_command)) {
			if(message.user === cb.room_slug || message.is_mod) {
				FlexibleTipMenu.show_menu(FlexibleTipMenu.i18n('lbl_everyone'));
			}
			else {
				FlexibleTipMenu.show_menu(FlexibleTipMenu.i18n('lbl_single_user'), message.user);
			}
		}
		else if(command_patterns.colors_sample.test(txt_command)) {
			FlexibleTipMenu.show_colors_sample(message.user);
		}
		else {
			// never mind
		}

		return FlexibleTipMenu.hide_message(message);
	},

	/**
	 * Gets a value from the app settings (storage)
	 * @param {string} name The name of the setting to get a value for
	 * @returns {string} The value
	 */
	val: function(name) {
		if('undefined' === typeof settings_list[name]) {
			return null;
		}

		const value = cb.settings[settings_list[name]];
		if(FlexibleTipMenu.i18n('lbl_not_applicable') === value) {
			return null;
		}

		return value;
	},

	/**
	 * Gets a localized label or template
	 * @param {string} idx The identifier of the label or template to localize
	 * @returns {string} The value
	 */
	i18n: function(idx) {
		if('undefined' === typeof i18n[lang][idx]) {
			return null;
		}

		return i18n[lang][idx].trim();
	},

	/**
	 * Whether a specific setting is disabled in the current configuration
	 * @param {string} setting_name
	 * @returns {boolean} bool
	 */
	is_disabled: function(setting_name) {
		if(!setting_name) {
			return true;
		}

		return null === FlexibleTipMenu.val(setting_name);
	},
};

const ftm = FlexibleTipMenu; // shorthand



//
// Start storing settings
//
cb.settings_choices = [];

cb.settings_choices.push({
	name: settings_list.app_name,
	label: ftm.i18n('app_name'),
	type: 'str',
	minLength: 1,
	maxLength: 99,
	required: false,
});

cb.settings_choices.push({
	name: settings_list.errors_flag,
	label: ftm.i18n('errors_flag'),
	type: 'choice',
	choice1: ftm.i18n('lbl_broadcaster'),
	choice2: ftm.i18n('lbl_host_mods'),
	choice3: ftm.i18n('lbl_not_applicable'),
	defaultValue: ftm.i18n('lbl_broadcaster'),
});

// automod chars module
cb.settings_choices.push({
	name: settings_list.automod_chars_flag,
	label: ftm.i18n('automod_chars_flag'),
	type: 'choice',
	choice1: ftm.i18n('lbl_broadcaster'),
	choice2: ftm.i18n('lbl_everyone'),
	choice3: ftm.i18n('lbl_single_user'),
	choice4: ftm.i18n('lbl_not_applicable'),
	defaultValue: ftm.i18n('lbl_not_applicable'),
});

// automod links module
cb.settings_choices.push({
	name: settings_list.automod_links_flag,
	label: ftm.i18n('automod_links_flag'),
	type: 'choice',
	choice1: ftm.i18n('lbl_broadcaster'),
	choice2: ftm.i18n('lbl_everyone'),
	choice3: ftm.i18n('lbl_single_user'),
	choice4: ftm.i18n('lbl_not_applicable'),
	defaultValue: ftm.i18n('lbl_not_applicable'),
});

// record automods infractions
cb.settings_choices.push({
	name: settings_list.automod_record_flag,
	label: ftm.i18n('automod_record_flag'),
	type: 'choice',
	choice1: ftm.i18n('lbl_broadcaster'),
	choice2: ftm.i18n('lbl_everyone'),
	choice3: ftm.i18n('lbl_single_user'),
	choice4: ftm.i18n('lbl_not_applicable'),
	defaultValue: ftm.i18n('lbl_not_applicable'),
});

// decorator gender module
cb.settings_choices.push({
	name: settings_list.decorator_gender_flag,
	label: ftm.i18n('decorator_gender_flag'),
	type: 'choice',
	choice1: ftm.i18n('lbl_broadcaster'),
	choice2: ftm.i18n('lbl_host_mods'),
	choice3: ftm.i18n('lbl_group_fans'),
	choice4: ftm.i18n('lbl_group_havetk'),
	choice5: ftm.i18n('lbl_everyone'),
	choice6: ftm.i18n('lbl_not_applicable'),
	defaultValue: ftm.i18n('lbl_not_applicable'),
});

// autothank module
cb.settings_choices.push({
	name: settings_list.autothank_flag,
	label: ftm.i18n('autothank_flag'),
	type: 'choice',
	choice1: ftm.i18n('lbl_broadcaster'),
	choice2: ftm.i18n('lbl_everyone'),
	choice3: ftm.i18n('lbl_single_user'),
	choice4: ftm.i18n('lbl_not_applicable'),
	defaultValue: ftm.i18n('lbl_not_applicable'),
});

cb.settings_choices.push({
	name: settings_list.autothank_above_tokens,
	label: ftm.i18n('autothank_above_tokens'),
	type: 'int',
	minValue: 1,
	maxValue: 999999,
	defaultValue: 24,
});

cb.settings_choices.push({
	name: settings_list.autothank_publicly_background_color,
	label: ftm.i18n('autothank_publicly_background_color'),
	type: 'str',
	minLength: 6,
	maxLength: 7,
	defaultValue: colors_sample.white,
});

cb.settings_choices.push({
	name: settings_list.autothank_publicly_text_color,
	label: ftm.i18n('autothank_publicly_text_color'),
	type: 'str',
	minLength: 6,
	maxLength: 7,
	defaultValue: colors_sample.black,
});

cb.settings_choices.push({
	name: settings_list.autothank_publicly_boldness,
	label: ftm.i18n('autothank_publicly_boldness'),
	type: 'choice',
	choice1: font_weights.normal,
	choice2: font_weights.bold,
	choice3: font_weights.bolder,
	defaultValue: font_weights.bold,
});

cb.settings_choices.push({
	name: settings_list.autothank_publicly_format,
	label: ftm.i18n('autothank_publicly_format'),
	type: 'str',
	minLength: 1,
	maxLength: 99,
	defaultValue: ftm.i18n('expl_autothank_publicly_format_recommend_english'),
});

cb.settings_choices.push({
	name: settings_list.autothank_privately_background_color,
	label: ftm.i18n('autothank_privately_background_color'),
	type: 'str',
	minLength: 6,
	maxLength: 7,
	defaultValue: colors_sample.white,
});

cb.settings_choices.push({
	name: settings_list.autothank_privately_text_color,
	label: ftm.i18n('autothank_privately_text_color'),
	type: 'str',
	minLength: 6,
	maxLength: 7,
	defaultValue: colors_sample.black,
});

cb.settings_choices.push({
	name: settings_list.autothank_privately_boldness,
	label: ftm.i18n('autothank_privately_boldness'),
	type: 'choice',
	choice1: font_weights.normal,
	choice2: font_weights.bold,
	choice3: font_weights.bolder,
	defaultValue: font_weights.bold,
});

cb.settings_choices.push({
	name: settings_list.autothank_privately_format,
	label: ftm.i18n('autothank_privately_format'),
	type: 'str',
	minLength: 1,
	maxLength: 99,
	defaultValue: ftm.i18n('expl_autothank_privately_format_recommend_english'),
});

cb.settings_choices.push({
	name: settings_list.autothank_remind_tip_note_format,
	label: ftm.i18n('autothank_remind_tip_note_format'),
	type: 'str',
	minLength: 1,
	maxLength: 99,
	defaultValue: ftm.i18n('expl_autothank_remind_tip_note_format_recommend_english'),
});


for(let i=0; i<nb_of_distinct_menus && i<az.length; ++i) {
	const menu_idx_letter = az[i].toUpperCase();

	// the first offset should retain settigns from earlier versions
	const settings_idx_offset = (0 === i) ? '' : menu_idx_letter;

	cb.settings_choices.push({
		name: settings_list.tip_menu_flag + settings_idx_offset,
		label: ftm.i18n('tip_menu_flag').replace(label_patterns.menu, menu_idx_letter),
		type: 'choice',
		choice1: ftm.i18n('lbl_broadcaster'),
		choice2: ftm.i18n('lbl_everyone'),
		choice3: ftm.i18n('lbl_group_fans'),
		choice4: ftm.i18n('lbl_group_havetk'),
		choice5: ftm.i18n('lbl_not_applicable'),
		defaultValue: (0 === i) ? ftm.i18n('lbl_broadcaster') : ftm.i18n('lbl_not_applicable'),
	});

	cb.settings_choices.push({
		name: settings_list.tip_menu_header + settings_idx_offset,
		label: ftm.i18n('tip_menu_header').replace(label_patterns.menu, menu_idx_letter),
		type: 'str',
		minLength: 1,
		maxLength: 99,
		required: false,
	});

	cb.settings_choices.push({
		name: settings_list.tip_menu_footer + settings_idx_offset,
		label: ftm.i18n('tip_menu_footer').replace(label_patterns.menu, menu_idx_letter),
		type: 'str',
		minLength: 1,
		maxLength: 99,
		required: false,
	});

	cb.settings_choices.push({
		name: settings_list.inline_separator + settings_idx_offset,
		label: ftm.i18n('inline_separator').replace(label_patterns.menu, menu_idx_letter),
		type: 'str',
		minLength: 0,
		maxLength: 10,
		required: false,
	});

	cb.settings_choices.push({
		name: settings_list.inline_spacing + settings_idx_offset,
		label: ftm.i18n('inline_spacing').replace(label_patterns.menu, menu_idx_letter),
		type: 'choice',
		choice1: ftm.i18n('lbl_inline_spacing_before'),
		choice2: ftm.i18n('lbl_inline_spacing_after'),
		choice3: ftm.i18n('lbl_inline_spacing_both'),
		choice4: ftm.i18n('lbl_not_applicable'),
		defaultValue: ftm.i18n('lbl_not_applicable'),
		required: false,
	});

	cb.settings_choices.push({
		name: settings_list.menu_background_color + settings_idx_offset,
		label: ftm.i18n('menu_background_color').replace(label_patterns.menu, menu_idx_letter),
		type: 'str',
		minLength: 6,
		maxLength: 7,
		defaultValue: colors_sample.black,
	});

	cb.settings_choices.push({
		name: settings_list.menu_text_color + settings_idx_offset,
		label: ftm.i18n('menu_text_color').replace(label_patterns.menu, menu_idx_letter),
		type: 'str',
		minLength: 6,
		maxLength: 7,
		defaultValue: colors_sample.white,
	});

	cb.settings_choices.push({
		name: settings_list.menu_boldness + settings_idx_offset,
		label: ftm.i18n('menu_boldness').replace(label_patterns.menu, menu_idx_letter),
		type: 'choice',
		choice1: font_weights.normal,
		choice2: font_weights.bold,
		choice3: font_weights.bolder,
		defaultValue: font_weights.normal,
	});

	cb.settings_choices.push({
		name: settings_list.menu_repeat_minutes + settings_idx_offset,
		label: ftm.i18n('menu_repeat_minutes').replace(label_patterns.menu, menu_idx_letter),
		type: 'int',
		minValue: 0,
		maxValue: 60,
		defaultValue: 10,
	});

	cb.settings_choices.push({
		name: settings_list.menu_item_prefix + settings_idx_offset,
		label: ftm.i18n('menu_item_prefix').replace(label_patterns.menu, menu_idx_letter),
		type: 'str',
		minLength: 1,
		maxLength: 100,
		required: false,
	});

	cb.settings_choices.push({
		name: settings_list.menu_item_suffix + settings_idx_offset,
		label: ftm.i18n('menu_item_suffix').replace(label_patterns.menu, menu_idx_letter),
		type: 'str',
		minLength: 1,
		maxLength: 100,
		required: false,
	});

	cb.settings_choices.push({
		name: settings_list.menu_item_display_format + settings_idx_offset,
		label: ftm.i18n('menu_item_display_format').replace(label_patterns.menu, menu_idx_letter),
		type: 'str',
		minLength: 1,
		maxLength: 99,
		defaultValue: ftm.i18n('expl_menu_item_display_format_recommend_english'),
	});

	cb.settings_choices.push({
		name: settings_list.sort_order + settings_idx_offset,
		label: ftm.i18n('sort_order').replace(label_patterns.menu, menu_idx_letter),
		type: 'choice',
		choice1: ftm.i18n('lbl_sort_amount_asc'),
		choice2: ftm.i18n('lbl_sort_amount_desc'),
		choice3: ftm.i18n('lbl_not_applicable'),
		defaultValue: ftm.i18n('lbl_sort_amount_asc'),
	});

	const item_lbl_tpl = ftm.i18n('menu_item_lbl');
	for(let j=0; j<nb_of_menu_items; ++j) {
		const item_lbl = item_lbl_tpl
			.replace(label_patterns.menu_idx, menu_idx_letter)
			.replace(label_patterns.item_idx, j+1);

		const new_item = {
			name: settings_list.menu_item_lbl + settings_idx_offset + (j+1),
			label: item_lbl,
			type: 'str',
			minLength: 1,
			maxLength: 99,
			defaultValue: '',
			required: false,
		};

		cb.settings_choices.push(new_item);
	}
}



cb.onStart(user => {

//
// launch the app components, each with its own self-test
//

cb.setTimeout(function () {
	ftm.show_commands_help(user.user);
	ftm.show_commands_help('', user_groups.mods);
}, 1000 / 2);

cb.onMessage(ftm.message_handler); // start listening on messages, possible commands


if(is_debug) {
	cb.sendNotice(ftm.basic_log(cbjs, 'cbjs').join("\n"), user.user, colors_sample.black, colors_sample.white);
	cb.sendNotice(ftm.basic_log(cb, 'cb').join("\n"), user.user, colors_sample.white, colors_sample.black);
}
else if(ftm.is_disabled('tip_menu_flag')) {
	cb.setTimeout(function () {
		ftm.alert_error('tip_menu_flag', ftm.i18n('errmsg_app_disabled'));
	}, 1000 * 2);
}
else if (!ftm.check_template_format('menu_item_display_format', ['LABEL'])) {
	cb.setTimeout(function () {
		ftm.alert_error('menu_item_display_format', ftm.i18n('errmsg_app_errors'));
	}, 1000 * 2);
}
else if(!ftm.val('menu_repeat_minutes')) {
	cb.setTimeout(function () {
		ftm.alert_error('menu_repeat_minutes', ftm.i18n('errmsg_tipmenu_once'));
		ftm.show_menu();
	}, 1000 * 2);
}
else {
	// self-test passes: go on...
	cb.setTimeout(ftm.show_menu_handler, 1000 * 2); // Repeatedly show the tip menu(s)
}


//
// Start the autothank module
//

if(ftm.is_disabled('autothank_flag')) {
	// possibly show an alert to the broadcaster, or maybe not, I'm not sure yet
	/**
	cb.setTimeout(function () {
		ftm.alert_error('autothank_flag', ftm.i18n('errmsg_thanks_module_disabled'), colors_sample.black, colors_sample.white);
	}, 1000 * 2);
	 */
}
else if(!ftm.check_template_format('autothank_publicly_format', ['TIPPER'])) {
	cb.setTimeout(function () {
		ftm.alert_error('autothank_publicly_format', ftm.i18n('errmsg_thanks_module_errors'), colors_sample['pastel red'], colors_sample.black);
	}, 1000 * 2);
}
else if(!ftm.check_template_format('autothank_privately_format', ['TIPPER'])) {
	cb.setTimeout(function () {
		ftm.alert_error('autothank_privately_format', ftm.i18n('errmsg_thanks_module_errors'), colors_sample['pastel red'], colors_sample.black);
	}, 1000 * 2);
}
else {
	// self-test passes: go on...
	cb.onTip(ftm.thank_tipper_handler); // start listening for tips
}

});
