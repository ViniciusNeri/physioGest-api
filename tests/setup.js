require('reflect-metadata');
const { container } = require('tsyringe');

// Limpar container entre testes
beforeEach(() => {
  container.clearInstances();
});

// Configurações globais de teste podem ser adicionadas aqui
// Por exemplo: mocks globais, configurações de banco, etc.