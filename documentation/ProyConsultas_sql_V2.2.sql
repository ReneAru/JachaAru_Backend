-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-04-01 14:52:35.802

-- tables
-- Table: Categoria
CREATE TABLE Categoria (
    id_categoria serial  NOT NULL,
    categoria varchar(100)  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Categoria_pk PRIMARY KEY (id_categoria)
);

-- Table: ConsultaCompleja
CREATE TABLE ConsultaCompleja (
    id_conscomp serial  NOT NULL,
    consulta varchar(1000)  NOT NULL,
    Usuario_usr_id int  NOT NULL,
    Investigador_invs_id int  NOT NULL,
    startdate date  NOT NULL,
    enddate date  NULL,
    state int  NOT NULL,
    CONSTRAINT ConsultaCompleja_pk PRIMARY KEY (id_conscomp)
);

-- Table: ConsultaFiltro
CREATE TABLE ConsultaFiltro (
    consf_id serial  NOT NULL,
    Usuario_usr_id int  NOT NULL,
    Filtro_id_filtro int  NOT NULL,
    Investigador_invs_id int  NOT NULL,
    startdate date  NOT NULL,
    enddate date  NULL,
    state int  NOT NULL,
    CONSTRAINT ConsultaFiltro_pk PRIMARY KEY (consf_id)
);

-- Table: ConsultaRapida
CREATE TABLE ConsultaRapida (
    id_consultarapida serial  NOT NULL,
    Usuario_usr_id int  NOT NULL,
    Filtro_id_filtro int  NOT NULL,
    startdate date  NOT NULL,
    enddate date  NULL,
    state int  NOT NULL,
    CONSTRAINT ConsultaRapida_pk PRIMARY KEY (id_consultarapida)
);

-- Table: Desegregacion
CREATE TABLE Desegregacion (
    id_desegregacion serial  NOT NULL,
    Tipo_desegregacion_id_t_desegregacion int  NOT NULL,
    desagregacion varchar(50)  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Desegregacion_pk PRIMARY KEY (id_desegregacion)
);

-- Table: Ficha_Fuente
CREATE TABLE Ficha_Fuente (
    id_ficha_fuente serial  NOT NULL,
    Fuente_id_fuente int  NOT NULL,
    Ficha_Metodologica_id_ficha_met int  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Ficha_Fuente_pk PRIMARY KEY (id_ficha_fuente)
);

-- Table: Ficha_Metodologica
CREATE TABLE Ficha_Metodologica (
    id_ficha_met serial  NOT NULL,
    ficha int  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Ficha_Metodologica_pk PRIMARY KEY (id_ficha_met)
);

-- Table: Filtro
CREATE TABLE Filtro (
    id_filtro int  NOT NULL,
    Categoria_id_categoria int  NOT NULL,
    Tema_id_tema int  NOT NULL,
    Indicador_id_indicador int  NOT NULL,
    Desegregacion_id_desegregacion int  NOT NULL,
    years_id_year int  NOT NULL,
    Fuente_id_fuente int  NOT NULL,
    Ficha_Metodologica_id_ficha_met int  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Filtro_pk PRIMARY KEY (id_filtro)
);

-- Table: Fuente
CREATE TABLE Fuente (
    id_fuente serial  NOT NULL,
    fuente varchar(50)  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Fuente_pk PRIMARY KEY (id_fuente)
);

-- Table: Fuente_year
CREATE TABLE Fuente_year (
    id_fun_year serial  NOT NULL,
    years_id_year int  NOT NULL,
    Fuente_id_fuente int  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Fuente_year_pk PRIMARY KEY (id_fun_year)
);

-- Table: Indicador
CREATE TABLE Indicador (
    id_indicador serial  NOT NULL,
    indicador varchar(50)  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Indicador_pk PRIMARY KEY (id_indicador)
);

-- Table: Investigador
CREATE TABLE Investigador (
    invs_id serial  NOT NULL,
    nombre varchar(50)  NOT NULL,
    apellido varchar(50)  NOT NULL,
    correo varchar(50)  NOT NULL,
    telegramid varchar(50)  NULL,
    state int  NOT NULL,
    CONSTRAINT Investigador_pk PRIMARY KEY (invs_id)
);

-- Table: Investigador_area
CREATE TABLE Investigador_area (
    id_invs_area serial  NOT NULL,
    Categoria_id_categoria int  NOT NULL,
    Investigador_invs_id int  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Investigador_area_pk PRIMARY KEY (id_invs_area)
);

-- Table: Tdes_indicador
CREATE TABLE Tdes_indicador (
    id_td_i serial  NOT NULL,
    Indicador_id_indicador int  NOT NULL,
    Tipo_desegregacion_id_t_desegregacion int  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Tdes_indicador_pk PRIMARY KEY (id_td_i)
);

-- Table: Tema
CREATE TABLE Tema (
    id_tema serial  NOT NULL,
    Categoria_id_categoria int  NOT NULL,
    tema varchar(100)  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Tema_pk PRIMARY KEY (id_tema)
);

-- Table: Tipo_desegregacion
CREATE TABLE Tipo_desegregacion (
    id_t_desegregacion serial  NOT NULL,
    tipo_desg varchar(50)  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Tipo_desegregacion_pk PRIMARY KEY (id_t_desegregacion)
);

-- Table: Usuario
CREATE TABLE Usuario (
    usr_id serial  NOT NULL,
    nombres varchar(50)  NOT NULL,
    apellidos varchar(50)  NOT NULL,
    google_id int  NULL,
    mail varchar(50)  NOT NULL,
    telegram_id int  NULL,
    pass varchar(500)  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT Usuario_pk PRIMARY KEY (usr_id)
);

-- Table: indicador_tema
CREATE TABLE indicador_tema (
    id_ind_tem serial  NOT NULL,
    Tema_id_tema int  NOT NULL,
    Indicador_id_indicador int  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT indicador_tema_pk PRIMARY KEY (id_ind_tem)
);

-- Table: respuesta_conscomp
CREATE TABLE respuesta_conscomp (
    id_respconscomp serial  NOT NULL,
    state int  NOT NULL,
    costo money  NOT NULL,
    ConsultaCompleja_id_conscomp int  NOT NULL,
    documento varchar(500)  NULL,
    CONSTRAINT respuesta_conscomp_pk PRIMARY KEY (id_respconscomp,costo)
);

-- Table: respuesta_consfilt
CREATE TABLE respuesta_consfilt (
    id_respconsfilt serial  NOT NULL,
    state int  NOT NULL,
    costo money  NOT NULL,
    ConsultaFiltro_consf_id int  NOT NULL,
    documento varchar(500)  NULL,
    CONSTRAINT respuesta_consfilt_pk PRIMARY KEY (id_respconsfilt,costo)
);

-- Table: respuesta_consrap
CREATE TABLE respuesta_consrap (
    id_respconsrap serial  NOT NULL,
    state int  NOT NULL,
    costo money  NOT NULL,
    ConsultaRapida_id_consultarapida int  NOT NULL,
    documento varchar(500)  NULL,
    CONSTRAINT respuesta_consrap_pk PRIMARY KEY (id_respconsrap,costo)
);

-- Table: year
CREATE TABLE year (
    id_year serial  NOT NULL,
    year int  NOT NULL,
    CONSTRAINT year_pk PRIMARY KEY (id_year)
);

-- Table: year_desegregacion
CREATE TABLE year_desegregacion (
    id_year_des serial  NOT NULL,
    Desegregacion_id_desegregacion int  NOT NULL,
    years_id_year int  NOT NULL,
    state int  NOT NULL,
    CONSTRAINT year_desegregacion_pk PRIMARY KEY (id_year_des)
);

-- foreign keys
-- Reference: ConsultaCompleja_Investigador (table: ConsultaCompleja)
ALTER TABLE ConsultaCompleja ADD CONSTRAINT ConsultaCompleja_Investigador
    FOREIGN KEY (Investigador_invs_id)
    REFERENCES Investigador (invs_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ConsultaCompleja_Usuario (table: ConsultaCompleja)
ALTER TABLE ConsultaCompleja ADD CONSTRAINT ConsultaCompleja_Usuario
    FOREIGN KEY (Usuario_usr_id)
    REFERENCES Usuario (usr_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ConsultaFiltro_Filtro (table: ConsultaFiltro)
ALTER TABLE ConsultaFiltro ADD CONSTRAINT ConsultaFiltro_Filtro
    FOREIGN KEY (Filtro_id_filtro)
    REFERENCES Filtro (id_filtro)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ConsultaFiltro_Investigador (table: ConsultaFiltro)
ALTER TABLE ConsultaFiltro ADD CONSTRAINT ConsultaFiltro_Investigador
    FOREIGN KEY (Investigador_invs_id)
    REFERENCES Investigador (invs_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ConsultaFiltro_Usuario (table: ConsultaFiltro)
ALTER TABLE ConsultaFiltro ADD CONSTRAINT ConsultaFiltro_Usuario
    FOREIGN KEY (Usuario_usr_id)
    REFERENCES Usuario (usr_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ConsultaRapida_Filtro (table: ConsultaRapida)
ALTER TABLE ConsultaRapida ADD CONSTRAINT ConsultaRapida_Filtro
    FOREIGN KEY (Filtro_id_filtro)
    REFERENCES Filtro (id_filtro)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: ConsultaRapida_Usuario (table: ConsultaRapida)
ALTER TABLE ConsultaRapida ADD CONSTRAINT ConsultaRapida_Usuario
    FOREIGN KEY (Usuario_usr_id)
    REFERENCES Usuario (usr_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Desegregacion_Tipo_desegregacion (table: Desegregacion)
ALTER TABLE Desegregacion ADD CONSTRAINT Desegregacion_Tipo_desegregacion
    FOREIGN KEY (Tipo_desegregacion_id_t_desegregacion)
    REFERENCES Tipo_desegregacion (id_t_desegregacion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Ficha_Fuente_Ficha_Metodologica (table: Ficha_Fuente)
ALTER TABLE Ficha_Fuente ADD CONSTRAINT Ficha_Fuente_Ficha_Metodologica
    FOREIGN KEY (Ficha_Metodologica_id_ficha_met)
    REFERENCES Ficha_Metodologica (id_ficha_met)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Ficha_Fuente_Fuente (table: Ficha_Fuente)
ALTER TABLE Ficha_Fuente ADD CONSTRAINT Ficha_Fuente_Fuente
    FOREIGN KEY (Fuente_id_fuente)
    REFERENCES Fuente (id_fuente)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Filtro_Categoria (table: Filtro)
ALTER TABLE Filtro ADD CONSTRAINT Filtro_Categoria
    FOREIGN KEY (Categoria_id_categoria)
    REFERENCES Categoria (id_categoria)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Filtro_Desegregacion (table: Filtro)
ALTER TABLE Filtro ADD CONSTRAINT Filtro_Desegregacion
    FOREIGN KEY (Desegregacion_id_desegregacion)
    REFERENCES Desegregacion (id_desegregacion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Filtro_Ficha_Metodologica (table: Filtro)
ALTER TABLE Filtro ADD CONSTRAINT Filtro_Ficha_Metodologica
    FOREIGN KEY (Ficha_Metodologica_id_ficha_met)
    REFERENCES Ficha_Metodologica (id_ficha_met)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Filtro_Fuente (table: Filtro)
ALTER TABLE Filtro ADD CONSTRAINT Filtro_Fuente
    FOREIGN KEY (Fuente_id_fuente)
    REFERENCES Fuente (id_fuente)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Filtro_Indicador (table: Filtro)
ALTER TABLE Filtro ADD CONSTRAINT Filtro_Indicador
    FOREIGN KEY (Indicador_id_indicador)
    REFERENCES Indicador (id_indicador)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Filtro_Tema (table: Filtro)
ALTER TABLE Filtro ADD CONSTRAINT Filtro_Tema
    FOREIGN KEY (Tema_id_tema)
    REFERENCES Tema (id_tema)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Filtro_years (table: Filtro)
ALTER TABLE Filtro ADD CONSTRAINT Filtro_years
    FOREIGN KEY (years_id_year)
    REFERENCES year (id_year)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Fuente_year_Fuente (table: Fuente_year)
ALTER TABLE Fuente_year ADD CONSTRAINT Fuente_year_Fuente
    FOREIGN KEY (Fuente_id_fuente)
    REFERENCES Fuente (id_fuente)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Fuente_year_years (table: Fuente_year)
ALTER TABLE Fuente_year ADD CONSTRAINT Fuente_year_years
    FOREIGN KEY (years_id_year)
    REFERENCES year (id_year)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Investigador_area_Categoria (table: Investigador_area)
ALTER TABLE Investigador_area ADD CONSTRAINT Investigador_area_Categoria
    FOREIGN KEY (Categoria_id_categoria)
    REFERENCES Categoria (id_categoria)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Investigador_area_Investigador (table: Investigador_area)
ALTER TABLE Investigador_area ADD CONSTRAINT Investigador_area_Investigador
    FOREIGN KEY (Investigador_invs_id)
    REFERENCES Investigador (invs_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Tdes_indicador_Indicador (table: Tdes_indicador)
ALTER TABLE Tdes_indicador ADD CONSTRAINT Tdes_indicador_Indicador
    FOREIGN KEY (Indicador_id_indicador)
    REFERENCES Indicador (id_indicador)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Tdes_indicador_Tipo_desegregacion (table: Tdes_indicador)
ALTER TABLE Tdes_indicador ADD CONSTRAINT Tdes_indicador_Tipo_desegregacion
    FOREIGN KEY (Tipo_desegregacion_id_t_desegregacion)
    REFERENCES Tipo_desegregacion (id_t_desegregacion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Tema_Categoria (table: Tema)
ALTER TABLE Tema ADD CONSTRAINT Tema_Categoria
    FOREIGN KEY (Categoria_id_categoria)
    REFERENCES Categoria (id_categoria)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: indicador_tema_Indicador (table: indicador_tema)
ALTER TABLE indicador_tema ADD CONSTRAINT indicador_tema_Indicador
    FOREIGN KEY (Indicador_id_indicador)
    REFERENCES Indicador (id_indicador)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: indicador_tema_Tema (table: indicador_tema)
ALTER TABLE indicador_tema ADD CONSTRAINT indicador_tema_Tema
    FOREIGN KEY (Tema_id_tema)
    REFERENCES Tema (id_tema)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: respuesta_conscomp_ConsultaCompleja (table: respuesta_conscomp)
ALTER TABLE respuesta_conscomp ADD CONSTRAINT respuesta_conscomp_ConsultaCompleja
    FOREIGN KEY (ConsultaCompleja_id_conscomp)
    REFERENCES ConsultaCompleja (id_conscomp)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: respuesta_consfilt_ConsultaFiltro (table: respuesta_consfilt)
ALTER TABLE respuesta_consfilt ADD CONSTRAINT respuesta_consfilt_ConsultaFiltro
    FOREIGN KEY (ConsultaFiltro_consf_id)
    REFERENCES ConsultaFiltro (consf_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: respuesta_consrap_ConsultaRapida (table: respuesta_consrap)
ALTER TABLE respuesta_consrap ADD CONSTRAINT respuesta_consrap_ConsultaRapida
    FOREIGN KEY (ConsultaRapida_id_consultarapida)
    REFERENCES ConsultaRapida (id_consultarapida)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: year_desegregacion_Desegregacion (table: year_desegregacion)
ALTER TABLE year_desegregacion ADD CONSTRAINT year_desegregacion_Desegregacion
    FOREIGN KEY (Desegregacion_id_desegregacion)
    REFERENCES Desegregacion (id_desegregacion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: year_desegregacion_years (table: year_desegregacion)
ALTER TABLE year_desegregacion ADD CONSTRAINT year_desegregacion_years
    FOREIGN KEY (years_id_year)
    REFERENCES year (id_year)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

