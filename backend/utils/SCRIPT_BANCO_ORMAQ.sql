CREATE SCHEMA ormaq_db;
USE ormaq_db;

CREATE TABLE Equipamento_Status (
  eqpStaId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  eqpStaDescricao VARCHAR(45) NOT NULL
);

CREATE TABLE Implemento (
  impId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  impNome VARCHAR(45) NOT NULL,
  impDataAquisicao DATE NOT NULL,
  impDescricao LONGTEXT NULL,
  impInativo INT NOT NULL,
  impStatus INT NOT NULL,
  impPrecoVenda DECIMAL(10, 2) NOT NULL, 
  impPrecoHora DECIMAL(10, 2) NOT NULL, 
  CONSTRAINT impStatus
    FOREIGN KEY (impStatus)
    REFERENCES Equipamento_Status (eqpStaId)
);

CREATE TABLE Maquina (
  maqId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  maqNome VARCHAR(45) NOT NULL,
  maqDataAquisicao DATE NOT NULL,
  maqTipo VARCHAR(100) NOT NULL,
  maqDescricao LONGTEXT NULL, 
  maqInativo INT NOT NULL, 
  maqHorasUso INT NULL,
  maqStatus INT NOT NULL,
  maqPrecoVenda DECIMAL(10, 2) NOT NULL, 
  maqPrecoHora DECIMAL(10, 2) NOT NULL,
  CONSTRAINT maqStatus
    FOREIGN KEY (maqStatus)
    REFERENCES Equipamento_Status (eqpStaId)
);

CREATE TABLE Peca (
  pecId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  pecNome VARCHAR(45) NOT NULL,
  pecDataAquisicao DATE NOT NULL,
  pecDescricao LONGTEXT NULL,
  pecInativo INT NOT NULL,
  pecStatus INT NOT NULL,
  pecPrecoVenda DECIMAL(10, 2) NOT NULL, 
  pecPrecoHora DECIMAL(10, 2) NOT NULL,
  CONSTRAINT pecStatus
    FOREIGN KEY (pecStatus)
    REFERENCES Equipamento_Status (eqpStaId)
);

CREATE TABLE Manutencao_Equipamento (
  manId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  manDataInicio DATE NOT NULL,
  manDescricao VARCHAR(150) NOT NULL,
  manDataTermino DATE NULL,
  manObservacao VARCHAR(150) NULL,
  manStatus VARCHAR(15) NOT NULL,
  manMaqId INT NULL,
  manImpId INT NULL,
  manPecId INT NULL,
  CONSTRAINT manMaqId
    FOREIGN KEY (manMaqId)
    REFERENCES Maquina (maqId),
  CONSTRAINT manImpId
    FOREIGN KEY (manImpId)
    REFERENCES Implemento (impId),
  CONSTRAINT manPecId
    FOREIGN KEY (manPecId)
    REFERENCES Peca (pecId)
);

CREATE TABLE Cliente (
  cliId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  cliNome VARCHAR(60) NOT NULL,
  cliCPF_CNPJ VARCHAR(25) NOT NULL,
  cliTelefone VARCHAR(14) NULL,
  cliEmail VARCHAR(25) NULL
);

CREATE TABLE Usuario_Perfil (
  usuPerId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  usuPerDescricao VARCHAR(45) NOT NULL
);

CREATE TABLE Usuario (
  usuId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  usuNome VARCHAR(60) NOT NULL,
  usuSenha VARCHAR(20) NOT NULL,
  usuTelefone VARCHAR(14) NULL,
  usuEmail VARCHAR(25) NULL,
  usuPerfil INT NOT NULL,
  CONSTRAINT usuPerfil
    FOREIGN KEY (usuPerfil)
    REFERENCES Usuario_Perfil (usuPerId)
);

CREATE TABLE Locacao_Status (
  locStaId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  locStaDescricao VARCHAR(45) NOT NULL
);

CREATE TABLE Locacao (
  locId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  locDataInicio DATE NOT NULL,
  locDataFinalPrevista DATE NOT NULL,
  locDataFinalEntrega DATE NULL,
  locValorTotal DECIMAL(10, 2) NOT NULL,
  locDesconto DECIMAL(10, 2) NULL,
  locValorFinal DECIMAL(10, 2) NOT NULL,
  locCliId INT NOT NULL,
  locUsuId INT NOT NULL,
  locStatus INT NOT NULL,
  CONSTRAINT locCliId
    FOREIGN KEY (locCliId)
    REFERENCES Cliente (cliId),
  CONSTRAINT locUsuId
    FOREIGN KEY (locUsuId)
    REFERENCES Usuario (usuId),
  CONSTRAINT locStatus
    FOREIGN KEY (locStatus)
    REFERENCES Locacao_Status (locStaId)
);

CREATE TABLE Itens_Locacao (
  iteLocId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  iteLocQuantidade INT NOT NULL,
  iteLocValorUnitario DECIMAL(10, 2) NOT NULL,
  iteLocPecId INT NULL,
  iteLocImpId INT NULL,
  iteLocMaqId INT NULL,
  IteLocLocacaoId INT NOT NULL,
  CONSTRAINT iteLocPecId
    FOREIGN KEY (iteLocPecId)
    REFERENCES Peca (pecId),
  CONSTRAINT iteLocImpId
    FOREIGN KEY (iteLocImpId)
    REFERENCES Implemento (impId),
  CONSTRAINT iteLocMaqId
    FOREIGN KEY (iteLocMaqId)
    REFERENCES Maquina (maqId), 
  CONSTRAINT IteLocLocacaoId
    FOREIGN KEY (IteLocLocacaoId)
    REFERENCES Locacao (locId)
);

CREATE TABLE Imagens_Equipamento (
  imgId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  imgUrl VARCHAR(255) NOT NULL,
  imgPrincipal BOOLEAN NOT NULL,
  imgPecId INT NULL,
  imgMaqId INT NULL,
  imgImpId INT NULL,
  CONSTRAINT fk_imgPecId
    FOREIGN KEY (imgPecId)
    REFERENCES Peca (pecId),
  CONSTRAINT fk_imgMaqId
    FOREIGN KEY (imgMaqId)
    REFERENCES Maquina (maqId),
  CONSTRAINT fk_imgImpId
    FOREIGN KEY (imgImpId)
    REFERENCES Implemento (impId)
);

INSERT INTO Locacao_Status (locStaId, locStaDescricao)
VALUES
  (1, 'Em andamento'),
  (2, 'Encerrada');

INSERT INTO Usuario_Perfil (usuPerId, usuPerDescricao)
VALUES
  (1, 'Administrador'),
  (2, 'Funcionário');

INSERT INTO Equipamento_Status (eqpStaId, eqpStaDescricao)
VALUES
  (1, 'Disponível'),
  (2, 'Locado'),
  (3, 'Manutenção');

INSERT INTO Maquina (maqId, maqNome, maqDataAquisicao, maqTipo, maqDescricao, maqInativo, maqStatus, maqHorasUso, maqPrecoVenda, maqPrecoHora)
VALUES
  (1, 'Escavadeira', '2022-05-15', 'Nova', 'Escavadeira de grande porte', 0, 1, 200, 150000.00, 500.00),
  (2, 'Retroescavadeira', '2023-03-10', 'Nova', 'Retroescavadeira compacta', 0, 1, 0, 80000.00, 300.00),
  (3, 'Bulldozer', '2021-11-20', 'Semi-Nova', 'Bulldozer de alta performance', 0, 2, 180, 250000.00, 600.00);

INSERT INTO Implemento (impId, impNome, impDataAquisicao, impDescricao, impInativo, impStatus, impPrecoVenda, impPrecoHora)
VALUES
  (1, 'Pulverizador', '2022-01-10', 'Pulverizador agrícola', 0, 1, 15000.00, 100.00),
  (2, 'Arado', '2022-02-15', 'Arado para trator', 0, 1, 12000.00, 80.00);

INSERT INTO Peca (pecId, pecNome, pecDataAquisicao, pecDescricao, pecInativo, pecStatus, pecPrecoVenda, pecPrecoHora)
VALUES
  (1, 'Ferro de Reposição', '2023-01-05', 'Ferro para substituição', 0, 1, 200.00, 10.00),
  (2, 'Correia', '2023-02-10', 'Correia de transmissão', 0, 1, 150.00, 8.00);

INSERT INTO Imagens_Equipamento (imgUrl, imgPrincipal, imgPecId, imgMaqId, imgImpId)
VALUES
  ('https://example.com/escavadeira_principal.jpg', TRUE, NULL, 1, NULL),
  ('https://example.com/escavadeira_adicional.jpg', FALSE, NULL, 1, NULL),
  ('https://example.com/retroescavadeira_principal.jpg', TRUE, NULL, 2, NULL), 
  ('https://example.com/retroescavadeira_adicional.jpg', FALSE, NULL, 2, NULL),
  ('https://example.com/bulldozer_principal.jpg', TRUE, NULL, 3, NULL), 
  ('https://example.com/pulverizador_principal.jpg', TRUE, NULL, NULL, 1),
  ('https://example.com/arado_principal.jpg', TRUE, NULL, NULL, 2);

INSERT INTO Cliente (cliId, cliNome, cliCPF_CNPJ, cliTelefone, cliEmail)
VALUES
  (1, 'João Silva', '123.456.789-00', '(11)91234-5678', 'joao.silva@email.com'),
  (2, 'Maria Oliveira', '987.654.321-00', '(11)98765-4321', 'maria.oliveira@email.com');

INSERT INTO Manutencao_Equipamento (manId, manDataInicio, manDescricao, manDataTermino, manObservacao, manStatus, manMaqId, manImpId, manPecId)
VALUES
  (1, '2024-01-10', 'Troca de óleo', '2024-01-15', 'Óleo trocado com sucesso', 'Concluído', 1, null, null),
  (2, '2024-02-20', 'Reparo nas correias', '2024-02-25', 'Correias substituídas', 'Concluído', null, 2, null);

INSERT INTO Usuario (usuId, usuNome, usuSenha, usuTelefone, usuEmail, usuPerfil)
VALUES
  (1, 'Carlos Pereira', 'senha123', '(11)99876-5432', 'carlos.pereira@email.com', 1),
  (2, 'Fernanda Lima', 'senha456', '(11)91234-6789', 'fernanda.lima@email.com', 2);

INSERT INTO Locacao (locId, locDataInicio, locDataFinalPrevista, locDataFinalEntrega, locValorTotal, locDesconto, locValorFinal, locCliId, locUsuId, locStatus)
VALUES
  (1, '2024-05-01', '2024-05-10', '2024-05-09', 10000.00, 500.00, 9500.00, 1, 1, 1),
  (2, '2024-06-01', '2024-06-15', '2024-06-14', 15000.00, 750.00, 14250.00, 2, 2, 1);

INSERT INTO Itens_Locacao (iteLocId, iteLocQuantidade, iteLocValorUnitario, iteLocPecId, iteLocImpId, iteLocMaqId, IteLocLocacaoId)
VALUES
  (1, 1, 1000.00, 1, null, null, 1),
  (2, 2, 1500.00, null, 2, null, 2);

SELECT * FROM Equipamento_Status;
SELECT * FROM Locacao_Status;
SELECT * FROM Usuario_Perfil;
SELECT * FROM Maquina;
SELECT * FROM Cliente;
SELECT * FROM Implemento;
SELECT * FROM Peca;
SELECT * FROM Manutencao_Equipamento;
SELECT * FROM Usuario;
SELECT * FROM Locacao;
SELECT * FROM Itens_Locacao;
SELECT * FROM Imagens_Equipamento;