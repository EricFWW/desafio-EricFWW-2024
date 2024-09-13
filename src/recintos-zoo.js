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
  
    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }
      
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }
  
        const animalInfo = this.animais[animal];
        let recintosViaveis = [];
  
        this.recintos.forEach(recinto => {
            const biomaViavel = animalInfo.biomas.some(bioma => recinto.bioma.includes(bioma));
            const espacoDisponivel = this.calcularEspacoDisponivel(recinto, animalInfo.tamanho, quantidade, animal);
  
            if (biomaViavel && espacoDisponivel >= 0 && this.verificarConvivencia(recinto, animal)) {
                recintosViaveis.push('Recinto ' + recinto.numero + ' (espaço livre: ' + espacoDisponivel + ' total: ' + recinto.tamanho + ')');
            }
        });
  
        if (recintosViaveis.length > 0) {
            return { recintosViaveis };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
  
    calcularEspacoDisponivel(recinto, tamanhoAnimal, quantidade, novoAnimal) {
        let espacoOcupado = 0;
  
        // Calcular espaço ocupado pelos animais que já estão no recinto
        recinto.ocupacao.forEach(animal => {
            espacoOcupado += this.animais[animal.especie].tamanho * animal.quantidade;
        });
  
        // Adicionar mais 1 espaço se houver mais de uma espécie no recinto
        if (recinto.ocupacao.length > 0 && recinto.ocupacao[0].especie !== novoAnimal) {
            espacoOcupado += 1;
        }
  
        // Calcular quanto espaço os novos animais vão ocupar
        const espacoNecessario = tamanhoAnimal * quantidade;
  
        // Verifica se o macaco não vai ficar sozinho no recinto
        if (recinto.ocupacao.length === 0 && novoAnimal === 'MACACO' && quantidade < 2) {
            return -1;  // Esse -1 vai tornar o "espacoDisponivel >= 0" em false
        }
  
        // retorna o espaço disponível DEPOIS de inserir os animais novos com os já existentes no recinto
        return recinto.tamanho - espacoOcupado - espacoNecessario;
    }
  
    verificarConvivencia(recinto, novoAnimal) {
        const ocupacaoExistente = recinto.ocupacao;
  
        // Verifica se o recinto está vazio ou se tem a mesma espécie para poder colocar o animal carnívoro
        if (this.animais[novoAnimal].carnivoro) {
            return ocupacaoExistente.length === 0 || ocupacaoExistente.every(a => a.especie === novoAnimal);
        }

        if (novoAnimal === 'HIPOPOTAMO') {
            // Hipopótamos só podem conviver com outras espécies se o bioma for savana E rio
            const biomaAdequado = recinto.bioma.includes('savana') && recinto.bioma.includes('rio');

            // Se o recinto estiver vazio, segue adiante com o código
            if (ocupacaoExistente.length > 0 && !biomaAdequado) {
                return false;  // Recinto não viável se já houver outras espécies e o bioma não for savana E rio
            }
        }
  
        // Verificar se já há carnívoros no recinto (caso o novo animal seja herbívoro)
        const existeCarnivoro = ocupacaoExistente.some(animal => this.animais[animal.especie].carnivoro);

        if (existeCarnivoro) {
            return false;  // Não pode ter herbívoros e carnívoros no mesmo recinto
        }
  
        return true;
    }
  }

    export { RecintosZoo as RecintosZoo };

   
