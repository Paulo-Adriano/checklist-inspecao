// Array para armazenar tarefas
let tarefas = [];

// Elementos do DOM
const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const inputData = document.getElementById('input-data');
const inputImagem = document.getElementById('input-imagem');
const listaTarefas = document.getElementById('lista-tarefas');

// Função para renderizar as tarefas na tela
function renderizarTarefas() {
  listaTarefas.innerHTML = '';

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement('li');
    if (tarefa.concluida) li.classList.add('concluida');

    // Imagem se existir
    if (tarefa.imagem) {
      const img = document.createElement('img');
      img.src = tarefa.imagem;
      img.alt = 'Imagem da tarefa';
      li.appendChild(img);
    }

    // Div com texto + data
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

    // Checkbox para marcar concluída
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

// Ao enviar o formulário, adiciona nova tarefa
formTarefa.addEventListener('submit', (e) => {
  e.preventDefault();

  const texto = inputTarefa.value.trim();
  const data = inputData.value;
  const imagem = inputImagem.value.trim();

  if (!texto || !data) {
    alert('Por favor, preencha a descrição e a data.');
    return;
  }

  tarefas.push({
    texto,
    data,
    imagem: imagem || null,
    concliuda: false,  // note o erro aqui! vamos corrigir abaixo
    concluida: false,  // corrigido
  });

  // limpa inputs
  inputTarefa.value = '';
  inputData.value = '';
  inputImagem.value = '';

  renderizarTarefas();
});

// Botão enviar para WhatsApp
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

  // Abre o WhatsApp Web (no desktop) ou app (no celular)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    // tenta abrir o app no celular
    window.open('whatsapp://send', '_blank');
  } else {
    // abre o WhatsApp Web no desktop
    window.open('https://web.whatsapp.com/', '_blank');
  }
});

// Renderiza as tarefas ao carregar a página
renderizarTarefas();
