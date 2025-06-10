let tarefas = [];

const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const inputData = document.getElementById('input-data');
const inputImagem = document.getElementById('input-imagem');
const listaTarefas = document.getElementById('lista-tarefas');

function renderizarTarefas() {
  listaTarefas.innerHTML = '';

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement('li');
    if (tarefa.concluida) li.classList.add('concluida');

    if (tarefa.imagem) {
      const img = document.createElement('img');
      img.src = tarefa.imagem;
      img.alt = 'Imagem da tarefa';
      li.appendChild(img);
    }

    const divInfo = document.createElement('div');
    divInfo.classList.add('tarefa-info');

    const spanTexto = document.createElement('span');
    spanTexto.textContent = tarefa.texto;
    divInfo.appendChild(spanTexto);

    const spanData = document.createElement('div');
    spanData.textContent = `Data: ${tarefa.data}`;
    spanData.classList.add('tarefa-data');
    divInfo.appendChild(spanData);

    li.appendChild(divInfo);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarefa.concluida;
    checkbox.addEventListener('change', () => {
      tarefas[index].concluida = checkbox.checked;
      renderizarTarefas();
    });

    li.appendChild(checkbox);

    listaTarefas.appendChild(li);
  });
}

formTarefa.addEventListener('submit', (e) => {
  e.preventDefault();

  const texto = inputTarefa.value.trim();
  const data = inputData.value;
  const arquivoImagem = inputImagem.files[0];

  if (!texto || !data) {
    alert('Por favor, preencha a descrição e a data.');
    return;
  }

  let urlImagem = null;
  if (arquivoImagem) {
    urlImagem = URL.createObjectURL(arquivoImagem);
  }

  tarefas.push({
    texto,
    data,
    imagem: urlImagem,
    concluida: false,
  });

  inputTarefa.value = '';
  inputData.value = '';
  inputImagem.value = null;

  renderizarTarefas();
});

document.getElementById('btn-whatsapp').addEventListener('click', async () => {
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

  try {
    await navigator.clipboard.writeText(mensagem);
    alert('Mensagem copiada para a área de transferência! Agora abra o WhatsApp e cole para enviar.');
  } catch (err) {
    alert('Não foi possível copiar a mensagem automaticamente. Por favor, copie manualmente:\n\n' + mensagem);
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.open('whatsapp://send', '_blank');
  } else {
    window.open('https://web.whatsapp.com/', '_blank');
  }
});

renderizarTarefas();
