const form = document.getElementById('form-tarefa');
const input = document.getElementById('tarefa-input');
const dataInput = document.getElementById('data-input');
const imagemInput = document.getElementById('imagem-input');
const lista = document.getElementById('lista-tarefas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

function salvar() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function renderizar() {
  lista.innerHTML = '';
  tarefas.forEach((tarefa, index) => {
    const li = document.createElement('li');
    li.className = tarefa.concluida ? 'completed' : '';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';

    if (tarefa.imagem) {
      const img = document.createElement('img');
      img.src = tarefa.imagem;
      img.alt = 'Imagem da tarefa';
      img.className = 'thumb';
      infoDiv.appendChild(img);
    }

    const textoSpan = document.createElement('span');
    textoSpan.textContent = tarefa.texto;

    const dataSpan = document.createElement('span');
    dataSpan.className = 'task-date';
    dataSpan.textContent = ` (Data: ${tarefa.data})`;

    infoDiv.appendChild(textoSpan);
    infoDiv.appendChild(dataSpan);

    const botoes = document.createElement('div');
    botoes.className = 'task-buttons';
    botoes.innerHTML = `
      <button onclick="concluir(${index})">✔</button>
      <button onclick="excluir(${index})">🗑</button>
    `;

    li.appendChild(infoDiv);
    li.appendChild(botoes);

    lista.appendChild(li);
  });
}

function concluir(index) {
  tarefas[index].concluida = !tarefas[index].concluida;
  salvar();
  renderizar();
}

function excluir(index) {
  tarefas.splice(index, 1);
  salvar();
  renderizar();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const novaTarefa = input.value.trim();
  const dataTarefa = dataInput.value;
  const imagemArquivo = imagemInput.files[0];

  if (!novaTarefa || !dataTarefa) return;

  if (imagemArquivo) {
    const reader = new FileReader();
    reader.onload = function () {
      adicionarTarefa(novaTarefa, dataTarefa, reader.result);
    };
    reader.readAsDataURL(imagemArquivo);
  } else {
    adicionarTarefa(novaTarefa, dataTarefa, null);
  }

  input.value = '';
  dataInput.value = '';
  imagemInput.value = '';
});

function adicionarTarefa(texto, data, imagemBase64) {
  tarefas.push({ texto, data, imagem: imagemBase64, concluida: false });
  salvar();
  renderizar();
}

renderizar();

document.getElementById('btn-whatsapp').addEventListener('click', () => {
  const feitas = tarefas.filter(t => t.concluida);
  const pendentes = tarefas.filter(t => !t.concluida);

  let mensagem = `*Checklist de Inspeção*\n\n`;

  if (feitas.length) {
    mensagem += `✅ *Realizadas:*\n`;
    feitas.forEach(t => {
      mensagem += `- ${t.texto} (Data: ${t.data})\n`;
    });
    mensagem += `\n`;
  }

  if (pendentes.length) {
    mensagem += `⏳ *Pendentes:*\n`;
    pendentes.forEach(t => {
      mensagem += `- ${t.texto} (Data: ${t.data})\n`;
    });
  }

  const textoCodificado = encodeURIComponent(mensagem);
  const numeroWhatsApp = '5581987607653'; // Ex: 55 + DDD + número sem traços

  const link = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;
  window.open(link, '_blank');
});
