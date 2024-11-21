import multer from 'multer';

// Configuração de armazenamento
const storage = multer.memoryStorage();

// Configuração para aceitar múltiplos arquivos
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }  // Limite de 10MB por imagem (opcional)
}).array('imagens', 10);  // 'imagens' é o nome do campo e 5 é o número máximo de arquivos que podem ser enviados

export default upload;