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
    impExibirCatalogo INT NOT NULL,
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
    maqModelo VARCHAR(100) NOT NULL, 
    maqSerie VARCHAR(100) NOT NULL, 
    maqAnoFabricacao YEAR NOT NULL, 
    maqDescricao LONGTEXT NULL,
    maqExibirCatalogo INT NOT NULL,
    maqHorasUso INT NULL,
    maqStatus INT NOT NULL,
    maqPrecoVenda DECIMAL(10, 2) NOT NULL,
    CONSTRAINT maqStatus
      FOREIGN KEY (maqStatus)
      REFERENCES Equipamento_Status (eqpStaId)
  );

  CREATE TABLE Maquina_Aluguel (
    maqAluId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    maqId INT NOT NULL,
    maqAluPrecoDiario DECIMAL(10, 2) NOT NULL,
    maqAluPrecoSemanal DECIMAL(10, 2) NOT NULL,
    maqAluPrecoQuinzenal DECIMAL(10, 2) NOT NULL,
    maqAluPrecoMensal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT maqId
      FOREIGN KEY (maqId)
      REFERENCES Maquina(maqId)
      ON DELETE CASCADE
  );

  CREATE TABLE Peca (
    pecId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    pecNome VARCHAR(45) NOT NULL,
    pecDataAquisicao DATE NOT NULL,
    pecDescricao LONGTEXT NULL,
    pecExibirCatalogo INT NOT NULL,
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
    locPrecoHoraExtra DECIMAL(10, 2) NULL,
    locCliId INT NOT NULL,
    locStatus INT NOT NULL,
    CONSTRAINT locCliId
      FOREIGN KEY (locCliId)
      REFERENCES Cliente (cliId),
    CONSTRAINT locStatus
      FOREIGN KEY (locStatus)
      REFERENCES Locacao_Status (locStaId)
  );

  CREATE TABLE Itens_Locacao (
    iteLocId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    iteLocValorUnitario DECIMAL(10, 2) NOT NULL,
    iteLocPlanoAluguel VARCHAR(15) NOT NULL,
    iteLocQuantDias INT NOT NULL,
    iteLocMaqId INT NULL,
    IteLocLocacaoId INT NOT NULL,
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
    imgNome VARCHAR(255) NOT NULL,
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
    (2, 'Finalizada');

  INSERT INTO Usuario_Perfil (usuPerId, usuPerDescricao)
  VALUES
    (1, 'Administrador'),
    (2, 'Funcionário');

  INSERT INTO Equipamento_Status (eqpStaId, eqpStaDescricao)
  VALUES
    (1, 'Disponível'),
    (2, 'Locado'),
    (3, 'Em Manutenção'),
    (4, 'Vendido');

  INSERT INTO Maquina (maqNome, maqDataAquisicao, maqTipo, maqModelo, maqSerie, maqAnoFabricacao, maqDescricao, maqExibirCatalogo, maqHorasUso, maqStatus, maqPrecoVenda)
  VALUES
    ('Escavadeira Hidráulica', '2022-05-15', 'Nova', 'CAT320D', 'SN12345', 2022, 'Ideal para grandes escavações', 1, 500, 1, 500000.00),
    ('Trator Agrícola', '2020-09-10', 'Nova', 'John Deere 6110B', 'JD54321', 2020, 'Versátil para atividades no campo', 1, 300, 1, 200000.00),
    ('Guindaste', '2021-07-22', 'Semi-Nova', 'Liebherr LTM 1090', 'LG09876', 2021, 'Guindaste para uso em construções de grande porte', 1, 100, 1, 800000.00),
    ('Retroescavadeira', '2019-03-18', 'Semi-Nova', 'JCB 3CX', 'JCB56789', 2019, 'Ideal para obras urbanas', 1, 400, 1, 300000.00);

  INSERT INTO Implemento (impId, impNome, impDataAquisicao, impDescricao, impExibirCatalogo, impStatus, impPrecoVenda, impPrecoHora)
  VALUES
    (1, 'Pulverizador', '2022-01-10', 'Pulverizador agrícola', 1, 1, 15000.00, 100.00),
    (2, 'Arado', '2022-02-15', 'Arado para trator', 0, 1, 12000.00, 80.00);

  INSERT INTO Peca (pecId, pecNome, pecDataAquisicao, pecDescricao, pecExibirCatalogo, pecStatus, pecPrecoVenda, pecPrecoHora)
  VALUES
    (1, 'Ferro de Reposição', '2023-01-05', 'Ferro para substituição', 1, 1, 200.00, 10.00),
    (2, 'Correia', '2023-02-10', 'Correia de transmissão', 0, 1, 150.00, 8.00);

  INSERT INTO Cliente (cliId, cliNome, cliCPF_CNPJ, cliTelefone, cliEmail)
  VALUES
    (1, 'João Silva', '123.456.789-00', '(11)91234-5678', 'joao.silva@email.com'),
    (2, 'Maria Oliveira', '987.654.321-00', '(11)98765-4321', 'maria.oliveira@email.com');

  INSERT INTO Maquina_Aluguel (maqId, maqAluPrecoDiario, maqAluPrecoSemanal, maqAluPrecoQuinzenal, maqAluPrecoMensal)
  VALUES
  (1, 500.00, 3000.00, 6000.00, 12000.00), 
  (2, 400.00, 2500.00, 5000.00, 10000.00), 
  (3, 800.00, 5000.00, 10000.00, 20000.00), 
  (4, 350.00, 2100.00, 4200.00, 8400.00); 

  INSERT INTO Manutencao_Equipamento (manId, manDataInicio, manDescricao, manDataTermino, manObservacao, manStatus, manMaqId, manImpId, manPecId)
  VALUES
    (1, '2024-01-10', 'Troca de óleo', '2024-01-15', 'Óleo trocado com sucesso', 'Finalizada', 1, null, null),
    (2, '2024-02-20', 'Reparo nas correias', '2024-02-25', 'Correias substituídas', 'Finalizada', null, 2, null);

  INSERT INTO Usuario (usuId, usuNome, usuSenha, usuTelefone, usuEmail, usuPerfil)
  VALUES
    (1, 'Carlos Pereira', 'senha123', '(11)99876-5432', 'carlos.pereira@email.com', 1),
    (2, 'Fernanda Lima', 'senha456', '(11)91234-6789', 'fernanda.lima@email.com', 2);

  INSERT INTO Locacao (locDataInicio, locDataFinalPrevista, locDataFinalEntrega, locValorTotal, locDesconto, locValorFinal, locPrecoHoraExtra, locCliId, locStatus) 
  VALUES 
    ('2024-05-01', '2024-05-10', '2024-05-09', 10000.00, 500.00, 9500.00, 0, 1, 2),  
    ('2024-06-01', '2024-06-15', '2024-06-14', 15000.00, 750.00, 14250.00, 100.00, 2, 2); 

  INSERT INTO Itens_Locacao ( iteLocValorUnitario, iteLocPlanoAluguel, iteLocQuantDias, iteLocMaqId, IteLocLocacaoId ) 
  VALUES 
    (1000.00, 'Diária', 3, 1, 1),  
    (1500.00, 'Mensal', 35, 2, 2);  

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
  SELECT * FROM Maquina_Aluguel;