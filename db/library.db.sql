BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "authors" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL,
	"birth_year"	INTEGER
);
CREATE TABLE IF NOT EXISTS "books" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL,
	"year"	INTEGER NOT NULL,
	"author"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "books_authors" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"book_id"	INTEGER NOT NULL,
	"author_id"	INTEGER NOT NULL
);
INSERT INTO "authors" VALUES (1,'Kevin Fedarko',1960);
INSERT INTO "authors" VALUES (2,'Erik Carlson',1970);
INSERT INTO "books" VALUES (1,'The Emerald Isle',2014,'Kevin Fedarko');
INSERT INTO "books" VALUES (2,'Devil In The White City',2002,'Erik Larson');
INSERT INTO "books_authors" VALUES (1,1,1);
INSERT INTO "books_authors" VALUES (2,2,2);
COMMIT;