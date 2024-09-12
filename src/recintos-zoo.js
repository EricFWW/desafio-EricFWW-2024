class RecintosZoo {
    constructor() {
      this.recintos = [
        { numero: 1, bioma: ['savana'], tamanho: 10, ocupacao: [{ especie: 'MACACO', quantidade: 3 }] },
        { numero: 2, bioma: ['floresta'], tamanho: 5, ocupacao: [] },
        { numero: 3, bioma: ['savana', 'rio'], tamanho: 7, ocupacao: [{ especie: 'GAZELA', quantidade: 1 }] },
        { numero: 4, bioma: ['rio'], tamanho: 8, ocupacao: [] },
        { numero: 5, bioma: ['savana'], tamanho: 9, ocupacao: [{ especie: 'LEAO', quantidade: 1 }] }
      ];
  
      this.animais = {
        LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
        LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
        CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
        MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
        GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
        HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
      };
    }
  
    // Método principal que analisa os recintos
    analisaRecintos(animal, quantidade) {
      if (!this.animais[animal]) {
        return { erro: 'Animal inválido' };
      }
      
      if (quantidade <= 0) {
        return { erro: 'Quantidade inválida' };
      }
  
      const animalInfo = this.animais[animal];
      let recintosViaveis = [];
  
      this.recintos.forEach(recinto => {
        const biomaAdequado = animalInfo.biomas.some(bioma => recinto.bioma.includes(bioma));
        const espacoDisponivel = this.calculaEspacoDisponivel(recinto, animalInfo.tamanho, quantidade, animal);
  
        if (biomaAdequado && espacoDisponivel >= 0 && this.verificaConvivencia(recinto, animal)) {
          recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanho})`);
        }
      });
  
      if (recintosViaveis.length > 0) {
        return { recintosViaveis };
      } else {
        return { erro: 'Não há recinto viável' };
      }
    }
  
    // Calcula o espaço disponível em cada recinto
    calculaEspacoDisponivel(recinto, tamanhoAnimal, quantidade, novoAnimal) {
      let espacoOcupado = 0;
  
      // Calcula o espaço ocupado pelos animais existentes
      recinto.ocupacao.forEach(animal => {
        espacoOcupado += this.animais[animal.especie].tamanho * animal.quantidade;
      });
  
      // Adiciona espaço extra se houver mais de uma espécie no recinto
      if (recinto.ocupacao.length > 0 && recinto.ocupacao[0].especie !== novoAnimal) {
        espacoOcupado += 1;
      }
  
      // Calcula o espaço necessário para os novos animais
      const espacoNecessario = tamanhoAnimal * quantidade;
  
      // Verifica se os macacos podem ser colocados sozinhos
      if (recinto.ocupacao.length === 0 && novoAnimal === 'MACACO' && quantidade < 2) {
        return -1;  // Recinto não viável
      }
  
      return recinto.tamanho - espacoOcupado - espacoNecessario;
    }
  
    // Verifica se os novos animais podem conviver com os já existentes
    verificaConvivencia(recinto, novoAnimal) {
      const ocupacaoExistente = recinto.ocupacao;
  
      // Se o novo animal é carnívoro, ele só pode conviver com sua própria espécie
      if (this.animais[novoAnimal].carnivoro) {
        return ocupacaoExistente.length === 0 || ocupacaoExistente.every(a => a.especie === novoAnimal);
      }
  
      // Verifica se já há carnívoros no recinto (caso o novo animal seja herbívoro)
      const existeCarnivoro = ocupacaoExistente.some(animal => this.animais[animal.especie].carnivoro);
      if (existeCarnivoro) {
        return false;  // Não pode haver herbívoros com carnívoros
      }
  
      return true;
    }
  }

  export { RecintosZoo as RecintosZoo };
