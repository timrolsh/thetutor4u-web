drop schema if exists thetutor4u cascade;

create schema "thetutor4u";

create table thetutor4u.conversation (
    id serial primary key,
    messages_count int8 default 0 not null
);

create table thetutor4u."user" (
    id text not null primary key,
    email text,
    username text,
    first_name text,
    last_name text,
    dob_month int8,
    dob_day int8,
    dob_year int8,
    balance double precision default 0 not null,
    profile_picture bytea,
    biography text,
    is_tutor int8 default 0 not null,
    -- 0 means offline, 1 means online, 2 means busy
    online_status int8 default 0 not null,
    net_income double precision default 0 not null,
    time_account_created int8
);

create table thetutor4u.conversation_user (
    user_id text not null constraint fk_user references thetutor4u."user",
    conversation_id int8 not null constraint fk_conversation references thetutor4u.conversation
);

create table thetutor4u.subject (
    id serial not null primary key,
    name text not null
);

create table thetutor4u.tutor (
    user_id text not null constraint pk_user_id unique constraint fk_user_id references thetutor4u."user"
);

create table thetutor4u.subject_tutor (
    subject_id int8 not null constraint fk_subject references thetutor4u.subject,
    tutor_id text not null constraint fk_tutor_id references thetutor4u.tutor (user_id)
);

create table thetutor4u.student (
    user_id text not null constraint pk_user_id_student unique constraint fk_user_id references thetutor4u."user"
);

create table thetutor4u.session (
    id serial not null primary key,
    tutor_id text not null constraint fk_tutor_id references thetutor4u.tutor (user_id),
    student_id text not null constraint fk_student_id references thetutor4u.student (user_id),
    start_time int8 not null,
    end_time int8 not null,
    -- tutor's hourly rate for session
    tutor_rate double precision not null
);

create table thetutor4u.language (
    id serial not null primary key,
    language_name text not null,
    language_code text not null
);

create table thetutor4u.language_user (
    language_id int8 not null constraint fk_language_id references thetutor4u.language,
    user_id text not null constraint fk_user_id references thetutor4u."user"
);

create table thetutor4u.message (
    conversation_id int8 not null constraint fk_message_conversation references thetutor4u.conversation,
    text int8 not null,
    time_sent int8 not null,
    received int8 not null,
    time_received int8,
    message_number int8 not null
);

-- test table for server to query
create table thetutor4u.test (online int8);

insert into
    thetutor4u.test (online)
values
    (1);

-- populate the language table with all languages
insert into
    thetutor4u.language (id, language_name, language_code)
values
    (0, 'Afar', 'aa'),
    (1, 'Abkhaz', 'ab'),
    (2, 'Avestan', 'ae'),
    (3, 'Afrikaans', 'af'),
    (4, 'Akan', 'ak'),
    (5, 'Amharic', 'am'),
    (6, 'Aragonese', 'an'),
    (7, 'Arabic', 'ar'),
    (8, 'Assamese', 'as'),
    (9, 'Avaric', 'av'),
    (10, 'Aymara', 'ay'),
    (11, 'Azerbaijani', 'az'),
    (12, 'Bashkir', 'ba'),
    (13, 'Belarusian', 'be'),
    (14, 'Bulgarian', 'bg'),
    (15, 'Bihari', 'bh'),
    (16, 'Bislama', 'bi'),
    (17, 'Bambara', 'bm'),
    (18, 'Bengali', 'bn'),
    (19, 'Tibetan Standard, Tibetan, Central', 'bo'),
    (20, 'Breton', 'br'),
    (21, 'Bosnian', 'bs'),
    (22, 'Catalan; Valencian', 'ca'),
    (23, 'Chechen', 'ce'),
    (24, 'Chamorro', 'ch'),
    (25, 'Corsican', 'co'),
    (26, 'Cree', 'cr'),
    (27, 'Czech', 'cs'),
    (
        28,
        'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic',
        'cu'
    ),
    (29, 'Chuvash', 'cv'),
    (30, 'Welsh', 'cy'),
    (31, 'Danish', 'da'),
    (32, 'German', 'de'),
    (33, 'Divehi; Dhivehi; Maldivian;', 'dv'),
    (34, 'Ewe', 'ee'),
    (35, 'Greek, Modern', 'el'),
    (36, 'English', 'en'),
    (37, 'Esperanto', 'eo'),
    (38, 'Spanish; Castilian', 'es'),
    (39, 'Estonian', 'et'),
    (40, 'Basque', 'eu'),
    (41, 'Persian', 'fa'),
    (42, 'Fula; Fulah; Pulaar; Pular', 'ff'),
    (43, 'Finnish', 'fi'),
    (44, 'Fijian', 'fj'),
    (45, 'Faroese', 'fo'),
    (46, 'French', 'fr'),
    (47, 'Western Frisian', 'fy'),
    (48, 'Irish', 'ga'),
    (49, 'Scottish Gaelic; Gaelic', 'gd'),
    (50, 'Galician', 'gl'),
    (51, 'Guaraní', 'gn'),
    (52, 'Gujarati', 'gu'),
    (53, 'Manx', 'gv'),
    (54, 'Hausa', 'ha'),
    (55, 'Hebrew (modern)', 'he'),
    (56, 'Hindi', 'hi'),
    (57, 'Hiri Motu', 'ho'),
    (58, 'Croatian', 'hr'),
    (59, 'Haitian; Haitian Creole', 'ht'),
    (60, 'Hungarian', 'hu'),
    (61, 'Armenian', 'hy'),
    (62, 'Herero', 'hz'),
    (63, 'Interlingua', 'ia'),
    (64, 'Indonesian', 'id'),
    (65, 'Interlingue', 'ie'),
    (66, 'Igbo', 'ig'),
    (67, 'Nuosu', 'ii'),
    (68, 'Inupiaq', 'ik'),
    (69, 'Ido', 'io'),
    (70, 'Icelandic', 'is'),
    (71, 'Italian', 'it'),
    (72, 'Inuktitut', 'iu'),
    (73, 'Japanese', 'ja'),
    (74, 'Javanese', 'jv'),
    (75, 'Georgian', 'ka'),
    (76, 'Kongo', 'kg'),
    (77, 'Kikuyu, Gikuyu', 'ki'),
    (78, 'Kwanyama, Kuanyama', 'kj'),
    (79, 'Kazakh', 'kk'),
    (80, 'Kalaallisut, Greenlandic', 'kl'),
    (81, 'Khmer', 'km'),
    (82, 'Kannada', 'kn'),
    (83, 'Korean', 'ko'),
    (84, 'Kanuri', 'kr'),
    (85, 'Kashmiri', 'ks'),
    (86, 'Kurdish', 'ku'),
    (87, 'Komi', 'kv'),
    (88, 'Cornish', 'kw'),
    (89, 'Kirghiz, Kyrgyz', 'ky'),
    (90, 'Latin', 'la'),
    (91, 'Luxembourgish, Letzeburgesch', 'lb'),
    (92, 'Luganda', 'lg'),
    (93, 'Limburgish, Limburgan, Limburger', 'li'),
    (94, 'Lingala', 'ln'),
    (95, 'Lao', 'lo'),
    (96, 'Lithuanian', 'lt'),
    (97, 'Luba-Katanga', 'lu'),
    (98, 'Latvian', 'lv'),
    (99, 'Malagasy', 'mg'),
    (100, 'Marshallese', 'mh'),
    (101, 'Māori', 'mi'),
    (102, 'Macedonian', 'mk'),
    (103, 'Malayalam', 'ml'),
    (104, 'Mongolian', 'mn'),
    (105, 'Marathi (Marāṭhī)', 'mr'),
    (106, 'Malay', 'ms'),
    (107, 'Maltese', 'mt'),
    (108, 'Burmese', 'my'),
    (109, 'Nauru', 'na'),
    (110, 'Norwegian Bokmål', 'nb'),
    (111, 'North Ndebele', 'nd'),
    (112, 'Nepali', 'ne'),
    (113, 'Ndonga', 'ng'),
    (114, 'Dutch', 'nl'),
    (115, 'Norwegian Nynorsk', 'nn'),
    (116, 'Norwegian', 'no'),
    (117, 'South Ndebele', 'nr'),
    (118, 'Navajo, Navaho', 'nv'),
    (119, 'Chichewa; Chewa; Nyanja', 'ny'),
    (120, 'Occitan', 'oc'),
    (121, 'Ojibwe, Ojibwa', 'oj'),
    (122, 'Oromo', 'om'),
    (123, 'Oriya', 'or'),
    (124, 'Ossetian, Ossetic', 'os'),
    (125, 'Panjabi, Punjabi', 'pa'),
    (126, 'Pāli', 'pi'),
    (127, 'Polish', 'pl'),
    (128, 'Pashto, Pushto', 'ps'),
    (129, 'Portuguese', 'pt'),
    (130, 'Quechua', 'qu'),
    (131, 'Romansh', 'rm'),
    (132, 'Kirundi', 'rn'),
    (133, 'Romanian, Moldavian, Moldovan', 'ro'),
    (134, 'Russian', 'ru'),
    (135, 'Kinyarwanda', 'rw'),
    (136, 'Sanskrit (Saṁskṛta)', 'sa'),
    (137, 'Sardinian', 'sc'),
    (138, 'Sindhi', 'sd'),
    (139, 'Northern Sami', 'se'),
    (140, 'Sango', 'sg'),
    (141, 'Sinhala, Sinhalese', 'si'),
    (142, 'Slovak', 'sk'),
    (143, 'Slovene', 'sl'),
    (144, 'Samoan', 'sm'),
    (145, 'Shona', 'sn'),
    (146, 'Somali', 'so'),
    (147, 'Albanian', 'sq'),
    (148, 'Serbian', 'sr'),
    (149, 'Swati', 'ss'),
    (150, 'Southern Sotho', 'st'),
    (151, 'Sundanese', 'su'),
    (152, 'Swedish', 'sv'),
    (153, 'Swahili', 'sw'),
    (154, 'Tamil', 'ta'),
    (155, 'Telugu', 'te'),
    (156, 'Tajik', 'tg'),
    (157, 'Thai', 'th'),
    (158, 'Tigrinya', 'ti'),
    (159, 'Turkmen', 'tk'),
    (160, 'Tagalog', 'tl'),
    (161, 'Tswana', 'tn'),
    (162, 'Tonga (Tonga Islands)', 'to'),
    (163, 'Turkish', 'tr'),
    (164, 'Tsonga', 'ts'),
    (165, 'Tatar', 'tt'),
    (166, 'Twi', 'tw'),
    (167, 'Tahitian', 'ty'),
    (168, 'Uighur, Uyghur', 'ug'),
    (169, 'Ukrainian', 'uk'),
    (170, 'Urdu', 'ur'),
    (171, 'Uzbek', 'uz'),
    (172, 'Venda', 've'),
    (173, 'Vietnamese', 'vi'),
    (174, 'Volapük', 'vo'),
    (175, 'Walloon', 'wa'),
    (176, 'Wolof', 'wo'),
    (177, 'Xhosa', 'xh'),
    (178, 'Yiddish', 'yi'),
    (179, 'Yoruba', 'yo'),
    (180, 'Zhuang, Chuang', 'za'),
    (181, 'Chinese', 'zh');