CREATE TABLE `Equipamento_Status` (
  `eqpStaId` INT NOT NULL PRIMARY KEY,
  `eqpStaDescricao` VARCHAR(45) NOT NULL
);

CREATE TABLE `Implemento` (
  `impId` INT NOT NULL PRIMARY KEY,
  `impNome` VARCHAR(45) NOT NULL,
  `impDataAquisicao` DATE NOT NULL,
  `impDescricao` VARCHAR(250) NULL,
  `impInativo` CHAR(1) NOT NULL,
  `impStatus` INT NOT NULL,
  CONSTRAINT `impStatus`
    FOREIGN KEY (`impStatus`)
    REFERENCES `Equipamento_Status` (`epqStaId`)
);

CREATE TABLE `Maquina` (
  `maqId` INT NOT NULL PRIMARY KEY,
  `maqNome` VARCHAR(45) NOT NULL,
  `maqDataAquisicao` DATE NOT NULL,
  `maqTipo` VARCHAR(100) NOT NULL,
  `maqDescricao` VARCHAR(250) NULL,
  `maqInativo` CHAR(1) NOT NULL,
  `maqHorasUso` INT NULL,
  `maqStatus` INT NOT NULL,
  CONSTRAINT `maqStatus`
    FOREIGN KEY (`maqStatus`)
    REFERENCES `Equipamento_Status` (`epqStaId`)
);

CREATE TABLE `Peca` (
  `pecId` INT NOT NULL PRIMARY KEY,
  `pecNome` VARCHAR(45) NOT NULL,
  `pecDataAquisicao` DATE NOT NULL,
  `pecDescricao` VARCHAR(250) NULL,
  `pecInativo` CHAR(1) NOT NULL,
  `pecStatus` INT NOT NULL,
  CONSTRAINT `pecStatus`
    FOREIGN KEY (`pecStatus`)
    REFERENCES `Equipamento_Status` (`epqStaId`)
);

CREATE TABLE `Manutencao_Equipamento` (
  `manId` INT NOT NULL PRIMARY KEY,
  `manDataInicio` DATE NOT NULL,
  `manDecricao` VARCHAR(150) NOT NULL,
  `manDataTermino` DATE NULL,
  `manObservacao` VARCHAR(150) NULL,
  `manStatus` VARCHAR(10) NOT NULL,
  `manMaqId` INT NOT NULL,
  `manImpId` INT NOT NULL,
  `manPecId` INT NOT NULL,
  CONSTRAINT `manMaqId`
    FOREIGN KEY (`manMaqId`)
    REFERENCES `Maquina` (`maqId`),
  CONSTRAINT `manImpId`
    FOREIGN KEY (`manImpId`)
    REFERENCES `Implemento` (`impId`),
  CONSTRAINT `manPecId`
    FOREIGN KEY (`manPecId`)
    REFERENCES `Peca` (`pecId`)
);

CREATE TABLE `Cliente` (
  `cliId` INT NOT NULL PRIMARY KEY,
  `cliNome` VARCHAR(60) NOT NULL,
  `cliCPF_CNPJ` VARCHAR(25) NOT NULL,
  `usuTelefone` VARCHAR(14) NULL,
  `usuEmail` VARCHAR(25) NULL
);

CREATE TABLE `Usuario_Perfil` (
  `usuPerId` INT NOT NULL PRIMARY KEY,
  `usuPerDescricao` VARCHAR(45) NOT NULL
);

CREATE TABLE `Usuario` (
  `usuId` INT NOT NULL PRIMARY KEY,
  `usuNome` VARCHAR(60) NOT NULL,
  `usuSenha` VARCHAR(20) NOT NULL,
  `usuTelefone` VARCHAR(14) NULL,
  `usuEmail` VARCHAR(25) NULL,
  `usuPerfil` INT NOT NULL,
  CONSTRAINT `usuPerfil`
    FOREIGN KEY (`usuPerfil`)
    REFERENCES `Usuario_Perfil` (`usuPerId`)
);

CREATE TABLE `Locacao_Status` (
  `locStaId` INT NOT NULL PRIMARY KEY,
  `locStaDescricao` VARCHAR(45) NOT NULL
);

CREATE TABLE `Locacao` (
  `locId` INT NOT NULL PRIMARY KEY,
  `locDataInicio` DATE NOT NULL,
  `locDataFinalPrevista` DATE NOT NULL,
  `locDataFinalEntrega` DATE NOT NULL,
  `locValorTotal` DECIMAL(10, 2) NOT NULL,
  `locDesconto` DECIMAL(10, 2) NULL,
  `locValorFinal` DECIMAL(10, 2) NOT NULL,
  `locCliId` INT NOT NULL,
  `locUsuId` INT NOT NULL,
  `locStatus` INT NOT NULL,
  CONSTRAINT `locCliId`
    FOREIGN KEY (`locCliId`)
    REFERENCES `Cliente` (`cliId`),
  CONSTRAINT `locUsuId`
    FOREIGN KEY (`locUsuId`)
    REFERENCES `Usuario` (`usuId`),
  CONSTRAINT `locStatus`
    FOREIGN KEY (`locStatus`)
    REFERENCES `Locacao_Status` (`locStaId`)
);

CREATE TABLE `Itens_Locacao` (
  `iteLocId` INT NOT NULL  PRIMARY KEY,
  `iteLocQuantidade` INT NOT NULL,
  `iteLocValorUnitario` DECIMAL(10, 2) NOT NULL,
  `iteLocPecId` INT NOT NULL,
  `iteLocImpId` INT NOT NULL,
  `iteLocMaqId` INT NOT NULL,
  `IteLocLocacaoId` INT NOT NULL,
  CONSTRAINT `iteLocPecId`
    FOREIGN KEY (`iteLocPecId`)
    REFERENCES `Peca` (`pecId`),
  CONSTRAINT `iteLocImpId`
    FOREIGN KEY (`iteLocImpId`)
    REFERENCES `Implemento` (`impId`),
CONSTRAINT `iteLocMaqId`
    FOREIGN KEY (`iteLocMaqId`)
    REFERENCES `Implemento` (`impId`),
  CONSTRAINT `IteLocLocacaoId`
    FOREIGN KEY (`IteLocLocacaoId`)
    REFERENCES `Locacao` (`locId`)
);

INSERT INTO `Locacao_Status` (`locStaId`, `locStaDescricao`)
VALUES
  (1, 'Em andamento'),
  (2, 'Encerrada');

INSERT INTO `Usuario_Perfil` (`usuPerId`, `usuPerDescricao`)
VALUES
  (1, 'Administrador'),
  (2, 'Funcionário');

INSERT INTO `Equipamento_Status` (`eqpStaId`, `eqpStaDescricao`)
VALUES
  (1, 'Disponível'),
  (2, 'Locado'),
  (3, 'Manutenção');

INSERT INTO `Maquina` (`maqId`, `maqNome`, `maqDataAquisicao`, `maqTipo`, `maqDescricao`, `impInativo`, `maqStatus`)
VALUES
  (1, 'Escavadeira', '2022-05-15', 'Nova', 'Escavadeira de grande porte', 'N', 1),
  (2, 'Retroescavadeira', '2023-03-10', 'Nova', 'Retroescavadeira compacta', 'N', 1),
  (3, 'Bulldozer', '2021-11-20', 'Semi-Nova', 'Bulldozer de alta performance', 'N', 2);

INSERT INTO `Cliente` (`cliId`, `cliNome`, `cliCPF_CNPJ`, `usuTelefone`, `usuEmail`)
VALUES
  (1, 'João Silva', '123.456.789-00', '(11)91234-5678', 'joao.silva@email.com'),
  (2, 'Maria Oliveira', '987.654.321-00', '(11)98765-4321', 'maria.oliveira@email.com');

INSERT INTO `Implemento` (`impId`, `impNome`, `impDataAquisicao`, `impDescricao`, `impInativo`, `impStatus`)
VALUES
  (1, 'Pulverizador', '2022-01-10', 'Pulverizador agrícola', 'N', 1),
  (2, 'Arado', '2022-02-15', 'Arado para trator', 'N', 1);

INSERT INTO `Peca` (`pecId`, `pecNome`, `pecDataAquisicao`, `pecDescricao`, `pecInativo`, `pecStatus`)
VALUES
  (1, 'Ferro de Reposição', '2023-01-05', 'Ferro para substituição', 'N', 1),
  (2, 'Correia', '2023-02-10', 'Correia de transmissão', 'N', 1);

SELECT * FROM `Equipamento_Status`;
SELECT * FROM `Locacao_Status`;
SELECT * FROM `Usuario_Perfil`;
SELECT * FROM `Maquina`;
SELECT * FROM `Cliente`;
SELECT * FROM `Implemento`;
SELECT * FROM `Peca`;


SELECT m.maqId, m.maqNome, m.maqDataAquisicao, m.maqTipo, m.maqInativo, m.maqHorasUso, es.eqpStaId, es.eqpStaDescricao
FROM Maquina m
JOIN Equipamento_Status es ON m.maqStatus = es.eqpStaId;

DESCRIBE Equipamento_Status;