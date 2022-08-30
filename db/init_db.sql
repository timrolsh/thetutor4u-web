/*
 All timestamps in this database will be recorded as unix timestamps in seconds. Unix second timestamp can be found
 with parseInt(Date.now() / 1000) in node/browser js.
 */
-- if the schema exists, remove it and recreate it from scratch
drop schema if exists thetutor4u cascade;

create schema "thetutor4u";

-- conversation between multiple users
create table thetutor4u.conversation (id int8 not null);

-- multiple users may be a part of multiple conversations
create table thetutor4u.conversation_user (
    user_id text not null,
    conversation_id int8 not null
);

-- one conversation can have many messages
create table thetutor4u.message (
    conversation_id int8 not null,
    content text not null,
    time_sent int8 not null,
    received bool not null,
    time_received int8
);

/*
 all users are automatically students, but not all users are automatically tutors, so tutors have their own table. Every
 student can choose to study one subject at a time for the instant tutoring service.
 */
create table thetutor4u."user" (
    -- sub fields from jwts either generated by google or by email service providers
    id text not null,
    -- identity service provider: https://accounts.google.com for google and email for email
    iss text not null,
    -- users email address
    email text,
    -- user's username, every user has a unique username
    username text,
    -- user's first name
    first_name text,
    -- user's last name
    last_name text,
    -- dob is in the format 2022-08-15 for August 15th, 2022 for example. This is the format html dates use
    dob text,
    -- user's profile picture file
    profile_picture bytea,
    -- 0 means offline, 1 means online, 2 means busy
    online_status int8 default 0 not null,
    -- unix timestamp (seconds, Date.now() / 1000 in JS) for when account was created
    time_account_created timestamp default now(),
    -- last time their account was online
    last_online TIMESTAMP,
    -- the user's balance
    balance double precision default 0 not null,
    --     for students: what subject are they currently looking for tutoring in
    subject_name text,
    password_hash text
);

create table thetutor4u.language (
    english_name text not null,
    native_name text not null,
    code text not null
);

-- language can be spoken by multiple users, users each speak multiple languages
create table thetutor4u.language_user (
    language_code text not null,
    user_id text not null
);

create table thetutor4u.subject (name text not null);

-- a tutor has a bio
create table thetutor4u.tutor (
    user_id text not null,
    -- tutor's bio
    biography text
);

-- multiple tutors can teach multiple subjects
create table thetutor4u.subject_tutor (
    subject_name text not null,
    tutor_id text not null,
    hourly_rate double precision default 0 not null,
    -- when tutors are in the pool this is true, but when they are in the session this is false
    teaching_now integer default 0 not null
);

create table thetutor4u.session (
    tutor_id text not null,
    student_id text not null,
    start_time int8 not null,
    end_time int8 not null,
    -- tutor's hourly rate for session
    tutor_rate double precision not null
);

create table thetutor4u.rating (
    rating_user_id text not null,
    rated_user_id text not null,
    rating_text text not null,
    rating_value integer not null,
    time_rating_left timestamp not null
);

-- populate language table with all languages
insert into
    thetutor4u.language (english_name, native_name, code)
values
    ('Afar ', 'Afaraf ', 'aa '),
    ('Abkhaz ', 'аҧсуа бызшәа, аҧсшәа ', 'ab '),
    ('Avestan ', 'avesta ', 'ae '),
    ('Afrikaans ', 'Afrikaans ', 'af '),
    ('Akan ', 'Akan ', 'ak '),
    ('Amharic ', 'አማርኛ ', 'am '),
    ('Aragonese ', 'aragonés ', 'an '),
    ('Arabic ', 'العربية ', 'ar '),
    ('Assamese ', 'অসমীয়া ', 'as '),
    ('Avaric ', 'авар мацӀ, магӀарул мацӀ ', 'av '),
    ('Aymara ', 'aymar aru ', 'ay '),
    ('Azerbaijani ', 'azərbaycan dili ', 'az '),
    ('South Azerbaijani ', 'تورکجه‎ ', 'az '),
    ('Bashkir ', 'башҡорт теле ', 'ba '),
    ('Belarusian ', 'беларуская мова ', 'be '),
    ('Bulgarian ', 'български език ', 'bg '),
    ('Bihari ', 'भोजपुरी ', 'bh '),
    ('Bislama ', 'Bislama ', 'bi '),
    ('Bambara ', 'bamanankan ', 'bm '),
    ('Bengali; Bangla ', 'বাংলা ', 'bn '),
    (
        'Tibetan Standard, Tibetan, Central ',
        'བོད་ཡིག ',
        'bo '
    ),
    ('Breton ', 'brezhoneg ', 'br '),
    ('Bosnian ', 'bosanski jezik ', 'bs '),
    (
        'Catalan; Valencian ',
        'català, valencià ',
        'ca '
    ),
    ('Chechen ', 'нохчийн мотт ', 'ce '),
    ('Chamorro ', 'Chamoru ', 'ch '),
    ('Corsican ', 'corsu, lingua corsa ', 'co '),
    ('Cree ', 'ᓀᐦᐃᔭᐍᐏᐣ ', 'cr '),
    ('Czech ', 'čeština, český jazyk ', 'cs '),
    (
        'Old Church Slavonic, Church Slavonic, Old Bulgarian ',
        'ѩзыкъ словѣньскъ ',
        'cu '
    ),
    ('Chuvash ', 'чӑваш чӗлхи ', 'cv '),
    ('Welsh ', 'Cymraeg ', 'cy '),
    ('Danish ', 'dansk ', 'da '),
    ('German ', 'Deutsch ', 'de '),
    ('Divehi; Dhivehi; Maldivian; ', 'ދިވެހި ', 'dv '),
    ('Dzongkha ', 'རྫོང་ཁ ', 'dz '),
    ('Ewe ', 'Eʋegbe ', 'ee '),
    ('Greek, Modern ', 'ελληνικά ', 'el '),
    ('English ', 'English ', 'en '),
    ('Esperanto ', 'Esperanto ', 'eo '),
    (
        'Spanish; Castilian ',
        'español, castellano ',
        'es '
    ),
    ('Estonian ', 'eesti, eesti keel ', 'et '),
    ('Basque ', 'euskara, euskera ', 'eu '),
    ('Persian (Farsi) ', 'فارسی ', 'fa '),
    (
        'Fula; Fulah; Pulaar; Pular ',
        'Fulfulde, Pulaar, Pular ',
        'ff '
    ),
    ('Finnish ', 'suomi, suomen kieli ', 'fi '),
    ('Fijian ', 'vosa Vakaviti ', 'fj '),
    ('Faroese ', 'føroyskt ', 'fo '),
    ('French ', 'français, langue française ', 'fr '),
    ('Western Frisian ', 'Frysk ', 'fy '),
    ('Irish ', 'Gaeilge ', 'ga '),
    ('Scottish Gaelic; Gaelic ', 'Gàidhlig ', 'gd '),
    ('Galician ', 'galego ', 'gl '),
    ('Guaraní ', 'Avañe''ẽ ', 'gn '),
    ('Gujarati ', 'ગુજરાતી ', 'gu '),
    ('Manx ', 'Gaelg, Gailck ', 'gv '),
    ('Hausa ', 'Hausa, هَوُسَ ', 'ha '),
    ('Hebrew (modern) ', 'עברית ', 'he '),
    ('Hindi ', 'हिन्दी, हिंदी ', 'hi '),
    ('Hiri Motu ', 'Hiri Motu ', 'ho '),
    ('Croatian ', 'hrvatski jezik ', 'hr '),
    (
        'Haitian; Haitian Creole ',
        'Kreyòl ayisyen ',
        'ht '
    ),
    ('Hungarian ', 'magyar ', 'hu '),
    ('Armenian ', 'Հայերեն ', 'hy '),
    ('Herero ', 'Otjiherero ', 'hz '),
    ('Interlingua ', 'Interlingua ', 'ia '),
    ('Indonesian ', 'Bahasa Indonesia ', 'id '),
    (
        'Interlingue ',
        'Originally called Occidental; then Interlingue after WWII ',
        'ie '
    ),
    ('Igbo ', 'Asụsụ Igbo ', 'ig '),
    ('Nuosu ', 'ꆈꌠ꒿ Nuosuhxop ', 'ii '),
    ('Inupiaq ', 'Iñupiaq, Iñupiatun ', 'ik '),
    ('Ido ', 'Ido ', 'io '),
    ('Icelandic ', 'Íslenska ', 'is '),
    ('Italian ', 'italiano ', 'it '),
    ('Inuktitut ', 'ᐃᓄᒃᑎᑐᑦ ', 'iu '),
    ('Japanese ', '日本語 (にほんご) ', 'ja '),
    ('Javanese ', 'basa Jawa ', 'jv '),
    ('Georgian ', 'ქართული ', 'ka '),
    ('Kongo ', 'KiKongo ', 'kg '),
    ('Kikuyu, Gikuyu ', 'Gĩkũyũ ', 'ki '),
    ('Kwanyama, Kuanyama ', 'Kuanyama ', 'kj '),
    ('Kazakh ', 'қазақ тілі ', 'kk '),
    (
        'Kalaallisut, Greenlandic ',
        'kalaallisut, kalaallit oqaasii ',
        'kl '
    ),
    ('Khmer ', 'ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ ', 'km '),
    ('Kannada ', 'ಕನ್ನಡ ', 'kn '),
    ('Korean ', '한국어 (韓國語), 조선어 (朝鮮語) ', 'ko '),
    ('Kanuri ', 'Kanuri ', 'kr '),
    ('Kashmiri ', 'कश्मीरी, كشميري‎ ', 'ks '),
    ('Kurdish ', 'Kurdî, كوردی‎ ', 'ku '),
    ('Komi ', 'коми кыв ', 'kv '),
    ('Cornish ', 'Kernewek ', 'kw '),
    ('Kyrgyz ', 'Кыргызча, Кыргыз тили ', 'ky '),
    ('Latin ', 'latine, lingua latina ', 'la '),
    (
        'Luxembourgish, Letzeburgesch ',
        'Lëtzebuergesch ',
        'lb '
    ),
    ('Ganda ', 'Luganda ', 'lg '),
    (
        'Limburgish, Limburgan, Limburger ',
        'Limburgs ',
        'li '
    ),
    ('Lingala ', 'Lingála ', 'ln '),
    ('Lao ', 'ພາສາລາວ ', 'lo '),
    ('Lithuanian ', 'lietuvių kalba ', 'lt '),
    ('Luba-Katanga ', 'Tshiluba ', 'lu '),
    ('Latvian ', 'latviešu valoda ', 'lv '),
    ('Malagasy ', 'fiteny malagasy ', 'mg '),
    ('Marshallese ', 'Kajin M̧ajeļ ', 'mh '),
    ('Māori ', 'te reo Māori ', 'mi '),
    ('Macedonian ', 'македонски јазик ', 'mk '),
    ('Malayalam ', 'മലയാളം ', 'ml '),
    ('Mongolian ', 'монгол ', 'mn '),
    ('Marathi (Marāṭhī) ', 'मराठी ', 'mr '),
    ('Malay ', 'bahasa Melayu, بهاس ملايو‎ ', 'ms '),
    ('Maltese ', 'Malti ', 'mt '),
    ('Burmese ', 'ဗမာစာ ', 'my '),
    ('Nauru ', 'Ekakairũ Naoero ', 'na '),
    ('Norwegian Bokmål ', 'Norsk bokmål ', 'nb '),
    ('North Ndebele ', 'isiNdebele ', 'nd '),
    ('Nepali ', 'नेपाली ', 'ne '),
    ('Ndonga ', 'Owambo ', 'ng '),
    ('Dutch ', 'Nederlands, Vlaams ', 'nl '),
    ('Norwegian Nynorsk ', 'Norsk nynorsk ', 'nn '),
    ('Norwegian ', 'Norsk ', 'no '),
    ('South Ndebele ', 'isiNdebele ', 'nr '),
    (
        'Navajo, Navaho ',
        'Diné bizaad, Dinékʼehǰí ',
        'nv '
    ),
    (
        'Chichewa; Chewa; Nyanja ',
        'chiCheŵa, chinyanja ',
        'ny '
    ),
    ('Occitan ', 'occitan, lenga d''òc ', 'oc '),
    ('Ojibwe, Ojibwa ', 'ᐊᓂᔑᓈᐯᒧᐎᓐ ', 'oj '),
    ('Oromo ', 'Afaan Oromoo ', 'om '),
    ('Oriya ', 'ଓଡ଼ିଆ ', 'or '),
    ('Ossetian, Ossetic ', 'ирон æвзаг ', 'os '),
    ('Panjabi, Punjabi ', 'ਪੰਜਾਬੀ, پنجابی‎ ', 'pa '),
    ('Pāli ', 'पाऴि ', 'pi '),
    ('Polish ', 'język polski, polszczyzna ', 'pl '),
    ('Pashto, Pushto ', 'پښتو ', 'ps '),
    ('Portuguese ', 'português ', 'pt '),
    ('Quechua ', 'Runa Simi, Kichwa ', 'qu '),
    ('Romansh ', 'rumantsch grischun ', 'rm '),
    ('Kirundi ', 'Ikirundi ', 'rn '),
    ('Romanian ', 'limba română ', 'ro '),
    ('Russian ', 'русский язык ', 'ru '),
    ('Kinyarwanda ', 'Ikinyarwanda ', 'rw '),
    ('Sanskrit (Saṁskṛta) ', 'संस्कृतम् ', 'sa '),
    ('Sardinian ', 'sardu ', 'sc '),
    ('Sindhi ', 'सिन्धी, سنڌي، سندھی‎ ', 'sd '),
    ('Northern Sami ', 'Davvisámegiella ', 'se '),
    ('Sango ', 'yângâ tî sängö ', 'sg '),
    ('Sinhala, Sinhalese ', 'සිංහල ', 'si '),
    ('Slovak ', 'slovenčina, slovenský jazyk ', 'sk '),
    (
        'Slovene ',
        'slovenski jezik, slovenščina ',
        'sl '
    ),
    ('Samoan ', 'gagana fa''a Samoa ', 'sm '),
    ('Shona ', 'chiShona ', 'sn '),
    ('Somali ', 'Soomaaliga, af Soomaali ', 'so '),
    ('Albanian ', 'gjuha shqipe ', 'sq '),
    ('Serbian ', 'српски језик ', 'sr '),
    ('Swati ', 'SiSwati ', 'ss '),
    ('Southern Sotho ', 'Sesotho ', 'st '),
    ('Sundanese ', 'Basa Sunda ', 'su '),
    ('Swedish ', 'Svenska ', 'sv '),
    ('Swahili ', 'Kiswahili ', 'sw '),
    ('Tamil ', 'தமிழ் ', 'ta '),
    ('Telugu ', 'తెలుగు ', 'te '),
    ('Tajik ', 'тоҷикӣ, toğikī, تاجیکی‎ ', 'tg '),
    ('Thai ', 'ไทย ', 'th '),
    ('Tigrinya ', 'ትግርኛ ', 'ti '),
    ('Turkmen ', 'Türkmen, Түркмен ', 'tk '),
    (
        'Tagalog ',
        'Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔ ',
        'tl '
    ),
    ('Tswana ', 'Setswana ', 'tn '),
    ('Tonga (Tonga Islands) ', 'faka Tonga ', 'to '),
    ('Turkish ', 'Türkçe ', 'tr '),
    ('Tsonga ', 'Xitsonga ', 'ts '),
    ('Tatar ', 'татар теле, tatar tele ', 'tt '),
    ('Twi ', 'Twi ', 'tw '),
    ('Tahitian ', 'Reo Tahiti ', 'ty '),
    ('Uyghur, Uighur ', 'Uyƣurqə, ئۇيغۇرچە‎ ', 'ug '),
    ('Ukrainian ', 'українська мова ', 'uk '),
    ('Urdu ', 'اردو ', 'ur '),
    ('Uzbek ', 'O‘zbek, Ўзбек, أۇزبېك‎ ', 'uz '),
    ('Venda ', 'Tshivenḓa ', 've '),
    ('Vietnamese ', 'Tiếng Việt ', 'vi '),
    ('Volapük ', 'Volapük ', 'vo '),
    ('Walloon ', 'walon ', 'wa '),
    ('Wolof ', 'Wollof ', 'wo '),
    ('Xhosa ', 'isiXhosa ', 'xh '),
    ('Yiddish ', 'ייִדיש ', 'yi '),
    ('Yoruba ', 'Yorùbá ', 'yo '),
    (
        'Zhuang, Chuang ',
        'Saɯ cueŋƅ, Saw cuengh ',
        'za '
    ),
    ('Chinese ', '中文 (Zhōngwén), 汉语, 漢語 ', 'zh '),
    ('Zulu ', 'isiZulu ', 'zu ');