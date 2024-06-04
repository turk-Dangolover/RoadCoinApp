## Lizenzen

Dieses Projekt verwendet die folgenden Bibliotheken und deren Lizenzen:

- **Spring Boot**: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- **React Native**: [MIT License](https://opensource.org/licenses/MIT)
- **Google Maps**: Unterliegt den [Google Maps/Google Earth APIs Terms of Service](https://developers.google.com/maps/terms)


# Datenbankstruktur für RodeCoin

Die folgenden SQL-Abfragen erstellen die notwendigen Tabellen und Constraints für das System.

## Tabellenstruktur
Es benötigt eine Datenbank "RodeCoin".
### Tabelle 
Diese Tabelle speichert die Informationen zu den Artikeln im Shop.

```sql
CREATE TABLE IF NOT EXISTS public.shop
(
    itemnumber integer NOT NULL DEFAULT nextval('shop_itemnumber_seq'::regclass),
    itemname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    price integer NOT NULL,
    description text COLLATE pg_catalog."default",
    stockquantity integer DEFAULT 0,
    category character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT shop_pkey PRIMARY KEY (itemnumber)
);

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    verify boolean DEFAULT false,
    verification_id character varying(255) COLLATE pg_catalog."default",
    currcoins integer DEFAULT 0,
    allcoins integer DEFAULT 0,
    allrout integer DEFAULT 0,
    allsteps integer DEFAULT 0,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username),
    CONSTRAINT users_verification_id_key UNIQUE (verification_id)
);

CREATE TABLE IF NOT EXISTS public.useritems
(
    verification_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    itemnumber integer NOT NULL,
    isequipped boolean DEFAULT false,
    CONSTRAINT useritems_pkey PRIMARY KEY (verification_id, itemnumber),
    CONSTRAINT useritems_itemnumber_fkey FOREIGN KEY (itemnumber)
        REFERENCES public.shop (itemnumber) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT useritems_verification_id_fkey FOREIGN KEY (verification_id)
        REFERENCES public.users (verification_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);




## env

Es muss eine .env in diesem Format erstellt werden:
GOOGLE_MAPS_KEY = 'key'
SERVER_IP = 'http://192.168.178.46:8080/save'
SERVER_IP1 = 'http://192.168.178.46:8080'
SERVER_IP2 = 'http://192.168.178.46:8080/look'
SERVER_IP3 = 'http://192.168.178.46:8080/get'
SERVER_IP4 = 'http://192.168.178.46:8080/change'
